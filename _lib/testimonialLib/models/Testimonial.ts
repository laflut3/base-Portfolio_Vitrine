import { Schema, model, models, Document } from 'mongoose';

export interface CommentaireDocument extends Document {
    User: {
        _id: string;
        username: string;
        image: string;
    };
    objet: string;
    message: string;
    note: number;
    dateEnvoie: Date;
}

const CommentaireSchema = new Schema({
    User: {
        _id: { type: String, required: true },
        username: { type: String, required: true },
        image: { type: String },
    },
    objet: { type: String, required: true },
    message: { type: String, required: true },
    note: { type: Number, required: true },
    dateEnvoie: { type: Date, default: Date.now },
});

const Commentaire = models?.Commentaire || model<CommentaireDocument>('Commentaire', CommentaireSchema);
export default Commentaire;
