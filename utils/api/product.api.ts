import axios from "axios";
import { Product } from "@/types/product.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export const fetchProduct = async (id: string): Promise<Product | null> => {
  try {
    const res = await axios.get(`${BASE_URL}/products/${id}`);
    return res.data[0] || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};
