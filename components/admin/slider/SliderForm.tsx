'use client';

import React, { useState, useCallback } from "react";
import { uploadImageToCloudinary } from "@/services/upload.service";
import { Slider, SliderCreateData, SliderUpdateData, sliderService } from "@/services/slider.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Image as ImageIcon, Plus } from "lucide-react";

interface SliderFormProps {
    refetch: () => void;
    editingSlider?: Slider | null;
    onEditComplete?: () => void;
}

const SliderForm = ({ refetch, editingSlider, onEditComplete }: SliderFormProps) => {
    const [formData, setFormData] = useState<Slider>({
        id: "",
        title: "",
        subtitle: "",
        buttonText: "",
        buttonLink: "",
        image: "",
        createdAt: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string>(formData.image);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleInputChange = useCallback(
        (field: keyof Slider, value: string) => setFormData(prev => ({ ...prev, [field]: value })),
        [setFormData]
    );

    const validateFile = (file: File): string | null => {
        if (!file.type.startsWith("image/")) return "Vui lòng chọn file ảnh hợp lệ";
        if (file.size > 5 * 1024 * 1024) return "Kích thước file không được vượt quá 5MB";
        return null;
    };

    const handleImageChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const validationError = validateFile(file);
            if (validationError) {
                toast.error(validationError);
                return;
            }

            setImage(file);
            setPreview(URL.createObjectURL(file));
            setIsUploading(true);
            setUploadProgress(0);

            try {
                const cloudinaryUrl = await uploadImageToCloudinary(file, "slider-image");
                setUploadProgress(100);
                setImageUrl(cloudinaryUrl);
                toast.success("Upload ảnh thành công!");
            } catch (error) {
                console.error("Upload error:", error);
                toast.error(
                    `Upload ảnh thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`
                );
                handleRemoveImage();
            } finally {
                setIsUploading(false);
                setUploadProgress(0);
            }
        },
        []
    );

    const handleRemoveImage = useCallback(() => {
        if (preview) URL.revokeObjectURL(preview);
        setImage(null);
        setPreview(null);
        setImageUrl("");
    }, [preview]);

    // Effect để handle khi có slider được truyền vào để edit
    React.useEffect(() => {
        if (editingSlider) {
            setFormData(editingSlider);
            setIsEditing(true);
            setImageUrl(editingSlider.image);
        }
    }, [editingSlider]);

    const resetForm = useCallback(() => {
        setFormData({
            id: "",
            title: "",
            subtitle: "",
            buttonText: "",
            buttonLink: "",
            image: "",
            createdAt: "",
        });
        setIsEditing(false);
        handleRemoveImage();
        onEditComplete?.();
    }, [handleRemoveImage, onEditComplete]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!imageUrl) {
            toast.error("Vui lòng chọn và upload ảnh trước khi lưu slider!");
            return;
        }

        if (formData.buttonLink && !/^https?:\/\/.+/.test(formData.buttonLink)) {
            toast.error("Button Link phải là URL hợp lệ (bắt đầu bằng http:// hoặc https://)");
            return;
        }

        try {
            if (isEditing) {
                const sliderData: SliderUpdateData = {
                    title: formData.title,
                    subtitle: formData.subtitle,
                    buttonText: formData.buttonText,
                    buttonLink: formData.buttonLink,
                    image: imageUrl,
                };
                await sliderService.updateSlider(formData.id, sliderData);
                toast.success("Cập nhật slider thành công!");
            } else {
                const sliderData: SliderCreateData = {
                    title: formData.title,
                    subtitle: formData.subtitle,
                    buttonText: formData.buttonText,
                    buttonLink: formData.buttonLink,
                    image: imageUrl,
                };
                await sliderService.createSlider(sliderData);
                toast.success("Thêm slider thành công!");
            }
            resetForm();
            refetch();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
            console.error("Submit error:", error);
            try {
                const parsedError = JSON.parse(errorMessage);
                toast.error(`Lưu slider thất bại: ${parsedError.message || parsedError.error || "Kiểm tra backend"}`);
            } catch (e) {
                toast.error(`Lưu slider thất bại: ${errorMessage}`);
            }
        }
    };

    return (
        <Card className="h-fit">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl md:text-3xl text-center">
                    {isEditing ? "Edit Slider" : "Add New Slider"}
                </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-semibold">
                            Slider Title *
                        </Label>
                        <Input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={e => handleInputChange("title", e.target.value)}
                            placeholder="Enter slider title..."
                            required
                            className="transition-all duration-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subtitle" className="text-sm font-semibold">
                            Subtitle
                        </Label>
                        <Input
                            id="subtitle"
                            type="text"
                            value={formData.subtitle}
                            onChange={e => handleInputChange("subtitle", e.target.value)}
                            placeholder="Enter subtitle..."
                            className="transition-all duration-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="buttonText" className="text-sm font-semibold">
                            Button Text
                        </Label>
                        <Input
                            id="buttonText"
                            type="text"
                            value={formData.buttonText}
                            onChange={e => handleInputChange("buttonText", e.target.value)}
                            placeholder="Enter button text..."
                            className="transition-all'duration-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="buttonLink" className="text-sm font-semibold">
                            Button Link
                        </Label>
                        <Input
                            id="buttonLink"
                            type="url"
                            value={formData.buttonLink}
                            onChange={e => handleInputChange("buttonLink", e.target.value)}
                            placeholder="Enter button link..."
                            className="transition-all duration-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Slider Image *</Label>
                        {preview ? (
                            <div className="relative group">
                                <div className="relative overflow-hidden rounded-lg border">
                                    <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleRemoveImage}
                                            disabled={isUploading}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                {imageUrl && (
                                    <p className="text-xs text-green-600 mt-2 flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        Uploaded to Cloudinary successfully
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                <div className="mt-4">
                                    <Label htmlFor="image-upload" className="cursor-pointer">
                                        <Button type="button" variant="outline" asChild>
                                            <span>
                                                <Upload className="w-4 h-4 mr-2" />
                                                {isUploading ? "Uploading..." : "Choose Image"}
                                            </span>
                                        </Button>
                                    </Label>
                                    <Input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        disabled={isUploading}
                                    />
                                </div>
                            </div>
                        )}
                        {isUploading && <Progress value={uploadProgress} className="w-full" />}
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={isUploading || !imageUrl}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            size="lg"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            {isEditing ? "Update Slider" : "Add Slider"}
                        </Button>
                        {isEditing && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={resetForm}
                                className="flex-1"
                                size="lg"
                            >
                                Cancel Edit
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default SliderForm;
