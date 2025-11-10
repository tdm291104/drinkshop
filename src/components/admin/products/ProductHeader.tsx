import React from 'react';
import { Button } from '@/components/ui/button';
import { FaSync, FaPlus, FaMinus } from 'react-icons/fa';

interface ProductHeaderProps {
    loading: boolean;
    showForm: boolean;
    isSubmitting: boolean;
    onRefresh: () => void;
    onToggleForm: () => void;
}

export default function ProductHeader({
    loading,
    showForm,
    isSubmitting,
    onRefresh,
    onToggleForm,
}: ProductHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">Quản lý sản phẩm</h1>
            <div className="flex space-x-2">
                <Button
                    onClick={onRefresh}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                >
                    <FaSync className={`mr-2 ${loading ? "animate-spin" : ""}`} />
                    Làm mới
                </Button>
                <Button
                    onClick={onToggleForm}
                    variant={showForm ? "destructive" : "default"}
                    size="sm"
                    disabled={isSubmitting}
                >
                    {showForm ? (
                        <>
                            <FaMinus className="mr-2" />
                            Ẩn form
                        </>
                    ) : (
                        <>
                            <FaPlus className="mr-2" />
                            Sản phẩm mới
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
