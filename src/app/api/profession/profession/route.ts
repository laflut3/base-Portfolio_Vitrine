// src/app/api/profession/profession/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Profession from '../../../../../_lib/ProfessionLib/model/Profession';
import Product from '../../../../../_lib/TemplateLib/model/Template';

// GET /api/profession/:profession
export async function GET(request: NextRequest, { params }: { params: { profession: string } }) {
  try {
    const profession = await Profession.findOne({ name: params.profession }).exec();
    if (!profession) {
      return NextResponse.json({ message: 'Profession not found' }, { status: 404 });
    }

    const contracts = await Product.find({ _id: { $in: profession.products } }).exec();
    return NextResponse.json(contracts);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}