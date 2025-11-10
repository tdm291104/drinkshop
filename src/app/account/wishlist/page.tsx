"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';

export default function WishlistPage() {
    const {
        products,
        favorites,
        loading,
        error,
        isAuthenticated,
        removeFromWishlist,
        addToCart
    } = useWishlist();

    const handleAddToCart = async (productId: string) => {
        try {
            await addToCart(productId);
            alert('Đã thêm sản phẩm vào giỏ hàng!');
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Có lỗi xảy ra');
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Danh sách yêu thích</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <Card key={idx} className="p-4 space-y-2">
                            <Skeleton className="h-40 w-full rounded-lg" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Danh sách yêu thích</h1>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">Lỗi: {error}</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Danh sách yêu thích</h1>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold text-blue-800 mb-2">Chưa đăng nhập</h2>
                    <p className="text-blue-700 mb-4">
                        Bạn cần đăng nhập để xem danh sách sản phẩm yêu thích.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        Đăng nhập
                    </Link>
                </div>
                <div className="text-center py-12">
                    <Heart className="mx-auto h-24 w-24 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                        Danh sách yêu thích trống
                    </h3>
                    <p className="text-gray-500 mb-8">
                        Đăng nhập để xem và quản lý danh sách sản phẩm yêu thích của bạn.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Danh sách yêu thích</h1>

            {products === null || products.length === 0 ? (
                <div className="text-center py-12">
                    <Heart className="mx-auto h-24 w-24 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                        Chưa có sản phẩm yêu thích
                    </h3>
                    <p className="text-gray-500 mb-8">
                        Hãy thêm những sản phẩm bạn yêu thích để dễ dàng theo dõi và mua sắm sau này.
                    </p>
                    <Button asChild>
                        <Link href="/products">
                            Khám phá sản phẩm
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const favorite = favorites.find(fav => fav.productId === String(product.id));
                        return (
                            <Card key={product.id} className="hover:shadow-md transition-shadow duration-200 relative">
                                {favorite && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFromWishlist(favorite.id)}
                                        className="absolute top-2 right-2 z-10 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                                        title="Xóa khỏi danh sách yêu thích"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}

                                <Link href={`/products/${product.id}`}>
                                    <CardHeader>
                                        <Image
                                            src={`/${product.image}`}
                                            alt={product.name}
                                            width={320}
                                            height={160}
                                            className="h-40 w-full object-cover rounded-md"
                                        />
                                    </CardHeader>
                                    <CardContent>
                                        <CardTitle className="text-base font-semibold mb-2 line-clamp-2">
                                            {product.name}
                                        </CardTitle>
                                        <p className="text-lg font-bold text-red-600 mb-2">
                                            {product.price.toLocaleString()} VND
                                        </p>
                                        <Button
                                            className="w-full mt-2"
                                            size="sm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleAddToCart(String(product.id));
                                            }}
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-1" />
                                            Thêm vào giỏ
                                        </Button>
                                    </CardContent>
                                </Link>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
