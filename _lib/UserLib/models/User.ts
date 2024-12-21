import mongoose, { Schema, model } from "mongoose";
import { CartDocument } from "@/../_lib/CartLib/Model/Cart"; // Importez le document du panier si vous en avez besoin

export interface UserDocument {
    nom: string;
    prenom: string;
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
    isVerified: boolean;
    dateOfBirth: Date;
    createdAt: Date;
    cart?: CartDocument; // Ajoutez cette ligne pour référencer le panier
}

const UserSchema = new Schema<UserDocument>({
    username: {
        type: String,
        required: [true, "Le nom d'utilisateur est obligatoire"]
    },
    nom: {
        type: String,
        required: [true, "Le nom est obligatoire"]
    },
    prenom: {
        type: String,
        required: [true, "Le prénom est obligatoire"]
    },
    dateOfBirth: {
        type: Date,
        required: [true, "Veuillez indiquez votre date d'anniversaire"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Email is invalid",
        ],
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart', // Référence au modèle de panier
    },
    isVerified: {
        type: Boolean,
        required: true,
    }
}, {
    timestamps: true,
});

const User = mongoose.models?.User || model<UserDocument>('User', UserSchema);
export default User;
