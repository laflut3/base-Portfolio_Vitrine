import {connectDB} from "../../MongoLib/mongodb";
import User from "../models/User";
import type {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                await connectDB();
                const user = await User.findOne({
                    email: credentials?.email,
                }).select("+password");

                if (!user) throw new Error("Wrong Email");

                const passwordMatch = await bcrypt.compare(
                    credentials!.password,
                    user.password
                );

                if (!passwordMatch) throw new Error("Wrong Password");

                // Return the user with updated data if needed
                return {
                    id: user._id.toString(),
                    name: user.username,
                    email: user.email,
                    firstName: user.prenom,
                    lastName: user.nom,
                    isAdmin: user.isAdmin,
                    isVerified: user.isVerified,
                    dateOfBirth: user.DateOfBirth
                };
            }
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 3600,
        updateAge: 300,
    },
    callbacks: {
        async jwt({token, user, account, profile}) {
            await connectDB();

            // Si l'utilisateur se connecte pour la première fois avec Google
            if (account && profile) {
                let existingUser = await User.findOne({email: profile.email});

                // Si l'utilisateur existe déjà, on récupère ses informations
                if (existingUser) {
                    token.id = existingUser._id.toString();
                    token.name = existingUser.username;
                    token.email = existingUser.email;
                    token.firstName = existingUser.prenom;
                    token.lastName = existingUser.nom;
                    token.isAdmin = existingUser.isAdmin;
                    token.isVerified = existingUser.isVerified;
                    token.dateOfBirth = existingUser.dateOfBirth;
                } else {
                    // Si l'utilisateur n'existe pas, on en crée un nouveau
                    existingUser = await User.create({
                        username: profile.name,
                        email: profile.email,
                        // Ajouter les champs nécessaires ici
                    });

                    token.id = existingUser._id.toString();
                    token.name = existingUser.username;
                    token.email = existingUser.email;
                    token.firstName = existingUser.prenom;
                    token.lastName = existingUser.nom;
                    token.isAdmin = existingUser.isAdmin;
                    token.isVerified = existingUser.isVerified;
                    token.dateOfBirth = existingUser.dateOfBirth;
                }
            }

            // Si l'utilisateur est déjà connecté (ex: via email/mot de passe)
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.isAdmin = user.isAdmin;
                token.isVerified = user.isVerified;
                token.dateOfBirth = user.dateOfBirth;
            } else {
                // Mise à jour du token avec les données de l'utilisateur existant
                const updatedUser = await User.findById(token.id);
                if (updatedUser) {
                    token.name = updatedUser.username;
                    token.email = updatedUser.email;
                    token.firstName = updatedUser.prenom;
                    token.lastName = updatedUser.nom;
                    token.isAdmin = updatedUser.isAdmin;
                    token.isVerified = updatedUser.isVerified;
                    token.dateOfBirth = updatedUser.dateOfBirth;
                }
            }
            return token;
        },
        async session({session, token}) {
            // Update session object with the latest data from the token
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.firstName = token.firstName;
            session.user.lastName = token.lastName;
            session.user.isAdmin = token.isAdmin;
            session.user.dateOfBirth = token.dateOfBirth;
            session.user.isVerified = token.isVerified;

            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};
