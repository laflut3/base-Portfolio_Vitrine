import axios from 'axios';


/**
 * Récupère les sections d'une politique spécifique par son slug.
 *
 * @param {string} slug - Le slug de la politique à récupérer.
 * @returns {Promise<any>} - Une promesse qui résout avec les données des sections de la politique.
 * @throws {Error} - Lance une erreur si la récupération échoue avec un message explicatif.
 *
 * @example
 *
 * fetchPolicySections('privacy-policy')
 *   .then(data => {
 *     console.log('Sections de la politique:', data);
 *   })
 *   .catch(error => {
 *     console.error('Erreur lors de la récupération des sections:', error.message);
 *   });
 */
export async function fetchPolicySections(slug: string): Promise<any> {
    try {
        const response = await axios.get(`/api/policy/${slug}`);
        if (response.status !== 200) {
            throw new Error(`Impossible de récupérer la politique : ${response.statusText}`);
        }
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des sections de la politique.');
    }
}

/**
 * Met à jour une section spécifique d'une politique.
 *
 * @param {string} slug - Le slug de la politique à mettre à jour.
 * @param {object} sectionData - Les nouvelles données de la section à mettre à jour.
 * @returns {Promise<void>} - Une promesse qui résout si la mise à jour est réussie.
 * @throws {Error} - Lance une erreur si la mise à jour échoue.
 *
 * @example
 *
 * updatePolicySection('privacy-policy', { title: 'New Title', content: 'Updated content' })
 *   .then(() => {
 *     console.log('Section mise à jour avec succès');
 *   })
 *   .catch(error => {
 *     console.error('Erreur lors de la mise à jour de la section:', error.message);
 *   });
 */
export async function updatePolicySection(slug: string, sectionData: object): Promise<void> {
    try {
        const response = await axios.put(`/api/policy/${slug}`, sectionData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status !== 200) {
            throw new Error("Échec de la mise à jour de la section");
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Erreur lors de la mise à jour de la section.");
    }
}

/**
 * Ajoute une nouvelle section à une politique spécifique.
 *
 * @param {string} slug - Le slug de la politique à laquelle ajouter la section.
 * @param {object} sectionData - Un objet contenant les données de la nouvelle section à ajouter.
 * @returns {Promise<void>} - Une promesse qui se résout si l'ajout est réussi.
 * @throws {Error} - Lance une erreur si l'ajout échoue.
 *
 * @example
 *
 * addSectionToPolicy('privacy-policy', { title: 'New Section', content: 'This is the content of the new section' })
 *   .then(() => {
 *     console.log('Section ajoutée avec succès');
 *   })
 *   .catch(error => {
 *     console.error('Erreur lors de l\'ajout de la section:', error.message);
 *   });
 */
export async function addSectionToPolicy(slug: string, sectionData: object): Promise<void> {
    try {
        const response = await axios.post(`/api/policy/${slug}`, sectionData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status !== 200) {
            throw new Error("Échec de l'ajout de la section");
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Erreur lors de l'ajout de la section.");
    }
}

/**
 * Supprime une section spécifique d'une politique.
 *
 * @param {string} slug - Le slug de la politique à partir de laquelle supprimer la section.
 * @param {string} sectionId - L'identifiant de la section à supprimer.
 * @returns {Promise<void>} - Une promesse qui se résout si la suppression est réussie.
 * @throws {Error} - Lance une erreur si la suppression échoue.
 *
 * @example
 *
 * deleteSectionFromPolicy('privacy-policy', 'section-id-123')
 *   .then(() => {
 *     console.log('Section supprimée avec succès');
 *   })
 *   .catch(error => {
 *     console.error('Erreur lors de la suppression de la section:', error.message);
 *   });
 */
export async function deleteSectionFromPolicy(slug: string, sectionId: string): Promise<void> {
    try {
        const response = await axios.delete(`/api/policy/${slug}/${sectionId}`);

        if (response.status !== 200) {
            throw new Error("Échec de la suppression de la section");
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Erreur lors de la suppression de la section.");
    }
}
