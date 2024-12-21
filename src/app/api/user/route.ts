import { NextResponse } from 'next/server';
import { connectDB } from '@/../_lib/MongoLib/mongodb';
import User from '@/../_lib/UserLib/models/User';
import Cart from '@/../_lib/CartLib/Model/Cart';
import Order from '@/../_lib/OrderLib/model/order';
import {getServerSession} from "next-auth";
import {authOptions} from "@/../_lib/UserLib/lib/auth";

export async function GET() {
    await connectDB();

    try {
        const users = await User.find({});
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    await connectDB();

    try {
        const { userId } = await request.json();

        console.log('Received DELETE request with data:', { userId });

        if (!userId) {
            console.error('Invalid request data:', { userId });
            return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found:', { userId });
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Supprimer le panier de l'utilisateur si il en a un
        const cart = await Cart.findOne({ user: userId });
        if (cart) {
            await Cart.findByIdAndDelete(cart._id);
            console.log('Cart deleted successfully:', { cartId: cart._id });
        }

        // Supprimer toutes les commandes de l'utilisateur
        const orders = await Order.find({ userId });
        if (orders.length > 0) {
            await Order.deleteMany({ userId });
            console.log('Orders deleted successfully for user:', { userId });
        }

        // Supprimer l'utilisateur
        await User.findByIdAndDelete(userId);
        console.log('User deleted successfully:', { userId });

        return NextResponse.json({ message: 'User, cart, and orders deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting user, cart, or orders:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    await connectDB();

    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
        }

        const { userId, updateData } = await request.json();

        if (!userId || !updateData) {
            return NextResponse.json({ message: 'Données de requête invalides' }, { status: 400 });
        }

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
        }

        // Autoriser la modification si l'utilisateur est admin ou s'il modifie ses propres informations
        if (!(session.user.isAdmin || userId === session.user.id)) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 403 });
        }

        // Mettez à jour uniquement les champs spécifiés dans updateData
        const allowedUpdates = ['nom', 'prenom', 'username', 'email', 'dateOfBirth'];
        allowedUpdates.forEach((key) => {
            if (updateData[key] !== undefined) {
                user[key] = updateData[key];
            }
        });

        await user.save();

        return NextResponse.json({ message: 'Informations utilisateur mises à jour avec succès' }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
    }
}