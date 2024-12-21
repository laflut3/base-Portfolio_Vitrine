"use client";

import React, {useState, useEffect} from 'react';
import {useSession} from "next-auth/react";
import {notFound, useRouter} from "next/navigation";
import {ProductDetail, ProductPageProps} from "@/../_lib/ProductLib/type/Product";
import {fetchProductById} from "@/../_lib/ProductLib/service/produit";
import {createOrder} from "@/../_lib/OrderLib/service/orders";
import {FaShoppingCart} from "react-icons/fa";
import Image from "next/image";
import {addToCart} from "@/../_lib/CartLib/service/cart";

export default function ProductPage({params}: ProductPageProps) {
    const [product, setProduct] = useState<ProductDetail>()
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const {data: session} = useSession();
    const router = useRouter();

    useEffect(() => {
        const loadProduct = async () => {
            const fetchedProduct = await fetchProductById(params.id);
            if (!fetchedProduct) {
                setError(true);
                setLoading(false);
                return;
            }
            setProduct(fetchedProduct);
            setLoading(false);
        };

        loadProduct();
    }, [params.id]);

    const handleCart = async () => {
        if (!product) return;

        try {
            // Utilisateur connecté
            if (session?.user) {
                await addToCart({ userId: session.user.id, productId: product._id, quantity: 1 });
            } else {
                // Utilisateur non connecté - Stocker le panier dans le localStorage
                const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
                const existingTemplateIndex = cartItems.findIndex(
                    (item: any) => item.productId === product._id
                );

                if (existingTemplateIndex > -1) {
                    cartItems[existingTemplateIndex].quantity += 1;
                } else {
                    cartItems.push({
                        productId: product._id,
                        name: product.name,
                        price: product.price,
                        image: base64Image,
                        quantity: 1,
                    });
                }

                localStorage.setItem('cart', JSON.stringify(cartItems));
            }

            setIsSuccess(true);
            setMessage('Produit ajouté au panier!');
        } catch (error) {
            console.error('Error adding template to cart:', error);
            setIsSuccess(false);
            setMessage('Échec de l\'ajout au panier.');
        }

        // Clear the message after 3 seconds
        setTimeout(() => {
            setMessage(null);
            setIsSuccess(null);
        }, 3000);
    };

    const handleOrder = async () => {
        if (!product || !session?.user) return;

        try {
            const result = await createOrder({
                userId: session.user.id,
                items: [{
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                }],
                amount: product.price,
            });

            console.log(result);
            router.push(`/paiement?orderId=${result.orderId}`);
        } catch (error) {
            console.error('Order creation failed:', error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen z-10"></div>;
    }

    if (error || !product) {
        return notFound();
    }

    const base64Image = product.image
        ? `data:image/png;base64,${Buffer.from(product.image).toString('base64')}`
        : '';

    return (
        <main className="relative min-h-screen flex items-center justify-center">
            <section className="flex flex-col lg:flex-row items-center justify-center p-8 z-10 w-full max-w-7xl">
                <div className="flex-1 flex justify-center mb-8 lg:mb-0 lg:pr-8">
                    <div className="relative w-[350px] h-[350px] lg:w-[500px] lg:h-[500px]">
                        {base64Image && (
                            <Image
                                src={base64Image}
                                alt={`${product.name}`}
                                fill
                                style={{objectFit: 'contain'}}
                                quality={100}
                                className="rounded-lg shadow-lg"
                            />
                        )}
                    </div>
                </div>

                <div className="flex-1 p-8 text-center lg:text-left">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                    <p className="text-lg text-gray-700 mb-6">{product.description}</p>
                    <div className="flex flex-col lg:flex-row items-center justify-between mt-4">
                        <div className={`flex space-x-2`}>
                            <button
                                className="bg-white text-black border border-black hover:text-white py-4 px-4 rounded-lg mb-4 lg:mb-0 hover:bg-red-600 transition duration-300 flex items-center justify-center text-center"
                                onClick={handleCart}
                            >
                                <FaShoppingCart className=""/>
                            </button>
                            <button
                                className="bg-red-500 text-white py-2 px-6 rounded-lg mb-4 lg:mb-0 hover:bg-red-600 transition duration-300"
                                onClick={handleOrder}
                            >
                                Acheter maintenant
                            </button>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">{product.price}€</span>
                    </div>
                </div>

                {message && (
                    <div
                        className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg text-white transition-opacity duration-300 ease-in-out ${
                            isSuccess ? 'bg-green-500' : 'bg-red-500'
                        } ${message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    >
                        {message}
                    </div>
                )}
            </section>
        </main>
    );
}
