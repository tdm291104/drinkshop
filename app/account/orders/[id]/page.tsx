"use client";

import Image from "next/image";
import ModalReview from "@/components/review/ModalReview";
import titleleftdark from "@/public/Image_Rudu/titleleft-dark.png";
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent";
import OrderTable, {
  headers,
  ProductItem,
} from "@/components/ordertable/OrderTable";
import { useEffect, useState, useMemo, use } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { setStatusCancelOrder } from "@/utils/api/order.api";
import { TableCell, TableRow } from "@/components/ui/table";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import { ConfirmDialog } from "@/components/confirmdialog/ConfirmDialog";
import { formatCurrency } from "@/utils/format.currency";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { OrderStatus } from "@/types/order.types";
import { useOrder } from "@/hooks/useOrder";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/dist/client/link";
import { fetchAddress } from "@/utils/api/address.api";
import { Address } from "@/types/user.types";
import { addNotification } from "@/utils/api/notification.api";

const OrderDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const order = useOrder(id);
  const orderDetails = useOrderDetails(id);
  const [status, setStatus] = useState("");
  const [isReviewed, setIsReviewed] = useState(false);
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);
  const ready = useRequireAuth();

  useEffect(() => {
    const getAddress = async () => {
      if (order?.addressId) {
        try {
          const data = await fetchAddress(order.addressId);
          setAddress(data);
        } catch (error) {
          console.error("Lỗi khi lấy địa chỉ:", error);
        }
      }
    };
    getAddress();
  }, [order?.addressId]);

  const orderLabels = useMemo(() => {
    if (!order) return [];
    return [
      { label: "MÃ ĐƠN HÀNG", value: order?.id ?? "ID" },
      {
        label: "NGÀY ĐẶT",
        value: order?.orderDate
          ? new Date(order.orderDate).toLocaleDateString()
          : "Time",
      },
      { label: "KHO HÀNG", value: order?.store ?? "Kho hàng" },
      { label: "TRẠNG THÁI", value: status },
      {
        label: "SỐ ĐIỆN THOẠI",
        value: address ? address.phone : "Chưa có số điện thoại",
      },
      {
        label: "ĐỊA CHỈ GIAO HÀNG",
        value: address
          ? `${address.address}, ${address.city}, ${address.country}`
          : "Chưa có địa chỉ",
      },
    ];
  }, [order, status, address]);

  const orderDetailsItems: ProductItem[] = orderDetails.map((item) => ({
    id: item.id,
    product: item.product,
    quantity: item.quantity,
    totalPrice: item.totalPrice,
  }));
  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setIsReviewed(order.isReviewed ? true : false);
    }
  }, [order]);
  const orderDetailsFooter = useMemo(() => {
    if (!order) return [];
    return [
      {
        label: "Giá",
        value: formatCurrency(order.subtotal) || "0 đ",
        isTotal: false,
      },
      {
        label: "Khuyến mãi",
        value: order.discount + "%",
        isTotal: false,
      },
      {
        label: "Phí vận chuyển",
        value: formatCurrency(order.shippingFee) || "0 đ",
        isTotal: false,
      },
      {
        label: "Tổng cộng",
        value: formatCurrency(order.totalPrice) || "0 đ",
        isTotal: true,
      },
    ];
  }, [order]);

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      await setStatusCancelOrder(order.id);
      await addNotification(
        order.userId,
        "Đơn hàng đã được hủy",
        `Đơn hàng ${order.id} đã được hủy thành công.`,
        `/account/orders/${order.id}`
      );
      toast.success("Đơn hàng đã được hủy.");
      setStatus("Đã hủy");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi hủy đơn hàng.");
      console.error(error);
    }
  };
  if (!ready) return null;
  return (
    <div className="py-6">
      <BreadcrumbComponent
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Danh sách đơn hàng", href: "/account/orders" },
          { label: "Chi tiết đơn hàng" },
        ]}
      />

      <div className="my-6">
        <h1 className="text-2xl font-semibold mb-2">CHI TIẾT ĐƠN HÀNG</h1>
        <Image src={titleleftdark} alt="Underline" width={70} height={20} />
      </div>

      <div className="my-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
        <div className="grid grid-cols-2 gap-y-2 gap-x-6 mb-6">
          {orderLabels.map((item, index) => (
            <div key={index}>
              <p className="text-lg text-muted-foreground">{item.label}</p>
              <p className="font-medium">{item.value}</p>
            </div>
          ))}
        </div>
        <OrderTable
          data={orderDetailsItems}
          footer={
            <>
              {orderDetailsFooter.map((item, index) => (
                <TableRow key={index}>
                  <TableCell
                    colSpan={headers.length - 1}
                    className={
                      item.isTotal
                        ? "font-bold text-lg text-right"
                        : "text-right font-normal"
                    }
                  >
                    {item.label}
                  </TableCell>
                  <TableCell
                    className={
                      item.isTotal
                        ? "font-bold text-lg text-right"
                        : "text-right font-normal"
                    }
                  >
                    {item.value}
                  </TableCell>
                </TableRow>
              ))}
            </>
          }
        />
      </div>

      <div className="my-6">
        {(status === OrderStatus.PENDING ||
          status === OrderStatus.APPROVED) && (
          <ConfirmDialog
            title="Hủy đơn hàng"
            description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
            confirmText="Có"
            cancelText="Không"
            onConfirm={handleCancelOrder}
            trigger={
              <Button className="bg-black hover:bg-[var(--ring)] text-white">
                Hủy đơn hàng
              </Button>
            }
          />
        )}
        {status === OrderStatus.COMPLETED && !isReviewed && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-[var(--ring)] text-white">
                Đánh giá sản phẩm
              </Button>
            </DialogTrigger>
            <ModalReview
              orderDetails={orderDetails}
              onClose={() => setOpen(false)}
              onSuccess={() => setIsReviewed(true)}
            />
          </Dialog>
        )}
        {status === OrderStatus.COMPLETED && isReviewed && (
          <div className="flex flex-col gap-y-4">
            Xem sản phẩm bạn đã đánh giá:
            {orderDetails.map((detail, index) => (
              <Link
                key={index}
                href={`/products/${detail.product.id}`}
                className="text-[var(--chart-5)] hover:text-[var(--chart-4)] underline"
              >
                {detail.product.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
