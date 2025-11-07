import axios from "axios";
import { fetchProduct } from "./product.api"; // đổi path cho đúng file
import { Product } from "@/types/product.types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("fetchProduct", () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("nên trả về product khi API có dữ liệu", async () => {
    const mockProduct: Product = {
      status: "",
      reviewCount: 1,
      id: "1",
      name: "Ruou vang",
      price: 100000,
      originalPrice: 120000,
      image: "https://example.com/ruou-vang.jpg",
      category: "Ruou",
      description: "Ruou vang ngon",
      rating: 4.5,
      reviews: 10,
      stock: 100,
      features: ["Ngon", "Chat luong cao"],
      discount: 10,
    };

    mockedAxios.get.mockResolvedValueOnce({ data: [mockProduct] });

    const result = await fetchProduct("1");

    expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/products/1`);
    expect(result).toEqual(mockProduct);
  });

  it("trả về null khi API trả về mảng rỗng", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const result = await fetchProduct("1");

    expect(result).toBeNull();
  });
});
