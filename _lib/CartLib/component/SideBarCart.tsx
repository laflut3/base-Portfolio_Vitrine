"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import logo_sidebar from '@public/images/logo/fleo-web-reversed.png';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import {CartItem, SidebarProps} from "../type/CartType";
import Article from "./CartArticle";
import {
    clearCartItems,
    decrementCartItemQuantity,
    fetchCartItems,
    incrementCartItemQuantity,
    removeCartItem
} from "../service/cart";
import {createOrder} from "@lib/OrderLib/service/orders";

const SideBarCart: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const getCartItems = async () => {
            if (!session?.user) {
                console.error('User not authenticated');
                return;
            }

            try {
                const items = await fetchCartItems(session.user.id); // Utilise la fonction du service
                setCartItems(items);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        getCartItems();
    }, [session]);

    useEffect(() => {
        const totalPrice = cartItems.reduce((acc, item) => {
            const itemPrice = Number(item.product.price);
            const itemQuantity = Number(item.quantity);
            return acc + (isNaN(itemPrice) || isNaN(itemQuantity) ? 0 : itemPrice * itemQuantity);
        }, 0);
        setTotal(totalPrice);
    }, [cartItems]);

    const handleDecrement = async (id: string) => {
        const item = cartItems.find((cartItem) => cartItem._id === id);
        if (!item) return;

        const newQuantity = item.quantity - 1;

        if (newQuantity <= 0) {
            await handleRemove(id); // Gère la suppression si la quantité devient 0
            return;
        }

        const productId = item.product?._id || item.product?.productId;
        if (!productId) {
            console.error('Product ID is undefined:', item.product);
            return;
        }

        try {
            await decrementCartItemQuantity(productId, session?.user?.id as string, newQuantity); // Appel de la fonction service

            const updatedItems = cartItems.map((cartItem) =>
                cartItem._id === id ? { ...cartItem, quantity: newQuantity } : cartItem
            );
            setCartItems(updatedItems); // Met à jour l'état des items du panier
        } catch (error) {
            console.error('Error decrementing item quantity:', error);
        }
    };

    const handleIncrement = async (id: string) => {
        const item = cartItems.find((cartItem) => cartItem._id === id);
        if (!item) return;

        const newQuantity = item.quantity + 1;
        const productId = item.product?._id || item.product?.productId;

        if (!productId) {
            console.error('Product ID is undefined:', item.product);
            return;
        }

        try {
            await incrementCartItemQuantity(productId, session?.user?.id as string, newQuantity);
            const updatedItems = cartItems.map((cartItem) =>
                cartItem._id === id ? { ...cartItem, quantity: newQuantity } : cartItem
            );
            setCartItems(updatedItems);
        } catch (error) {
            console.error('Error incrementing item quantity:', error);
        }
    };

    const handleRemove = async (id: string): Promise<void> => {
        const item = cartItems.find((cartItem) => cartItem._id === id);

        if (!item || !item.product || !item.product._id) {
            console.error('Item, product, or product._id is undefined');
            return;
        }

        try {
            // Ensure product._id and session.user.id are passed correctly
            await removeCartItem(item.product._id, session?.user?.id as string);
            const updatedItems = cartItems.filter((cartItem) => cartItem._id !== id);
            setCartItems(updatedItems);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };


    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        const orderItems = cartItems.map(item => ({
            productId: item.product._id || item.product.productId,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
        }));

        try {
            const result = await createOrder({
                items: orderItems,
                amount: total,
                userId: session?.user?.id as string,
            });

            await clearCartItems(cartItems, session?.user?.id as string);
            setCartItems([]);

            router.push(`/paiement?orderId=${result.orderId}`);
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <div
            className={`absolute top-0 right-0 min-h-screen h-full w-96 bg-white shadow-xl transform transition-transform ease-in-out duration-300 z-50 ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{maxHeight: '100vh'}} // Ensure it never grows beyond viewport height
        >
            {/* Header Section */}
            <div className="flex items-center justify-between p-4 border-b bg-tertiary">
                <h2 className="text-2xl font-bold text-text-primary">Mon Panier</h2>
                <button
                    className="text-4xl font-bold text-text-secondary hover:text-text-quinary transition-colors"
                    onClick={() => onClose()}
                >
                    &times;
                </button>
            </div>

            {/* Cart Items Section */}
            <div className="p-4 overflow-y-auto" style={{maxHeight: '60vh'}}>
                {cartItems.length > 0 ? (
                    <ul className="space-y-4">
                        {cartItems.map((item, index) => (
                            <Article
                                key={index}
                                item={item}
                                onDecrement={handleDecrement}
                                onIncrement={handleIncrement}
                                onRemove={handleRemove}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-text-secondary">Votre panier est vide.</div>
                )}
            </div>

            {/* Total Section */}
            <div className="absolute bottom-0 w-full bg-gray-50 p-4 border-t">
                <div className="flex items-center justify-between mb-4">
                    <Image src={logo_sidebar} alt="logo" width={50} height={50}/>
                    <div>
                        <span className="text-sm text-text-secondary">Total</span>
                        <p className="text-xl font-semibold text-text-primary">€ {total.toFixed(2)}</p>
                    </div>
                </div>
                <button
                    className="text-black bg-red-600 font-semibold w-full py-3 rounded-lg hover:bg-bg-tertiary transition-colors"
                    onClick={handleCheckout}
                >
                    Passer la commande
                </button>
            </div>
        </div>
    );
};

export default SideBarCart;
