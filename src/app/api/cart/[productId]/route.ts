// app/api/cart/[productId]/route.ts
import { connectDB } from '@/../_lib/MongoLib/mongodb';
import Cart from '@/../_lib/CartLib/Model/Cart';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { productId: string } }) {
    await connectDB();

    try {
        // Extract productId from the route params
        const { productId } = params;

        // Get the userId from the request's JSON body (if sent via body) or headers
        const { userId } = await request.json();

        if (!userId || !productId) {
            console.error('Invalid request data:', { userId, productId });
            return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
        }

        // Find the user's cart
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            console.error('Panier non trouvé:', { userId });
            return NextResponse.json({ message: 'Panier non trouvé' }, { status: 404 });
        }

        // Find the product in the cart
        const productIndex = cart.items.findIndex((item: { product: mongoose.Schema.Types.ObjectId }) =>
            item.product.toString() === productId
        );

        if (productIndex === -1) {
            console.error('Produit non trouvé dans le panier:', { productId });
            return NextResponse.json({ message: 'Produit non trouvé dans le panier' }, { status: 404 });
        }

        // Remove the item from the cart
        cart.items.splice(productIndex, 1);
        await cart.save();

        console.log('Produit supprimé du panier avec succès:', { productId });
        return NextResponse.json(cart, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la suppression du produit du panier:', error);
        return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
    }
}
