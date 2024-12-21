"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SideBarCart from '@lib/CartLib/component/SideBarCart';
import BurgerMenu from './MenuBurger';
import Link from 'next/link';
import logo from '@/../public/images/logo/fleo-web-reversed.png';
import cart from "@/../public/images/Utils/black-cart-icon.png";
import { AiOutlineUser } from "react-icons/ai";

export default function Navbar() {
    const [isBlurred, setIsBlurred] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsBlurred(scrollPosition > 50);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleNavClick = (targetId: string) => {
        router.push('/');

        setTimeout(() => {
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: "smooth",
                });
            }
        }, 100);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 transition-all duration-300 ${isBlurred ? 'bg-black bg-opacity-50 backdrop-blur-md' : 'bg-transparent'} z-50`}>
            <nav className="font-thin text-2xl py-2">
                <div className="flex items-center justify-between">
                    <div className="flex w-1/3 justify-start items-center pl-1">
                        <Link href="/">
                            <Image src={logo} alt="logo" width={60} height={60}/>
                        </Link>
                    </div>

                    <div className="hidden md:flex flex-1 justify-center">
                        <ul className="flex items-center justify-center space-x-8">
                            <li className="whitespace-nowrap">
                                <Link href="/">Accueil</Link>
                            </li>
                            <li className="whitespace-nowrap cursor-pointer text-stroke-black"
                                onClick={() => handleNavClick("products")}>Produits
                            </li>
                            <li className="whitespace-nowrap">
                                <Link href="/about">A propos</Link>
                            </li>
                            <li className="whitespace-nowrap">
                                <Link href="/contact">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cart and Profile or Burger Menu */}
                    <div className="flex w-1/3 justify-end items-center pr-2 space-x-2">
                        <button onClick={() => setIsSidebarOpen(true)}>
                            <Image src={cart} alt="cart" width={40} height={40}/>
                        </button>

                        {/* Profile button hidden on mobile and tablet screens, Burger Menu visible */}
                        <div className="hidden md:block">
                            {!session?.user ? (
                                <Link href="/login" className="bg-secondary text-primary rounded-xl px-4 py-2">Se
                                    connecter</Link>
                            ) : (
                                <Link href="/profile"
                                      className="bg-secondary text-primary rounded-xl px-4 py-2 flex items-center">
                                    <AiOutlineUser size={35}/>
                                </Link>
                            )}
                        </div>

                        {/* Burger Menu for mobile and tablet screens */}
                        <div className="md:hidden">
                            <BurgerMenu/>
                        </div>
                    </div>
                </div>
            </nav>

            <SideBarCart isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </header>

    );
}
