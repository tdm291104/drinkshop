import React from 'react';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import OrderTableRow from './OrderTableRow';
import type { Address as OrderTableRowAddress } from './OrderTableRow';
import type { Order } from '@/types/order.types';
import type { User } from '@/types/user.types';
import { ORDER_STATUS } from '@/constants/order-status';

const TABLE_HEADERS = [
    'Mã đơn',
    'Khách hàng',
    'Địa chỉ',
    'Tổng giá',
    'Trạng thái',
    'Ngày đặt',
    'Thao tác'
] as const;

interface OrderTableProps {
    tableData: {
        order: Order;
        user?: User;
        address?: OrderTableRowAddress;
    }[];
    searchQuery: string;
    filterStatus: string;
    onOpenDetails: (order: Order) => void;
    onUpdateStatus: (orderId: string, newStatus: string) => void;
}

const OrderTable = ({
    tableData,
    searchQuery,
    filterStatus,
    onOpenDetails,
    onUpdateStatus
}: OrderTableProps) => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
            <TableHeader>
                <TableRow className="bg-gray-50">
                    {TABLE_HEADERS.map((header, index) => (
                        <TableHead
                            key={index}
                            className="font-semibold text-gray-700"
                        >
                            {header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {tableData.length > 0 ? (
                    tableData.map(({ order, user, address }) => (
                        <OrderTableRow
                            key={order.id}
                            order={order}
                            user={user}
                            address={address}
                            onOpenDetails={() => onOpenDetails(order)}
                            onUpdateStatus={onUpdateStatus}
                        />
                    ))
                ) : (
                    <TableRow>
                        <td colSpan={TABLE_HEADERS.length} className="text-center py-8 text-gray-500">
                            {searchQuery || filterStatus !== ORDER_STATUS.ALL
                                ? 'Không tìm thấy đơn hàng phù hợp'
                                : 'Chưa có đơn hàng nào'
                            }
                        </td>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </div>
);

export default OrderTable;
