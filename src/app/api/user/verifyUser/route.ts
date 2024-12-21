import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/../_lib/MongoLib/mongodb';
import User from '@/../_lib/UserLib/models/User';
import * as process from 'node:process';

export async function GET(request: NextRequest) {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json({ message: 'Jeton de vérification manquant' }, { status: 400 });
    }

    try {
        const user = await User.findById(token);

        if (!user) {
            return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ message: 'Utilisateur déjà vérifié' }, { status: 200 });
        }

        user.isVerified = true;
        await user.save();

        // Redirection vers la page de validation spécifiée dans l'environnement
        return NextResponse.redirect(`${process.env.REDIRECTION_VALIDATION}`);
    } catch (error) {
        console.error('Erreur lors de la vérification du compte:', error);
        return NextResponse.json({ message: 'Erreur lors de la vérification du compte' }, { status: 500 });
    }
}
