"use client";

import { useRouter } from "next/navigation";

const AdminPage: React.FC = () => {
    const router = useRouter();

    const handleUser = () => {
        router.push("/admin/users");
    };

    const handleProduct = () => {
        router.push("/admin/product");
    };

    const handleCommande = () => {
        router.push("/admin/Commande");
    };

    const handleNews = () => {
        router.push("/admin/newsLetter");
    };

    return (
        <main className="relative flex text-center items-center justify-center min-h-screen w-full">
            <div className="m-5 mt-20 mb-10 relative z-10 w-full px-6 py-10 md:px-10 md:py-20 backdrop-blur-md rounded-xl flex flex-col items-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    BIENVENUE dans l'espace /Admin.
                </h1>
                <p className="text-base md:text-lg text-gray-700 text-center max-w-3xl mb-8 md:mb-10">
                    Ici, vous pouvez éditer vos produits, consulter vos ventes annuelles
                    et mensuelles, et supprimer des utilisateurs.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-3/4">
                    <button
                        onClick={handleUser}
                        className="h-24 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors duration-300"
                    >
                        Utilisateurs
                    </button>
                    <button
                        onClick={handleProduct}
                        className="h-24 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors duration-300"
                    >
                        Produits
                    </button>
                    <button
                        onClick={handleCommande}
                        className="h-24 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors duration-300"
                    >
                        Commandes
                    </button>
                    <button
                        onClick={handleNews}
                        className="h-24 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors duration-300"
                    >
                        News Letter
                    </button>
                </div>
            </div>
        </main>
    );
};

export default AdminPage;
