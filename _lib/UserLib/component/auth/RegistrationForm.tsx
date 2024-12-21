"use client"

import React, {FormEvent, useRef, useState} from 'react';
import {FaGoogle, FaEye, FaEyeSlash} from 'react-icons/fa';
import {useRouter} from "next/navigation";
import {register} from "@lib/UserLib/actions/register";
import styles from "@/styles/Button.module.css";

const RegistrationForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string>();
    const router = useRouter();
    const ref = useRef<HTMLFormElement>(null);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const formData = new FormData(ref.current!);
        const r = await register({
            nom: formData.get("nom"),
            prenom: formData.get("prenom"),
            username: formData.get("username"),
            dateOfBirth: formData.get("DateOfBirth"),
            email: formData.get("email"),
            password: formData.get("password"),
        });
        ref.current?.reset();
        if (r?.error) {
            setError(r.error);
            return;
        } else {
            router.push("/login")
        }
    };

    return (
        <section className="min-h-screen relative flex flex-col justify-center text-center items-center">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <h2 className="stroke-black stroke-1 text-2xl font-bold text-center mb-4 mt-10">S'inscrire</h2>
            <form ref={ref} className=" rounded-lg shadow-lg bg-white bg-opacity-80" onSubmit={handleSubmit}>
                <div className={`p-8 pb-0`}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Nom">
                            Nom
                        </label>
                        <input
                            type="text"
                            placeholder="Ex : Dupond"
                            name="nom"
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Prenom">
                            prénom
                        </label>
                        <input
                            name="prenom"
                            type="text"
                            required
                            placeholder="Ex : Jean"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username*
                        </label>
                        <input
                            name="username"
                            type="text"
                            placeholder="Entrez votre username"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="DateOfBirth">
                            Date de naissance
                        </label>
                        <input
                            type="date"
                            placeholder="date de naissance"
                            name="DateOfBirth"
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Adresse Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="Entrez votre email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="relative mb-4">
                        <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Entrez votre mot de passe"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 pt-6 flex items-center">
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-500 focus:outline-none focus:text-gray-700"
                            >
                                {showPassword ? <FaEyeSlash/> : <FaEye/>}
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            className={`${styles.customButton}`}
                        >
                            REGISTER
                        </button>
                    </div>
                    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                </div>
                <div className=" bg-white h-20 flex items-center justify-between">
                    <a href="/login"
                       className="inline-block align-baseline text-black pl-8 font-bold text-sm hover:text-blue-800">
                        Déjà un compte ? Se connecter
                    </a>
                </div>
            </form>
        </section>
    );
};

export default RegistrationForm;
