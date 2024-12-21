"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { leapfrog } from 'ldrs';
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import livre from "../../../../../public/images/Utils/livre-ouvert.png";
import RedirectionArrow from "@lib/UserLib/component/admin/RedirectionArrow";
import {deleteEmailFromNewsletter, getEmails, sendNewsletter} from "@lib/NewsLetterLib/service/newsLetter";
import {EmailEntry} from "../../../../NewsLetterLib/type/EmailEntry";

const ProductForm: React.FC = () => {
    leapfrog.register();

    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [emails, setEmails] = useState<EmailEntry[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const data = await getEmails();
                setEmails(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des emails:', error);
            }
        };

        fetchEmails();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsSuccess(false);

        try {
            await sendNewsletter(subject, description);
            setIsSuccess(true);
            setSubject("");
            setDescription("");
            alert('Newsletter envoyée avec succès !');
        } catch (error: any) {
            alert(error.message || 'Erreur lors de l\'envoi de la newsletter.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteEmail = async (email: string) => {
        const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer l'email ${email} ?`);
        if (!confirmDelete) return;

        try {
            await deleteEmailFromNewsletter(email);
            setEmails(emails.filter((entry) => entry.email !== email)); // Mettez à jour l'état en supprimant l'email
            alert('Email supprimé avec succès !');
        } catch (error: any) {
            alert(error.message || 'Erreur lors de la suppression de l\'email.');
        }
    };

    return (
        <section className="flex flex-col justify-center items-center min-h-screen p-8 w-1/2 my-20 space-y-10">
            <RedirectionArrow/>
            <div className={"text-black bg-white rounded-lg shadow-xl mx-auto"}>
                <div className="flex justify-between items-center bg-[#3577B4] p-8 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-white">NEWS LETTER</h2>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center p-6 space-y-4 md:space-y-0">
                    <h2 className="text-lg md:text-2xl font-bold text-center md:text-left">Envoyer un mail</h2>
                    <Image
                        src={livre}
                        alt="livre"
                        className=" w-1/2 h-1/2 md:h-auto pl-0 md:pl-8 md:ml-5 md:mr-10"
                    />
                </div>
                <form onSubmit={handleSubmit} className={`p-8 space-y-4`}>
                    <div>
                        <label className="block text-lg font-medium mb-2">Objet</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 text-white bg-opacity-30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="Entrez l'objet de l'email"
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium mb-2">Message</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 text-white bg-opacity-30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="Entrez le message de l'email"
                            rows={4}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition-colors duration-200 flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <l-leapfrog
                                size="40"
                                speed="2.5"
                                color="white"
                            ></l-leapfrog>
                        ) : (
                            "Envoyer l'email"
                        )}
                    </button>

                    {isSuccess && (
                        <p className="text-green-500 mt-4 text-center">
                            Email envoyé avec succès !
                        </p>
                    )}
                </form>

                {/* Email List */}
                <div className="p-8 space-y-4">
                    <h3 className="text-xl font-bold mb-4">Liste des adresses email</h3>
                    <ul className="space-y-2">
                        {emails.map((entry: EmailEntry, index) => (
                            <li key={index} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                                <span>{entry.email}</span> {/* Accédez à la propriété email */}
                                <button
                                    onClick={() => handleDeleteEmail(entry.email)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                    <FaTrash/>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default ProductForm;
