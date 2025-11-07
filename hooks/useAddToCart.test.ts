/**
 * @jest-environment jsdom
 */
import { renderHook, act, waitFor } from "@testing-library/react";
import axios from "axios";
import { toast } from "sonner";
import { useAddToCart } from "./useAddToCart";
import { useCartStore } from "@/stores/cart.store";
import { Product } from "@/types/product.types";
import { Cart } from "@/types/cart.type";

jest.mock("axios");
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
  },
}));
jest.mock("@/stores/cart.store", () => ({
  useCartStore: jest.fn(),
}));

const makeCartStoreMock = (state: any) => {
  (useCartStore as unknown as jest.Mock).mockImplementation((selector?: any) =>
    typeof selector === "function" ? selector(state) : state
  );
};

describe("useAddToCart", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const mockedToast = toast as jest.Mocked<typeof toast>;

  let cartState: Cart;
  let mockSetCart: jest.Mock;
  const mockSetIsChange = jest.fn();

  const mockProduct: Product = {
    status: "available",
    reviewCount: 10,
    id: "p1",
    name: "Product 1",
    price: 100,
    originalPrice: 120,
    image: "",
    category: "Category 1",
    description: "Description 1",
    rating: 4.5,
    reviews: 100,
    stock: 50,
    features: ["Feature 1", "Feature 2"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_BASE = "http://localhost";

    cartState = {
      id: "c1",
      userId: "user1",
      items: [],
      totalPrice: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockSetCart = jest.fn((newCart: Cart) => {
      cartState = newCart;
      makeCartStoreMock({
        cart: cartState,
        setCart: mockSetCart,
        setIsChange: mockSetIsChange,
      });
    });

    makeCartStoreMock({
      cart: cartState,
      setCart: mockSetCart,
      setIsChange: mockSetIsChange,
    });

    // Mock axios để tự động cập nhật state
    mockedAxios.patch.mockImplementation(async (url, data) => {
      mockSetCart(data as Cart);
      return {};
    });
  });

  it("hiển thị lỗi khi product null", async () => {
    const { result } = renderHook(() => useAddToCart());

    await act(async () => {
      await result.current(null);
    });

    expect(mockedToast.error).toHaveBeenCalledWith("Sản phẩm không hợp lệ!");
  });

  it("hiển thị lỗi khi không có giỏ hàng", async () => {
    makeCartStoreMock({ cart: null });

    const { result } = renderHook(() => useAddToCart());

    await act(async () => {
      await result.current(mockProduct);
    });

    expect(mockedToast.error).toHaveBeenCalledWith(
      "Không tìm thấy giỏ hàng! Vui lòng đăng nhập"
    );
  });

  it("thêm sản phẩm thành công", async () => {
    const { result } = renderHook(() => useAddToCart());

    await act(async () => {
      await result.current(mockProduct);
    });

    expect(mockedAxios.patch).toHaveBeenCalledWith(
      "http://localhost/carts/c1",
      expect.objectContaining({
        items: [
          expect.objectContaining({
            productId: "p1",
            quantity: 1,
          }),
        ],
        totalPrice: 100,
      })
    );
    expect(mockSetCart).toHaveBeenCalled();
    expect(mockSetIsChange).toHaveBeenCalledWith(true);
    expect(mockedToast.success).toHaveBeenCalledWith("Đã thêm vào giỏ hàng!");
  });

  it("hiển thị lỗi khi gọi API thất bại", async () => {
    mockedAxios.patch.mockRejectedValueOnce(new Error("API error"));

    const { result } = renderHook(() => useAddToCart());

    await act(async () => {
      await result.current(mockProduct);
    });

    expect(mockedToast.error).toHaveBeenCalledWith(
      "Thêm vào giỏ hàng thất bại."
    );
  });

  /* bug chưa fix đc 
   it("click 2 lần liên tiếp", async () => {
    const { result } = renderHook(() => useAddToCart());
    const addToCart = result.current; 
    await act(async () => {
      await addToCart(mockProduct);
    }); 
    await act(async () => {
      await addToCart(mockProduct);
    });
    const cartState = useCartStore.getState().cart!;
    expect(cartState.items.length).toBe(1);
    expect(cartState.items[0].quantity).toBe(2);
  });*/

  it("nếu sản phẩm đã có trong cart thì click sẽ tăng số lượng", async () => {
    cartState = {
      id: "c1",
      items: [{ productId: "p1", product: mockProduct, quantity: 1 }],
      totalPrice: 100,
      userId: "user1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    makeCartStoreMock({
      cart: cartState,
      setCart: mockSetCart,
      setIsChange: mockSetIsChange,
    });

    mockedAxios.patch.mockResolvedValue({});

    const { result } = renderHook(() => useAddToCart());

    await act(async () => {
      await result.current(mockProduct);
    });

    expect(mockedAxios.patch).toHaveBeenLastCalledWith(
      "http://localhost/carts/c1",
      expect.objectContaining({
        items: [
          expect.objectContaining({
            productId: "p1",
            quantity: 2,
          }),
        ],
        totalPrice: 200,
      })
    );
  });
});
