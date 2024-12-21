import axios from "axios";

/**
 * Service pour envoyer le formulaire de contact à l'API.
 *
 * @param {Object} formData - Les données du formulaire de contact.
 * @param {string} formData.name - Le nom de l'utilisateur.
 * @param {string} formData.email - L'email de l'utilisateur.
 * @param {string} formData.message - Le message de l'utilisateur.
 * @param {boolean} formData.consent - Le consentement de l'utilisateur pour le traitement des données.
 * @returns {Promise<Object>} - Une promesse qui résout avec la réponse de l'API.
 * @throws {Error} - Lance une erreur si la requête échoue.
 */
export const sendContactForm = async (formData: {
    name: string;
    email: string;
    message: string;
    consent: boolean;
}): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await axios.post("/api/contact", formData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw new Error("Erreur lors de l'envoi du formulaire de contact");
    }
};
