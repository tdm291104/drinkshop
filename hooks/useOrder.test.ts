/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import axios from "axios";
import { useOrder } from "./useOrder";
import { Order } from "@/types/order.types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useOrder", () => {
  const orderId = "order1";
  const mockOrder: Order = {
    id: orderId,
    userId: "user1",
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
  };

  const OLD_ENV = process.env;
  let API_BASE: string;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, NEXT_PUBLIC_API_BASE: "http://localhost" };
    API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
  });

  afterAll(() => {
    process.env = OLD_ENV; // restore env
  });

  it("fetches and sets order", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockOrder });

    const { result } = renderHook(() => useOrder(orderId));

    await waitFor(() => {
      expect(result.current).toEqual(mockOrder);
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${API_BASE}/orders/${orderId}`
    );
  });

  it("returns null if API returns null", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: null });

    const { result } = renderHook(() => useOrder(orderId));

    await waitFor(() => {
      expect(result.current).toBeNull();
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${API_BASE}/orders/${orderId}`
    );
  });

  it("handles error gracefully", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockedAxios.get.mockRejectedValueOnce(new Error("API error"));

    const { result } = renderHook(() => useOrder(orderId));

    await waitFor(() => {
      expect(result.current).toBeNull();
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${API_BASE}/orders/${orderId}`
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching order:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
