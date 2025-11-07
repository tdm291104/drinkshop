/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from "@testing-library/react";
import { useRequireAuth } from "./useRequireAuth";
import * as utils from "@/lib/utils";
import { toast } from "sonner";

// Mock useRouter
const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

// Mock toast
jest.mock("sonner", () => ({
  toast: {
    info: jest.fn(),
  },
}));

describe("useRequireAuth hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to /login and shows toast when token is missing", async () => {
    // Mock getToken trả về null
    jest.spyOn(utils, "getToken").mockReturnValue(null);

    const { result } = renderHook(() => useRequireAuth());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });

    expect(toast.info).toHaveBeenCalledWith(
      "Bạn cần đăng nhập để truy cập trang này."
    );
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("sets ready to true when token exists", async () => {
    // Mock getToken trả về UserWithoutPassword hợp lệ
    jest.spyOn(utils, "getToken").mockReturnValue({
      id: "1",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      avatar: "",
      role: "customer",
      receiveNews: false,
      twoFactorEnabled: false,
    });

    const { result } = renderHook(() => useRequireAuth());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(toast.info).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
