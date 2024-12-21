export interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface CartItem {
    product: {
        _id: string | undefined;
        productId: string;
        name: string;
        price: number;
        image?: string;
    };
    quantity: number;
    _id: string;
}

/** cart interface */
export interface AddToCartParams {
    userId: string;
    productId: string;
    quantity: number;
}