"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { dotWave } from "ldrs";
import styles from "@/styles/Button.module.css"; // Assurez-vous que le chemin est correct
import ValidationPopup from "@/components/utils/décors/ValidationPopUp";
import {sendContactForm} from "@lib/Contact/type/ContactType"; // Importez le composant de la popup

const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        consent: false,
    });
    const [status, setStatus] = useState<string>("");
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            dotWave.register();
        }
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const { checked } = e.target as HTMLInputElement;
            setFormData((prevData) => ({
                ...prevData,
                [name]: checked,
            }));
            if (name === "consent" && checked) {
                setShowPopup(true);
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus("Sending");
        try {
            const data = await sendContactForm(formData);
            if (data.success) {
                setStatus("Message envoyé !");
                setFormData({ name: "", email: "", message: "", consent: false });
            } else {
                setStatus("Problème lors de l'envoi du mail");
            }
        } catch (error) {
            setStatus("Erreur lors de l'envoi du formulaire");
        }
    };


    return (
        <section className="w-1/2 h-1/2 min-h-screen flex flex-col justify-center text-center rounded-lg sm:mt-0 sm:mb-0 mt-24 mb-10">
            <h2 className="text-white text-4xl mb-4">Prendre contact</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-2xl bg-opacity-80 rounded-2xl">
                <div className="p-8">
                    <p className="text-black mb-4">
                        Vous avez des questions ou des suggestions ? Remplissez ce formulaire pour nous contacter
                    </p>
                    <div className="flex flex-col items-center w-full text-black">
                        <div className="flex flex-row space-x-4 w-full">
                            <input
                                type="text"
                                name="name"
                                placeholder="Entrez votre nom prénom"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-1/2 p-2 mb-4 rounded-2xl border border-gray-300 text-lg"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Entrez votre email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-1/2 p-2 mb-4 rounded-2xl border border-gray-300 text-lg"
                                required
                            />
                        </div>
                        <textarea
                            name="message"
                            placeholder="Entrez votre message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full p-2 mb-4 rounded-2xl border border-gray-300 text-lg h-32"
                            required
                        />
                    </div>
                    <div className="flex items-left text-left justify-start mb-4">
                        <input
                            type="checkbox"
                            name="consent"
                            checked={formData.consent}
                            onChange={handleChange}
                            className="mr-2"
                            required
                        />
                        <label className="text-black">Consentement*</label>
                    </div>
                    <button type="submit" className={`${styles.customButton}`}>
                        ENVOYER
                    </button>
                </div>
                <div className="bg-white space-y-2 h-20 flex flex-col items-center justify-center text-center">
                    {status && <p className="mt-4 text-black">{status}</p>}
                    <p className="text-black mb-4 sm:mb-0">
                        Vous pouvez directement nous joindre à lisa.mona.venture@gmail.com
                    </p>
                </div>
            </form>
            {showPopup && (
                <ValidationPopup
                    title="Le consentement lors d'un envoi"
                    text="Lorem ipsum dolor sit amet. Et velit praesentium quo voluptas impedit vel nulla quam! Qui perferendis repudiandae cum quam sequi et sunt quasi et rerum iusto ex eius modi. Qui laboriosam quasi rem corrupti sunt vel amet aliquam et quidem iure est omnis laboriosam. Et odio sint rem esse doloribus aut internos autem cum placeat corporis!"
                    onClose={() => setShowPopup(false)}
                />
            )}
        </section>
    );
};

export default ContactForm;
