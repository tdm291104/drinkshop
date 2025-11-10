'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw } from 'lucide-react';
import { Product } from '@/types/product.types';
import { Category } from '@/types/category.types';
import Image from 'next/image';

interface ProductTableProps {
    products: Product[];
    categories: Category[];
    loading: boolean;
    isSubmitting: boolean;
    onEdit: (product: Product) => void;
    onDelete: (productId: string) => void;
    onRefresh: () => void;
}

export default function ProductTable({
    products,
    categories,
    loading,
    isSubmitting,
    onEdit,
    onDelete,
    onRefresh,
}: ProductTableProps) {
    const getImageSrc = (imagePath: string | undefined) => {
        if (!imagePath) return '/Product/1.jpg';
        if (imagePath.startsWith('http') || imagePath.startsWith('/')) return imagePath;
        return `/${imagePath}`;
    };


    const getCategoryName = (category: string) => {
        const foundCategory = categories.find(cat => cat.name === category);
        return foundCategory ? foundCategory.name : category || 'Unknown';
    };

    const tableHeaders = [
        'Image',
        'Name',
        'Category',
        'Price',
        'Stock',
        'Rating',
        'Actions',
    ];

    return (
        <Card className="shadow-lg py-0 mt-10">
            <CardHeader className="bg-teal-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold text-center">
                    Danh sách sản phẩm ({products.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Đang tải sản phẩm...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Chưa có sản phẩm nào.</p>
                        <Button
                            onClick={onRefresh}
                            variant="outline"
                            className="gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Tải lại dữ liệu
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-gray-100">
                                    {tableHeaders.map((header, index) => (
                                        <TableHead
                                            key={index}
                                            className="font-semibold text-gray-700"
                                        >
                                            {header}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <Image
                                                src={getImageSrc(product.image)}
                                                alt={product.name || 'Product image'}
                                                width={40}
                                                height={40}
                                                className="object-cover rounded-md"
                                                style={{ width: 'auto', height: 'auto' }}
                                                priority={false}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{getCategoryName(product.category)}</TableCell>
                                        <TableCell>{product.price?.toLocaleString('vi-VN')} VND</TableCell>
                                        <TableCell>{product.stock || 'N/A'}</TableCell>
                                        <TableCell>
                                            {product.rating || 0} ({product.reviews || 0} reviews)
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onEdit(product)}
                                                    className="border-teal-600 text-teal-600 hover:bg-teal-50"
                                                    disabled={isSubmitting}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => onDelete(product.id.toString())}
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                    disabled={isSubmitting}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
