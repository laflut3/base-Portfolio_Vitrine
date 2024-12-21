//api/orders/[id]/route.ts
import { NextResponse } from 'next/server';
import Order from '@/../_lib/OrderLib/model/order';
import { connectDB } from '@/../_lib/MongoLib/mongodb';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await connectDB();

        // Parse the request body to get personal info and status
        const { name, email, phone, address, status } = await request.json();

        // Ensure status is being updated to 'paid'
        if (status !== 'paid') {
            return NextResponse.json({ error: 'Invalid status update' }, { status: 400 });
        }

        // Update the order with the new data
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            {
                name,
                email,
                phone,
                address,
                status,
            },
            { new: true }
        );

        if (!updatedOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    try {
        await connectDB();
        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ error: 'Error fetching order' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    try {
        await connectDB();
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Order deleted successfully', orderId: id });
    } catch (error) {
        console.error('Error deleting order:', error);
        return NextResponse.json({ error: 'Error deleting order' }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = params;

        // Mise à jour du statut à "completed"
        const updatedOrder = await Order.findByIdAndUpdate(id, { status: 'completed' }, { new: true });

        if (!updatedOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json({ error: 'Error updating order status' }, { status: 500 });
    }
}