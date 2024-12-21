import { NextResponse } from 'next/server';
import { connectDB } from '@/../_lib/MongoLib/mongodb';
import Product from '@/../_lib/ProductLib/model/products';

// GET: Récupérer un produit par son ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    await connectDB();

    try {
        const product = await Product.findById(params.id);
        if (!product) {
            return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
        return NextResponse.json({ error: 'Erreur lors de la récupération du produit' }, { status: 500 });
    }
}

// PATCH: Modifier un produit par son ID
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    await connectDB();

    try {
        const data = await request.json();
        const product = await Product.findByIdAndUpdate(params.id, data, { new: true, runValidators: true });
        if (!product) {
            return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit:', error);
        return NextResponse.json({ error: 'Erreur lors de la mise à jour du produit' }, { status: 500 });
    }
}

// DELETE: Supprimer un produit par son ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await connectDB();

    try {
        const product = await Product.findByIdAndDelete(params.id);
        if (!product) {
            return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        return NextResponse.json({ error: 'Erreur lors de la suppression du produit' }, { status: 500 });
    }
}
