'use client';

import React, { useCallback } from "react";
import { Slider, sliderService } from "@/services/slider.service";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Edit, Trash2 } from "lucide-react";

interface SliderListProps {
    sliders: Slider[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    onEditSlider: (slider: Slider) => void;
}

const SliderList = ({ sliders, loading, error, refetch, onEditSlider }: SliderListProps) => {
    const handleDeleteSlider = useCallback(
        async (id: string, title: string) => {
            if (!confirm(`Bạn có chắc muốn xóa slider "${title}" không?`)) return;

            try {
                await sliderService.deleteSlider(id);
                toast.success("Xóa slider thành công!");
                refetch();
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
                console.error("Delete error:", error);
                try {
                    const parsedError = JSON.parse(errorMessage);
                    toast.error(`Xóa slider thất bại: ${parsedError.message || "Không thể xóa slider, kiểm tra backend"}`);
                } catch (e) {
                    toast.error(`Xóa slider thất bại: ${errorMessage}`);
                }
            }
        },
        [refetch]
    );

    return (
        <Card className="h-fit">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="text-xl md:text-2xl text-center">
                    Existing Sliders
                </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
                {loading && (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="w-20 h-16 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>Error: {error}</AlertDescription>
                    </Alert>
                )}

                {!loading && !error && sliders.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                        <p>No sliders found</p>
                    </div>
                )}

                {!loading && !error && sliders.length > 0 && (
                    <div className="space-y-4">
                        <ScrollArea className="h-96">
                            <div className="space-y-4 pr-4">
                                {sliders.map(slider => (
                                    <Card
                                        key={slider.id}
                                        className="p-4 hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={slider.image}
                                                    alt={slider.title}
                                                    className="w-20 h-16 object-cover rounded-lg"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold truncate">{slider.title}</h3>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {slider.subtitle}
                                                </p>
                                                <div className="flex items-center mt-2 gap-2">
                                                    <Badge variant="secondary">ID: {slider.id}</Badge>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => onEditSlider(slider)} // Đảm bảo có dấu ? để tránh lỗi
                                                        disabled={!onEditSlider} // Disable nếu không có function
                                                    >
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteSlider(slider.id, slider.title)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default SliderList;
