"use client"

import React, { useState, useEffect, Suspense } from 'react';
import ProjectCard from './ProjectDiv/ProjectCard';
import { fetchProjects } from '../service/ProjectService'; // Utilise axios maintenant
import { IProject } from "../type/IProject";
import Carroussel from "@/components/utils/décors/Carroussel";

const ProjectFilterBar = React.lazy(() => import('./ProjectDiv/ProjectFilterBar'));

const ProjectSection: React.FC = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [filterType, setFilterType] = useState<string | null>(null);
    const [projects, setProjects] = useState<IProject[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        setIsClient(typeof window !== 'undefined');

        const fetchData = async () => {
            try {
                const fetchedProjects = await fetchProjects();
                setProjects(fetchedProjects?.Projects || []); // Assurez-vous que les projets sont bien récupérés
            } catch (error) {
                console.error('Error fetching projects:', error);
                setProjects([]);
            }
        };

        fetchData();
    }, []);

    const handleFilterChange = (type: string) => setFilterType(type);
    const handleRemoveFilter = () => setFilterType(null);

    if (!isClient) return null;

    const filteredProjects = filterType
        ? projects.filter((project) => project.type === filterType)
        : projects;

    return (
        <section
            className="relative min-h-screen flex flex-col items-center mb-4 mt-4 pt-8 w-full"
            id="projects"
        >

            {/* Content */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 sm:px-8">
                {/* Title */}
                <h1 className="w-full text-4xl sm:text-6xl md:text-7xl lg:text-8xl p-6 mb-8 font-aquire text-center">
                    Mes projets
                </h1>

                {/* Filter Bar */}
                <Suspense fallback={"Loading ..."}>
                    <ProjectFilterBar onFilterChange={handleFilterChange} />
                </Suspense>

                {/* Filter Tag */}
                {filterType && (
                    <div className="flex justify-center mt-4 px-4">
                        <div className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full">
                            <span>{filterType}</span>
                            <button
                                className="ml-2 text-gray-500 hover:text-gray-700"
                                onClick={handleRemoveFilter}
                            >
                                &#x2715;
                            </button>
                        </div>
                    </div>
                )}

                {/* Projects Grid */}
                <div
                    className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mt-6 px-4">
                    {Array.isArray(filteredProjects) && filteredProjects.length > 0 ? (
                        !isMobile ? (
                            filteredProjects.map((project) => (
                                <ProjectCard key={project._id} project={project}/>
                            ))
                        ) : (
                            <Carroussel items={filteredProjects.map((project) => (
                                <ProjectCard key={project._id} project={project}/>
                            ))}
                            />
                        )
                    ) : (
                        <p className="text-center text-gray-500 text-xl">No projects found</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProjectSection;
