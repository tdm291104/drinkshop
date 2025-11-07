'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '../../../types/product.types';
import { Category } from '../../../types/category.types';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { uploadImageToCloudinary } from "@/services/upload.service";

interface ProductFormProps {
    formData: Partial<Product>;
    categories: Category[];
    editingProductId: string | null;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSelectChange: (name: string) => (value: string) => void;
    onCheckboxChange: (name: string) => (checked: boolean) => void;
    onCancelEdit: () => void;
}

export default function ProductForm({
    formData,
    categories,
    editingProductId,
    isSubmitting,
    onSubmit,
    onChange,
    onSelectChange,
    onCheckboxChange,
    onCancelEdit,
}: ProductFormProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh hợp lệ');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Kích thước file không được vượt quá 5MB');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const imageUrl = await uploadImageToCloudinary(file, "product-image");
            setUploadProgress(100);

            onChange({
                target: {
                    name: "image",
                    value: imageUrl
                }
            } as React.ChangeEvent<HTMLInputElement>);
        } catch (error) {
            console.error('Upload error:', error);
            alert(`Upload ảnh thất bại: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleRemoveImage = () => {
        onChange({
            target: {
                name: "image",
                value: ""
            }
        } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
        <Card className="shadow-lg py-0">
            <CardHeader className="bg-teal-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold text-center py-2">
                    {editingProductId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Product Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Tên sản phẩm *
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name || ''}
                            onChange={onChange}
                            required
                            className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                            placeholder="Nhập tên sản phẩm"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                            Mô tả sản phẩm
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description || ''}
                            onChange={onChange}
                            rows={4}
                            className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                            placeholder="Nhập mô tả sản phẩm"
                        />
                    </div>

                    {/* Product Image Upload */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Hình ảnh sản phẩm
                        </Label>

                        {formData.image ? (
                            <div className="relative">
                                <div className="relative w-full max-w-md">
                                    <Image
                                        src={formData.image}
                                        alt="Product preview"
                                        width={200}
                                        height={100}
                                        className="w-full h-48 object-cover rounded-lg border"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={handleRemoveImage}
                                        disabled={isUploading || isSubmitting}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Nhấn vào nút X để xóa ảnh hiện tại
                                </p>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-4">
                                    <Label
                                        htmlFor="image-upload"
                                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        {isUploading ? 'Đang upload...' : 'Chọn ảnh sản phẩm'}
                                    </Label>
                                    <Input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={isUploading || isSubmitting}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Hỗ trợ PNG, JPG, GIF up to 5MB
                                </p>
                            </div>
                        )}

                        {/* Upload Progress */}
                        {isUploading && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        )}
                    </div>

                    {/* Price fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                                Giá bán *
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                value={formData.price || ''}
                                onChange={onChange}
                                required
                                min="0"
                                className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="originalPrice" className="text-sm font-medium text-gray-700">
                                Giá gốc *
                            </Label>
                            <Input
                                id="originalPrice"
                                name="originalPrice"
                                type="number"
                                value={formData.originalPrice || ''}
                                onChange={onChange}
                                required
                                min="0"
                                className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Category and Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                                Danh mục *
                            </Label>
                            <Select
                                name="category"
                                value={formData.category || ''}
                                onValueChange={onSelectChange('category')}
                            >
                                <SelectTrigger className="border-gray-300 focus:ring-teal-500 focus:border-teal-500">
                                    <SelectValue placeholder="Chọn danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.name}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock" className="text-sm font-medium text-gray-700">
                                Số lượng tồn kho *
                            </Label>
                            <Input
                                id="stock"
                                name="stock"
                                type="number"
                                value={formData.stock || ''}
                                onChange={onChange}
                                required
                                min="0"
                                className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4 pt-4">
                        {editingProductId && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancelEdit}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                disabled={isSubmitting || isUploading}
                            >
                                Hủy
                            </Button>
                        )}
                        <Button
                            type="submit"
                            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6"
                            disabled={isSubmitting || isUploading}
                        >
                            {isSubmitting ? 'Đang xử lý...' :
                                isUploading ? 'Đang upload ảnh...' :
                                    editingProductId ? 'Cập nhật' : 'Thêm sản phẩm'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
