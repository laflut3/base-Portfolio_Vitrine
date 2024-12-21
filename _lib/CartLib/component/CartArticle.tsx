// Article Component
import {CartItem} from "../type/CartType";
import React from "react";
import {FiTrash2} from "react-icons/fi";
import Image from 'next/image';

const Article: React.FC<{
    item: CartItem;
    onDecrement: (id: string) => void;
    onRemove: (id: string) => void;
    onIncrement: (id: string) => void
}> = ({ item, onDecrement, onRemove, onIncrement }) => {
    const { product, quantity } = item;
    const base64Image = product.image
        ? `data:image/png;base64,${Buffer.from(product.image).toString('base64')}`
        : '';

    return (
        <li className="flex items-center justify-between p-2 mb-4 bg-white rounded-lg shadow-sm z-100">
            <div className="flex items-center space-x-6">
                <button
                    onClick={() => onRemove(item._id)}
                    className="text-gray-600 hover:text-red-600 transition-colors flex items-center justify-center"
                >
                    <FiTrash2 size={18} />
                </button>

                <div className="flex items-center">
                    <button
                        onClick={() => onDecrement(item._id)}
                        className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-600 transition-colors shadow-md"
                    >
                        -
                    </button>
                    <div className="text-lg font-semibold text-gray-800 mx-2">
                        {quantity}
                    </div>
                    <button
                        onClick={() => onIncrement(item._id)}
                        className="bg-green-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-600 transition-colors shadow-md"
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="flex space-x-6 ml-4">
                {base64Image ? (
                    <div className="relative w-14 h-14 rounded-lg shadow-md overflow-hidden">
                        <Image
                            src={base64Image}
                            alt={`Image of ${product.name}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            quality={100}
                            className="rounded-lg"
                        />
                    </div>
                ) : (
                    <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                    </div>
                )}
                <div>
                    <p className="text-lg font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">€ {(product.price * quantity).toFixed(2)}</p>
                </div>
            </div>
        </li>
    );
};

export default Article;