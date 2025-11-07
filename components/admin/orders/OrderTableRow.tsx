import React from 'react';
import { toast } from 'sonner';

import {
    TableCell,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/order.types';
import { User } from '@/types/user.types';
import { Address } from '@/types/address.types';
import { ORDER_STATUSES, ORDER_STATUS } from '@/constants/order-status';
import { DATE_FORMATS } from '@/constants/date';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatOrderDate, formatPrice } from '@/utils/orderCalculations';

interface OrderTableRowProps {
    order: Order;
    user?: User;
    address?: Address;
    onOpenDetails: (order: Order) => void;
    onUpdateStatus: (orderId: string, status: string) => void;
}

const OrderTableRow = React.memo<OrderTableRowProps>(({
    order,
    user,
    address,
    onOpenDetails,
    onUpdateStatus
}) => {
    if (!order) {
        console.error('OrderTableRow: order is undefined');
        return (
            <TableRow>
                <TableCell colSpan={7} className="text-center text-red-500">
                    Lỗi: Dữ liệu đơn hàng không hợp lệ
                </TableCell>
            </TableRow>
        );
    }

    const isStatusEditable = order.status !== ORDER_STATUS.COMPLETED && order.status !== ORDER_STATUS.CANCELLED;

    const handleOpenDetails = () => {
        try {
            if (!order) {
                console.error('Cannot open details: order is undefined');
                return;
            }
            onOpenDetails(order);
        } catch (error) {
            console.error('Error opening order details:', error);
        }
    };

    const handleStatusUpdate = (newStatus: string) => {
        try {
            if (!order || !order.id) {
                console.error('Cannot update status: order or order.id is undefined');
                return;
            }

            // Kiểm tra xem có thể cập nhật trạng thái không
            if (!isStatusEditable) {
                toast.error('Không thể cập nhật trạng thái', {
                    description: `Đơn hàng đã ${order.status.toLowerCase()} không thể thay đổi trạng thái`,
                });
                return;
            }

            onUpdateStatus(order.id, newStatus);
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <TableRow key={order.id}>
            <TableCell>{order.id || 'N/A'}</TableCell>
            <TableCell>
                {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : `Không tìm thấy (ID: ${order.userId || 'N/A'})`}
            </TableCell>
            <TableCell>
                {address ? `${address.address || ''}, ${address.city || ''}`.trim() : 'Không tìm thấy'}
            </TableCell>
            <TableCell>
                {formatPrice(order)}
            </TableCell>
            <TableCell>
                <StatusBadge status={order.status || 'Không xác định'} />
            </TableCell>
            <TableCell>
                {formatOrderDate(order)}
            </TableCell>
            <TableCell className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenDetails}
                    disabled={!order || !onOpenDetails}
                >
                    Xem chi tiết
                </Button>
                <Select
                    value={order.status || ''}
                    onValueChange={handleStatusUpdate}
                    disabled={!order || !onUpdateStatus || !isStatusEditable}
                >
                    <SelectTrigger className={`w-[140px] ${!isStatusEditable ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        {ORDER_STATUSES.map(status => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </TableCell>
        </TableRow>
    );
});

OrderTableRow.displayName = 'OrderTableRow';

export default OrderTableRow;
export type { Address };
