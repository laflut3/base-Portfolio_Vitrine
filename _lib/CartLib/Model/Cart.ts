import mongoose, { Schema, model, Document } from "mongoose";

export interface CartDocument extends Document {
    user: mongoose.Schema.Types.ObjectId;
    items: {
        product: mongoose.Schema.Types.ObjectId;
        quantity: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const CartSchema = new Schema<CartDocument>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
}, {
    timestamps: true,
});

const Cart = mongoose.models?.Cart || model<CartDocument>('Cart', CartSchema);
export default Cart;
