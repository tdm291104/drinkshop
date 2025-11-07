/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";

// Lưu lại biến môi trường gốc
const OLD_ENV = process.env;

import { useAddress } from "./useAddressByUser";
import { Address } from "@/types/user.types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useAddress", () => {
  const mockAddresses: Address[] = [
    {
      id: "addr1",
      userId: "user1",
      firstName: "John",
      lastName: "Doe",
      company: "",
      address: "123 Street",
      city: "Hanoi",
      country: "Vietnam",
      zipCode: "100000",
      phone: "0123456789",
      isDefault: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // reset process.env cho mỗi test
    process.env = { ...OLD_ENV, NEXT_PUBLIC_API_BASE: "http://localhost" };
  });

  afterAll(() => {
    // restore lại môi trường gốc sau khi chạy hết test
    process.env = OLD_ENV;
  });

  it("fetches addresses for a given userId", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockAddresses });

    const { result } = renderHook(() => useAddress("user1"));

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_BASE}/addresses?userId=user1`
      );
      expect(result.current.addresses).toEqual(mockAddresses);
    });
  });

  it("sets addresses to [] if API returns null", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: null });

    const { result } = renderHook(() => useAddress("user1"));

    await waitFor(() => {
      expect(result.current.addresses).toEqual([]);
    });
  });

  it("does not fetch if userId is empty", async () => {
    renderHook(() => useAddress(""));

    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("handles API error gracefully", async () => {
    const error = new Error("API error");
    mockedAxios.get.mockRejectedValueOnce(error);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useAddress("user1"));

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_BASE}/addresses?userId=user1`
      );
      expect(result.current.addresses).toEqual([]);
    });

    expect(consoleSpy).toHaveBeenCalledWith("Error fetching address:", error);

    consoleSpy.mockRestore();
  });
});
