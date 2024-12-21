// src/app/api/admin/draws/[id]/route.ts
import { NextResponse } from 'next/server';
import Draw from '@lib/drawsLib/models/Draws';

// DELETE (delete) a Draw
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    const deletedDraw = await Draw.findByIdAndDelete(id);
    if (!deletedDraw) {
      return NextResponse.json({ error: 'Draw not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Draw deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete Draw' }, { status: 500 });
  }
}

// PUT (create) a new draw
export async function PUT (req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  try {
    const drawData = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updatedDraw = await Draw.findByIdAndUpdate(id, drawData, { new: true });
    if (!updatedDraw) {
      return NextResponse.json({ error: 'Draw not found' }, { status: 404 });
    }
    return NextResponse.json(updatedDraw);
  } catch (error) {
    console.error('Error updating skill:', error);

    return NextResponse.json({ error: 'Failed to update Draw' }, { status: 500 });
  }
}
