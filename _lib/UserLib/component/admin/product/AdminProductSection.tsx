"use client";

import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import Image from 'next/image';
import {FaEdit, FaTrash} from "react-icons/fa";
import {leapfrog} from 'ldrs';
import product from "../../../../../public/images/Utils/product.png";
import RedirectionArrow from "@lib/UserLib/component/admin/RedirectionArrow";
import {addProduct, deleteProduct, fetchProducts, updateProduct} from "@lib/ProductLib/service/produit";
import {ProductDetail} from "../../../../ProductLib/type/Product";

const ProductManagement: React.FC = () => {
    leapfrog.register();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [products, setProducts] = useState<ProductDetail[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des produits:", error);
            }
        };

        loadProducts();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsSuccess(false);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        if (image) {
            formData.append("image", image);
        }

        try {
            await addProduct(formData);
            setIsSuccess(true);
            setName("");
            setDescription("");
            setPrice("");
            setImage(null);
            window.location.reload(); // Refresh to show the new product
        } catch (error: any) {
            console.error("Erreur lors de l'ajout du produit", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteProduct(id);
            setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression du produit:", error);
        }
    };

    const handleModify = (product: ProductDetail) => {
        setSelectedProduct(product);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedProduct(null);
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedProduct) return;

        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const updatedProduct: Partial<ProductDetail> = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            price: parseFloat(formData.get("price") as string),
        };

        const fileInput = formData.get("image") as File;
        if (fileInput && fileInput.size > 0) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                updatedProduct.image = Buffer.from(reader.result as ArrayBuffer);
                await handleUpdateProduct(updatedProduct);
            };
            reader.readAsArrayBuffer(fileInput);
        } else {
            await handleUpdateProduct(updatedProduct);
        }
    };

    const handleUpdateProduct = async (updatedProduct: Partial<ProductDetail>) => {
        if (!selectedProduct) return;

        setIsLoading(true);

        try {
            const updatedProductData = await updateProduct(selectedProduct._id, updatedProduct);

            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === selectedProduct._id ? updatedProductData : product
                )
            );

            setShowPopup(false);
            setSelectedProduct(null);
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour du produit:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex flex-col justify-center items-center min-h-screen p-8 w-1/2 my-20 space-y-10">
            <RedirectionArrow/>
            <div className="text-black w-full bg-white rounded-lg shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-center bg-[#3577B4] p-6 md:p-8 rounded-t-lg">
                    <h2 className="text-xl md:text-2xl font-bold text-white">GESTION DES PRODUITS</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 text-black p-6 md:p-8 rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Ajouter un nouveau produit</h2>
                        <Image src={product} alt="Produit" className="w-1/2 h-1/2 sm:w-40 sm:h-40" />
                    </div>
                    <div>
                        <label className="block text-base md:text-lg font-medium mb-2">Nom du produit</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 md:px-4 md:py-2 bg-gray-700 text-white bg-opacity-30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="Entrez le nom du produit"
                        />
                    </div>
                    <div>
                        <label className="block text-base md:text-lg font-medium mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 md:px-4 md:py-2 bg-gray-700 text-white bg-opacity-30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="Décrivez le produit"
                            rows={4}
                        />
                    </div>
                    <div>
                        <label className="block text-base md:text-lg font-medium mb-2">Prix (€)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full px-3 py-2 md:px-4 md:py-2 bg-gray-700 text-white bg-opacity-30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="Entrez le prix du produit"
                        />
                    </div>
                    <div>
                        <label className="block text-base md:text-lg font-medium mb-2">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full file:bg-gray-600 file:bg-opacity-30 file:py-2 file:px-4 file:rounded-md file:border-0 hover:file:bg-gray-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition-colors duration-200 flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <l-leapfrog
                                size="40"
                                speed="2.5"
                                color="white"
                            ></l-leapfrog>
                        ) : (
                            "Ajouter le produit"
                        )}
                    </button>

                    {isSuccess && (
                        <p className="text-green-500 mt-4">
                            Produit ajouté avec succès !
                        </p>
                    )}
                </form>

                {/* Product List */}
                <div className="space-y-4 p-6 md:p-8">
                    {products.map(product => (
                        <details key={product._id}
                                 className="p-4 bg-gray-500 bg-opacity-20 text-black rounded-lg shadow">
                            <summary className="cursor-pointer text-lg font-semibold flex justify-between items-center">
                                <span>
                                    {product.name} - {product.price.toFixed(2)}€
                                </span>
                                <div className="flex space-x-2">
                                    <FaEdit
                                        className="hover:text-blue-400 cursor-pointer"
                                        onClick={() => handleModify(product)}
                                    />
                                    <FaTrash
                                        className="hover:text-red-400 cursor-pointer"
                                        onClick={() => handleDelete(product._id)}
                                    />
                                </div>
                            </summary>
                            <div className="mt-2 space-y-2">
                                <p className="flex items-center"><strong>Description:</strong> <span
                                    className="mx-2">{product.description}</span></p>
                                <div className="flex justify-center mb-4">
                                    <Image
                                        src={`data:image/png;base64,${Buffer.from(product.image).toString('base64')}`}
                                        alt={product.name}
                                        width={200}
                                        height={200}
                                        className="rounded-md object-cover"
                                    />
                                </div>
                            </div>
                        </details>
                    ))}

                    {/* Modify Product MessageFlash */}
                    {showPopup && selectedProduct && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur z-50"
                            style={{margin: 0}}
                        >
                            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl m-8">
                                <h2 className="text-3xl font-bold mb-6">Modifier le produit</h2>
                                <form onSubmit={handleFormSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-lg font-medium mb-2">Nom:</label>
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={selectedProduct.name}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-lg font-medium mb-2">Description:</label>
                                        <input
                                            type="text"
                                            name="description"
                                            defaultValue={selectedProduct.description}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-lg font-medium mb-2">Prix:</label>
                                        <input
                                            type="number"
                                            name="price"
                                            defaultValue={selectedProduct.price}
                                            step="0.01"
                                            className="w-full p-2 border border-gray-300 rounded"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-lg font-medium mb-2">Image:</label>
                                        <input
                                            type="file"
                                            name="image"
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="submit"
                                            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
                                        >
                                            Enregistrer
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleClosePopup}
                                            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductManagement;
