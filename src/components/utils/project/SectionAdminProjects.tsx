"use client";

import React, { useState, useEffect } from 'react';
import ProjectForm from './ProjectForm';
import ProjectBox from './ProjectBox';
import EditModal from './Modal';

const AdminForm: React.FC = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editProjectId, setEditProjectId] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch('/api/projects');
            const data = await response.json();
            setProjects(data.Projects);
        };
        fetchProjects();
    }, []);

    const handleSaveProject = async (formData: FormData) => {
        const response = await fetch(isEditMode && editProjectId ? `/api/projects?id=${editProjectId}` : '/api/projects', {
            method: isEditMode ? 'PUT' : 'POST',
            body: formData,
        });
        const data = await response.json();

        if (response.ok) {
            setProjects((prev) => isEditMode ? prev.map(p => p._id === editProjectId ? data.project : p) : [...prev, data.Project]);
            setIsEditMode(false);
            setEditProjectId(null);
            setShowEditModal(false);
        }
    };

    const handleEditProject = (project: any) => {
        setIsEditMode(true);
        setEditProjectId(project._id);
        setShowEditModal(true); // Ouvrir la modal
    };

    const handleDeleteProject = async (id: string) => {
        await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
        setProjects(projects.filter((project) => project._id !== id));
    };

    return (
        <div>
            {/* Formulaire d'ajout */}
            <ProjectForm
                isEditMode={false}
                onSave={handleSaveProject}
                project={null}
            />

            {/* Grille des projets */}
            <div className="grid grid-cols-3 gap-4">
                {projects.map((project) => (
                    <ProjectBox
                        key={project._id}
                        project={project}
                        onEdit={() => handleEditProject(project)}
                        onDelete={() => handleDeleteProject(project._id)}
                    />
                ))}
            </div>

            {/* Modal de modification */}
            {showEditModal && editProjectId && (
                <EditModal
                    project={projects.find(p => p._id === editProjectId) || null}
                    onSave={handleSaveProject}
                    onClose={() => setShowEditModal(false)}
                />
            )}
        </div>
    );
};

export default AdminForm;
