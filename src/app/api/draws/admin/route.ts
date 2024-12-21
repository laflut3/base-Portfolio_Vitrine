// src/app/api/admin/draws/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@lib/MongoLib/mongodb';
import Draw from '@lib/drawsLib/models/Draws';

// GET all draws
export async function GET() {
  try {
    await connectDB();
    const draws = await Draw.find();
    return NextResponse.json(draws);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Draws' }, { status: 500 });
  }
}

// POST (create) a new draw
export async function POST(req: Request) {
  console.log('POST /api/admin/draws');
  try {
    await connectDB();
    const drawData = await req.json();

    if (!drawData.title || !drawData.image) {
      return new NextResponse(JSON.stringify({ error: 'Title and image are required' }), { status: 400 });
    }

    const newDraw = new Draw(drawData);
    await newDraw.save();

    return new NextResponse(JSON.stringify(newDraw), { status: 201 });
  } catch (error) {
    console.error('Error during POST:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to create draw' }), { status: 500 });
  }
}