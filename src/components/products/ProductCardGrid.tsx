"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { ChartColumnStacked, Heart, ShoppingCart } from "lucide-react";
import type { Product as ApiProduct } from "@/src/lib/api";
import type { Product as CartProduct } from "@/src/types/product.types";
import styles from "./product-card.module.css";
import { useAddToCart } from "@/src/hooks/useAddToCart";
import { formatCurrency } from "@/src/utils/format.currency";
import { useProductCompareStore } from "@/src/stores/product.compare.store";
import ProductDiscountBadge from "./ProductDiscountBadge";
import StarRating from "./StarRating";

interface ProductCardGridProps {
  product: ApiProduct;
  badge?: string;
  badgeColor?: string;
}

export default function ProductCardGrid({
  product,
  badge,
  badgeColor = "bg-yellow-500",
}: ProductCardGridProps) {
  const addToCart = useAddToCart();
  const { addProduct } = useProductCompareStore();
  // Convert ApiProduct to CartProduct format
  const convertToCartProduct = (apiProduct: ApiProduct): CartProduct => {
    return {
      status: "active", // Default status
      reviewCount: apiProduct.reviews,
      id: apiProduct.id,
      name: apiProduct.name,
      price: apiProduct.price,
      originalPrice: apiProduct.originalPrice,
      image: apiProduct.image,
      category: apiProduct.category,
      description: apiProduct.description,
      rating: apiProduct.rating,
      reviews: apiProduct.reviews,
      stock: apiProduct.inStock ? 100 : 0, // Convert inStock boolean to stock number
      features: apiProduct.features,
      discount: apiProduct.discount,
    };
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cartProduct = convertToCartProduct(product);
    addToCart(cartProduct);
  };

  return (
    <Card className="group overflow-hidden">
      <div className="relative">
        <Link href={`/products/${product.id}`} className="block">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-52 object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {badge && (
          <Badge className={`absolute top-2 right-2 ${badgeColor} text-black`}>
            {badge}
          </Badge>
        )}
        <ProductDiscountBadge discount={product.discount} />
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full w-8 h-8"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex-col items-center hidden group-hover:flex">
          <Button
            className="bg-black hover:bg-gray-800 text-white w-full rounded-none py-2 text-sm"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Thêm vào giỏ
          </Button>
        </div>
        <div className="absolute inset-x-0 bottom-[50px] flex-col items-center hidden group-hover:flex">
          <Button
            className="bg-black hover:bg-gray-800 text-white w-full rounded-none py-2 text-sm"
            onClick={() => {
              addProduct(convertToCartProduct(product));
            }}
          >
            <ChartColumnStacked className="w-4 h-4 mr-2" />
            Thêm vào so sánh
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <StarRating rating={product.rating} reviews={product.reviews} className="mb-1" />
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-sm mb-1 line-clamp-2 hover:text-yellow-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-bold text-yellow-600">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-500 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
