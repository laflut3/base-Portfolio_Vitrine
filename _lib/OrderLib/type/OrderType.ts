interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface CreateOrderParams {
    userId: string;
    items: OrderItem[];
    amount: number;
}

export interface OrderDetails {
    _id: string;
    amount: number;
    status: "pending" | "paid" | "shipped" | "completed";
    items: OrderItem[];
    createdAt: string;
}