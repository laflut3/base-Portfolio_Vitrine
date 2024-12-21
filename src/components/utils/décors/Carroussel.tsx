import { useState } from 'react';
import Image from "next/image";

import left from "@/../public/images/Utils/left-icon.svg";
import right from "@/../public/images/Utils/right-icon.svg";

interface CarouselProps {
    items: React.ReactNode[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? items.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === items.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto p-8">
            <div className="overflow-hidden rounded-lg">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="min-w-full flex-shrink-0 flex items-center justify-center text-center"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Flèche gauche */}
            <button
                onClick={handlePrev}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 p-3 bg-gray-700 bg-opacity-50 hover:bg-opacity-100 transition duration-300 text-white rounded-full shadow-md focus:outline-none"
            >
                <Image src={left} alt="Précédent" width={24} height={24} />
            </button>

            {/* Flèche droite */}
            <button
                onClick={handleNext}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 bg-gray-700 bg-opacity-50 hover:bg-opacity-100 transition duration-300 text-white rounded-full shadow-md focus:outline-none"
            >
                <Image src={right} alt="Suivant" width={24} height={24} />
            </button>

            {/* Pagination des points */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-4 h-4 rounded-full transition duration-300 ${
                            index === currentIndex ? 'bg-gray-800' : 'bg-gray-400'
                        } hover:bg-gray-600`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
