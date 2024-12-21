"use client";

import React, { useState, FormEvent } from 'react';
import {forgotPassword} from "@lib/UserLib/service/auth";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        try {
            await forgotPassword(email);
            setSuccess('Vérifiez votre email pour le lien de réinitialisation.');
        } catch (error: any) {
            setError(error.message || 'Une erreur est survenue.');
        }
    };

    return (
        <section className="min-h-screen flex flex-col text-center justify-center items-center w-full">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Mot de passe oublié</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-2xl p-10 w-1/2">
                <div>
                    <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="email"
                    >
                        Adresse e-mail
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Entrez votre adresse e-mail"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="text-white w-full py-2 px-4 bg-blue-600 font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Envoyer le lien de réinitialisation
                    </button>
                </div>
                {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}
                {success && <p className="text-green-600 text-sm text-center mt-4">{success}</p>}
            </form>
        </section>
    );
};

export default ForgotPassword;
