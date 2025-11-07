/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import axios from "axios";
import { useOrders } from "./useOrders";
import { Order } from "@/types/order.types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useOrders", () => {
  const userId = "user1";
  const mockOrders: Order[] = [
    {
      id: "order1",
      userId: userId,
      addressId: "address1",
      status: "completed",
      store: "store1",
      totalPrice: 15000,
      subtotal: 14000,
      totalItem: 2,
      shippingFee: 1000,
      discount: 0,
      paymentMethod: "credit_card",
      orderDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isReviewed: true,
    },
    {
      id: "order2",
      userId: userId,
      addressId: "address1",
      status: "pending",
      store: "store1",
      totalPrice: 15000,
      subtotal: 14000,
      totalItem: 2,
      shippingFee: 1000,
      discount: 0,
      paymentMethod: "credit_card",
      orderDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isReviewed: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and sets orders", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockOrders });

    const { result } = renderHook(() => useOrders(userId));

    await waitFor(() => {
      expect(result.current).toEqual(mockOrders);
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_BASE}/orders?userId=${userId}`
    );
  });

  it("returns empty array if API returns empty", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const { result } = renderHook(() => useOrders(userId));

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });

  it("handles error gracefully", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockedAxios.get.mockRejectedValueOnce(new Error("API error"));

    const { result } = renderHook(() => useOrders(userId));

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching orders:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
