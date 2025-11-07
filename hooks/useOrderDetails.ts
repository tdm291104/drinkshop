import { useEffect, useState } from "react";
import axios from "axios";
import { OrderDetail, Order } from "@/types/order.types";

export const useOrderDetails = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const openDetails = async (order: Order) => {
    try {
      setSelectedOrder(order);
      setIsLoadingDetails(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/orderDetails?orderId=${order.id}`
      );
      setOrderDetails(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setOrderDetails([]);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeDetails = () => {
    setSelectedOrder(null);
    setOrderDetails([]);
    setIsLoadingDetails(false);
  };

  useEffect(() => {
    return () => {
      setSelectedOrder(null);
      setOrderDetails([]);
      setIsLoadingDetails(false);
    };
  }, []);

  return {
    selectedOrder,
    orderDetails,
    isLoadingDetails,
    openDetails,
    closeDetails,
  };
};
