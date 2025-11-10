import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
    rating: number;
    reviews?: number;
    className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, reviews, className = "" }) => (
    <div className={`flex items-center ${className}`}>
        {[...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
            />
        ))}
        {typeof reviews === "number" && (
            <span className="text-xs text-gray-500 ml-1">({reviews})</span>
        )}
    </div>
);

export default StarRating;
