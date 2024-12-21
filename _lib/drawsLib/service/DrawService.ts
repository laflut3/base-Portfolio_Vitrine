import { Draw, NewDraw } from '../type/IDraw';

const headers = {
    'Content-Type': 'application/json',
};

/********************************  Draws ********************************/
export const getDraws = async (page: number) => {
    try {
        const res = await fetch(`/api/draws?page=${page}&limit=10`, {
            method: 'GET',
            headers,
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch draws: ${res.statusText}`);
        }
        const data = await res.json();
        console.log('data:', data);
        return data;
    } catch (error) {
        console.error('Failed to fetch draws:', error);
        throw error;
    }
};

export const getLengthDraws = async () => {
    try {
        const res = await fetch(`/api/draws/length`, {
            method: 'GET',
            headers,
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch total draws: ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch total draws:', error);
        throw error;
    }
};


export const createDraw = async (formData: NewDraw): Promise<Draw> => {
    try {
        const res = await fetch(`/api/draws`, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
            throw new Error(`Failed to create draw: ${res.statusText}`);
        }
        const data = await res.json();
        return data as Draw;
    } catch (error) {
        console.error('Failed to create draw:', error);
        throw error;
    }
};

// Supprimer une illustration
export const deleteDraw = async (id: string) => {
    try {
        const res = await fetch(`/api/draws/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            throw new Error(`Failed to delete draw: ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Failed to delete draw:', error);
        throw error;
    }
};

// Mettre à jour une illustration
export const updatedDraw = async (id: string, formData: NewDraw): Promise<Draw> => {
    try {
        const res = await fetch(`/api/draws/${id}`, {
            method: 'PUT',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
            throw new Error(`Failed to update draw: ${res.statusText}`);
        }
        const data = await res.json();
        return data as Draw;
    } catch (error) {
        console.error('Failed to update draw:', error);
        throw error;
    }
};