import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { OrderDetail } from "@/types/order.types";
import { FaStar } from "react-icons/fa6";
import { useState } from "react";
import Image from "next/image";
import { submitReview } from "@/utils/api/review.api";
import { toast } from "sonner";

interface ModalReviewProps {
  orderDetails: OrderDetail[];
  onClose: () => void;
  onSuccess: () => void;
}

const ModalReview = ({
  orderDetails,
  onClose,
  onSuccess,
}: ModalReviewProps) => {
  const [ratings, setRatings] = useState<{ [productId: string]: number }>({});
  const [comments, setComments] = useState<{ [productId: string]: string }>({});
  const rate = [1, 2, 3, 4, 5];
  const handleRating = (productId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [productId]: rating }));
  };

  const handleCommentChange = (productId: string, comment: string) => {
    setComments((prev) => ({ ...prev, [productId]: comment }));
  };

  const handleSubmit = async () => {
    const reviews = orderDetails.map((detail) => ({
      userId: "2", // Lấy từ cookie
      orderId: detail.orderId,
      productId: detail.product.id,
      rating: ratings[detail.product.id] || 5,
      comment: comments[detail.product.id] || "",
      createdAt: new Date().toISOString(),
    }));
    try {
      await submitReview(reviews, orderDetails[0].orderId);
      toast.success("Đánh giá của bạn đã được gửi!");
      setRatings({});
      setComments({});
      onSuccess();
      onClose();
    } catch {
      toast.error("Gửi đánh giá thất bại!");
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
      <DialogHeader>
        <DialogTitle>Đánh giá</DialogTitle>
        <DialogDescription>
          Hãy để lại đánh giá cho các sản phẩm bạn đã mua.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-6 overflow-y-auto max-h-[60vh] pr-2">
        {orderDetails.map((detail) => (
          <div key={detail.id} className="space-y-2 border-b pb-4">
            <div className="flex gap-x-4 items-center">
              <Image
                src={`/${detail.product.image}`}
                alt={detail.product.name}
                width={50}
                height={50}
                className="w-[50px] h-[50px]  rounded"
              />
              <Label htmlFor={`rating-${detail.id}`}>
                {detail.product.name}
              </Label>
            </div>
            <div className="flex space-x-1">
              {rate.map((star) => (
                <FaStar
                  key={star}
                  className={`w-5 h-5 cursor-pointer transition-colors ${
                    (ratings[detail.product.id] || 0) >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => handleRating(detail.product.id, star)}
                />
              ))}
            </div>
            <Label htmlFor={`comment-${detail.id}`}>Nhận xét</Label>
            <Textarea
              id={`comment-${detail.id}`}
              value={comments[detail.product.id] || ""}
              onChange={(e) =>
                handleCommentChange(detail.product.id, e.target.value)
              }
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
            />
          </div>
        ))}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Hủy</Button>
        </DialogClose>
        <Button type="button" onClick={handleSubmit}>
          Gửi đánh giá
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ModalReview;
