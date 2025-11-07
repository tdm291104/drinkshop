"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Grid, List, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductToolbarProps {
    totalProducts: number;
    indexOfFirstItem: number;
    indexOfLastItem: number;
    sortBy: string;
    setSortBy: (value: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function ProductToolbar({
    totalProducts,
    indexOfFirstItem,
    indexOfLastItem,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery
}: ProductToolbarProps) {
    return (
        <div className="flex flex-col gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                />
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                        Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalProducts)} của {totalProducts} kết quả
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Sắp xếp theo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Mặc định</SelectItem>
                            <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                            <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                            <SelectItem value="name">Tên A-Z</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex border rounded">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
