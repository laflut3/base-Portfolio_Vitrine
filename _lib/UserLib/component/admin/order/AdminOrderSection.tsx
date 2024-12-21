"use client";

import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaCartPlus, FaTrashAlt, FaTruck } from "react-icons/fa";
import RedirectionArrow from "@lib/UserLib/component/admin/RedirectionArrow";
import {deleteOrder, getOrders, markOrderAsShipped} from "@lib/OrderLib/service/orders";
import {OrderDetails} from "@lib/OrderLib/type/OrderType";

const AdminOrderSection = () => {
    const [orders, setOrders] = useState<OrderDetails[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                setOrders(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des commandes:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleDeleteOrder = async (orderId: string) => {
        try {
            await deleteOrder(orderId);
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
        } catch (error) {
            console.error('Erreur lors de la suppression de la commande:', error);
        }
    };

    const handleMarkAsShipped = async (orderId: string) => {
        try {
            const updatedOrder = await markOrderAsShipped(orderId);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === updatedOrder._id ? updatedOrder : order
                )
            );
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la commande:', error);
        }
    };

    const renderOrdersByStatus = (status: OrderDetails["status"], title: string) => {
        const filteredOrders = orders.filter((order) => order.status === status);

        if (filteredOrders.length === 0) return null;

        return (
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-black mb-4">{title}</h3>
                <ul className="space-y-4">
                    {filteredOrders.map((order) => (
                        <li key={order._id} className="border-b p-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">Order ID: {order._id}</p>
                                <p>Amount: €{order.amount.toFixed(2)}</p>
                                <p>Status: {order.status}</p>
                                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex space-x-4">
                                {order.status === "pending" && (
                                    <button
                                        onClick={() => handleDeleteOrder(order._id)}
                                        className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                    >
                                        <FaTrashAlt className="mr-2" />
                                        Delete
                                    </button>
                                )}
                                {order.status === "paid" && (
                                    <button
                                        onClick={() => handleMarkAsShipped(order._id)}
                                        className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                                    >
                                        <FaTruck className="mr-2" />
                                        Mark as Shipped
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <section className="flex flex-col justify-center items-center min-h-screen p-8 w-1/2 my-20 space-y-10">
            <RedirectionArrow/>
            <div className="text-black w-full bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 bg-[#3577B4] p-4">
                    COMMANDES
                </h2>
                <div
                    className="flex space-y-4 p-8 flex-col sm:flex-row mb-4 sm:justify-between justify-center text-center">
                    <p>liste des commande</p>
                    <div className={`flex justify-center items-center text-center`}>
                        <FaCartPlus className={`w-1/2 h-auto sm:w-52 sm:h-52 `}/>
                    </div>
                </div>
                <div className="p-8">
                    {orders.length === 0 ? (
                        <div className="flex justify-center items-center text-center">
                            <p>Aucune commande pour le moment ...</p>
                        </div>
                    ) : (
                        <>
                            {renderOrdersByStatus("paid", "Paid Orders")}
                            {renderOrdersByStatus("shipped", "Shipped Orders")}
                            {renderOrdersByStatus("pending", "Pending Orders")}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AdminOrderSection;
