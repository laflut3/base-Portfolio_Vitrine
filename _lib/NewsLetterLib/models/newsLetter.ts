import mongoose, { Schema, Document } from 'mongoose';

interface INewsLetter extends Document {
    email: string | null;
    createdAt: Date;
}

const newsLetterSchema: Schema = new Schema({
    email: { type: String, default: null, unique: true },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const NewsLetter = mongoose.models.NewsLetter || mongoose.model<INewsLetter>('NewsLetter', newsLetterSchema);

export default NewsLetter;
