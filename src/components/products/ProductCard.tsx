import Image from "next/image"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Heart, ShoppingCart, Star } from "lucide-react"
import type { Product } from "@/src/lib/api"
import styles from "./product-card.module.css"
import ProductCardList from "./ProductCardList"
import ProductCardGrid from "./ProductCardGrid"
import ProductDiscountBadge from "./ProductDiscountBadge"

interface ProductCardProps {
  product: Product
  badge?: string
  badgeColor?: string
  viewMode?: "grid" | "list"
}

export default function ProductCard({
  product,
  badge,
  badgeColor = "bg-yellow-500",
  viewMode = "grid",
}: ProductCardProps) {
  if (viewMode === "list") {
    return <ProductCardList product={product} badge={badge} badgeColor={badgeColor} />
  }

  return (
    <ProductCardGrid product={product} badge={badge} badgeColor={badgeColor} />
  )
}
