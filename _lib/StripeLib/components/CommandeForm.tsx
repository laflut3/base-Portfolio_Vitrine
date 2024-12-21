"use client";

import React, {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import convertToSubcurrency from "@lib/StripeLib/convertToSubcurrency";
import CheckoutPage from "@lib/StripeLib/components/CheckoutPage";
import {OrderDetails} from "@lib/OrderLib/type/OrderType";
import {fetchOrderDetails} from "@lib/OrderLib/service/orders";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const PaymentPage: React.FC = () => {
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    useEffect(() => {
        const getOrderDetails = async () => {
            if (!orderId) {
                setError("Aucun ID de commande fourni.");
                setLoading(false);
                return;
            }

            try {
                const fetchedOrderDetails = await fetchOrderDetails(orderId);
                setOrderDetails(fetchedOrderDetails);
            } catch (error: any) {
                setError(error.message || "Erreur lors de la récupération des détails de la commande.");
            } finally {
                setLoading(false);
            }
        };

        getOrderDetails();
    }, [orderId]);

    if (loading) {
        return <div className="text-center mt-4">Chargement des détails de la commande...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-4">{error}</div>;
    }

    if (!orderDetails) {
        return <div className="text-red-500 text-center mt-4">Détails de la commande non disponibles.</div>;
    }

    return (
        <section className="min-h-screen flex flex-col justify-center p-10 text-center m-10 rounded-md text-black">
            <div className="md-10">
                <h1 className="text-4xl font-extrabold mb-2">Résumé de la commande</h1>
                <h2 className="text-2xl ">Total : <span className="text-green-600">€ {orderDetails.amount.toFixed(2)}</span></h2>
            </div>
            <Elements stripe={stripePromise}
                      options={{
                          mode: "payment",
                          amount: convertToSubcurrency(orderDetails.amount),
                          currency: "eur"
                      }}
            >
                <CheckoutPage orderId={orderDetails._id} amount={orderDetails.amount}/>
            </Elements>
        </section>
    );
};

export default PaymentPage;
