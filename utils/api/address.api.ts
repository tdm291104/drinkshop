import axios from "axios";
import { Address } from "@/types/user.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export const fetchAddress = async (id: string): Promise<Address | null> => {
  try {
    const res = await axios.get(`${BASE_URL}/addresses/${id}`);
    return res.data || null;
  } catch (err) {
    console.error("Error fetching address", err);
    return null;
  }
};
