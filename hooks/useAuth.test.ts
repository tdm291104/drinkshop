/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "./useAuth";
import { useUserStore } from "@/stores/user.store";
import { useCartStore } from "@/stores/cart.store";
import { addCart } from "@/utils/api/cart.api";
import { setToken, removeToken } from "@/lib/utils";

jest.mock("@/stores/user.store", () => ({
  useUserStore: jest.fn(),
}));
jest.mock("@/stores/cart.store", () => ({
  useCartStore: { setState: jest.fn() },
}));
jest.mock("@/utils/api/cart.api", () => ({
  addCart: jest.fn(),
}));
jest.mock("@/lib/utils", () => ({
  setToken: jest.fn(),
  removeToken: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("useAuth hook", () => {
  const mockSetUser = jest.fn();
  const mockClearUser = jest.fn();

  let originalFetch: typeof global.fetch;

  // helper để mock fetch response
  const mockFetch = (response: any, ok = true) => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok,
      json: async () => response,
    });
  };

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();

    // dùng mockImplementation thay vì mockReturnValue
    (useUserStore as unknown as jest.Mock).mockImplementation(
      (selector?: any) => {
        const state = {
          user: null,
          setUser: mockSetUser,
          clearUser: mockClearUser,
        };
        return typeof selector === "function" ? selector(state) : state;
      }
    );
  });

  afterAll(() => {
    global.fetch = originalFetch; // restore
  });

  describe("register", () => {
    it("registers successfully", async () => {
      mockFetch({ data: { id: "user1" } }, true);

      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.register({
          email: "test@example.com",
          password: "123456",
          firstName: "A",
          lastName: "B",
          role: "customer",
        });
      });

      expect(addCart).toHaveBeenCalledWith("user1");
      expect(mockPush).toHaveBeenCalledWith("/login");
    });

    it("handles registration error", async () => {
      mockFetch({ message: "Error" }, false);

      const { result } = renderHook(() => useAuth());
      await expect(
        act(async () => {
          await result.current.register({
            email: "test@example.com",
            password: "123456",
            firstName: "A",
            lastName: "B",
            role: "customer",
          });
        })
      ).rejects.toThrow("Error");

      expect(addCart).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("logs in normally and redirects based on role (admin)", async () => {
      mockFetch({ data: { role: "admin" } }, true);

      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.login({
          email: "test@example.com",
          password: "123456",
        });
      });

      expect(setToken).toHaveBeenCalledWith({ role: "admin" });
      expect(mockSetUser).toHaveBeenCalledWith({ role: "admin" });
      expect(mockPush).toHaveBeenCalledWith("/admin");
    });

    it("logs in normally and redirects based on role (customer)", async () => {
      mockFetch({ data: { role: "customer" } }, true);

      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.login({
          email: "test@example.com",
          password: "123456",
        });
      });

      expect(setToken).toHaveBeenCalledWith({ role: "customer" });
      expect(mockSetUser).toHaveBeenCalledWith({ role: "customer" });
      expect(mockPush).toHaveBeenCalledWith("/");
    });

    it("redirects to 2FA page if required", async () => {
      mockFetch(
        {
          requiresTwoFactor: true,
          email: "test@example.com",
        },
        true
      );

      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.login({
          email: "test@example.com",
          password: "123456",
        });
      });

      expect(mockPush).toHaveBeenCalledWith(
        `/two-factor?email=${encodeURIComponent("test@example.com")}`
      );
      expect(setToken).not.toHaveBeenCalled();
    });

    it("handles login error", async () => {
      mockFetch({ message: "Login failed" }, false);

      const { result } = renderHook(() => useAuth());
      await expect(
        act(async () => {
          await result.current.login({
            email: "test@example.com",
            password: "123456",
          });
        })
      ).rejects.toThrow("Login failed");

      expect(setToken).not.toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("logs out successfully", async () => {
      mockFetch({}, true);

      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.logout();
      });

      expect(mockClearUser).toHaveBeenCalled();
      expect(useCartStore.setState).toHaveBeenCalledWith({
        cart: null,
        isChange: false,
      });
      expect(removeToken).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/login");
    });

    it("handles logout error", async () => {
      mockFetch({ message: "Logout failed" }, false);

      const { result } = renderHook(() => useAuth());
      await expect(
        act(async () => {
          await result.current.logout();
        })
      ).rejects.toThrow("Logout failed");

      expect(removeToken).not.toHaveBeenCalled();
    });
  });
});
