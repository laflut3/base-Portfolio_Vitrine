import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/../_lib/MongoLib/mongodb';
import User from '@/../_lib/UserLib/models/User';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ message: 'Email invalide.' }, { status: 400 });
        }

        await connectDB();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "L'utilisateur avec cet email n'existe pas." }, { status: 404 });
        }

        // Générer un token de réinitialisation
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
            expiresIn: '1h',
        });

        // Configurer le transporteur de courrier avec Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const resetUrl = `${process.env.NEXTAUTH_URL}/forgot/change?token=${token}`;

        // Structure de l'email HTML
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border-radius: 10px;">
                <h2 style="color: #333333; text-align: center;">Réinitialisation de votre mot de passe</h2>
                <p style="font-size: 16px; color: #555555;">
                    Bonjour ${user.prenom ? user.prenom : 'Utilisateur'},
                </p>
                <p style="font-size: 16px; color: #555555;">
                    Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :
                </p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #3577B4; text-decoration: none; border-radius: 5px;">
                        Réinitialiser mon mot de passe
                    </a>
                </div>
                <p style="font-size: 14px; color: #999999; text-align: center;">
                    Si vous n'avez pas demandé de réinitialisation de mot de passe, vous pouvez ignorer cet email. Ce lien expirera dans 1 heure.
                </p>
                <p style="font-size: 14px; color: #999999; text-align: center;">
                    Merci,<br />L'équipe de support
                </p>
            </div>
        `;

        // Envoyer l'email avec le lien de réinitialisation
        await transporter.sendMail({
            from: `"Support" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Réinitialisation de mot de passe',
            html: emailHtml,
        });

        return NextResponse.json({ message: 'Un email de réinitialisation a été envoyé.' }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la demande de réinitialisation de mot de passe:', error);
        return NextResponse.json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.' }, { status: 500 });
    }
}
