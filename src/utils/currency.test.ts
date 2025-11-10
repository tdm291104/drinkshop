import {
  formatCurrency,
  formatPrice,
  formatAmount,
  formatDiscount,
  formatPriceWithColor,
} from "./currency";

describe("formatCurrency utilities", () => {
  describe("formatCurrency", () => {
    it("trả về '0 VND' khi amount là 0", () => {
      expect(formatCurrency(0)).toBe("0 VND");
    });

    it("trả về '0 VND' khi amount là NaN", () => {
      expect(formatCurrency(NaN)).toBe("0 VND");
    });

    it("trả về '0' khi amount = 0 và showCurrency = false", () => {
      expect(formatCurrency(0, false)).toBe("0");
    });

    it("định dạng số nguyên có VND", () => {
      expect(formatCurrency(1234567)).toBe("1.234.567 VND");
    });

    it("định dạng số nguyên không có VND", () => {
      expect(formatCurrency(1234567, false)).toBe("1.234.567");
    });
  });

  describe("formatPrice", () => {
    it("gọi formatCurrency với showCurrency = true", () => {
      expect(formatPrice(1234)).toBe("1.234 VND");
    });
  });

  describe("formatAmount", () => {
    it("gọi formatCurrency với showCurrency = false", () => {
      expect(formatAmount(1234)).toBe("1.234");
    });
  });

  describe("formatDiscount", () => {
    it("thêm dấu trừ trước giá", () => {
      expect(formatDiscount(1234)).toBe("-1.234 VND");
    });
  });

  describe("formatPriceWithColor", () => {
    it("trả về giá bình thường khi không giảm giá", () => {
      expect(formatPriceWithColor(1234)).toBe("1.234 VND");
    });

    it("trả về giá có dấu trừ khi giảm giá", () => {
      expect(formatPriceWithColor(1234, true)).toBe("-1.234 VND");
    });
  });
});
