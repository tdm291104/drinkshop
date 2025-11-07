import { renderHook, act, waitFor } from "@testing-library/react";
import axios from "axios";
import { useDashboard } from "./useDashboard";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and sets dashboard data successfully", async () => {
    // mock dữ liệu
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes("/users")) {
        return Promise.resolve({ data: [{ id: 1 }, { id: 2 }] });
      }
      if (url.includes("/orders")) {
        return Promise.resolve({
          data: [
            {
              id: 1,
              status: "Đã hoàn thành",
              totalPrice: 100,
              orderDate: new Date().toISOString(),
            },
            {
              id: 2,
              status: "Đang xử lý",
              totalPrice: 50,
              orderDate: new Date().toISOString(),
            },
          ],
        });
      }
      if (url.includes("/reviews")) {
        return Promise.resolve({ data: [{ id: 1 }] });
      }
      return Promise.resolve({ data: [] });
    });

    const { result } = renderHook(() => useDashboard());

    // chờ hook load xong
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.stats).toEqual({
      totalUsers: 2,
      totalRevenue: 100,
      totalOrders: 2,
      totalComments: 1,
    });
    expect(result.current.chartData).not.toBeNull();
    expect(result.current.chartData?.labels.length).toBe(7);
  });

  it("handles API error and sets error message", async () => {
    // mock lỗi
    mockedAxios.get.mockRejectedValueOnce(new Error("API error"));

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).not.toBeNull();
    expect(typeof result.current.error).toBe("string");

    // trong trường hợp lỗi stats và chartData sẽ là null
    expect(result.current.stats).toBeNull();
    expect(result.current.chartData).toBeNull();
  });

  it("can refresh data via refreshData", async () => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes("/users")) {
        return Promise.resolve({ data: [{ id: 1 }] });
      }
      if (url.includes("/orders")) {
        return Promise.resolve({
          data: [
            {
              id: 1,
              status: "Đã hoàn thành",
              totalPrice: 200,
              orderDate: new Date().toISOString(),
            },
          ],
        });
      }
      if (url.includes("/reviews")) {
        return Promise.resolve({ data: [{ id: 1 }, { id: 2 }] });
      }
      return Promise.resolve({ data: [] });
    });

    const { result } = renderHook(() => useDashboard());

    // chờ lần fetch đầu tiên
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.stats).toEqual({
      totalUsers: 1,
      totalRevenue: 200,
      totalOrders: 1,
      totalComments: 2,
    });

    // đổi dữ liệu mock để test refresh
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes("/users")) {
        return Promise.resolve({ data: [{ id: 1 }, { id: 2 }] });
      }
      if (url.includes("/orders")) {
        return Promise.resolve({
          data: [
            {
              id: 1,
              status: "Đã hoàn thành",
              totalPrice: 300,
              orderDate: new Date().toISOString(),
            },
            {
              id: 2,
              status: "Đã hoàn thành",
              totalPrice: 100,
              orderDate: new Date().toISOString(),
            },
          ],
        });
      }
      if (url.includes("/reviews")) {
        return Promise.resolve({ data: [{ id: 1 }] });
      }
      return Promise.resolve({ data: [] });
    });

    // gọi refreshData
    await act(async () => {
      await result.current.refreshData();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.stats).toEqual({
      totalUsers: 2,
      totalRevenue: 400,
      totalOrders: 2,
      totalComments: 1,
    });
  });
});
