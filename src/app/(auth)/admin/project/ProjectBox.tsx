import React from 'react';
import Image from "next/image";

interface ProjectBoxProps {
    project: any;
    onEdit: () => void;
    onDelete: () => void;
}

const ProjectBox: React.FC<ProjectBoxProps> = ({ project, onEdit, onDelete }) => {
    const imageSrc = project.image
        ? `data:image/jpeg;base64,${Buffer.from(project.image.data).toString('base64')}`
        : "/default-image.jpg"; // Image par défaut si pas d'image

    return (
        <div className="border border-gray-200 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
            {/* Image du projet */}
            <div className="flex justify-center items-center mb-4">
                <Image src={imageSrc} alt={project.titre} width={150} height={150} className="rounded-lg object-cover" />
            </div>

            {/* Titre du projet */}
            <h3 className="text-2xl font-semibold text-center text-gray-800 mb-2 truncate">
                {project.titre}
            </h3>

            {/* Type et URL */}
            <p className="text-sm text-gray-500 text-center mb-2">{project.type}</p>
            <p className="text-sm text-blue-600 text-center mb-4 truncate">
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                    {project.url}
                </a>
            </p>

            {/* Boutons */}
            <div className="flex justify-center space-x-4">
                <button
                    onClick={onEdit}
                    className="flex items-center justify-center bg-yellow-400 text-white py-2 px-4 rounded-full shadow hover:bg-yellow-500 transition-colors duration-300"
                >
                    ✏️ Modifier
                </button>
                <button
                    onClick={onDelete}
                    className="flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded-full shadow hover:bg-red-600 transition-colors duration-300"
                >
                    🗑️ Supprimer
                </button>
            </div>
        </div>
    );
};

export default ProjectBox;
