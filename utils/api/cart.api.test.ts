import axios from "axios";
import { clearCart, addCart } from "./cart.api";
import { Cart } from "@/types/cart.type";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("API giỏ hàng", () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

  const mockCart: Cart = {
    id: "123",
    userId: "u1",
    items: [
      {
        productId: "1",
        product: {
          status: "",
          reviewCount: 10,
          id: "p1",
          name: "Product 1",
          price: 10000,
          originalPrice: 12000,
          image: "/product1.jpg",
          category: "Category 1",
          description: "Description of Product 1",
          rating: 4.5,
          reviews: 100,
          stock: 50,
          features: ["Feature 1", "Feature 2"],
          discount: 10,
        },
        quantity: 1,
      },
    ],
    totalPrice: 10000,
    createdAt: "2025-08-14T00:00:00.000Z",
    updatedAt: "2025-08-14T00:00:00.000Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("clearCart - nên gọi API PUT và trả về giỏ hàng rỗng", async () => {
    // Giả lập API trả về kết quả thành công
    mockedAxios.put.mockResolvedValueOnce({
      data: { ...mockCart, items: [], totalPrice: 0 },
    });

    const result = await clearCart(mockCart);

    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${BASE_URL}/carts/${mockCart.id}`,
      {
        ...mockCart,
        items: [],
        totalPrice: 0,
      }
    );
    expect(result.data.items).toEqual([]);
    expect(result.data.totalPrice).toBe(0);
  });

  it("addCart - nên gọi API POST và trả về giỏ hàng mới", async () => {
    const userId = "u2";
    const now = new Date().toISOString();

    // Giả lập API trả về giỏ hàng mới
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        id: "456",
        userId,
        items: [],
        totalPrice: 0,
        createdAt: now,
        updatedAt: now,
      },
    });

    const result = await addCart(userId);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${BASE_URL}/carts`,
      expect.objectContaining({
        userId,
        items: [],
        totalPrice: 0,
      })
    );
    expect(result.data.userId).toBe(userId);
    expect(result.data.items).toEqual([]);
  });
});
