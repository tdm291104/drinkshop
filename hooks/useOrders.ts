import { useEffect, useState } from "react";
import axios from "axios";
import { Order } from "@/types/order.types";

export const useOrders = (userId: string) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/orders?userId=${userId}&_sort=-orderDate`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [userId]);

  return orders;
};
