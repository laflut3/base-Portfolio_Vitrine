//api/orders/route.ts

import { NextResponse } from 'next/server';
import Order from '@/../_lib/OrderLib/model/order';
import { connectDB } from '@/../_lib/MongoLib/mongodb';

export async function POST(request: Request) {
    try {
        await connectDB();
        const { userId, items, amount } = await request.json();

        const newOrder = new Order({
            userId,
            items,
            amount,
            // Les champs `name`, `email`, `address`, et `paymentId` seront ajoutés plus tard.
        });

        const savedOrder = await newOrder.save();
        return NextResponse.json({ orderId: savedOrder._id, amount: savedOrder.amount });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await connectDB();
        const { name, email, phone, address, paymentId } = await request.json();
        const orderId = request.url.split('/').pop();

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, {
            name,
            email,
            address,
            paymentId,
            status: 'paid', // Mettre à jour le statut après le paiement
        }, { new: true });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Error updating order' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    await connectDB();
    try {
        const orders = await Order.find();
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const { orderId, status } = await request.json();
    await connectDB();
    try {
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        return NextResponse.json(updatedOrder);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating order status' }, { status: 500 });
    }
}
