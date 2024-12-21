"use client";

import React, { useEffect, useState } from 'react';
import { createTestimonial, getTestimonials, deleteTestimonial, updateTestimonial } from '@lib/testimonialLib/service/testimonials';
import { CommentaireDocument } from "@lib/testimonialLib/type/Testimonial";
import { useSession } from "next-auth/react";
import Carroussel from "@/components/utils/décors/Carroussel";
import UserInitials from "@lib/UserLib/component/UserInitials";

export default function TestimonialsSection() {
    const [commentaires, setCommentaires] = useState<CommentaireDocument[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false); // Pour la popup
    const [newComment, setNewComment] = useState({ objet: '', message: '', note: 0 });
    const [isEditing, setIsEditing] = useState<boolean>(false); // Détermine si on est en mode édition
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null); // Stocke l'ID du commentaire à modifier
    const { data: session } = useSession(); // Récupère les données de session

    // Charger les commentaires depuis l'API
    useEffect(() => {
        const loadCommentaires = async () => {
            try {
                const fetchedCommentaires = await getTestimonials();
                setCommentaires(fetchedCommentaires);
            } catch (error) {
                console.error('Erreur lors du chargement des commentaires:', error);
            }
        };

        loadCommentaires();
    }, []);

    // Gestion de la soumission du commentaire (ajout ou modification)
    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session || !session.user) {
            console.error("Vous devez être connecté pour soumettre un commentaire.");
            return;
        }

        try {
            if (isEditing && editingCommentId) {
                // Mode édition : Mettre à jour le commentaire existant
                await updateTestimonial(editingCommentId, session.user.id, {
                    newMessage: newComment.message,
                    newObjet: newComment.objet,
                    newNote: newComment.note,
                });
                console.log("Commentaire mis à jour avec succès");

            } else {
                // Mode ajout : Créer un nouveau témoignage
                await createTestimonial({
                    User: {
                        _id: session.user.id, // Récupère l'ID de l'utilisateur connecté
                        username: session.user.name || 'Anonyme',
                    },
                    objet: newComment.objet,
                    message: newComment.message,
                    note: newComment.note,
                });
                console.log("Commentaire ajouté avec succès");
            }

            // Recharger les commentaires après soumission
            const updatedCommentaires = await getTestimonials();
            setCommentaires(updatedCommentaires);

            // Fermer la popup après la soumission
            setIsPopupOpen(false);
            setIsEditing(false); // Quitte le mode édition
            setEditingCommentId(null); // Réinitialise l'ID du commentaire en édition
        } catch (error) {
            console.error('Erreur lors de la soumission du commentaire:', error);
        }
    };

    // Gestion de la suppression d'un commentaire
    const handleDeleteComment = async (commentaireId: string) => {
        if (!session?.user?.id) {
            console.error('Utilisateur non connecté, suppression non autorisée');
            return;
        }

        try {
            // Supprime le commentaire si l'utilisateur est l'auteur ou un administrateur
            await deleteTestimonial(commentaireId, session.user.id, session.user.isAdmin);
            // Recharger les commentaires après la suppression
            const updatedCommentaires = await getTestimonials();
            setCommentaires(updatedCommentaires);
        } catch (error) {
            console.error('Erreur lors de la suppression du commentaire:', error);
        }
    };

    // Gestion de l'ouverture de la popup en mode édition
    const handleEditComment = (commentaire: CommentaireDocument) => {
        setIsEditing(true);
        setEditingCommentId(commentaire._id); // Stocke l'ID du commentaire à modifier
        setNewComment({
            objet: commentaire.objet,
            message: commentaire.message,
            note: commentaire.note,
        });
        setIsPopupOpen(true); // Ouvre la popup
    };

    return (
        <section className="min-h-screen bg-white flex flex-col justify-center items-center py-10">
            <h2 className="text-4xl font-bold mb-10 text-gray-800">Témoignages</h2>

            {/* Carrousel des commentaires */}
            <div className="w-full max-w-lg p-4 ">
                <Carroussel
                    items={commentaires.map((commentaire, index) => (
                        <div key={index} className="p-4 ">
                            <div className="bg-white shadow-lg rounded-lg p-6 space-y-4 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                                {/* User Initials */}
                                <div className="flex justify-center mb-4">
                                    <UserInitials
                                        firstName={session?.user.firstName || "D"}
                                        lastName={session?.user.lastName || "N"}
                                    />
                                </div>

                                {/* Commentaire Body */}
                                <h3 className="text-2xl font-semibold text-gray-800">{commentaire.objet}</h3>
                                <p className="text-md text-gray-600">{commentaire.message}</p>
                                <p className="text-md text-gray-500">Note: {commentaire.note}/5</p>
                                <p className="text-sm italic text-gray-400">- {commentaire.User.username}</p>

                                {/* Boutons Modifier et Supprimer */}
                                {(session?.user?.id === commentaire.User._id || session?.user?.isAdmin) && (
                                    <div className="flex justify-center items-center space-x-4 mt-4">
                                        {/* Bouton Modifier */}
                                        <button
                                            className="flex items-center text-blue-500 hover:text-blue-600 text-lg p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition duration-300"
                                            onClick={() => handleEditComment(commentaire)} // Passe en mode édition
                                        >
                                            ✏️
                                        </button>

                                        {/* Bouton Supprimer */}
                                        <button
                                            className="flex items-center text-red-500 hover:text-red-600 text-lg p-2 rounded-full bg-red-
                                            100 hover:bg-red-200 transition duration-300"
                                            onClick={() => handleDeleteComment(commentaire._id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                />
            </div>

            {/* Bouton pour ajouter un commentaire */}
            <button
                className="mt-10 bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md transition duration-300"
                onClick={() => {
                    setIsEditing(false); // Sort du mode édition
                    setIsPopupOpen(true); // Ouvre la popup pour l'ajout
                    setNewComment({ objet: '', message: '', note: 0 }); // Réinitialise les champs
                }}
            >
                Ajouter un commentaire
            </button>

            {/* Popup personnalisée pour ajouter ou modifier un commentaire */}
            {isPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 relative">
                        <h2 className="text-2xl font-bold mb-4">
                            {isEditing ? "Modifier le commentaire" : "Ajouter un commentaire"}
                        </h2>
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setIsPopupOpen(false)}
                        >
                            &times;
                        </button>
                        <form onSubmit={handleSubmitComment}>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium">Objet:</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newComment.objet}
                                    onChange={(e) => setNewComment({ ...newComment, objet: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium">Message:</label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newComment.message}
                                    onChange={(e) => setNewComment({ ...newComment, message: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium">Note:</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min={1}
                                    max={5}
                                    value={newComment.note}
                                    onChange={(e) => setNewComment({ ...newComment, note: +e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                                >
                                    {isEditing ? "Mettre à jour" : "Soumettre"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
