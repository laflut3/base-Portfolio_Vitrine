import axios from 'axios';
import {AddToCartParams} from "@lib/CartLib/type/CartType"

/**
 * Ajoute un produit au panier d'un utilisateur spécifique.
 *
 * Cette fonction envoie une requête POST à l'API pour ajouter un produit au panier d'un utilisateur avec une quantité spécifique.
 *
 * @async
 * @function
 * @param {Object} params - Les paramètres nécessaires pour ajouter un produit au panier.
 * @param {string} params.userId - L'identifiant de l'utilisateur.
 * @param {string} params.productId - L'identifiant du produit à ajouter.
 * @param {number} params.quantity - La quantité du produit à ajouter au panier.
 * @returns {Promise<void>} - Une promesse qui se résout si l'ajout au panier réussit.
 * @throws {Error} - Lance une erreur si l'ajout au panier échoue.
 *
 * @example
 * ```ts
 * await addToCart({ userId: '123', productId: 'abc', quantity: 2 });
 * ```
 */
export async function addToCart({userId, productId, quantity}: AddToCartParams): Promise<void> {
    try {
        await axios.post('/api/cart', {
            userId,
            productId,
            quantity
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('API error while adding to cart:', error.response?.status);
        } else {
            console.error('Failed to add product to cart:', error);
        }
        throw error; // Re-lancer l'erreur pour la gestion à un niveau supérieur
    }
}


/**
 * Récupère les items du panier pour un utilisateur spécifique.
 *
 * Cette fonction envoie une requête GET à l'API pour récupérer tous les articles actuellement dans le panier d'un utilisateur.
 *
 * @async
 * @function
 * @param {string} userId - L'identifiant de l'utilisateur pour lequel les items du panier doivent être récupérés.
 * @returns {Promise<any[]>} - Une promesse qui se résout avec un tableau des items du panier, où chaque item peut contenir des informations telles que le nom, le prix, la quantité, etc.
 * @throws {Error} - Lance une erreur si la récupération des items du panier échoue.
 *
 * @example
 * ```ts
 * const cartItems = await fetchCartItems('123');
 * console.log(cartItems);
 * ```
 */
export const fetchCartItems = async (userId: string): Promise<any[]> => {
    try {
        const response = await axios.get(`/api/cart?userId=${userId}`);
        return response.data; // Les items du panier se trouvent dans la réponse
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du panier');
    }
};

/**
 * Décrémente la quantité d'un produit dans le panier.
 *
 * @async
 * @function
 * @param {string} productId - L'identifiant du produit dont la quantité doit être décrémentée.
 * @param {string} userId - L'identifiant de l'utilisateur propriétaire du panier.
 * @param {number} newQuantity - La nouvelle quantité du produit dans le panier.
 * @returns {Promise<void>} - Une promesse qui se résout lorsque l'opération est réussie.
 * @throws {Error} - Lance une erreur si la requête échoue ou si les paramètres sont invalides.
 *
 * @example
 * ```ts
 * await decrementCartItemQuantity('product123', 'user456', 2);
 * ```
 */
export const decrementCartItemQuantity = async (productId: string, userId: string, newQuantity: number): Promise<void> => {
    try {
        await axios.patch('/api/cart', {
            productId,
            userId,
            quantity: newQuantity
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error('API error while decrementing quantity:', error.response?.statusText || error.message);
        } else if (error instanceof Error) {
            console.error('Failed to decrement item quantity:', error.message);
        } else {
            console.error('Unknown error:', error);
        }
        throw error;
    }
};

/**
 * Incrémente la quantité d'un produit dans le panier pour un utilisateur spécifique.
 *
 * Cette fonction envoie une requête PATCH à l'API pour mettre à jour la quantité d'un produit dans le panier d'un utilisateur.
 *
 * @async
 * @function
 * @param {string} productId - L'identifiant du produit dont la quantité doit être incrémentée.
 * @param {string} userId - L'identifiant de l'utilisateur propriétaire du panier.
 * @param {number} newQuantity - La nouvelle quantité du produit à mettre à jour dans le panier.
 * @returns {Promise<void>} - Une promesse qui se résout si l'opération réussit.
 * @throws {Error} - Lance une erreur si la requête échoue ou si les paramètres sont invalides.
 *
 * @example
 * ```ts
 * await incrementCartItemQuantity('product123', 'user456', 3);
 * ```
 */
export const incrementCartItemQuantity = async (productId: string, userId: string, newQuantity: number): Promise<void> => {
    try {
        await axios.patch('/api/cart', {
            productId,
            userId,
            quantity: newQuantity,
        });
    } catch (error: any) {
        // Si c'est une erreur Axios
        if (axios.isAxiosError(error)) {
            console.error('API error:', error.response?.statusText || error.message);
        } else if (error instanceof Error) {
            console.error('Erreur: ' + error.message); // Si c'est une erreur standard
        } else {
            console.error('Unknown error', error); // Si l'erreur n'est pas standard
        }
        throw error; // Relance l'erreur pour une gestion à un niveau supérieur
    }
};

/**
 * Supprime un produit du panier pour un utilisateur spécifique.
 *
 * Cette fonction envoie une requête DELETE à l'API pour retirer un produit du panier d'un utilisateur.
 *
 * @async
 * @function
 * @param {string} productId - L'identifiant du produit à retirer du panier.
 * @param {string} userId - L'identifiant de l'utilisateur propriétaire du panier.
 * @returns {Promise<void>} - Une promesse qui se résout si la suppression réussit.
 * @throws {Error} - Lance une erreur si la suppression échoue ou si les paramètres sont invalides.
 *
 * @example
 * ```ts
 * await removeCartItem('product123', 'user456');
 * ```
 */
export const removeCartItem = async (productId: string, userId: string): Promise<void> => {
    try {
        const response = await axios.delete(`/api/cart/${productId}`, {
            data: { userId } // Include any additional required data here
        });
        console.log('Item removed successfully:', response.data);
    } catch (error) {
        console.error('API error:', error);
        throw error; // Rethrow the error to be caught in the component
    }
};


/**
 * Vide tous les articles du panier pour un utilisateur spécifique.
 *
 * @async
 * @function
 * @param {any[]} cartItems - La liste des articles actuellement dans le panier.
 * @param {string} userId - L'identifiant de l'utilisateur dont le panier doit être vidé.
 * @returns {Promise<void>} - Une promesse qui se résout lorsque tous les articles sont supprimés avec succès.
 * @throws {Error} - Lance une erreur si la suppression échoue.
 *
 * @example
 * ```ts
 * await clearCartItems([{ product: { _id: 'product123' }, quantity: 1 }], 'user456');
 * ```
 */
export const clearCartItems = async (cartItems: any[], userId: string): Promise<void> => {
    try {
        for (const item of cartItems) {
            await axios.delete(`/api/cart/${item.product._id}`, {
                data: { userId }
            });
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error(`Erreur lors de la suppression de l'article avec ID`, error.response?.statusText || error.message);
        } else if (error instanceof Error) {
            console.error('Erreur lors de la suppression des articles du panier:', error.message);
        } else {
            console.error('Unknown error:', error);
        }
        throw error;
    }
};




