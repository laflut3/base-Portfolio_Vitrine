// components/ValidationPopup.tsx

import React from 'react';

interface ValidationPopupProps {
    title: string;
    text: string;
    onClose: () => void;
}

const ValidationPopUp: React.FC<ValidationPopupProps> = ({ title, text, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center text-black bg-black backdrop-blur bg-opacity-50 font-light">
            <div className="bg-white rounded-lg border-4 border-red-500 p-8 max-w-md text-center shadow-lg">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="mb-8">{text}</p>
                <button
                    onClick={onClose}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                >
                    FERMER LA POPUP
                </button>
            </div>
        </div>
    );
};

export default ValidationPopUp;
