import { NextResponse } from 'next/server';
import { connectDB } from '@/../_lib/MongoLib/mongodb';
import PrivacyPolicy from '@/../_lib/PolicyLib/models/Policy';
import mongoose from 'mongoose';

// DELETE: Remove a section from the policy
export async function DELETE(req: Request, { params }: { params: { slug: string, sectionId: string } }) {
    await connectDB();

    const { slug, sectionId } = params;

    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
        return NextResponse.json({ error: 'Invalid section ID format' }, { status: 400 });
    }

    try {
        // Remove the section by its ObjectId
        const result = await PrivacyPolicy.updateOne(
            { slug },
            { $pull: { sections: { _id: new mongoose.Types.ObjectId(sectionId) } } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ error: 'Section not found or already deleted' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Section deleted successfully' });
    } catch (error) {
        console.error('Error deleting section from policy:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
