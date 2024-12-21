"use client"

import {useEffect} from 'react';
import {cleanupOrders} from "@lib/OrderLib/service/orders";

const CleanUpOrders: React.FC = () => {
    useEffect(() => {
        const cleanUpInterval = setInterval(async () => {
            try {
                const deletedCount = await cleanupOrders();
                console.log(`${deletedCount} commandes supprimées.`);
            } catch (error) {
                console.error('Erreur lors du nettoyage des commandes:', error);
            }
        }, 60 * 60 * 1000); // Exécute toutes les heures

        return () => clearInterval(cleanUpInterval);
    }, []);

    return null; 
}

export default CleanUpOrders;