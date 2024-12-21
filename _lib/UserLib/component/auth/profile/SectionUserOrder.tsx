"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiTrash2, FiEdit2, FiCheck } from "react-icons/fi";

interface OrderDetails {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: {
        line1: string;
        city: string;
        postalCode: string;
        country: string;
    };
    items: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
    }>;
    amount: number;
    status: "pending" | "paid" | "shipped" | "completed";
    createdAt: string;
}

const SectionUserOrder = () => {
    const [orders, setOrders] = useState<OrderDetails[]>([]);
    const [editMode, setEditMode] = useState<{ [orderId: string]: boolean }>({});
    const [editedInfo, setEditedInfo] = useState<{ [orderId: string]: Partial<OrderDetails> }>({});
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!session?.user) {
                console.error("User not authenticated");
                return;
            }

            try {
                const res = await fetch(`/api/orders/user/${session.user.id}`);
                if (res.ok) {
                    const fetchedOrders = await res.json();
                    setOrders(fetchedOrders);
                } else {
                    console.error("Failed to fetch orders:", res.statusText);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [session]);

    const handleDeleteOrder = async (orderId: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
            } else {
                console.error("Failed to delete order:", res.statusText);
            }
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    const handleEditToggle = (orderId: string) => {
        setEditMode((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
        if (!editMode[orderId]) {
            const order = orders.find((order) => order._id === orderId);
            if (order) {
                setEditedInfo((prev) => ({
                    ...prev,
                    [orderId]: { ...order },
                }));
            }
        }
    };

    const handleInputChange = (orderId: string, field: keyof OrderDetails, value: string) => {
        setEditedInfo((prev) => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                [field]: value,
            },
        }));
    };

    const handleSave = async (orderId: string) => {
        const updatedInfo = editedInfo[orderId];
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedInfo),
            });

            if (res.ok) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId
                            ? { ...order, ...updatedInfo }
                            : order
                    )
                );
                setEditMode((prev) => ({ ...prev, [orderId]: false }));
            } else {
                console.error("Failed to update order:", res.statusText);
            }
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    const handlePaymentRedirect = (orderId: string) => {
        router.push(`/paiement?orderId=${orderId}`);
    };

    const handleMarkAsCompleted = async (orderId: string) => {
        const confirmation = confirm("Are you sure you have received this order?");
        if (confirmation) {
            try {
                const res = await fetch(`/api/orders/${orderId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (res.ok) {
                    setOrders((prevOrders) =>
                        prevOrders.map((order) =>
                            order._id === orderId
                                ? { ...order, status: "completed" }
                                : order
                        )
                    );
                } else {
                    console.error("Failed to mark order as completed:", res.statusText);
                }
            } catch (error) {
                console.error("Error marking order as completed:", error);
            }
        }
    };

    const renderOrdersByStatus = (status: OrderDetails["status"], title: string) => {
        const filteredOrders = orders.filter((order) => order.status === status);
        if (filteredOrders.length === 0) return null;

        return (
            <section className="text-black mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
                <ul className="space-y-6">
                    {filteredOrders.map((order) => (
                        <li
                            key={order._id}
                            className="border border-gray-200 p-6 rounded-lg bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl"
                        >
                            <details>
                                <summary className="cursor-pointer text-lg font-semibold">
                                    Order ID: {order._id} - Total Amount: € {order.amount.toFixed(2)}
                                </summary>
                                <div className="mt-4">
                                    <p className="text-md mb-2">
                                        <span className="font-semibold">Date: </span>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-md mb-2">
                                        <span className="font-semibold">Status: </span>{order.status}
                                    </p>
                                    <div className="mb-4">
                                        <p className="font-semibold mb-2">Items:</p>
                                        <ul className="list-disc list-inside ml-4">
                                            {order.items.map((item, idx) => (
                                                <li key={idx} className="text-sm">
                                                    {item.name} (x{item.quantity}) - € {item.price.toFixed(2)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Afficher les informations du client seulement si la commande est paid, shipped ou completed */}
                                    {(order.status === "paid" || order.status === "shipped" || order.status === "completed") && (
                                        <details className="mt-4">
                                            <summary className="cursor-pointer font-semibold">Customer Information</summary>
                                            <div className="mt-2">
                                                <p className="text-md mb-2">
                                                    <span className="font-semibold">Name: </span>{order.name}
                                                </p>
                                                <p className="text-md mb-2">
                                                    <span className="font-semibold">Email: </span>{order.email}
                                                </p>
                                                <p className="text-md mb-2">
                                                    <span className="font-semibold">Phone: </span>{order.phone}
                                                </p>
                                                <p className="text-md mb-2">
                                                    <span className="font-semibold">Address: </span>
                                                    {order.address?.line1 ? (
                                                        <>
                                                            {order.address.line1}, {order.address.city}, {order.address.postalCode}, {order.address.country}
                                                        </>
                                                    ) : (
                                                        <span>Address not provided</span>
                                                    )}
                                                </p>
                                            </div>
                                        </details>
                                    )}

                                    {editMode[order._id] && order.status === "paid" && (
                                        <div className="mt-4">
                                            <input
                                                type="text"
                                                value={editedInfo[order._id]?.name || order.name}
                                                onChange={(e) => handleInputChange(order._id, 'name', e.target.value)}
                                                className="border border-gray-300 p-2 rounded mb-2 w-full"
                                                placeholder="Name"
                                            />
                                            <input
                                                type="text"
                                                value={editedInfo[order._id]?.email || order.email}
                                                onChange={(e) => handleInputChange(order._id, 'email', e.target.value)}
                                                className="border border-gray-300 p-2 rounded mb-2 w-full"
                                                placeholder="Email"
                                            />
                                            <input
                                                type="text"
                                                value={editedInfo[order._id]?.phone || order.phone}
                                                onChange={(e) => handleInputChange(order._id, 'phone', e.target.value)}
                                                className="border border-gray-300 p-2 rounded mb-2 w-full"
                                                placeholder="Phone"
                                            />
                                            <input
                                                type="text"
                                                value={editedInfo[order._id]?.address?.line1 || order.address.line1}
                                                onChange={(e) => handleInputChange(order._id, 'address', e.target.value)}
                                                className="border border-gray-300 p-2 rounded mb-2 w-full"
                                                placeholder="Address Line 1"
                                            />
                                            <button
                                                onClick={() => handleSave(order._id)}
                                                className="flex items-center justify-center px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                                            >
                                                <FiCheck className="mr-2" />
                                                Save
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </details>
                            <div className="flex flex-col items-end space-y-3 mt-4">
                                {order.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() => handleDeleteOrder(order._id)}
                                            className="flex items-center justify-center px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                        >
                                            <FiTrash2 className="mr-2" />
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handlePaymentRedirect(order._id)}
                                            className="flex items-center justify-center px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                                        >
                                            Payer
                                        </button>
                                    </>
                                )}
                                {order.status === "paid" && (
                                    <button
                                        onClick={() => handleEditToggle(order._id)}
                                        className="flex items-center justify-center px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                                    >
                                        <FiEdit2 className="mr-2" />
                                        Edit Info
                                    </button>
                                )}
                                {order.status === "shipped" && (
                                    <button
                                        onClick={() => handleMarkAsCompleted(order._id)}
                                        className="flex items-center justify-center px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
                                    >
                                        Mark as Completed
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        );
    };

    return (
        <section className="container mx-auto px-6 py-10 z-10 relative mb-20">
            {renderOrdersByStatus("pending", "Pending Orders")}
            {renderOrdersByStatus("paid", "Paid Orders")}
            {renderOrdersByStatus("shipped", "Shipped Orders")}
            {renderOrdersByStatus("completed", "Completed Orders")}
        </section>
    );
};

export default SectionUserOrder;
