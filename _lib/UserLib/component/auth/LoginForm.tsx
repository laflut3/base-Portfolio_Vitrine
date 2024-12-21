import React, {FormEvent, useState} from 'react';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";

const LoginForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const res = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });
        if (res?.error) {
            setError(res.error as string);
        }
        if (res?.ok) {
            return router.push("/validation");
        }
    };

    return (
        <section className="min-h-screen flex flex-col justify-center text-center items-center w-full">
            <h2 className="stroke-2 stroke-black text-2xl font-bold text-center mb-8">Se connecter</h2>
            <form className={`shadow-lg rounded-lg bg-white bg-opacity-80 w-1/2`} onSubmit={handleSubmit}>
                <div className={`p-8 pb-0`}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            email
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Entrez votre username"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password*
                        </label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Entrez votre mot de passe"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                    <div className="mb-6">
                        <label className="inline-flex items-center text-gray-700">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <span className="ml-2">Se souvenir de moi</span>
                        </label>
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            LOGIN
                        </button>
                    </div>
                </div>
                <div className="bg-white h-20 p-8 flex items-center justify-between">
                    <a href="/register"
                       className="inline-block align-baseline font-bold text-sm text-black hover:text-gray-400">
                        Pas encore de compte ?
                    </a>
                    <a href="/forgot"
                       className="inline-block align-baseline font-bold text-sm text-black hover:text-gray-400">
                        Mot de passe oublié ?
                    </a>
                </div>
            </form>
        </section>
    );
};

export default LoginForm;
