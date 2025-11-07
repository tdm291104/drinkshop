import {
  calculateOrderTotal,
  validateOrderTotal,
  formatOrderDate,
  formatPrice,
} from "./orderCalculations";
import { Order, OrderDetail } from "@/types/order.types";

jest.mock("@/constants/date", () => ({
  DATE_FORMATS: {
    DISPLAY: "dd/MM/yyyy",
  },
}));

describe("calculateOrderTotal", () => {
  it("Tính đúng tổng đơn hàng với giảm giá và phí ship", () => {
    const orderDetails: OrderDetail[] = [
      { totalPrice: 100000 } as OrderDetail,
      { totalPrice: 200000 } as OrderDetail,
    ];
    const result = calculateOrderTotal(orderDetails, 10, 15000);
    expect(result).toEqual({
      subtotal: 300000,
      discountAmount: 30000,
      shippingFee: 15000,
      finalTotal: 285000,
    });
  });

  it("Tổng phụ = 0 khi không có sản phẩm", () => {
    const result = calculateOrderTotal([], 0, 0);
    expect(result.subtotal).toBe(0);
    expect(result.finalTotal).toBe(0);
  });
});

describe("validateOrderTotal", () => {
  it("Trả về true nếu chênh lệch <= tolerance", () => {
    expect(validateOrderTotal(100, 101)).toBe(true);
  });

  it("Trả về false nếu chênh lệch > tolerance", () => {
    expect(validateOrderTotal(100, 105)).toBe(false);
  });

  it("Có thể thay đổi tolerance", () => {
    expect(validateOrderTotal(100, 105, 5)).toBe(true);
  });
});

describe("formatOrderDate", () => {
  it("Format ngày hợp lệ", () => {
    const order = { orderDate: "2024-08-14T00:00:00Z" } as Order;
    expect(formatOrderDate(order)).toBe("14/08/2024");
  });

  it('Trả về "Không có ngày" khi orderDate null', () => {
    const order = { orderDate: null } as unknown as Order;
    expect(formatOrderDate(order)).toBe("Không có ngày");
  });

  it('Trả về "Ngày không hợp lệ" khi orderDate sai định dạng', () => {
    const order = { orderDate: "abc" } as Order;
    expect(formatOrderDate(order)).toBe("Ngày không hợp lệ");
  });
});

describe("formatPrice", () => {
  it("Format giá hợp lệ", () => {
    const order = { totalPrice: 1000000 } as Order;
    expect(formatPrice(order)).toBe("1.000.000 VND");
  });

  it('Trả về "0 VND" khi totalPrice null', () => {
    const order = { totalPrice: null } as unknown as Order;
    expect(formatPrice(order)).toBe("0 VND");
  });
});
