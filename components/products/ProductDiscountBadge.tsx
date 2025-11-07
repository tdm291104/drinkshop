import { Badge } from "@/components/ui/badge";

interface ProductDiscountBadgeProps {
    discount?: number;
}

export default function ProductDiscountBadge({ discount }: ProductDiscountBadgeProps) {
    if (!discount) return null;
    return (
        <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            -{discount}%
        </Badge>
    );
}
