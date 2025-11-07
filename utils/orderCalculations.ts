import { DATE_FORMATS } from "@/constants/date";
import { Order, OrderDetail } from "@/types/order.types";
import { vi } from "date-fns/locale";
import { format } from "date-fns";

export interface OrderCalculation {
    subtotal: number;
    discountAmount: number;
    shippingFee: number;
    finalTotal: number;
}

export const calculateOrderTotal = (
    orderDetails: OrderDetail[],
    discount: number,
    shippingFee: number
): OrderCalculation => {
    const subtotal = orderDetails.reduce((sum, detail) => sum + detail.totalPrice, 0);
    const discountAmount = (subtotal * discount) / 100;
    const finalTotal = subtotal - discountAmount + shippingFee;

    return {
        subtotal,
        discountAmount,
        shippingFee,
        finalTotal
    };
};

export const validateOrderTotal = (
    calculatedTotal: number,
    storedTotal: number,
    tolerance: number = 1
): boolean => {
    return Math.abs(calculatedTotal - storedTotal) <= tolerance;
};

export const formatOrderDate = (order: Order) => {
    try {
        if (!order.orderDate) return 'Không có ngày';
        const date = new Date(order.orderDate);
        if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
        return format(date, DATE_FORMATS.DISPLAY, { locale: vi });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Lỗi định dạng ngày';
    }
};

export const formatPrice = (order: Order) => {
    try {
        const price = order.totalPrice || 0;
        return price.toLocaleString('vi-VN') + ' VND';
    } catch (error) {
        console.error('Error formatting price:', error);
        return '0 VND';
    }
};
