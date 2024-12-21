"use client";

import React, {useEffect, useState} from "react";
import {useStripe, useElements, PaymentElement} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@lib/StripeLib/convertToSubcurrency";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation"
import {createPaymentIntent} from "@lib/StripeLib/service/paiement";
import {deleteOrder, updateOrderForPaiement} from "@lib/OrderLib/service/orders";

const CheckoutPage = ({amount, orderId}: { amount: number, orderId: string }) => {
    const link = "http://localhost:3000/profile"
    const router = useRouter();

    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [clientSecret, setClientSecret] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const [personalInfo, setPersonalInfo] = useState({
        name: "",
        email: "",
        phone: "",
        address: {
            line1: "",
            line2: "",
            city: "",
            postalCode: "",
            country: "",
        },
    });

    useEffect(() => {
        const fetchPaymentIntent = async () => {
            try {
                const secret = await createPaymentIntent(convertToSubcurrency(amount));
                setClientSecret(secret);
            } catch (error: any) {
                console.error('Erreur lors de la récupération du client secret:', error.message);
            }
        };

        fetchPaymentIntent();
    }, [amount]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            console.log("Stripe or elements not loaded");
            setLoading(false);
            return;
        }

        const { error: submitError } = await elements.submit();

        if (submitError) {
            setErrorMessage(submitError.message);
            setLoading(false);
            return;
        }

        await updateOrders();

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                receipt_email: personalInfo.email,
                return_url: link,
            },
        });

        if (error) {
            setErrorMessage(error.message);
            await handleDeleteOrder();
            Cookies.set('flashMessage', 'Erreur lors de l\'achat');
            setLoading(false);
            window.location.reload();  // Recharge la page pour afficher le message flash
            router.push("/")
        }

        setLoading(false);
    };

    const updateOrders = async (): Promise<void> => {
        try {
            await updateOrderForPaiement(orderId, personalInfo, 'paid');
        } catch (err: any) {
            setErrorMessage('An error occurred while updating your order.');
            console.error('Erreur lors de la mise à jour de la commande:', err.message);
        }
    };


    const handleDeleteOrder = async () => {
        try {
            await deleteOrder(orderId)
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setPersonalInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setPersonalInfo((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            },
        }));
    };

    if (!clientSecret) {
        return (
            <div className="flex items-center justify-center">
                <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                >
                    <span
                        className="!absolute !-m-px !h-px !w-px !overflow-hidden whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Finalisez votre commande</h2>

            {/* Personal Information Section */}
            <div className="mb-4 text-black">
                <h3 className="text-lg font-bold mb-2">Informations personnelles</h3>
                <input
                    type="text"
                    name="name"
                    value={personalInfo.name}
                    onChange={handleInputChange}
                    placeholder="Nom complet"
                    className="w-full p-2 mb-2 border rounded-md"
                />
                <input
                    type="email"
                    name="email"
                    value={personalInfo.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full p-2 mb-2 border rounded-md"
                />
                <input
                    type="text"
                    name="line1"
                    value={personalInfo.address.line1}
                    onChange={handleAddressChange}
                    placeholder="Adresse ligne 1"
                    className="w-full p-2 mb-2 border rounded-md"
                />
                <input
                    type="text"
                    name="line2"
                    value={personalInfo.address.line2}
                    onChange={handleAddressChange}
                    placeholder="Adresse ligne 2"
                    className="w-full p-2 mb-2 border rounded-md"
                />
                <input
                    type="text"
                    name="city"
                    value={personalInfo.address.city}
                    onChange={handleAddressChange}
                    placeholder="Ville"
                    className="w-full p-2 mb-2 border rounded-md"
                />
                <input
                    type="text"
                    name="postalCode"
                    value={personalInfo.address.postalCode}
                    onChange={handleAddressChange}
                    placeholder="Code postal"
                    className="w-full p-2 mb-2 border rounded-md"
                />
                <input
                    type="text"
                    name="country"
                    value={personalInfo.address.country}
                    onChange={handleAddressChange}
                    placeholder="Pays"
                    className="w-full p-2 mb-2 border rounded-md"
                />
            </div>

            {/* Payment Information Section */}
            <div className="space-y-4 text-black">
                <h3 className="text-lg font-bold mb-2">Informations de paiement</h3>
                <PaymentElement />
            </div>

            {/* Error Message and Submit Button */}
            {errorMessage && <div className="text-center text-red-500">{errorMessage}</div>}
            <button
                disabled={!stripe || loading}
                className="text-white w-full py-4 bg-red-500 mt-4 rounded-lg font-bold disabled:opacity-50 disabled:animate-pulse"
            >
                {!loading ? `Payer €${amount.toFixed(2)}` : "Traitement..."}
            </button>
        </form>
    );
};

export default CheckoutPage;