import React, { useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import Link from 'next/link';

export default function MenuBurger() {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <button onClick={handleClick} className="flex flex-col justify-center items-center">
                <span className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                <span className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isOpen ? 'opacity-0' : 'opacity-100'}`} ></span>
                <span className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
            </button>

            {/* Menu déroulant */}
            {isOpen && (
                <div className="absolute right-0 mt-4 py-2 w-48 bg-white rounded-lg shadow-xl z-50">
                    <Link href="/">
                        <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                            Accueil
                        </div>
                    </Link>
                    <Link href="/">
                        <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                            Produits
                        </div>
                    </Link>
                    <Link href="/about">
                        <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                            A propos
                        </div>
                    </Link>
                    <Link href="/contact">
                        <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                            Contact
                        </div>
                    </Link>
                    <Link href="/profile">
                        <div className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                            <FaUserCircle className="mr-2" />
                            <span>Profil</span>
                        </div>
                    </Link>
                    {/* Ajouter d'autres éléments de navigation si nécessaire */}
                </div>
            )}
        </div>
    );
}
