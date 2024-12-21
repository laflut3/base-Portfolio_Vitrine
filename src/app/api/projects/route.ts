import { NextResponse } from 'next/server';
import { connectDB } from "@/../_lib/MongoLib/mongodb";
import Project from '@/../_lib/ProjectsLib/models/Projects';

export async function POST(request: Request) {
    await connectDB();

    try {
        const formData = await request.formData();
        const titre = formData.get('titre')?.toString();  // Ajout du titre
        const url = formData.get('url')?.toString();
        const type = formData.get('type')?.toString();
        const image = formData.get('image') as File | null;

        if (!titre || !url || !type) {
            return NextResponse.json({ message: 'Titre, URL, and type are required' }, { status: 400 });
        }

        const newProject = new Project({
            titre,
            url,
            type,
            image: image ? Buffer.from(await image.arrayBuffer()) : undefined,
        });

        const savedProject = await newProject.save();

        return NextResponse.json({ message: 'Project created successfully', Project: savedProject }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}


export async function GET(request: Request) {
    await connectDB();

    try {
        const url = new URL(request.url);  // Parse l'URL de la requête
        const page = parseInt(url.searchParams.get('page') || '0', 10);  // Récupère le paramètre 'page'
        const limit = 10;  // Nombre de liens par page

        const Projects = await Project.find().skip(page * limit).limit(limit);
        const totalProjects = await Project.countDocuments();

        return NextResponse.json({
            Projects,
            nextPage: page + 1 < Math.ceil(totalProjects / limit) ? page + 1 : null,
        });
    } catch (error) {
        return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    await connectDB();

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ID is required' }, { status: 400 });
        }

        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return NextResponse.json({ message: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting Project:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    await connectDB();

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ID is required' }, { status: 400 });
        }

        const formData = await request.formData();
        const titre = formData.get('titre')?.toString();  // Ajout du titre
        const url = formData.get('url')?.toString();
        const type = formData.get('type')?.toString();
        const image = formData.get('image') as File | null;

        if (!titre || !url || !type) {
            return NextResponse.json({ message: 'Titre, URL, and type are required' }, { status: 400 });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            {
                titre,
                url,
                type,
                image: image ? Buffer.from(await image.arrayBuffer()) : undefined,
            },
            { new: true }
        );

        if (!updatedProject) {
            return NextResponse.json({ message: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Project updated successfully', project: updatedProject }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
