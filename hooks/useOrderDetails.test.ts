/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import axios from "axios";
import { useOrderDetails } from "./useOrderDetails";
import { OrderDetail } from "@/types/order.types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useOrderDetails", () => {
  const orderId = "order1";
  const mockOrderDetails: OrderDetail[] = [
    {
      id: "od1",
      orderId: orderId,
      productId: "p1",
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
      price: 10000,
      totalPrice: 20000,
    },
    {
      id: "od2",
      orderId: orderId,
      productId: "p2",
      product: {
        status: "available",
        reviewCount: 5,
        id: "p2",
        name: "Product 2",
        price: 5000,
        originalPrice: 6000,
        image: "",
        category: "Category 2",
        description: "Description 2",
        rating: 4.0,
        reviews: 50,
        stock: 30,
        features: ["Feature 3", "Feature 4"],
      },
      quantity: 1,
      price: 5000,
      totalPrice: 5000,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and sets order details", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockOrderDetails });

    const { result } = renderHook(() => useOrderDetails(orderId));

    await waitFor(() => {
      expect(result.current).toEqual(mockOrderDetails);
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_BASE}/orderDetails?orderId=${orderId}`
    );
  });

  it("handles error gracefully", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockedAxios.get.mockRejectedValueOnce(new Error("API error"));

    const { result } = renderHook(() => useOrderDetails(orderId));

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching order:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
