import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    const { name, email, message } = await req.json();

    // Configuration de Nodemailer pour utiliser Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"Contact Form" <${process.env.GMAIL_USER}>`,
            to: process.env.RECIPIENT_EMAIL,
            subject: 'New Contact Form Submission',
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
            <h1 style="color: #333;">Nouveau Message de Contact</h1>
        </div>
        <div style="padding: 20px 0;">
            <p style="font-size: 16px; color: #555;">Vous avez reçu une nouvelle soumission de formulaire de contact. Voici les détails :</p>
            <table style="width: 100%; border-spacing: 0; margin-top: 20px;">
                <tr>
                    <td style="width: 30%; font-weight: bold; color: #333;">Nom:</td>
                    <td style="color: #555;">${name}</td>
                </tr>
                <tr>
                    <td style="width: 30%; font-weight: bold; color: #333;">Email:</td>
                    <td style="color: #555;">${email}</td>
                </tr>
                <tr>
                    <td style="width: 30%; font-weight: bold; color: #333;">Message:</td>
                    <td style="color: #555;">${message}</td>
                </tr>
            </table>
        </div>
        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; background-color: #f1f1f1; border-radius: 0 0 10px 10px;">
            <p style="font-size: 14px; color: #999;">Cet email a été généré automatiquement. Veuillez ne pas y répondre.</p>
            <p style="font-size: 14px; color: #999;">&copy; ${new Date().getFullYear()} Votre Société. Tous droits réservés.</p>
        </div>
    </div>
`,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false });
    }
}
