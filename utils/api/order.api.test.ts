import axios from "axios";

// backup env cũ
const OLD_ENV = process.env;
process.env = { ...OLD_ENV, NEXT_PUBLIC_API_BASE: "http://localhost" };

// import tất cả từ order.api sau khi env đã set
import * as OrderApi from "./order.api";
const {
  ORDER_STATUSES,
  updateOrderStatus,
  orderStatusActions,
  createOrder,
  createOrderDetails,
  getOrders,
  getOrderById,
  isValidOrderStatus,
  getStatusLabel,
  getStatusColorClass,
} = OrderApi;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

// mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

afterAll(() => {
  process.env = OLD_ENV; // restore lại env
});

describe("order.api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // updateOrderStatus
  describe("updateOrderStatus", () => {
    it("gọi PATCH đúng endpoint & payload", async () => {
      const mockResponse = { id: "1", status: ORDER_STATUSES.APPROVED };
      mockedAxios.patch.mockResolvedValueOnce({ data: mockResponse });

      const result = await updateOrderStatus("1", ORDER_STATUSES.APPROVED);

      expect(mockedAxios.patch).toHaveBeenCalledWith(`${API_BASE}/orders/1`, {
        status: ORDER_STATUSES.APPROVED,
      });
      expect(result).toEqual(mockResponse);
    });

    it("ném lỗi khi API fail", async () => {
      mockedAxios.patch.mockRejectedValueOnce(new Error("Update failed"));

      await expect(
        updateOrderStatus("1", ORDER_STATUSES.APPROVED)
      ).rejects.toThrow("Update failed");
    });
  });

  // orderStatusActions
  describe("orderStatusActions", () => {
    it("cancel ủy quyền đúng tới updateOrderStatus với CANCELLED", async () => {
      const spy = jest
        .spyOn(OrderApi, "updateOrderStatus")
        .mockResolvedValueOnce({ status: ORDER_STATUSES.CANCELLED } as any);

      const result = await orderStatusActions.cancel("123");

      expect(spy).toHaveBeenCalledWith("123", ORDER_STATUSES.CANCELLED);
      expect(result).toEqual({ status: ORDER_STATUSES.CANCELLED });

      spy.mockRestore();
    });
  });

  // createOrder
  describe("createOrder", () => {
    it("gọi POST tạo order", async () => {
      const mockOrder = { userId: "u1", totalPrice: 100 } as any;
      const mockResponse = { id: "o1", ...mockOrder };
      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await createOrder(mockOrder);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_BASE}/orders`,
        mockOrder
      );
      expect(result).toEqual(mockResponse);
    });

    it("ném lỗi khi API fail", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Create fail"));
      await expect(createOrder({ userId: "u1" } as any)).rejects.toThrow(
        "Create fail"
      );
    });
  });

  // createOrderDetails
  describe("createOrderDetails", () => {
    it("gọi POST cho từng order detail với payload đúng", async () => {
      const details = [
        { orderId: "o1", sku: "A" },
        { orderId: "o1", sku: "B" },
      ] as any[];

      mockedAxios.post.mockResolvedValue({ data: {} });

      await createOrderDetails(details);

      expect(mockedAxios.post).toHaveBeenNthCalledWith(
        1,
        `${API_BASE}/orderDetails`,
        details[0]
      );
      expect(mockedAxios.post).toHaveBeenNthCalledWith(
        2,
        `${API_BASE}/orderDetails`,
        details[1]
      );
    });

    it("không gọi API khi mảng rỗng", async () => {
      await createOrderDetails([]);
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it("ném lỗi nếu 1 item fail", async () => {
      const details = [{ orderId: "o1" }, { orderId: "o1" }] as any[];
      mockedAxios.post
        .mockResolvedValueOnce({ data: {} })
        .mockRejectedValueOnce(new Error("detail fail"));

      await expect(createOrderDetails(details)).rejects.toThrow("detail fail");
    });
  });

  // getOrders
  describe("getOrders", () => {
    it("gọi GET đúng endpoint", async () => {
      const mockData = [{ id: "o1" }];
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await getOrders();

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_BASE}/orders`);
      expect(result).toEqual(mockData);
    });
  });

  // getOrderById
  describe("getOrderById", () => {
    it("gọi GET đúng endpoint với id", async () => {
      const mockData = { id: "o1" };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await getOrderById("o1");

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_BASE}/orders/o1`);
      expect(result).toEqual(mockData);
    });
  });

  // isValidOrderStatus
  describe("isValidOrderStatus", () => {
    it("trả về true nếu status hợp lệ", () => {
      expect(isValidOrderStatus(ORDER_STATUSES.APPROVED)).toBe(true);
    });

    it("trả về false nếu status không hợp lệ", () => {
      expect(isValidOrderStatus("invalid" as any)).toBe(false);
    });
  });

  // getStatusLabel
  describe("getStatusLabel", () => {
    it("trả về label đúng với status", () => {
      expect(getStatusLabel(ORDER_STATUSES.COMPLETED)).toBe("Đã hoàn thành");
    });

    it("trả về 'invalid' nếu status không hợp lệ", () => {
      expect(getStatusLabel("invalid" as any)).toBe("invalid");
    });
  });

  // getStatusColorClass
  describe("getStatusColorClass", () => {
    it("trả về class đúng cho COMPLETED", () => {
      expect(getStatusColorClass(ORDER_STATUSES.COMPLETED)).toBe(
        "bg-green-100 text-green-800"
      );
    });

    it("trả về class mặc định cho status không hợp lệ", () => {
      expect(getStatusColorClass("invalid" as any)).toBe(
        "bg-gray-100 text-gray-800"
      );
    });
  });
});
