import { useEffect, useState } from "react";
import { Address } from "@/types/user.types";
import axios from "axios";

export const useAddress = (userId: string) => {
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchDefaultAddress = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/addresses?userId=${userId}`
        );
        setAddresses(response.data || []);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchDefaultAddress();
  }, [userId]);

  return {
    addresses,
  };
};
