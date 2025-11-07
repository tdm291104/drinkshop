import { Product } from "@/types/product.types";
export interface CartItem {
  productId: string;
  product: Product | null;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export type CartCreate = Omit<Cart, "id">;
