// src/app/api/profession/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import Profession from '../../../../../_lib/ProfessionLib/model/Profession';
import { authOptions } from '@/../_lib/UserLib/lib/auth';

const isAdmin = (session: any) => session?.user?.role === 'admin';


// GET /api/profession/get/:id
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const profession = await Profession.findById(params.id).populate('products').exec();
      if (!profession) {
        return NextResponse.json({ message: 'Profession not found' }, { status: 404 });
      }
      return NextResponse.json(profession);
    } catch (error) {
      return NextResponse.json({ message: (error as Error).message }, { status: 500 });
    }
  }


  // DELETE /api/profession/delete/:id
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
  
    if (!session || !isAdmin(session)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const profession = await Profession.findByIdAndDelete(params.id).exec();
      if (!profession) {
        return NextResponse.json({ message: 'Profession not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Profession deleted successfully' });
    } catch (error) {
      return NextResponse.json({ message: (error as Error).message }, { status: 400 });
    }
  }