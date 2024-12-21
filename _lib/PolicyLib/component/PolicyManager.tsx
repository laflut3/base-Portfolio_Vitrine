"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {addSectionToPolicy, deleteSectionFromPolicy, fetchPolicySections, updatePolicySection} from "@lib/PolicyLib/service/policy";
import {Section, PolicyManagerProps} from "@lib/PolicyLib/type/PolicyType";

const PolicyManager: React.FC<PolicyManagerProps> = ({ slug }) => {
    const [sections, setSections] = useState<Section[]>([]); // Initialize with an empty array
    const [editingSection, setEditingSection] = useState<Section | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSection, setNewSection] = useState({ title: "", content: "" });
    const { data: session } = useSession();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    const isAdmin = session?.user?.isAdmin;

    useEffect(() => {
        const fetchSections = async () => {
            setIsLoading(true); // Début du chargement
            try {
                const data = await fetchPolicySections(slug);
                setSections(data.sections || []);
            } catch (error: any) {
                console.error('Erreur lors de la récupération de la politique:', error);
                setError('Erreur lors du chargement des sections de la politique. Veuillez réessayer plus tard.');
            } finally {
                setIsLoading(false); // Fin du chargement
            }
        };

        fetchSections();
    }, [slug]);


    const handleEditClick = (section: Section) => {
        setEditingSection(section);
        setIsModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (editingSection) {
            try {
                await updatePolicySection(slug, editingSection);
                setIsModalOpen(false);
                setEditingSection(null);
                location.reload(); // Recharge la page pour actualiser les données
            } catch (error: any) {
                console.error('Erreur lors de la mise à jour de la section:', error.message);
            }
        }
    };

    const handleAddSection = async () => {
        try {
            await addSectionToPolicy(slug, newSection);
            setNewSection({ title: "", content: "" });
            location.reload(); // Recharge la page après l'ajout de la section
        } catch (error: any) {
            console.error('Erreur lors de l\'ajout de la section:', error.message);
        }
    };

    const handleDeleteSection = async (slug: string, sectionId: string) => {
        console.log("Attempting to delete section with ID:", sectionId, "from policy:", slug);
        try {
            await deleteSectionFromPolicy(slug, sectionId);
            location.reload(); // Recharge la page après la suppression
        } catch (error: any) {
            console.error('Erreur lors de la suppression de la section:', error.message);
        }
    };


    return (
        <main className="text-black relative flex items-center justify-center min-h-screen bg-[rgba(114, 169, 241, 0.46)]">
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-3xl">
                <h1 className="text-2xl font-bold mb-6">{slug}</h1>
                {isLoading ? (
                    <p>Chargement...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : sections.length > 0 ? (
                    sections.map((section) => (
                        <div key={section._id} className="mb-8">
                            <h2 className="text-xl font-semibold">{section.title}</h2>
                            <p className="text-gray-700">{section.content}</p>
                            {isAdmin && (
                                <div className="mt-2">
                                    <button
                                        onClick={() => handleEditClick(section)}
                                        className="text-blue-500 hover:underline mr-4"
                                    >
                                        Éditer
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSection(slug, section._id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Supprimer
                                    </button>

                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Aucune section trouvée.</p>
                )}

                {isAdmin && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold">Ajouter une nouvelle section</h2>
                        <input
                            type="text"
                            placeholder="Titre"
                            value={newSection.title}
                            onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                            className="w-full mt-2 p-2 border rounded-md"
                        />
                        <textarea
                            placeholder="Contenu"
                            value={newSection.content}
                            onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                            className="w-full mt-2 p-2 border rounded-md"
                        />
                        <button
                            onClick={handleAddSection}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Ajouter
                        </button>
                    </div>
                )}

                {isModalOpen && editingSection && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4">Editer la section</h2>
                            <input
                                type="text"
                                value={editingSection.title}
                                onChange={(e) =>
                                    setEditingSection({ ...editingSection, title: e.target.value })
                                }
                                className="w-full p-2 border rounded-md mb-4"
                            />
                            <textarea
                                value={editingSection.content}
                                onChange={(e) =>
                                    setEditingSection({ ...editingSection, content: e.target.value })
                                }
                                className="w-full p-2 border rounded-md mb-4"
                            />
                            <button
                                onClick={handleSaveEdit}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
                            >
                                Sauvegarder
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default PolicyManager;
