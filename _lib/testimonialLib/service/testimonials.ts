import axios from 'axios';
import { CommentaireDocument } from '../type/Testimonial';

/**
 * Récupère tous les commentaires/témoignages disponibles.
 *
 * @returns {Promise<CommentaireDocument[]>} - Une promesse qui se résout avec un tableau de témoignages.
 * @throws {Error} - Lance une erreur si la récupération échoue.
 *
 * @example
 *
 * getTestimonials()
 *   .then(testimonials => {
 *     console.log('Témoignages récupérés:', testimonials);
 *   })
 *   .catch(error => {
 *     console.error('Erreur lors de la récupération des témoignages:', error.message);
 *   });
 */
export const getTestimonials = async (): Promise<CommentaireDocument[]> => {
    try {
        const response = await axios.get('/api/testimonial');
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des témoignages:', error);
        throw new Error('Erreur lors de la récupération des témoignages.');
    }
};

/**
 * Crée un nouveau témoignage.
 *
 * @param {Object} testimonialData - Les données du témoignage à créer.
 * @param {string} testimonialData.User - L'utilisateur qui soumet le témoignage.
 * @param {string} testimonialData.objet - L'objet du témoignage.
 * @param {string} testimonialData.message - Le message du témoignage.
 * @param {number} testimonialData.note - La note attribuée dans le témoignage.
 * @returns {Promise<void>} - Une promesse qui se résout si le témoignage est créé avec succès.
 * @throws {Error} - Lance une erreur si la création échoue.
 */

export interface User {
    _id: string;
    username: string;
    image?: string;
}

export async function createTestimonial(testimonialData: {
    User: User;
    objet: string;
    message: string;
    note: number;
}): Promise<void> {
    try {
        const response = await axios.post('/api/testimonial', testimonialData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 201) {
            throw new Error('Erreur lors de la création du témoignage.');
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la création du témoignage.');
    }
}

/**
 * Supprime un témoignage spécifique par son identifiant.
 *
 * @param {string} commentaireId - L'identifiant du témoignage à supprimer.
 * @param {string} userId - L'identifiant de l'utilisateur.
 * @param {boolean} isAdmin - Si l'utilisateur est administrateur ou non.
 * @returns {Promise<void>} - Une promesse qui se résout si le témoignage est supprimé avec succès.
 * @throws {Error} - Lance une erreur si la suppression échoue.
 *
 * @example
 *
 * deleteTestimonial('commentaireId', 'userId', true)
 *   .then(() => {
 *     console.log('Témoignage supprimé avec succès.');
 *   })
 *   .catch(error => {
 *     console.error('Erreur lors de la suppression du témoignage:', error.message);
 *   });
 */
export async function deleteTestimonial(commentaireId: string, userId: string, isAdmin: boolean): Promise<void> {
    try {
        const response = await axios.delete('/api/testimonial', {
            data: { commentaireId, userId, isAdmin },
        });

        if (response.status !== 200) {
            throw new Error('Erreur lors de la suppression du témoignage.');
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du témoignage.');
    }
}

/**
 * Met à jour un témoignage spécifique.
 *
 * @param {string} commentaireId - L'identifiant du témoignage à mettre à jour.
 * @param {string} userId - L'identifiant de l'utilisateur.
 * @param {Object} updatedData - Les nouvelles données à mettre à jour.
 * @param {string} updatedData.newMessage - Le nouveau message du témoignage.
 * @param {string} updatedData.newObjet - Le nouvel objet du témoignage.
 * @param {number} updatedData.newNote - La nouvelle note attribuée.
 * @returns {Promise<void>} - Une promesse qui se résout si le témoignage est mis à jour avec succès.
 * @throws {Error} - Lance une erreur si la mise à jour échoue.
 *
 * @example
 *
 * updateTestimonial('commentaireId', 'userId', { newMessage: 'Updated message', newObjet: 'Updated objet', newNote: 4 })
 *   .then(() => {
 *     console.log('Témoignage mis à jour avec succès.');
 *   })
 *   .catch(error => {
 *     console.error('Erreur lors de la mise à jour du témoignage:', error.message);
 *   });
 */
export async function updateTestimonial(
    commentaireId: string,
    userId: string,
    updatedData: {
        newMessage: string;
        newObjet: string;
        newNote: number;
    }
): Promise<void> {
    try {
        const response = await axios.patch('/api/testimonial', {
            commentaireId,
            userId,
            ...updatedData,
        });

        if (response.status !== 200) {
            throw new Error('Erreur lors de la mise à jour du témoignage.');
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du témoignage.');
    }
}
