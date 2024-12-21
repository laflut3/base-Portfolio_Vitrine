import { NextResponse } from 'next/server';
import { connectDB } from '@/../_lib/MongoLib/mongodb';
import PrivacyPolicy from '@/../_lib/PolicyLib/models/Policy';

// GET: Retrieve the policy or create it if it doesn't exist
export async function GET(req: Request, { params }: { params: { slug: string } }) {
    try {
        await connectDB();

        const { slug } = params;

        let policyPage = await PrivacyPolicy.findOne({ slug });

        if (!policyPage) {
            policyPage = new PrivacyPolicy({
                slug,
                sections: [
                    {
                        title: `titre par défaut ${slug}`,
                        content: `texte par defaut ${slug}`,
                    },
                ],
            });
            await policyPage.save();
        }

        return NextResponse.json({ sections: policyPage.sections });
    } catch (error) {
        console.error('Error in GET /api/policy/[slug]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Add a new section to the policy
export async function POST(req: Request, { params }: { params: { slug: string } }) {
    await connectDB();
    const { slug } = params;

    try {
        const { title, content } = await req.json();

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
        }

        let policyPage = await PrivacyPolicy.findOne({ slug });

        if (policyPage) {
            policyPage.sections.push({ title, content });
            await policyPage.save();
            return NextResponse.json(policyPage);
        } else {
            const newPolicyPage = new PrivacyPolicy({
                slug,
                sections: [{ title, content }],
            });
            await newPolicyPage.save();
            return NextResponse.json(newPolicyPage);
        }
    } catch (error) {
        console.error('Error in POST /api/policy/[slug]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


// PUT: Update a section in the policy
export async function PUT(req: Request, { params }: { params: { slug: string } }) {
    await connectDB();
    const { slug } = params;
    const { _id, title, content } = await req.json();

    try {
        const policyPage = await PrivacyPolicy.findOneAndUpdate(
            { slug, "sections._id": _id },
            { $set: { "sections.$.title": title, "sections.$.content": content } },
            { new: true }
        );

        if (!policyPage) {
            return NextResponse.json({ error: 'Section not found' }, { status: 404 });
        }

        return NextResponse.json(policyPage);
    } catch (error) {
        console.error('Error updating the policy section:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}