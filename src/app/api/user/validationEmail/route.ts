import { NextResponse } from 'next/server';
import { connectDB } from '@/../_lib/MongoLib/mongodb';
import User from '@/../_lib/UserLib/models/User';
import nodemailer from 'nodemailer';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/../_lib/UserLib/lib/auth';
import { NextRequest } from 'next/server';
import * as process from "node:process";

export async function POST(request: NextRequest) {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const userEmail = session.user.email;

    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
        }

        const verificationToken = user._id.toString();
        const verificationLink = `${process.env.NEXTAUTH_URL}/api/user/verifyUser?token=${verificationToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: userEmail,
            subject: 'Validation de votre compte',
            text: `Cliquez sur ce lien pour valider votre compte : ${verificationLink}`,
            html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation d'Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
            background-color: #3577B4;
            color: #ffffff;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 25px;
            font-size: 16px;
            color: #ffffff;
            background-color: #3577B4;
            text-decoration: none;
            border-radius: 4px;
        }
        .button:hover {
            background-color: #2b5e8e;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #999999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bienvenue chez [Nom de l'Entreprise]</h1>
        </div>
        <div class="content">
            <p>Bonjour ${user.name},</p>
            <p>Merci de vous être inscrit sur notre site ! Pour finaliser votre inscription et commencer à utiliser tous nos services, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
            <a href="${verificationLink}" class="button" style="color: white">Confirmer mon adresse email</a>
            <p>Si vous n'avez pas créé de compte chez nous, vous pouvez ignorer cet email en toute sécurité.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 [Nom de l'Entreprise]. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
`,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent: ', info.response);
        return NextResponse.json({ message: 'Email de validation envoyé avec succès' }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return NextResponse.json({ message: 'Erreur lors de l\'envoi de l\'email' }, { status: 500 });
    }
}
