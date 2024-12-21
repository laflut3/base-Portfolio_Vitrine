"use client";
import React, { useState } from 'react';
import { Draw } from '../type/IDraw';
import Image from 'next/image';

export default function PictureGeneratorSection({ illustrations }: { illustrations: Draw[] }) {
    const [selectedImage, setSelectedImage] = useState<Draw | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handleImageClick = (illustration: Draw) => {
        setSelectedImage(illustration);
    };
 
    const handleClosePopup = () => {
        setSelectedImage(null);
    };

    return (
        <section className="my-[20%] md:my-[10%] min-h-screen w-full h-auto relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 w-full h-full">
                {illustrations.map((illustration: Draw, index: number) => {
                    const isHovered = hoveredIndex === index;

                    return (
                        <div
                            key={index}
                            className="relative w-full min-h-[300px] overflow-hidden cursor-pointer lg:min-h-[300px] xl:min-h-[350px] 2xl:min-h-[350px]"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => handleImageClick(illustration)}
                            style={{
                                background: `url(${illustration.image}) no-repeat center center`,
                                backgroundSize: 'cover',
                            }}
                        >
                            {isHovered && (
                                <p className="absolute inset-0 flex items-center justify-center text-xl font-helvetica-now-text text-primary-color text-center" style={{ WebkitTextStroke: '.5px black' }}>
                                    {illustration.title}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={handleClosePopup}
                >
                    <button
                        onClick={handleClosePopup}
                        className="absolute font-helvetica-now-text-bold top-0 right-5 text-white text-5xl p-2 rounded-full"
                    >
                        &times;
                    </button>
                    <div
                        className="relative w-full max-w-xl h-1/2 max-h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={selectedImage.image}
                            alt={`${selectedImage.title} full size`}
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
