/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import axios from "axios";
import { useCart } from "./useCart";
import { Cart } from "@/types/cart.type";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useCart", () => {
  const userId = "user1";
  const mockCart: Cart = {
    id: "cart1",
    userId: userId,
    items: [
      {
        product: {
          status: "available",
          reviewCount: 10,
          id: "p1",
          name: "Product 1",
          price: 10000,
          originalPrice: 12000,
          image: "",
          category: "Category 1",
          description: "Description 1",
          rating: 4.5,
          reviews: 100,
          stock: 50,
          features: ["Feature 1", "Feature 2"],
        },
        quantity: 2,
        productId: "p1",
      },
    ],
    totalPrice: 20000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("fetches and sets cart", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [mockCart] });

    const { result } = renderHook(() => useCart(userId));

    await waitFor(() => {
      expect(result.current.cart).toEqual(mockCart);
    });
  });

  it("fetches and sets cart", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [mockCart] });

    const { result } = renderHook(() => useCart(userId));

    await waitFor(() => {
      expect(result.current.cart).toEqual(mockCart);
    });
  });
});
