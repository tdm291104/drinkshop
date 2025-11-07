/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { useUser } from "./useUser";
import { User } from "@/types/user.types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useUser hook", () => {
  const mockUser: User = {
    id: "user1",
    email: "john@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    avatar: "avatar.png",
    role: "customer",
    receiveNews: true,
    twoFactorEnabled: false,
  };

  it("fetches and sets user data correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockUser });

    const { result } = renderHook(() => useUser("user1"));

    await waitFor(() => {
      expect(result.current).toEqual(mockUser);
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_BASE}/users/user1`
    );
  });

  it("handles API error gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    mockedAxios.get.mockRejectedValueOnce(new Error("API error"));

    const { result } = renderHook(() => useUser("user1"));

    await waitFor(() => {
      expect(result.current).toBeNull();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching user:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
