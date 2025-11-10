import { formatCurrency } from "./format.currency";

describe("formatCurrency", () => {
  it("Định dạng số nguyên", () => {
    expect(formatCurrency(1000)).toBe("1.000 đ");
  });

  it("Định dạng chuỗi số", () => {
    expect(formatCurrency("2000")).toBe("2.000 đ");
  });

  it('Trả về "0 đ" khi null', () => {
    expect(formatCurrency(null)).toBe("0 đ");
  });

  it('Trả về "0 đ" khi undefined', () => {
    expect(formatCurrency(undefined)).toBe("0 đ");
  });

  it("Định dạng số lớn", () => {
    expect(formatCurrency(123456789)).toBe("123.456.789 đ");
  });

  it("Giữ phần thập phân khi truyền số thực", () => {
    expect(formatCurrency(1234.56)).toBe("1.234,56 đ");
  });
});
