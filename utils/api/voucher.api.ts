import axios from "axios";
import { Voucher } from "@/types/voucher.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export const fetchVoucher = async (code: string): Promise<Voucher | null> => {
  try {
    const res = await axios.get(`${BASE_URL}/vouchers?code=${code}`);
    return res.data[0] || null;
  } catch (error) {
    console.error("Error fetching voucher:", error);
    return null;
  }
};
