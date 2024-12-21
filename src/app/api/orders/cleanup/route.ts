import { NextResponse } from 'next/server';
import Order from '@/../_lib/OrderLib/model/order';
import { connectDB } from '@/../_lib/MongoLib/mongodb';

export async function GET() {
    await connectDB();

    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

    try {
        const result = await Order.deleteMany({
            status: 'pending',
            createdAt: { $lt: threeHoursAgo },
        });

        return NextResponse.json({ deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Erreur lors du nettoyage des commandes en pending:', error);
        return NextResponse.json({ error: 'Erreur lors du nettoyage des commandes' }, { status: 500 });
    }
}
