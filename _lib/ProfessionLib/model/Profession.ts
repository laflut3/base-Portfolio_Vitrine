import mongoose, { Schema, Document } from 'mongoose';

interface IProfession extends Document {
  name: string;
  description: string;
  yearsOfExperience: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProfessionSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, 
  }
);

const Profession = mongoose.models.Profession || mongoose.model<IProfession>('Profession', ProfessionSchema);

export default Profession;
