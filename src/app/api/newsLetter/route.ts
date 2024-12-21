import { NextResponse } from 'next/server';
import {connectDB} from '@/../_lib/MongoLib/mongodb';
import NewsLetter from '@/../_lib/NewsLetterLib/models/newsLetter';
import nodemailer from 'nodemailer';

// Modifier une adresse e-mail dans la newsletter
export async function PUT(req: Request) {
    await connectDB();
    const body = await req.json();
    const { oldEmail, newEmail } = body;

    if (!oldEmail || !newEmail) {
        return NextResponse.json({ message: 'Both old and new emails are required' }, { status: 400 });
    }

    try {
        const updatedEntry = await NewsLetter.findOneAndUpdate(
            { email: oldEmail },
            { email: newEmail },
            { new: true }
        );

        if (!updatedEntry) {
            return NextResponse.json({ message: 'Old email not found' }, { status: 404 });
        }

        return NextResponse.json(updatedEntry, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating email', error }, { status: 500 });
    }
}

// Supprimer une adresse e-mail de la newsletter
export async function DELETE(req: Request) {
    await connectDB();
    const body = await req.json();
    const { email } = body;

    if (!email) {
        return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    try {
        const deletedEntry = await NewsLetter.findOneAndDelete({ email });
        if (!deletedEntry) {
            return NextResponse.json({ message: 'Email not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Email deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting email', error }, { status: 500 });
    }
}

// Optionnel : Si vous souhaitez récupérer toutes les adresses email de la newsletter
export async function GET() {
    await connectDB();

    try {
        const emails = await NewsLetter.find().select('email -_id');
        return NextResponse.json(emails, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error retrieving emails', error }, { status: 500 });
    }
}
