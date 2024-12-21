import { NextResponse } from "next/server";
import Product from "@/../_lib/ProductLib/model/products";
import { connectDB } from "@/../_lib/MongoLib/mongodb";

// GET: Récupérer tous les produits
export async function GET() {
    await connectDB();
    const products = await Product.find();
    return NextResponse.json(products);
}

// POST: Créer un nouveau produit
export async function POST(req: Request) {
    try {
        await connectDB();

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const price = parseFloat(formData.get("price") as string);
        const imageFile = formData.get("image") as File;

        let imageBuffer: Buffer | undefined;
        if (imageFile) {
            const arrayBuffer = await imageFile.arrayBuffer();
            imageBuffer = Buffer.from(arrayBuffer);
        }

        const product = new Product({
            name,
            description,
            price,
            image: imageBuffer,
        });

        await product.save();
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Error in POST API:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}