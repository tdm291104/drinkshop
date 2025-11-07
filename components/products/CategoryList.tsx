"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { IMAGE_DIMENSIONS } from "@/constants/image-dimensions";

type Category = {
    name: string;
    value: string;
    count: number;
}

interface CategoryListProps {
    categories: Category[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export default function CategoryList({ categories, selectedCategory, onSelectCategory }: CategoryListProps) {
    return (
        <div className="mb-6 lg:mb-8">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">
                DANH MỤC SẢN PHẨM
                <Image
                    src="/Image_Rudu/titleleft-dark.png"
                    alt="arrow-trang-tri"
                    width={IMAGE_DIMENSIONS.TITLE_DECORATION.width}
                    height={IMAGE_DIMENSIONS.TITLE_DECORATION.height}
                />
            </h3>

            <ul className="space-y-2">
                {categories.map((category, index) => (
                    <li key={index}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSelectCategory(category.value)}
                            className={`w-full flex justify-between p-1 h-auto font-normal ${selectedCategory === category.value
                                ? "text-yellow-600 font-medium"
                                : "text-gray-600"
                                }`}
                        >
                            <span>{category.name}</span>
                            <span>({category.count})</span>
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
