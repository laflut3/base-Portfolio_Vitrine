//app/api/cart/getToken.ts
import { connectDB } from '@/../_lib/MongoLib/mongodb';
import Cart from '@/../_lib/CartLib/Model/Cart';
import { NextResponse } from 'next/server';
import mongoose from "mongoose";

export async function POST(request: Request) {
    await connectDB();

    try {
        const { productId, userId, quantity = 1 } = await request.json();

        if (!userId || !productId) {
            console.error('Invalid request data:', { userId, productId, quantity });
            return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
        }

        let cart = await Cart.findOne({ user: userId });

        if (cart) {
            const productIndex = cart.items.findIndex((item: { product: mongoose.Schema.Types.ObjectId }) =>
                item.product.toString() === productId
            );

            if (productIndex > -1) {
                cart.items[productIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
        } else {
            cart = new Cart({
                user: userId,
                items: [{ product: productId, quantity }],
            });
        }

        await cart.save();
        console.log('Produit ajouté au panier avec succès:', { productId });
        return NextResponse.json(cart, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    await connectDB();

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            console.error('User ID manquant dans la requête');
            return NextResponse.json({ message: 'User ID requis' }, { status: 400 });
        }

        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            console.error('Panier non trouvé pour l\'utilisateur:', { userId });
            return NextResponse.json({ message: 'Panier non trouvé' }, { status: 404 });
        }

        return NextResponse.json(cart.items, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la récupération des produits du panier:', error);
        return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    await connectDB();

    try {
        const { productId, userId, quantity } = await request.json();

        if (!userId || !productId || quantity === undefined) {
            console.error('Invalid request data:', { userId, productId, quantity });
            return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            console.error('Panier non trouvé:', { userId });
            return NextResponse.json({ message: 'Panier non trouvé' }, { status: 404 });
        }

        const productIndex = cart.items.findIndex((item: { product: mongoose.Schema.Types.ObjectId }) =>
            item.product.toString() === productId
        );

        if (productIndex === -1) {
            console.error('Produit non trouvé dans le panier:', { productId });
            return NextResponse.json({ message: 'Produit non trouvé dans le panier' }, { status: 404 });
        }

        cart.items[productIndex].quantity = quantity;  // Mettre à jour la quantité
        await cart.save();

        console.log('Quantité mise à jour avec succès:', { productId, quantity });
        return NextResponse.json(cart, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la quantité du produit dans le panier:', error);
        return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
    }
}

