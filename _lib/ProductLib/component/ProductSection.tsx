"use client";

import React, {useState, useEffect} from "react";
import Image from "next/image";
import {ProductDetail} from "@lib/ProductLib/type/Product";
import Carousel from "@/components/utils/décors/Carroussel";
import {bouncy} from 'ldrs'
import {fetchProducts} from "@lib/ProductLib/service/produit";

const ProductCard = ({product}: { product: ProductDetail }) => {
    const base64Image = product.image
        ? `data:image/png;base64,${Buffer.from(product.image).toString('base64')}`
        : '';

    return (
        <div className="flex flex-col items-center justify-center w-1/2 p-2">
            <div className="relative w-full h-0 pb-[100%] bg-tertiary border-2 rounded-lg overflow-hidden">
                <Image
                    src={base64Image}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                />
                <a
                    href={`/products/${product._id}`}
                    className="bg-secondary text-white py-2 px-4 rounded-lg absolute bottom-2 right-2 text-xs md:text-sm lg:text-base"
                >
                    En savoir plus
                </a>
            </div>
            <p className="text-primary text-left mt-4 text-sm md:text-lg lg:text-xl font-bimbo text-stroke-black-2">
                {product.name}
            </p>
        </div>
    );
};

const SecondSection = () => {
    bouncy.register();

    const [products, setProducts] = useState<ProductDetail[]>([

    ]);

    useEffect(() => {
        const fetchProd = async () => {
            try {
                const data = await fetchProducts(); // Utilisation correcte de la fonction
                setProducts(data); // Assigne la réponse à l'état 'products'
            } catch (error) {
                console.error("Erreur lors de la récupération des produits:", error);
            }
        };

        fetchProd();
    }, []);

    return (
        <section
            className="relative min-h-screen flex flex-col items-center justify-center z-20 pt-20 md:pt-24"
            id="products"
        >
            <h2 className="flex text-center items-center justify-center text-stroke-black text-4xl">
                Nos Produits
            </h2>
            <h3 className="flex text-stroke-black text-xl font-lazy-dog text-center items-center justify-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            </h3>
            {products.length > 0 ? (
                <Carousel
                    items={products.map((product, index) => (
                        <ProductCard key={product._id || index} product={product}/>
                    ))}
                />
            ) : (
                <div className="mt-20">
                    <l-bouncy
                        size="45"
                        speed="1.75"
                        color="black"
                    ></l-bouncy>
                </div>
            )}
        </section>
    );
};

export default SecondSection;
