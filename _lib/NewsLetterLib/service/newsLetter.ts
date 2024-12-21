import axios from 'axios';
import {EmailEntry} from "../type/EmailEntry";

/**
 * Ajoute un email à la liste de diffusion.
 *
 * @param {string} email - L'adresse email à ajouter à la newsletter.
 * @returns {Promise<void>} - Une promesse qui se résout si l'email est ajouté avec succès.
 * @throws {Error} - Lance une erreur si l'ajout échoue.
 *
 * @example
 *
 * addEmailToNewsletter('example@email.com')
 *   .then(() => {
 *     console.log('Email ajouté avec succès.');
 *   })
 *   .catch(error => {
 *     console.error('Erreur lors de l\'ajout de l\'email:', error.message);
 *   });
 */
export async function addEmailToNewsletter(email: string): Promise<void> {
    try {
        const response = await axios.post('/api/newsLetter/add', { email }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            throw new Error('Erreur lors de l\'ajout de l\'email.');
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'email.');
    }
}

/**
 * Supprime un email de la liste de diffusion.
 *
 * @param {string} email - L'adresse email à supprimer de la newsletter.
 * @returns {Promise<void>} - Une promesse qui se résout si l'email est supprimé avec succès.
 * @throws {Error} - Lance une erreur si la suppression échoue.
 *
 * @example
 *
 * deleteEmailFromNewsletter('example@email.com')
 *   .then(() => {
 *     console.log('Email supprimé avec succès.');
 *   })
 *   .catch(error => {
 *     console.error('Erreur lors de la suppression de l\'email:', error.message);
 *   });
 */
export async function deleteEmailFromNewsletter(email: string): Promise<void> {
    try {
        const response = await axios.delete('/api/newsLetter', {
            data: { email },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            throw new Error('Erreur lors de la suppression de l\'email.');
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'email.');
    }
}

/**
 * Envoie une newsletter avec un sujet et un message.
 *
 * @param {string} subject - Le sujet de la newsletter.
 * @param {string} message - Le contenu de la newsletter.
 * @returns {Promise<void>} - Une promesse qui se résout si la newsletter est envoyée avec succès.
 * @throws {Error} - Lance une erreur si l'envoi échoue.
 *
 * @example
 *
 * sendNewsletter('Sujet important', 'Voici le contenu de la newsletter')
 *   .then(() => {
 *     console.log('Newsletter envoyée avec succès.');
 *   })
 *   .catch(error => {
 *     console.error('Erreur lors de l\'envoi de la newsletter:', error.message);
 *   });
 */
export async function sendNewsletter(subject: string, message: string): Promise<void> {
    try {
        const response = await axios.post('/api/newsLetter/send', {
            subject,
            message,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            throw new Error('Erreur lors de l\'envoi de la newsletter.');
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi de la newsletter.');
    }
}

/**
 * Récupère la liste des emails de la newsletter.
 *
 * @returns {Promise<string[]>} - Une promesse qui se résout avec un tableau d'emails.
 * @throws {Error} - Lance une erreur si la récupération échoue.
 *
 * @example
 *
 * getEmails()
 *   .then(emails => {
 *     console.log('Emails récupérés:', emails);
 *   })
 *   .catch(error => {
 *     console.error('Erreur lors de la récupération des emails:', error.message);
 *   });
 */
export async function getEmails(): Promise<EmailEntry[]> {
    try {
        const response = await axios.get('/api/newsLetter');
        if (response.status === 200) {
            return response.data; // Assurez-vous que `response.data` est bien un tableau d'emails.
        } else {
            throw new Error('Échec lors de la récupération des emails');
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des emails.');
    }
}


