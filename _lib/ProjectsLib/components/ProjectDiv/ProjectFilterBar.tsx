"use client";

import React from 'react';

interface CatalogueFilterBarProps {
    onFilterChange: (type: string) => void;
}

const CatalogueFilterBar: React.FC<CatalogueFilterBarProps> = ({ onFilterChange }) => {

    const handleEcommerce = () => {
        onFilterChange("E-commerce");
    };

    const handleVitrine = () => {
        onFilterChange("Vitrine");
    };

    const handlePortefolio = () => {
        onFilterChange("Portfolio");
    };

    const handleAppJava = () => {
        onFilterChange("Application Java");
    };

    return (
        <div className="w-full flex flex-wrap justify-center items-center gap-4 font-merriweather text-white">
            <button className="px-4 sm:px-8 py-2 bg-secondary rounded-xl w-full sm:w-auto text-center" onClick={handleEcommerce}>
                Site E-commerce
            </button>
            <button className="px-6 sm:px-14 py-2 bg-secondary rounded-xl w-full sm:w-auto text-center" onClick={handleVitrine}>
                Site Vitrine
            </button>
            <button className="px-4 sm:px-12 py-2 bg-secondary rounded-xl w-full sm:w-auto text-center" onClick={handlePortefolio}>
                Site Portfolio
            </button>
            <button className="px-4 sm:px-12 py-2 bg-secondary rounded-xl w-full sm:w-auto text-center" onClick={handleAppJava}>
                Application Java
            </button>
        </div>
    );
};

export default CatalogueFilterBar;

