import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="w-full bg-gray-800 text-white py-6">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                {/* Social Media Links */}
                <div className="flex space-x-4 mb-4 md:mb-0">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                        <FaFacebookF size={24} />
                    </a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                        <FaTwitter size={24} />
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                        <FaInstagram size={24} />
                    </a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
                        <FaLinkedinIn size={24} />
                    </a>
                </div>

                {/* Links */}
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm">
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    <Link href="/terms" className="hover:underline">Conditions d'utilisation</Link>
                    <Link href="/privacy" className="hover:underline">Politique de confidentialité</Link>
                    <Link href="/contact" className="hover:underline">Contact</Link>
                    <Link href="/about" className="hover:underline">À propos</Link>
                </div>
            </div>
            <div className="mt-4 text-center text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Fleo-Web. Tous droits réservés.
            </div>
        </footer>
    );
};

export default Footer;
