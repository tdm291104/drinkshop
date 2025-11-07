import axios from "axios";
import { ReviewResponse } from "@/types/review.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export const submitReview = async (
  reviews: ReviewResponse[],
  orderId: string
) => {
  try {
    await Promise.all(
      reviews.map((review) => axios.post(`${BASE_URL}/reviews`, review))
    );
    await axios.patch(`${BASE_URL}/orders/${orderId}`, { isReviewed: true });
    return true;
  } catch (error) {
    console.error("Error submitting reviews:", error);
    throw error;
  }
};
