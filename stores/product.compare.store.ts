import { create } from "zustand";
import { Product } from "@/types/product.types";
import { toast } from "sonner";

interface ProductCompareState {
  products: Product[];
  maxItems: number;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  clearProducts: () => void;
  isInCompare: (id: string) => boolean;
}

export const useProductCompareStore = create<ProductCompareState>(
  (set, get) => ({
    products: [],
    maxItems: 4,

    addProduct: (product) => {
      const { products, maxItems } = get();
      if (products.find((p) => p.id === product.id)) {
        toast.warning("Sản phẩm đã có trong danh sách so sánh");
        return;
      }
      // Nếu vượt quá giới hạn thì bỏ sản phẩm đầu tiên để thêm mới
      if (products.length >= maxItems) {
        set({ products: [...products.slice(1), product] });
        toast.info("Đã xóa sản phẩm cũ nhất để thêm sản phẩm mới");
      } else {
        set({ products: [...products, product] });
        toast.success("Đã thêm sản phẩm vào danh sách so sánh");
      }
    },

    removeProduct: (id) => {
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
      toast.success("Đã xóa sản phẩm khỏi danh sách so sánh");
    },

    clearProducts: () => {
      set({ products: [] });
      toast.success("Đã xóa tất cả sản phẩm khỏi danh sách so sánh");
    },

    isInCompare: (id) => {
      return get().products.some((p) => p.id === id);
    },
  })
);
