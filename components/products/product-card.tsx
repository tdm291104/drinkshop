import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/api"

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
    return (
      <Card className="group hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-32 h-32 sm:h-40 flex-shrink-0 relative">
              {badge && (
                <Badge className={`absolute top-2 left-2 z-10 ${badgeColor} text-white text-xs`}>{badge}</Badge>
              )}
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={128}
                height={160}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-semibold mb-2 text-sm lg:text-base hover:text-yellow-600 transition-colors cursor-pointer">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-sm ${i < product.rating ? "text-yellow-500" : "text-gray-300"}`}>
                    ★
                  </span>
                ))}
                <span className="text-xs text-gray-500 ml-2">({product.reviews})</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-base lg:text-lg font-bold text-yellow-600">{product.price}</span>
                  <span className="text-sm">đ</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}đ</span>
                  )}
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button className="bg-black text-white hover:bg-gray-800 text-xs lg:text-sm flex-1 sm:flex-none">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    THÊM VÀO GIỎ
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-3 lg:p-4">
        <div className="relative mb-3 lg:mb-4">
          {badge && <Badge className={`absolute top-2 left-2 z-10 ${badgeColor} text-white text-xs`}>{badge}</Badge>}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={200}
            height={300}
            className="w-full h-48 lg:h-64 object-contain"
          />
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-center mb-2 text-sm lg:text-base line-clamp-2 hover:text-yellow-600 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <div className="flex justify-center items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-sm ${i < product.rating ? "text-yellow-500" : "text-gray-300"}`}>
              ★
            </span>
          ))}
          <span className="text-xs text-gray-500 ml-2">({product.reviews})</span>
        </div>
        <div className="text-center mb-3 lg:mb-4">
          <span className="text-base lg:text-lg font-bold text-yellow-600">{product.price}</span>
          <span className="text-sm">đ</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}đ</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button className="flex-1 bg-black text-white hover:bg-gray-800 text-xs lg:text-sm py-2 lg:py-3">
            <ShoppingCart className="w-4 h-4 mr-2" />
            THÊM VÀO GIỎ
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
