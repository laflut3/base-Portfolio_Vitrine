
export interface ProductDetail {
    description: string | undefined;
    image: Buffer;
    name: string;
    price: number;
    _id: string;
    createdAt: Date;
}

export interface ProductData {
    name: string;
    price: number;
    description?: string;
}

export interface ProductPageProps {
    params: {
        id: string;
    };
}