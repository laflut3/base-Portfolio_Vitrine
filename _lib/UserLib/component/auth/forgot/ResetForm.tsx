"use client";

import React, {useState, FormEvent, Suspense} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {resetPassword} from "@lib/UserLib/service/auth";

function ResetForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');

    const checkPasswordStrength = (password: string) => {
        if (password.length < 6) {
            return 'Faible';
        } else if (password.length < 10) {
            return 'Moyenne';
        } else {
            return 'Forte';
        }
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            if (typeof token === 'string') {
                await resetPassword(token, password);
                setSuccess('Votre mot de passe a été réinitialisé avec succès.');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError("Jeton de réinitialisation invalide.");
            }
        } catch (error: any) {
            setError(error.message || 'Une erreur est survenue.');
        }
    }

    return (
        <section className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg z-20">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Réinitialiser le mot de passe</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Nouveau mot de passe
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Entrez un nouveau mot de passe"
                    />
                    <p className={`mt-1 text-sm ${passwordStrength === 'Forte' ? 'text-green-600' : passwordStrength === 'Moyenne' ? 'text-yellow-600' : 'text-red-600'}`}>
                        Force du mot de passe : {passwordStrength}
                    </p>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                        Confirmer le mot de passe
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirmez votre nouveau mot de passe"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Réinitialiser le mot de passe
                </button>
                {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}
                {success && <p className="text-green-600 text-sm text-center mt-4">{success}</p>}
            </form>
        </section>
    );
}

const ResetFormWrapper: React.FC = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <ResetForm />
    </Suspense>
);

export default ResetFormWrapper;
