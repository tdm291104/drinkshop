import axios from "axios";
import { OrderCreate, OrderDetailCreate } from "@/types/order.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export const ORDER_STATUSES = {
  PENDING: "Đã đặt, chờ duyệt",
  APPROVED: "Đã duyệt",
  SHIPPING: "Đang giao hàng",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
) => {
  const response = await axios.patch(`${BASE_URL}/orders/${orderId}`, {
    status,
  });
  return response.data;
};

export const orderStatusActions = {
  cancel: (orderId: string) =>
    updateOrderStatus(orderId, ORDER_STATUSES.CANCELLED),
  complete: (orderId: string) =>
    updateOrderStatus(orderId, ORDER_STATUSES.COMPLETED),
  approve: (orderId: string) =>
    updateOrderStatus(orderId, ORDER_STATUSES.APPROVED),
  ship: (orderId: string) =>
    updateOrderStatus(orderId, ORDER_STATUSES.SHIPPING),
  pending: (orderId: string) =>
    updateOrderStatus(orderId, ORDER_STATUSES.PENDING),
} as const;

export const setStatusCancelOrder = orderStatusActions.cancel;
export const setStatusCompleteOrder = orderStatusActions.complete;
export const setStatusProcessingOrder = orderStatusActions.approve;
export const setStatusShippingOrder = orderStatusActions.ship;

export const createOrder = async (data: OrderCreate) => {
  const res = await axios.post(`${BASE_URL}/orders`, data);
  return res.data;
};

export const createOrderDetails = async (orderDetails: OrderDetailCreate[]) => {
  return Promise.all(
    orderDetails.map((detail) => axios.post(`${BASE_URL}/orderDetails`, detail))
  );
};

export const getOrders = async () => {
  const response = await axios.get(`${BASE_URL}/orders`);
  return response.data;
};

export const getOrderById = async (orderId: string) => {
  const response = await axios.get(`${BASE_URL}/orders/${orderId}`);
  return response.data;
};

export const isValidOrderStatus = (status: string): status is OrderStatus => {
  return Object.values(ORDER_STATUSES).includes(status as OrderStatus);
};

export const getStatusLabel = (status: OrderStatus): string => {
  const statusLabels: Record<OrderStatus, string> = {
    [ORDER_STATUSES.PENDING]: "Đã đặt, chờ duyệt",
    [ORDER_STATUSES.APPROVED]: "Đã duyệt",
    [ORDER_STATUSES.SHIPPING]: "Đang giao",
    [ORDER_STATUSES.COMPLETED]: "Đã hoàn thành",
    [ORDER_STATUSES.CANCELLED]: "Đã hủy",
  };

  return statusLabels[status] || status;
};

export const getStatusColorClass = (status: OrderStatus): string => {
  const statusColors: Record<OrderStatus, string> = {
    [ORDER_STATUSES.PENDING]: "bg-yellow-100 text-yellow-800",
    [ORDER_STATUSES.APPROVED]: "bg-blue-100 text-blue-800",
    [ORDER_STATUSES.SHIPPING]: "bg-purple-100 text-purple-800",
    [ORDER_STATUSES.COMPLETED]: "bg-green-100 text-green-800",
    [ORDER_STATUSES.CANCELLED]: "bg-red-100 text-red-800",
  };

  return statusColors[status] || "bg-gray-100 text-gray-800";
};
