import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            _id: string;
            id: string;
            name: string;
            email: string;
            firstName: string;
            lastName: string;
            isAdmin: boolean;
            isVerified: boolean;
            dateOfBirth: Date;
        }
    }

    interface User {
        id: string;
        name: string;
        email: string;
        firstName: string;
        lastName: string;
        isAdmin: boolean;
        isVerified: boolean;
        dateOfBirth: Date;

    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        name: string;
        email: string;
        firstName: string;
        lastName: string;
        isAdmin: boolean;
        isVerified: boolean;
        dateOfBirth: Date;
    }
}
