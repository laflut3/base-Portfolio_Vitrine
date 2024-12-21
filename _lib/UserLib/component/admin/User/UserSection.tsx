"use client";

import React, {useEffect, useState} from "react";
import axios from "axios";
import {FaEdit, FaTrash, FaArrowLeft, FaUserCircle} from "react-icons/fa";
import Link from "next/link";
import {useSession} from "next-auth/react";
import RedirectionArrow from "@lib/UserLib/component/admin/RedirectionArrow";

interface User {
    _id: string;
    nom: string;
    prenom: string;
    username: string;
    email: string;
    isAdmin: boolean;
    dateOfBirth: string;
    isVerified: boolean;
    createdAt: string;
    cart?: string;
}

const UserSection: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({});
    const {data: session} = useSession();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("/api/user");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleEditClick = (user: User, event: React.MouseEvent) => {
        event.preventDefault();
        const detailElement = document.getElementById(`detail-${user._id}`) as HTMLDetailsElement;

        if (!detailElement.open) {
            detailElement.open = true;
        }

        setEditingUser(user._id);
        setFormData(user);
    };

    const handleDeleteClick = async (userId: string) => {
        try {
            const response = await axios.delete(`/api/user`, {data: {userId}});
            if (response.status === 200) {
                setUsers(users.filter(user => user._id !== userId));
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSaveClick = async (userId: string) => {
        try {
            const response = await axios.put(`/api/user`, {userId, updateData: formData});
            if (response.status === 200) {
                setUsers(users.map(user => (user._id === userId ? {...user, ...formData} : user)));
                setEditingUser(null);
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <section className="min-h-screen flex flex-col justify-center items-center w-1/2 space-y-10">
            <RedirectionArrow/>
            <div className="text-black w-full bg-white rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4 bg-[#3577B4] p-4">
                    AUTHENTIFICATION ET AUTHORISATION
                </h2>
                <div className="flex space-y-4 flex-col sm:flex-row mb-4 justify-between">
                    <ul className="list-disc ml-6 space-y-2 p-4 sm:p-8">
                        <li>Vous avez {users.filter(user => user.isVerified).length} utilisateurs vérifiés</li>
                        <li>Vous avez {users.filter(user => !user.isVerified).length} utilisateurs non vérifiés</li>
                    </ul>
                    <div className={`flex justify-center text-center `}>
                        <FaUserCircle className={`w-1/4 h-1/4 sm:w-52 sm:h-52 sm:mr-10`}/>
                    </div>
                </div>
                <div className="space-y-4 p-4">
                    {users.map((user) => (
                        <details key={user._id} id={`detail-${user._id}`}
                                 className="p-4 bg-gray-500 bg-opacity-20 text-black rounded-lg shadow">
                            <summary
                                className="cursor-pointer text-lg font-semibold flex justify-between items-center">
                            <span>
                                {user.prenom} {user.nom} - {user.username}
                            </span>
                                <div className="flex space-x-2">
                                    <FaEdit
                                        className="hover:text-blue-400 cursor-pointer"
                                        onClick={(event) => handleEditClick(user, event)}
                                    />
                                    {session?.user?.id !== user._id && (
                                        <FaTrash
                                            className="hover:text-red-400 cursor-pointer"
                                            onClick={() => handleDeleteClick(user._id)}
                                        />
                                    )}
                                </div>
                            </summary>
                            <div className="mt-2 space-y-2">
                                <p className="flex items-center"><strong>Nom:</strong> <span
                                    className="mx-2">{editingUser === user._id ? (
                                    <input
                                        type="text"
                                        name="nom"
                                        value={formData.nom || ""}
                                        onChange={handleInputChange}
                                        className="mt-1 p-1 border-b-2 border-gray-600"
                                    />
                                ) : user.nom}</span></p>
                                <p className="flex items-center"><strong>Prénom:</strong> <span
                                    className="mx-2">{editingUser === user._id ? (
                                    <input
                                        type="text"
                                        name="prenom"
                                        value={formData.prenom || ""}
                                        onChange={handleInputChange}
                                        className="mt-1 p-1 border-b-2 border-gray-600"
                                    />
                                ) : user.prenom}</span></p>
                                {/* eslint-disable-next-line react/no-unescaped-entities */}
                                <p className="flex items-center"><strong>Nom d'utilisateur:</strong> <span
                                    className="mx-2">{editingUser === user._id ? (
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username || ""}
                                        onChange={handleInputChange}
                                        className="mt-1 p-1 border-b-2 border-gray-600"
                                    />
                                ) : user.username}</span></p>
                                <p className="flex items-center"><strong>Email:</strong> <span
                                    className="mx-2">{editingUser === user._id ? (
                                    <input
                                        type="text"
                                        name="email"
                                        value={formData.email || ""}
                                        onChange={handleInputChange}
                                        className="mt-1 p-1 border-b-2 border-gray-600"
                                    />
                                ) : user.email}</span></p>
                                <p className="flex items-center"><strong>Admin:</strong> <span
                                    className="mx-2">{editingUser === user._id ? (
                                    <input
                                        type="checkbox"
                                        name="isAdmin"
                                        checked={formData.isAdmin || false}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            isAdmin: e.target.checked,
                                        })}
                                        className="mt-1 p-1 border-b-2 border-gray-600"
                                    />
                                ) : user.isAdmin ? "Oui" : "Non"}</span></p>
                                <p className="flex items-center"><strong>Date de naissance:</strong> <span
                                    className="mx-2">{editingUser === user._id ? (
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth || ""}
                                        onChange={handleInputChange}
                                        className="mt-1 p-1 border-b-2 border-gray-600"
                                    />
                                ) : new Date(user.dateOfBirth).toLocaleDateString()}</span></p>
                                <p className="flex items-center"><strong>Date de création:</strong> <span
                                    className="mx-2">{new Date(user.createdAt).toLocaleDateString()}</span></p>
                                {user.cart && <p className="flex items-center"><strong>Panier ID:</strong> <span
                                    className="mx-2">{user.cart}</span></p>}

                                {editingUser === user._id && (
                                    <div className="mt-2 flex justify-end space-x-2">
                                        <button
                                            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
                                            onClick={() => handleSaveClick(user._id)}
                                        >
                                            Enregistrer
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600"
                                            onClick={() => setEditingUser(null)}
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                )}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UserSection;
