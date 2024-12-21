import React, { useState } from 'react';
import ProjectForm from './ProjectForm';
import Image from "next/image";

interface EditModalProps {
    project: any;
    onSave: (formData: FormData) => void;
    onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ project, onSave, onClose }) => {
    const [imageRemoved, setImageRemoved] = useState(false); // État pour gérer la suppression de l'image
    const imageSrc = !imageRemoved && project.image
        ? `data:image/jpeg;base64,${Buffer.from(project.image.data).toString('base64')}`
        : "/default-image.jpg"; // Image par défaut si supprimée

    return (
        <div className="text-black fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-lg font-bold mb-4">Modifier le projet</h2>

                {/* Formulaire d'édition */}
                <ProjectForm isEditMode={true} onSave={onSave} project={project} />

                {/* Affichage de l'image courante */}
                <div className="my-4">
                    <Image src={imageSrc} alt="image du projet" width={100} height={100} className="mb-2" />
                </div>

                {/* Bouton pour fermer la modal */}
                <button onClick={onClose} className="mt-4 bg-red-500 text-white p-2 rounded w-full">
                    Fermer
                </button>
            </div>
        </div>
    );
};

export default EditModal;
