import axios from "axios";
import { fetchAddress } from "./address.api";
import { Address } from "@/types/user.types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("fetchAddress", () => {
  const mockAddress: Address = {
    id: "1",
    userId: "user-1",
    firstName: "John",
    lastName: "Doe",
    company: "ABC Corp",
    address: "123 Main St",
    country: "Vietnam",
    city: "Hanoi",
    zipCode: "100000",
    phone: "0123456789",
    isDefault: true,
  };

  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks(); // reset mock calls
  });

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("trả về dữ liệu address", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockAddress });

    const result = await fetchAddress("1");

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_BASE}/addresses/1`
    );
    expect(result).toEqual(mockAddress);
  });

  it("trả về null khi API trả về dữ liệu rỗng", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: null });

    const result = await fetchAddress("2");

    expect(result).toBeNull();
  });

  it("trả về null và ghi log lỗi khi API gọi thất bại", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

    const result = await fetchAddress("3");

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching address",
      expect.any(Error)
    );
  });
});
