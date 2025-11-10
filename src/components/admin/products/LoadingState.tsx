'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface LoadingStateProps {
    productsLoading: boolean;
    categoriesLoading: boolean;
    productsCount: number;
    categoriesCount: number;
    error?: string;
    onRetry: () => void;
}

export default function LoadingState({
    productsLoading,
    categoriesLoading,
    productsCount,
    categoriesCount,
    error,
    onRetry,
}: LoadingStateProps) {
    const isLoading = productsLoading || categoriesLoading;

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Lỗi tải dữ liệu</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button
                        onClick={onRetry}
                        className="bg-blue-500 text-white hover:bg-blue-600 w-full"
                    >
                        Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Products: {productsLoading ? 'Loading...' : `✓ (${productsCount})`} |
                        Categories: {categoriesLoading ? 'Loading...' : `✓ (${categoriesCount})`}
                    </p>
                </div>
            </div>
        );
    }

    return null;
}