import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterOption {
    value: string;
    label: string;
}

interface OrderFiltersProps {
    filterStatus: string;
    setFilterStatus: (status: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusOptions: readonly FilterOption[];
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    statusOptions
}) => {
    return (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search Input */}
                <div className="space-y-2">
                    <Label htmlFor="search">
                        Tìm kiếm theo mã đơn hoặc tên khách hàng
                    </Label>
                    <Input
                        id="search"
                        type="text"
                        placeholder="Nhập mã đơn hoặc tên khách hàng..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                    <Label htmlFor="status-filter">
                        Lọc theo trạng thái
                    </Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default OrderFilters;
