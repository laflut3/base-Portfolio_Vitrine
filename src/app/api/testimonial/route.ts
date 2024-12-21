import { NextResponse } from 'next/server';
import { connectDB } from '@lib/MongoLib/mongodb';
import Commentaire from '@lib/testimonialLib/models/Testimonial';

/**
 * Fonction pour établir la connexion à la base de données.
 */
async function connectDatabase() {
    await connectDB();
}

/**
 * Gestionnaire pour la requête GET : Récupération des témoignages.
 *
 * @returns {NextResponse} - Liste des témoignages ou une erreur.
 */
export async function GET() {
    await connectDatabase();

    try {
        const testimonials = await Commentaire.find();
        return NextResponse.json(testimonials, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Erreur lors de la récupération des témoignages.' }, { status: 500 });
    }
}

/**
 * Gestionnaire pour la requête POST : Création d'un nouveau témoignage.
 *
 * @param {Request} request - La requête contenant les données du témoignage.
 * @returns {NextResponse} - Message de succès ou une erreur.
 */
export async function POST(request: Request) {
    await connectDatabase();

    try {
        const { User, objet, message, note } = await request.json();

        // Validation des données
        if (!User || !objet || !message || typeof note !== 'number') {
            return NextResponse.json({ message: 'Données invalides. Tous les champs sont requis.' }, { status: 400 });
        }

        const newCommentaire = new Commentaire({
            User,
            objet,
            message,
            note,
            dateEnvoie: new Date(),
        });

        await newCommentaire.save();
        return NextResponse.json({ message: 'Commentaire créé avec succès' }, { status: 201 });
    } catch (error) {
        console.error('Erreur lors de la création du témoignage :', error);
        return NextResponse.json({ message: 'Erreur serveur lors de la création du témoignage.' }, { status: 500 });
    }
}
/**
 * Gestionnaire pour la requête DELETE : Suppression d'un témoignage.
 *
 * @param {Request} request - La requête contenant les identifiants de l'utilisateur et du témoignage.
 * @returns {NextResponse} - Message de succès ou une erreur.
 */
export async function DELETE(request: Request) {
    await connectDatabase();

    try {
        const { userId, isAdmin, commentaireId } = await request.json();

        // Validation des entrées
        if (!userId || !commentaireId) {
            return NextResponse.json({ message: 'Requête invalide' }, { status: 400 });
        }

        const commentaire = await Commentaire.findById(commentaireId);
        if (!commentaire) {
            return NextResponse.json({ message: 'Commentaire non trouvé' }, { status: 404 });
        }

        if (commentaire.User._id !== userId && !isAdmin) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 403 });
        }

        await Commentaire.findByIdAndDelete(commentaireId);
        return NextResponse.json({ message: 'Commentaire supprimé avec succès' }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la suppression du témoignage :', error);
        return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
    }
}

/**
 * Gestionnaire pour la requête PATCH : Mise à jour d'un témoignage.
 *
 * @param {Request} request - La requête contenant les données du témoignage à mettre à jour.
 * @returns {NextResponse} - Message de succès ou une erreur.
 */
export async function PATCH(request: Request) {
    await connectDatabase();

    try {
        const { userId, commentaireId, newMessage, newObjet, newNote } = await request.json();

        // Validation des entrées
        if (!userId || !commentaireId || !newMessage || !newObjet || !newNote) {
            return NextResponse.json({ message: 'Requête invalide' }, { status: 400 });
        }

        const commentaire = await Commentaire.findById(commentaireId);
        if (!commentaire) {
            return NextResponse.json({ message: 'Commentaire non trouvé' }, { status: 404 });
        }

        if (commentaire.User._id !== userId) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 403 });
        }

        // Mise à jour du témoignage
        commentaire.message = newMessage;
        commentaire.objet = newObjet;
        commentaire.note = newNote;
        await commentaire.save();

        return NextResponse.json({ message: 'Commentaire mis à jour avec succès' }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du témoignage :', error);
        return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
    }
}
