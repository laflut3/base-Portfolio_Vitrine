// src/app/api/profession/get-all-available/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Profession from '../../../../../_lib/ProfessionLib/model/Profession';
import Product from '../../../../../_lib/TemplateLib/model/Template';
import { connectDB } from '@/../_lib/MongoLib/mongodb';

// GET /api/profession/get-all-available
export async function GET() {
    console.log('GET /api/profession/get-all-available');
    try {
        await connectDB();

        const professions = await Profession.find().populate('products').exec();

        const products = await Product.find().exec();

        const availableProducts = products.filter(product => {
            return !professions.some(profession =>
                profession.products.some((p: { toString: () => string; }) => p.toString() === product._id.toString())
            );
        });

        return NextResponse.json(availableProducts);
    } catch (error) {
        return NextResponse.json({ message: (error as Error).message }, { status: 500 });
    }
}