import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Order } from '@/types/order.types';
import { User } from '@/types/user.types';
import { Address } from '@/types/address.types';
import { OrderDetail } from '@/types/orderdetail.types';
import { formatPrice, formatDiscount } from '@/utils/currency';

interface OrderDetailsDialogProps {
    selectedOrder: Order | null;
    orderDetails: OrderDetail[];
    isLoadingDetails: boolean;
    usersMap: Map<string, User>;
    addressesMap: Map<string, Address>;
    onClose: () => void;
}

const OrderDetailsDialog = React.memo<OrderDetailsDialogProps>(({
    selectedOrder,
    orderDetails,
    isLoadingDetails,
    usersMap,
    addressesMap,
    onClose
}) => {
    if (!selectedOrder) return null;

    const user = usersMap.get(selectedOrder.userId);
    const address = addressesMap.get(selectedOrder.addressId);

    const subtotal = orderDetails.reduce((sum, detail) => sum + detail.totalPrice, 0);
    const discountAmount = (subtotal * selectedOrder.discount) / 100;
    const calculatedTotal = subtotal - discountAmount + selectedOrder.shippingFee;

    const customerInfo = [
        { label: 'Khách hàng', value: user ? `${user.firstName} ${user.lastName}` : 'Không tìm thấy' },
        { label: 'Email', value: user?.email || 'Không tìm thấy' },
        { label: 'Địa chỉ', value: address ? `${address.address}, ${address.city}` : 'Không tìm thấy' },
        { label: 'Số điện thoại', value: address?.phone || 'Không tìm thấy' },
        { label: 'Phương thức thanh toán', value: selectedOrder.paymentMethod }
    ];

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chi tiết đơn hàng #{selectedOrder.id}</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    {customerInfo.map(({ label, value }) => (
                        <p key={label}>
                            <strong>{label}:</strong> {value}
                        </p>
                    ))}

                    <h3 className="text-lg font-semibold mt-4">Sản phẩm</h3>
                    {isLoadingDetails ? (
                        <p>Đang tải chi tiết...</p>
                    ) : orderDetails.length === 0 ? (
                        <p className="text-red-500">Không tìm thấy chi tiết đơn hàng</p>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Sản phẩm</TableHead>
                                        <TableHead>Đơn giá</TableHead>
                                        <TableHead>Số lượng</TableHead>
                                        <TableHead className="text-right">Thành tiền</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderDetails.map((detail) => (
                                        <TableRow key={detail.id}>
                                            <TableCell>{detail.product.name}</TableCell>
                                            <TableCell>{formatPrice(detail.price)}</TableCell>
                                            <TableCell>{detail.quantity}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatPrice(detail.totalPrice)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span>Tạm tính:</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>

                                {selectedOrder.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Giảm giá ({selectedOrder.discount}%):</span>
                                        <span>{formatDiscount(discountAmount)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span>Phí vận chuyển:</span>
                                    <span>{formatPrice(selectedOrder.shippingFee)}</span>
                                </div>

                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>Tổng cộng:</span>
                                    <span className="text-red-600">
                                        {formatPrice(calculatedTotal)}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Đóng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
});

OrderDetailsDialog.displayName = 'OrderDetailsDialog';

export default OrderDetailsDialog;
export type { OrderDetail };
