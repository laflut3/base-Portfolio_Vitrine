import { NextRequest, NextResponse } from 'next/server';
import Profession from '../../../../../_lib/ProfessionLib/model/Profession';
import Template from '../../../../../_lib/TemplateLib/model/Template';
import { connectDB } from '@/../_lib/MongoLib/mongodb';

export async function GET() {
    console.log('GET /api/profession/get-all');
    try {
        await connectDB();

        const professions = await Profession.find().populate('templates').exec();

        const templates = await Template.find().exec();

        const availableTemplates = templates.filter(template => {
            return !professions.some(profession =>
                profession.templates.some((t: { toString: () => string; }) => t.toString() === template._id.toString())
            );
        });

        return NextResponse.json(availableTemplates);
    } catch (error) {
        return NextResponse.json({ message: (error as Error).message }, { status: 500 });
    }
}
