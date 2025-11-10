'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice: number;
    image: string;
    images: string[];
    categoryId: number;
    stock: number;
    isNew: boolean;
    isHot: boolean;
    isSale: boolean;
    discount: number;
    rating: number;
    reviewCount: number;
    status: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                size={14}
                className={`${index < Math.floor(rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
            />
        ));
    };

    return (
        <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
            {/* Product Image */}
            <div className="relative overflow-hidden">
                <div className="aspect-square relative">
                    <Image
                        src={`/${product.image}`}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                        <Badge className="bg-green-500 hover:bg-green-600">Mới</Badge>
                    )}
                    {product.isHot && (
                        <Badge className="bg-red-500 hover:bg-red-600">Hot</Badge>
                    )}
                    {product.isSale && product.discount > 0 && (
                        <Badge className="bg-orange-500 hover:bg-orange-600">
                            -{product.discount}%
                        </Badge>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm">
                        <Heart size={16} />
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm">
                        <Eye size={16} />
                    </Button>
                </div>

                {/* Out of Stock Overlay */}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">Hết hàng</span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                {/* Product Name */}
                <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-amber-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                        {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-500">
                        ({product.reviewCount} đánh giá)
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-amber-600">
                        {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                        </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <Button
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    disabled={product.stock === 0}
                >
                    <ShoppingCart size={16} className="mr-2" />
                    {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                </Button>

                {/* Stock Info */}
                {product.stock > 0 && product.stock <= 5 && (
                    <p className="text-xs text-red-500 mt-2 text-center">
                        Chỉ còn {product.stock} sản phẩm
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
