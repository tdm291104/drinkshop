import { Product } from "@/types/product.types";
export interface Order {
  id: string;
  userId: string;
  addressId: string;
  status: string;
  store: string;
  totalPrice: number;
  subtotal: number;
  totalItem: number;
  shippingFee: number;
  discount: number;
  paymentMethod: string;
  orderDate: string;
  updatedAt: string;
  isReviewed?: boolean;
}

export interface OrderDetail {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  totalPrice: number;
}

export enum OrderStatus {
  PENDING = "Đã đặt, chờ duyệt",
  APPROVED = "Đã duyệt",
  SHIPPING = "Đang giao hàng",
  COMPLETED = "Đã hoàn thành",
  CANCELED = "Đã hủy",
  ALL = "ALL",
}

export enum OrderStore {
  HADONG = "HÀ ĐÔNG",
}
export type OrderCreate = Omit<Order, "id">;
export type OrderDetailCreate = Omit<OrderDetail, "id">;
