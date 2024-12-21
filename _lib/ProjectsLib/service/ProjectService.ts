import axios from 'axios';

const instance = axios.create({
    baseURL: '/api',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
});

export const fetchProjects = async (page = 0) => {
    try {
        const response = await instance.get(`/projects?page=${page}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return null;
    }
};

export const addProject = async (projectData: { url: string, type: string, image?: File }) => {
    try {
        const formData = new FormData();
        formData.append('url', projectData.url);
        formData.append('type', projectData.type);
        if (projectData.image) {
            formData.append('image', projectData.image);
        }

        const response = await instance.post('/projects', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data;
    } catch (error) {
        console.error('Error adding project:', error);
        return null;
    }
};

export const deleteProject = async (id: string) => {
    try {
        const response = await instance.delete('/projects', {
            data: { id },
        });

        return response.data;
    } catch (error) {
        console.error('Error deleting project:', error);
        return null;
    }
};

export const updateProject = async (projectData: { id: string, url: string, type: string, image?: File }) => {
    try {
        const formData = new FormData();
        formData.append('id', projectData.id);
        formData.append('url', projectData.url);
        formData.append('type', projectData.type);
        if (projectData.image) {
            formData.append('image', projectData.image);
        }

        const response = await instance.put('/projects', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data;
    } catch (error) {
        console.error('Error updating project:', error);
        return null;
    }
};
