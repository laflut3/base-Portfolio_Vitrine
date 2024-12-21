'use client';

import React from 'react';

interface CookiePopupProps {
    isOpen: boolean;
    onClose: (consentGiven: boolean) => void;
}

const CookiePopup: React.FC<CookiePopupProps> = ({ isOpen, onClose }) => {
    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity ${
                isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        >
            <div className="bg-tertiary bg-white text-secondary shadow-xl w-full max-w-md mx-4 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-text-primary">Cookies</h2>
                    <button
                        className="text-2xl font-bold text-text-secondary hover:text-text-quinary transition-colors"
                        onClick={() => onClose(false)}
                    >
                        &times;
                    </button>
                </div>
                <p className="mt-2 mb-4 text-sm font-canva-sans text-secondary">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <div className="flex gap-4 justify-end">
                    <button
                        className="bg-bg-secondary bg-blue-400 text-primary font-lazy-dog py-2 px-4 rounded-lg hover:bg-bg-tertiary transition-colors"
                        onClick={() => onClose(true)}
                    >
                        Accepter
                    </button>
                    <button
                        className="bg-red-500 text-white font-lazy-dog py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                        onClick={() => onClose(false)}
                    >
                        Refuser
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookiePopup;
