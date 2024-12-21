// _lib/drawsLib/Draws.ts
import mongoose, { Schema, Document } from 'mongoose';

interface Draw extends Document {
  title: string;
  image: string;
}

const DrawSchema: Schema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
});

export default mongoose.models.Draw || mongoose.model<Draw>('Draw', DrawSchema);
