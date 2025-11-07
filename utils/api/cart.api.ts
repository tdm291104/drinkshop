import axios from "axios";
import { Cart, CartCreate } from "@/types/cart.type";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export const clearCart = async (cart: Cart) => {
  return axios.put(`${BASE_URL}/carts/${cart.id}`, {
    ...cart,
    items: [],
    totalPrice: 0,
  });
};

export const addCart = async (userId: string) => {
  const cart: CartCreate = {
    userId: userId,
    items: [],
    totalPrice: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return axios.post(`${BASE_URL}/carts`, cart);
};
