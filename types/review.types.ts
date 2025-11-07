export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type ReviewResponse = Omit<Review, "id">;
