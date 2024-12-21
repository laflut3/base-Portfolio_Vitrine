import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import React from "react";

export const GoogleSignInButton = () => {

    const handleGoogleSignIn = async () => {
        signIn("google");
    };

    return (
        <div className="flex items-center justify-center mb-6">
            <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                <FaGoogle className="mr-2" />
                Login with Google
            </button>
        </div>
    );
};
