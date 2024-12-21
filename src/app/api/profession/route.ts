// src/app/api/profession/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import Profession from '../../../../_lib/ProfessionLib/model/Profession';
import Product from '../../../../_lib/TemplateLib/model/Template';
import { authOptions } from '@/../_lib/UserLib/lib/auth';


const isAdmin = (session: any) => session?.user?.role === 'admin';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const professions = await Profession.find().populate('products').exec();
    return NextResponse.json(professions);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}



// POST /api/profession/add
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !isAdmin(session)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, products } = await request.json();

    if (!Array.isArray(products)) {
      return NextResponse.json({ message: 'Products must be an array' }, { status: 400 });
    }

    const productObjects = await Product.find({ '_id': { $in: products } }).exec();
    if (productObjects.length !== products.length) {
      return NextResponse.json({ message: 'One or more products do not exist' }, { status: 400 });
    }

    const newProfession = new Profession({ name, products });
    await newProfession.save();
    return NextResponse.json({ message: 'Profession added successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}



// // DELETE /api/profession/remove-contract/:professionId/:contractId
// export async function DELETE(request: NextRequest, { params }: { params: { professionId: string; contractId: string } }) {
//   const session = await getServerSession(authOptions);

//   if (!session || !isAdmin(session)) {
//     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const profession = await Profession.findById(params.professionId).exec();
//     if (!profession) {
//       return NextResponse.json({ message: 'Profession not found' }, { status: 404 });
//     }

//     if (!profession.products.includes(params.contractId)) {
//       return NextResponse.json({ message: 'Contract not associated with this profession' }, { status: 404 });
//     }

//     profession.products = profession.products.filter(prod => prod.toString() !== params.contractId);
//     await profession.save();

//     return NextResponse.json({ message: 'Contract removed from profession successfully' });
//   } catch (error) {
//     return NextResponse.json({ message: (error as Error).message }, { status: 500 });
//   }
// }

// // POST /api/profession/add-contract/:professionId/:contractId
// export async function POST(request: NextRequest, { params }: { params: { professionId: string; contractId: string } }) {
//   const session = await getServerSession(authOptions);

//   if (!session || !isAdmin(session)) {
//     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const profession = await Profession.findById(params.professionId).exec();
//     if (!profession) {
//       return NextResponse.json({ message: 'Profession not found' }, { status: 404 });
//     }

//     const contract = await Product.findById(params.contractId).exec();
//     if (!contract) {
//       return NextResponse.json({ message: 'Contract not found' }, { status: 404 });
//     }

//     if (!profession.products.includes(params.contractId)) {
//       profession.products.push(params.contractId);
//       await profession.save();
//     }

//     return NextResponse.json({ message: 'Contract added to profession successfully' });
//   } catch (error) {
//     return NextResponse.json({ message: (error as Error).message }, { status: 500 });
//   }
// }



// // GET /api/profession/get-by-contract-id/:contractId
// export async function GET(request: NextRequest, { params }: { params: { contractId: string } }) {
//   try {
//     const profession = await Profession.findOne({ products: params.contractId }).exec();
//     if (!profession) {
//       return NextResponse.json({ message: 'Profession not found' }, { status: 404 });
//     }
//     return NextResponse.json(profession.name);
//   } catch (error) {
//     return NextResponse.json({ message: (error as Error).message }, { status: 500 });
//   }
// }
