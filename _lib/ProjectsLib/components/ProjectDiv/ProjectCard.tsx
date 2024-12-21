import { IProject } from "../../type/IProject";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
    project: IProject;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const imageSrc = project.image
        ? `data:image/jpeg;base64,${Buffer.from(project.image.data).toString('base64')}`
        : "/default-image.jpg"; // Fallback si aucune image n'est disponible

    return (
        <Link href={project.url} passHref>
            <div
                className="flex flex-col justify-between items-center border-2 border-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 w-[180px] sm:w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto h-full p-2 sm:p-4">
                {/* Image du projet */}
                {project.image ? (
                    <Image
                        src={imageSrc}
                        alt={project.type}
                        className="object-cover"
                        width={200} // Fixer une taille d'image adaptable
                        height={200}
                    />
                ) : (
                    <div className="w-full h-40 bg-gray-200 flex justify-center items-center">
                        <span className="text-gray-500">No Image Available</span>
                    </div>
                )}

                {/* Contenu du projet */}
                <div className="p-2 sm:p-4 flex-1 w-full">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">{project.type}</h3>
                    <p className="text-sm sm:text-base text-gray-600 truncate">{project.url}</p>
                </div>
            </div>
        </Link>
    );
};

export default ProjectCard;
