import { NextResponse } from 'next/server';
import { connectDB } from '@/../_lib/MongoLib/mongodb';
import NewsLetter from '@/../_lib/NewsLetterLib/models/newsLetter';

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        // Vérifiez si l'email existe déjà dans la base de données
        const existingEmail = await NewsLetter.findOne({ email });
        if (existingEmail) {
            return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
        }

        // Ajout de l'email s'il n'existe pas
        const newEntry = await NewsLetter.create({ email });
        return NextResponse.json(newEntry, { status: 201 });

    } catch (error: any) {
        console.error('Error adding email:', error);

        return NextResponse.json({ message: 'Error adding email', error: error.message }, { status: 500 });
    }
}
