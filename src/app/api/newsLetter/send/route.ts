import { NextResponse } from 'next/server';
import { connectDB } from '@/../_lib/MongoLib/mongodb';
import NewsLetter from '@/../_lib/NewsLetterLib/models/newsLetter';
import nodemailer from 'nodemailer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/../_lib/UserLib/lib/auth';

// Middleware fictif pour vérifier si l'utilisateur est un administrateur
async function isAdmin(req: Request): Promise<boolean> {
    const session = await getServerSession(authOptions);
    return !!session?.user.isAdmin;
}

export async function POST(req: Request) {
    await connectDB();

    const isAdminUser = await isAdmin(req);
    if (!isAdminUser) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { subject, message } = body;

    if (!subject || !message) {
        return NextResponse.json({ message: 'Subject and message are required' }, { status: 400 });
    }

    try {
        const emails = await NewsLetter.find().select('email -_id');

        if (!emails.length) {
            return NextResponse.json({ message: 'No emails found' }, { status: 404 });
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_USER, // Votre adresse email
                pass: process.env.GMAIL_PASS, // Votre mot de passe ou mot de passe d'application
            },
        });

        // Construire le contenu HTML de l'email
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #333; text-align: center;">${subject}</h2>
                <hr style="border: none; border-top: 1px solid #eee;">
                <p style="color: #555; font-size: 16px; line-height: 1.6;">
                    ${message}
                </p>
                <div style="margin-top: 20px; text-align: center;">
                    <a href="https://localhost:3000/" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">
                        Visitez notre site
                    </a>
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin-top: 40px;">
                <p style="color: #999; font-size: 12px; text-align: center;">
                    Vous recevez cet email parce que vous êtes inscrit à notre newsletter. Si vous ne souhaitez plus recevoir ces emails, vous pouvez vous désinscrire à tout moment.
                </p>
            </div>
        `;

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: emails.map(entry => entry.email),
            subject,
            html: htmlContent, // Utilisation de HTML pour le contenu de l'email
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Emails sent successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error sending emails', error }, { status: 500 });
    }
}
