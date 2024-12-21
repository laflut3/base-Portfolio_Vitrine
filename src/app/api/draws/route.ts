// api/draws/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@lib/MongoLib/mongodb';
import Draw from '@lib/drawsLib/models/Draws';

export async function GET(request: Request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const draws = await Draw.find().skip(skip).limit(limit);
    const totalDraws = await Draw.countDocuments();

    return NextResponse.json({
      draws,
      totalPages: Math.ceil(totalDraws / limit),
      currentPage: page,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800',
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch draws' }, { status: 500 });
  }
}
