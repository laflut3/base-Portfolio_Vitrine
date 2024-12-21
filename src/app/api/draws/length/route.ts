// src/app/api/draws/length/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@lib/MongoLib/mongodb';
import Draw from '@lib/drawsLib/models/Draws';

export async function GET() {
  try {
    await connectDB();
    const totalDraws = await Draw.countDocuments();
    return NextResponse.json({
      totalDraws,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch total draws' }, { status: 500 });
  }
}