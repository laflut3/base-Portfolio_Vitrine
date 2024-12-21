import mongoose, { Schema, Document, Types } from 'mongoose';

interface Section extends Document {
    title: string;
    content: string;
}

interface IPrivacyPolicy extends Document {
    slug: string;
    sections: Types.DocumentArray<Section>;
}

const SectionSchema = new Schema<Section>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    _id: { type: Schema.Types.ObjectId, auto: true }, // Ajout d'un champ _id explicite
});

const PrivacyPolicySchema = new Schema<IPrivacyPolicy>({
    slug: { type: String, required: true, unique: true },
    sections: { type: [SectionSchema], required: true },
}, {
    timestamps: true,
});

// Vérification que le modèle n'existe pas déjà avant de le créer
const PrivacyPolicy = mongoose.models.PrivacyPolicy || mongoose.model<IPrivacyPolicy>('PrivacyPolicy', PrivacyPolicySchema);

export default PrivacyPolicy;
