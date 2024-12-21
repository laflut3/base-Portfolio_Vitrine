import mongoose, { Schema, model, Document } from "mongoose";
import * as buffer from "node:buffer";

interface ProductDocument extends Document {
    name: string;
    description: string;
    price: number;
    image: Buffer;
    createdAt: Date;
}

const ProductSchema = new Schema<ProductDocument>({
    name: {
        type: String,
        required: [true, "Le nom du produit est obligatoire"]
    },
    description : {
        type: String,
        required: true,
    },
    price : {
        type: Number,
        required: true,
    },
    image: {
        type: Buffer,  // Utilisation du type Buffer pour stocker les données binaires
        required: true // Facultatif, vous pouvez l'ajuster selon vos besoins
    }

}, {
    timestamps: true,
});

const Product = mongoose.models?.Product || model<ProductDocument>('Product', ProductSchema);
export default Product;
