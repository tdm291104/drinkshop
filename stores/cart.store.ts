import { create } from "zustand";
import { publicApi } from "@/lib/api/axios";
import { Cart } from "@/types/cart.type";

interface CartState {
  cart: Cart | null;
  isChange: boolean;
  fetchCart: (userId: string) => Promise<void>;
  setCart: (cart: Cart | null) => void;
  setIsChange: (value: boolean) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isChange: false,

  fetchCart: async (userId) => {
    if (!userId) {
      set({ cart: null });
      return;
    }
    try {
      const res = await publicApi.get(`/carts?userId=${userId}`);
      set({ cart: res[0] || null });
    } catch (error) {
      console.error("Error fetching cart:", error);
      set({ cart: null });
    }
  },

  setCart: (cart) => set({ cart }),

  setIsChange: (value) => set({ isChange: value }),
}));
