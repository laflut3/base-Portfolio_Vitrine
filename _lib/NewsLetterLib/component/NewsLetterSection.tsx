"use client"

import React, {useState} from 'react';
import Image from 'next/image';
import {FaTimes, FaTrash} from 'react-icons/fa'; // Import des icônes
import courrier from '../../../public/images/Utils/courrier.png';
import {addEmailToNewsletter, deleteEmailFromNewsletter} from "@lib/NewsLetterLib/service/newsLetter";

export default function NewsLetterSection() {
    const [email, setEmail] = useState('');
    const [deleteEmail, setDeleteEmail] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    // Fonction de soumission du formulaire d'ajout d'email
    const handleAddEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addEmailToNewsletter(email);
            alert('Email ajouté avec succès !');
            setEmail(''); // Réinitialiser le champ email
        } catch (error) {
            alert('Erreur lors de l\'ajout de l\'email.');
        }
    };

    // Fonction de soumission du formulaire de suppression d'email
    const handleDeleteEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await deleteEmailFromNewsletter(deleteEmail);
            alert('Email supprimé avec succès !');
            setDeleteEmail(''); // Réinitialiser le champ email de suppression
            setShowPopup(false); // Fermer la pop-up
        } catch (error) {
            alert('Erreur lors de la suppression de l\'email.');
        }
    };

    return (
        <section
            className="relative min-h-screen flex flex-col items-center justify-center z-20 pt-20 md:pt-24 w-full">
            <div className="bg-primary shadow-2xl p-10 rounded-2xl md:w-1/2">
                <h2 className="text-stroke-black text-center text-2xl md:text-3xl">
                    REJOINDRE LA COMMUNAUTÉ
                </h2>
                <h3 className="text-shadow-secondary text-lg md:text-xl text-center ">
                    Pour tous les âges, pour tous les curieux !
                </h3>
                <form onSubmit={handleAddEmail}
                      className='flex text-black items-center justify-between bg-tertiary rounded-lg mt-7'>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full py-2 px-2 pr-2 rounded-lg border-4 border-black mr-3'
                        placeholder='Votre adresse em@il'
                        required
                    />
                    <button type="submit">
                        <Image src={courrier} className='mr-1 mt-1' alt="courrier right" width={24} height={24}/>
                    </button>
                </form>
                <div className="flex text-center items-center justify-center">
                    <button
                        onClick={() => setShowPopup(true)}
                        className="mt-4 bg-red-600 py-2 px-4 rounded-lg"
                    >
                        Supprimer mon email de la newsletter
                    </button>
                </div>
            </div>

            {showPopup && (
                <div
                    className="text-black fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-20">
                    <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3">
                        <h2 className="text-lg md:text-xl font-bold mb-4">Supprimer votre email</h2>
                        <form onSubmit={handleDeleteEmail}>
                            <input
                                type="email"
                                value={deleteEmail}
                                onChange={(e) => setDeleteEmail(e.target.value)}
                                className="w-full py-2 px-2 mb-4 border border-gray-300 rounded-lg"
                                placeholder="Votre adresse em@il"
                                required
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPopup(false)}
                                    className="p-2 bg-gray-300 rounded-full"
                                >
                                    <FaTimes/>
                                </button>
                                <button type="submit" className="p-2 bg-red-500 text-white rounded-full">
                                    <FaTrash/>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}