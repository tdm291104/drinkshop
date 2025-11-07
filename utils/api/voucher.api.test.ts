import axios from "axios";
import { Voucher } from "@/types/voucher.types";
import { fetchVoucher } from "./voucher.api";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("fetchVoucher", () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // chặn console.error
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore(); // khôi phục lại console.error
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("nên trả về voucher khi API có dữ liệu", async () => {
    const mockVoucher: Voucher = {
      id: "v1",
      code: "BLACKFRIDAY",
      discountType: "percentage",
      discountValue: 20,
      status: "active",
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    };
    mockedAxios.get.mockResolvedValueOnce({ data: [mockVoucher] });

    const result = await fetchVoucher("BLACKFRIDAY");
    expect(result).toEqual(mockVoucher);
  });

  it("nên trả về null khi API không có dữ liệu", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const result = await fetchVoucher("BLACKFRIDAY");
    expect(result).toBeNull();
  });

  it("nên trả về null khi API gặp lỗi", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

    const result = await fetchVoucher("BLACKFRIDAY");
    expect(result).toBeNull();
  });
});
