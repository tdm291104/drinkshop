'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Filter, Star, TrendingUp, Sparkles, Percent } from 'lucide-react';

interface FilterSidebarProps {
    filterBy: string;
    setFilterBy: (filter: string) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
}

const FilterSidebar = ({ filterBy, setFilterBy, sortBy, setSortBy }: FilterSidebarProps) => {
    const filterOptions = [
        { value: 'all', label: 'Tất cả sản phẩm', icon: Filter, count: '' },
        { value: 'hot', label: 'Sản phẩm Hot', icon: TrendingUp, count: 'Hot', color: 'bg-red-500' },
        { value: 'new', label: 'Sản phẩm mới', icon: Sparkles, count: 'New', color: 'bg-green-500' },
        { value: 'sale', label: 'Khuyến mãi', icon: Percent, count: 'Sale', color: 'bg-orange-500' },
    ];

    const sortOptions = [
        { value: 'name', label: 'Tên A → Z' },
        { value: 'price-low', label: 'Giá thấp → cao' },
        { value: 'price-high', label: 'Giá cao → thấp' },
        { value: 'rating', label: 'Đánh giá cao nhất' },
    ];

    const priceRanges = [
        { label: 'Dưới 500.000đ', min: 0, max: 500000 },
        { label: '500.000đ - 1.000.000đ', min: 500000, max: 1000000 },
        { label: '1.000.000đ - 2.000.000đ', min: 1000000, max: 2000000 },
        { label: '2.000.000đ - 5.000.000đ', min: 2000000, max: 5000000 },
        { label: 'Trên 5.000.000đ', min: 5000000, max: Infinity },
    ];

    return (
        <div className="space-y-6">
            {/* Filter by Type */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Filter size={18} />
                        Bộ lọc sản phẩm
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {filterOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                            <Button
                                key={option.value}
                                variant={filterBy === option.value ? "default" : "ghost"}
                                className={`w-full justify-start gap-3 ${filterBy === option.value
                                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                                        : "hover:bg-gray-100"
                                    }`}
                                onClick={() => setFilterBy(option.value)}
                            >
                                <IconComponent size={16} />
                                <span className="flex-1 text-left">{option.label}</span>
                                {option.count && (
                                    <Badge className={option.color}>
                                        {option.count}
                                    </Badge>
                                )}
                            </Button>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Sort Options */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Sắp xếp theo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {sortOptions.map((option) => (
                        <Button
                            key={option.value}
                            variant={sortBy === option.value ? "default" : "ghost"}
                            className={`w-full justify-start ${sortBy === option.value
                                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                                    : "hover:bg-gray-100"
                                }`}
                            onClick={() => setSortBy(option.value)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </CardContent>
            </Card>

            {/* Price Range Filter */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Khoảng giá</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {priceRanges.map((range, index) => (
                        <label
                            key={index}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                            />
                            <span className="text-sm">{range.label}</span>
                        </label>
                    ))}
                </CardContent>
            </Card>

            {/* Rating Filter */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Đánh giá</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <label
                            key={rating}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                            />
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }, (_, index) => (
                                    <Star
                                        key={index}
                                        size={14}
                                        className={`${index < rating
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                                <span className="text-sm ml-1">& lên</span>
                            </div>
                        </label>
                    ))}
                </CardContent>
            </Card>

            {/* Clear Filters */}
            <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                    setFilterBy('all');
                    setSortBy('name');
                }}
            >
                Xóa tất cả bộ lọc
            </Button>
        </div>
    );
};

export default FilterSidebar;
