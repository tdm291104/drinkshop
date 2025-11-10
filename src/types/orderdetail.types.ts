export interface OrderDetail {
    id: string;
    orderId: string;
    productId: string;
    product: {
        id: string;
        name: string;
        image: string;
        price: number;
    };
    quantity: number;
    price: number;
    totalPrice: number;
}
