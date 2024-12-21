"use server"

import { connectDB } from "../../MongoLib/mongodb";
import User from "../models/User";
import bcrypt from "bcryptjs";

export const register = async (values: any) => {
    const { email, password, nom, prenom, username, dateOfBirth } = values;
    try {
        console.log('coucou'); 
        await connectDB();
        const userFound = await User.findOne({ email });
        if (userFound) {
            return {
                error: 'Email already exists!'
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            nom,
            prenom,
            username,
            dateOfBirth,
            email,
            password: hashedPassword,
            isAdmin: false,
            isVerified: false,
        });
        const savedUser = await user.save();
        // Convertir l'utilisateur en objet simple
        return {
            id: savedUser._id.toString(),
            nom: savedUser.nom,
            prenom: savedUser.prenom,
            username: savedUser.username,
            dateOfBirth: savedUser.dateOfBirth,
            email: savedUser.email,
            isAdmin: false,
            isVerified: false,
        };
    } catch (e) {
        console.log(e);
        return {
            error: 'Une erreur est survenue lors de la création de l\'utilisateur.'
        };
    }
}
