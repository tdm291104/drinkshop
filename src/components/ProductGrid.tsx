'use client';

import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

interface ProductGridProps {
    products: Product[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const ProductGrid = ({ products, currentPage, totalPages, onPageChange }: ProductGridProps) => {
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, currentPage + halfVisible);

        // Adjust if we're near the beginning or end
        if (currentPage <= halfVisible) {
            endPage = Math.min(maxVisiblePages, totalPages);
        }
        if (currentPage > totalPages - halfVisible) {
            startPage = Math.max(1, totalPages - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</div>
                <p className="text-gray-400 mt-2">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
            </div>
        );
    }

    return (
        <div>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                    {/* Previous Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1"
                    >
                        <ChevronLeft size={16} />
                        Trước
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                        {/* First page */}
                        {currentPage > 3 && totalPages > 5 && (
                            <>
                                <Button
                                    variant={1 === currentPage ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageChange(1)}
                                    className="w-10"
                                >
                                    1
                                </Button>
                                {currentPage > 4 && (
                                    <span className="flex items-center px-2 text-gray-500">...</span>
                                )}
                            </>
                        )}

                        {/* Visible page numbers */}
                        {generatePageNumbers().map((page) => (
                            <Button
                                key={page}
                                variant={page === currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(page)}
                                className={`w-10 ${page === currentPage
                                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                                        : ""
                                    }`}
                            >
                                {page}
                            </Button>
                        ))}

                        {/* Last page */}
                        {currentPage < totalPages - 2 && totalPages > 5 && (
                            <>
                                {currentPage < totalPages - 3 && (
                                    <span className="flex items-center px-2 text-gray-500">...</span>
                                )}
                                <Button
                                    variant={totalPages === currentPage ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageChange(totalPages)}
                                    className="w-10"
                                >
                                    {totalPages}
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Next Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1"
                    >
                        Sau
                        <ChevronRight size={16} />
                    </Button>
                </div>
            )}

            {/* Results Info */}
            <div className="text-center text-gray-500 text-sm mt-4">
                Trang {currentPage} của {totalPages} ({products.length} sản phẩm)
            </div>
        </div>
    );
};

export default ProductGrid;
