import axios from "axios";
import { submitReview } from "./review.api";
import { ReviewResponse } from "@/types/review.types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("submitReview", () => {
  const mockReviews: ReviewResponse[] = [
    {
      productId: "p1",
      userId: "u1",
      orderId: "order1",
      rating: 5,
      comment: "Tốt",
      createdAt: "2025-01-01",
    },
    {
      productId: "p2",
      userId: "u2",
      orderId: "order1",
      rating: 4,
      comment: "Ổn",
      createdAt: "2027-01-02",
    },
  ];
  const orderId = "order1";

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // chặn console.error
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore(); // trả lại bình thường
  });

  it("should submit reviews and mark order as reviewed", async () => {
    mockedAxios.post.mockResolvedValueOnce({}).mockResolvedValueOnce({});
    mockedAxios.patch.mockResolvedValueOnce({});

    const result = await submitReview(mockReviews, orderId);
    expect(result).toBe(true);
    expect(mockedAxios.post).toHaveBeenCalledTimes(mockReviews.length);
    expect(mockedAxios.patch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_BASE}/orders/${orderId}`,
      { isReviewed: true }
    );
  });

  it("should throw error if API fails", async () => {
    mockedAxios.post.mockRejectedValue(new Error("API Error"));

    await expect(submitReview(mockReviews, orderId)).rejects.toThrow(
      "API Error"
    );
  });
});
