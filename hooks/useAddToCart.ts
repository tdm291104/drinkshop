"use client";

import axios from "axios";
import { Product } from "@/types/product.types";
import { useCartStore } from "@/stores/cart.store";
import { CartItem } from "@/types/cart.type";
import { toast } from "sonner";

export const useAddToCart = () => {
  const { cart, setCart, setIsChange } = useCartStore();

  const addToCart = async (product: Product | null) => {
    if (!product) {
      toast.error("Sản phẩm không hợp lệ!");
      return;
    }
    if (!cart) {
      toast.error("Không tìm thấy giỏ hàng! Vui lòng đăng nhập");
      return;
    }

    const existingItem = cart.items.find(
      (item) => item.productId === product.id
    );

    let updatedCart;

    if (existingItem) {
      const updatedItems = cart.items.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      updatedCart = {
        ...cart,
        items: updatedItems,
        totalPrice: cart.totalPrice + product.price,
        updatedAt: new Date().toISOString(),
      };
    } else {
      const newItem: CartItem = {
        productId: product.id,
        product: product,
        quantity: 1,
      };

      updatedCart = {
        ...cart,
        items: [...cart.items, newItem],
        totalPrice: cart.totalPrice + product.price,
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE}/carts/${cart.id}`,
        updatedCart
      );

      setCart(updatedCart);
      setIsChange(true);

      toast.success("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Thêm vào giỏ hàng thất bại.");
    }
  };

  return addToCart;
};
