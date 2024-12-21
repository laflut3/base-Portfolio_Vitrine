import axios from 'axios';
import { UpdateUserData } from '../type/UserType';

/**
 * Supprime un utilisateur spécifique par son identifiant.
 *
 * @param {string} userId - L'identifiant de l'utilisateur à supprimer.
 * @returns {Promise<void>} - Une promesse qui résout si l'utilisateur est supprimé avec succès.
 * @throws {Error} - Lance une erreur si la suppression échoue.
 *
 * @example
 *
 * deleteUser('12345')
 *   .then(() => {
 *     console.log('User deleted successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Failed to delete user:', error.message);
 *   });
 */
export async function deleteUser(userId: string): Promise<void> {
    try {
        const response = await axios.delete("/api/user", {
            data: { userId },
        });

        if (response.status !== 200) {
            throw new Error("Échec de la suppression de l'utilisateur");
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Échec de la suppression de l'utilisateur");
    }
}

/**
 * Met à jour une information spécifique d'un utilisateur.
 *
 * @param {UpdateUserData} params - Un objet contenant l'ID de l'utilisateur, le champ à modifier et la nouvelle valeur.
 * @param {string} params.userId - L'identifiant de l'utilisateur à mettre à jour.
 * @param {string} params.field - Le champ de l'utilisateur à modifier.
 * @param {string | number} params.value - La nouvelle valeur à attribuer au champ.
 * @returns {Promise<void>} - Une promesse qui résout si la mise à jour est réussie.
 * @throws {Error} - Lance une erreur si la mise à jour échoue.
 *
 * @example
 *
 * updateUserData({ userId: '12345', field: 'name', value: 'John Doe' })
 *   .then(() => {
 *     console.log('User information updated successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Failed to update user information:', error.message);
 *   });
 */
export async function updateUserData({ userId, field, value }: UpdateUserData): Promise<void> {
    try {
        const response = await axios.put("/api/user", {
            userId,
            updateData: { [field]: value },
        });

        if (response.status !== 200) {
            throw new Error("Échec de la mise à jour de l'information");
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Échec de la mise à jour de l'information");
    }
}

/**
 * Envoie un email pour réinitialiser le mot de passe à un utilisateur qui l'a oublié.
 *
 * @param {string} email - L'adresse email de l'utilisateur pour envoyer le lien de réinitialisation du mot de passe.
 * @returns {Promise<void>} - Une promesse qui résout si l'email est envoyé avec succès.
 * @throws {Error} - Lance une erreur si l'envoi échoue.
 *
 * @example
 *
 * forgotPassword('john.doe@example.com')
 *   .then(() => {
 *     console.log('Password reset email sent successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Failed to send password reset email:', error.message);
 *   });
 */
export async function forgotPassword(email: string): Promise<void> {
    try {
        const response = await axios.post('/api/user/password/forgot', { email }, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200) {
            return Promise.resolve();
        } else {
            const data = response.data;
            throw new Error(data.message || 'Une erreur est survenue.');
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
    }
}


/**
 * Réinitialise le mot de passe d'un utilisateur à l'aide d'un jeton de réinitialisation.
 *
 * @param {string} token - Le jeton de réinitialisation de mot de passe.
 * @param {string} password - Le nouveau mot de passe de l'utilisateur.
 * @returns {Promise<void>} - Une promesse qui résout si le mot de passe est réinitialisé avec succès.
 * @throws {Error} - Lance une erreur si la réinitialisation échoue.
 *
 * @example
 *
 * resetPassword('reset-token-123', 'new-password')
 *   .then(() => {
 *     console.log('Password reset successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Failed to reset password:', error.message);
 *   });
 */
export async function resetPassword(token: string, password: string): Promise<void> {
    try {
        const response = await axios.post(`/api/user/password/reset`, {
            token,
            password
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200) {
            return Promise.resolve();
        } else {
            const data = response.data;
            throw new Error(data.message || 'Une erreur est survenue.');
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
    }
}

/**
 * Envoie un email de validation à l'utilisateur.
 *
 * @returns {Promise<void>} - Une promesse qui se résout si l'email de validation est envoyé avec succès.
 *
 * @throws {Error} - Lance une erreur si l'envoi de l'email de validation échoue.
 *
 * @example
 *
 * sendValidationEmail()
 *   .then(() => {
 *     console.log('Validation email sent successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Failed to send validation email:', error.message);
 *   });
 */
export async function sendValidationEmail(): Promise<void> {
    try {
        const response = await axios.post("/api/user/validationEmail");

        if (response.status !== 200) {
            throw new Error("Échec de l'envoi de l'email de validation");
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Error sending validation email");
    }
}