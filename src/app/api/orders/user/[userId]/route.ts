import { NextResponse } from 'next/server';
import Order from '@/../_lib/OrderLib/model/order';
import { connectDB } from '@/../_lib/MongoLib/mongodb';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;

    if (!userId) {
        return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
        );
    }

    try {
        await connectDB();
        const orders = await Order.find({ userId });
        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Error fetching orders' },
            { status: 500 }
        );
    }
}
