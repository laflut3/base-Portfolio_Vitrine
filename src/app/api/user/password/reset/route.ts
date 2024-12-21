import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/../_lib/MongoLib/mongodb';
import User from '@/../_lib/UserLib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ message: 'Token ou mot de passe manquant.' }, { status: 400 });
        }

        // Vérification des données reçues
        console.log('Token reçu:', token);
        console.log('Mot de passe reçu:', password);

        await connectDB();

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json({ message: "Utilisateur non trouvé." }, { status: 404 });
        }

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        return NextResponse.json({ message: 'Mot de passe réinitialisé avec succès.' }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        return NextResponse.json({ message: 'Le lien de réinitialisation est invalide ou a expiré.' }, { status: 500 });
    }
}

