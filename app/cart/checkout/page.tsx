"use client";
import Image from "next/image";
import Loading from "@/components/loading/Loading";
import OrderTable from "@/components/ordertable/OrderTable";
import SelectField from "@/components/selectfield/SelectField";
import titleleftdark from "@/public/Image_Rudu/titleleft-dark.png";
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent";
import { paymentOptions, shippingOptions } from "@/constants/shipping";
import {
  OrderCreate,
  OrderStatus,
  OrderStore,
  OrderDetailCreate,
} from "@/types/order.types";
import { createOrder, createOrderDetails } from "@/utils/api/order.api";
import { useState, useMemo, useEffect } from "react";
import { formatCurrency } from "@/utils/format.currency";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { fetchVoucher } from "@/utils/api/voucher.api";
import { ProductItem } from "@/components/ordertable/OrderTable";
import { useAddress } from "@/hooks/useAddressByUser";
import { clearCart } from "@/utils/api/cart.api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useUserStore } from "@/stores/user.store";
import { Address } from "@/types/user.types";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ModalAddress from "@/components/address/ModalAddress";
import { useCartStore } from "@/stores/cart.store";
import { addNotification } from "@/utils/api/notification.api";

const CheckoutPage = () => {
  const { user: currentUser } = useUserStore();
  const userId = currentUser?.id;
  const router = useRouter();
  const ready = useRequireAuth();

  const [paymentMethod, setPaymentMethod] = useState(
    "Thanh toán khi nhận hàng"
  );
  const [shippingMethod, setShippingMethod] = useState("J&T Express");
  const [shippingFee, setShippingFee] = useState(15000);
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { addresses } = useAddress(userId!);

  //const { cart, setCart, setIsChange } = useCartContext();
  const { cart, setCart, setIsChange } = useCartStore();
  const cartItems: ProductItem[] = useMemo(() => {
    return (
      cart?.items.map((item) => ({
        id: item.productId,
        product: item.product,
        quantity: item.quantity,
        totalPrice: item.quantity * (item.product?.price ?? 0),
      })) ?? []
    );
  }, [cart]);
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      setSelectedAddress(
        addresses.find((addr) => addr.isDefault) || addresses[0]
      );
    }
  }, [addresses]);

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.totalPrice, 0),
    [cartItems]
  );

  const rawDiscount = useMemo(() => {
    return discount <= 100 ? (subtotal * discount) / 100 : discount;
  }, [subtotal, discount]);

  const totalPrice = useMemo(
    () => subtotal - rawDiscount + shippingFee,
    [subtotal, rawDiscount, shippingFee]
  );

  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const userInfo = useMemo(
    () => [
      {
        label: "Họ tên",
        value: `${currentUser?.firstName} ${currentUser?.lastName}`,
      },
      {
        label: "Số điện thoại",
        value: selectedAddress?.phone || "Chưa cập nhật",
      },
      { label: "Email", value: currentUser?.email },
      {
        label: "Địa chỉ",
        value: `${selectedAddress?.address}, ${selectedAddress?.city}, ${selectedAddress?.country}`,
      },
    ],
    [currentUser, selectedAddress]
  );
  const orderInfo = useMemo(
    () => [
      { label: "Đơn vị vận chuyển", value: shippingMethod },
      {
        label: "Phí vận chuyển",
        value: formatCurrency(shippingFee),
      },
      { label: "Phương thức thanh toán", value: paymentMethod },
    ],
    [shippingMethod, shippingFee, paymentMethod, subtotal]
  );
  const orderFinish = useMemo(
    () => [
      {
        label: "Tạm tính",
        value: formatCurrency(subtotal),
        class: "text-base",
      },
      ...(discount > 0
        ? [
            {
              label: "Giảm giá",
              value: `-${formatCurrency(rawDiscount)}`,
              class: "text-green-600",
            },
          ]
        : []),
      {
        label: "Phí vận chuyển",
        value: formatCurrency(shippingFee),
        class: "text-base",
      },
    ],
    [subtotal, rawDiscount, shippingFee]
  );
  const handleApplyVoucher = async () => {
    if (!voucherCode) return;
    try {
      const voucher = await fetchVoucher(voucherCode);
      if (voucher?.discountType === "freeship") {
        setShippingFee(0);
        setVoucherError("");
      } else if (voucher?.discountType === "percentage") {
        setDiscount(voucher.discountValue);
        setVoucherError("");
      } else {
        setVoucherError("Mã giảm giá không hợp lệ");
        setDiscount(0);
      }
    } catch (error) {
      console.error(error);
      setVoucherError("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const handleOrder = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống");
      router.push("/");
      return;
    }
    if (!selectedAddress?.id) {
      toast.error("Vui lòng thêm địa chỉ giao hàng trước khi đặt hàng");
      router.push("/account/addresses");
      return;
    }

    const orderData: OrderCreate = {
      userId: userId!,
      addressId: selectedAddress?.id || "",
      status: OrderStatus.PENDING,
      store: OrderStore.HADONG,
      totalPrice: totalPrice,
      subtotal: subtotal,
      totalItem: totalItems,
      shippingFee: shippingFee,
      discount: discount,
      paymentMethod: paymentMethod,
      orderDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLoading(true);
    try {
      const res = await createOrder(orderData);
      const orderId = res.id.toString();

      router.prefetch(`/account/orders/${orderId}`);

      const orderDetails: OrderDetailCreate[] = cart.items.map((item) => ({
        orderId: orderId,
        productId: item.productId,
        product: item.product!,
        quantity: item.quantity,
        price: item.product?.price || 0,
        totalPrice: item.quantity * (item.product?.price || 0),
      }));

      await Promise.all([createOrderDetails(orderDetails), clearCart(cart)]);
      await addNotification(
        userId!,
        "Đặt hàng thành công",
        `Đơn hàng #${orderId}`,
        `/account/orders/${orderId}`
      );
      setCart({ ...cart, items: [], totalPrice: 0 });
      setIsChange(false);

      toast.success("Đặt hàng thành công");
      router.push(`/account/orders/${orderId}`);
    } catch (error) {
      console.error(error);
      toast.error("Đặt hàng thất bại. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };
  if (!ready) return null;
  if (!cart || cart.items.length === 0) return <Loading />;
  return (
    <div className="py-6">
      <BreadcrumbComponent
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Giỏ hàng", href: "/cart" },
          { label: "Đặt hàng" },
        ]}
      />
      <div className="my-6">
        <h1 className="text-2xl font-semibold mb-2">ĐẶT HÀNG</h1>
        <Image src={titleleftdark} alt="Underline" width={70} height={20} />
      </div>

      <OrderTable data={cartItems} />

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="border rounded-xl p-4 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Phương thức giao hàng</h2>
          <SelectField
            label="Phương thức thanh toán"
            placeholder="Chọn phương thức thanh toán"
            value={paymentMethod}
            onChange={setPaymentMethod}
            options={paymentOptions}
          />

          <SelectField
            label="Đơn vị vận chuyển"
            placeholder="Chọn đơn vị vận chuyển"
            value={shippingMethod}
            onChange={(value) => {
              setShippingMethod(value);
              const selectedOption = shippingOptions.find(
                (option) => option.value === value
              );
              setShippingFee(selectedOption?.fee ?? 0);
            }}
            options={shippingOptions}
          />
        </div>
        <div className="border rounded-xl p-4 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Thông tin đơn hàng</h2>
          {orderInfo.map((item) => (
            <p key={item.label} className="flex justify-between">
              <span>{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </p>
          ))}
          <div className="space-y-2">
            <label htmlFor="voucher" className="block font-medium">
              Mã giảm giá
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="voucher"
                type="text"
                value={voucherCode}
                onChange={(e) => {
                  setVoucherCode(e.target.value);
                  setVoucherError("");
                }}
                placeholder="Nhập mã giảm giá"
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <Button variant="outline" onClick={handleApplyVoucher}>
                Áp dụng
              </Button>
            </div>
            <div className="flex flex-row items-center gap-2">
              {voucherError && (
                <p className="text-red-500 text-sm">{voucherError}</p>
              )}
              {discount > 0 && (
                <Button variant="outline" onClick={() => setDiscount(0)}>
                  Giảm giá: {discount}% <X className="ml-2" />
                </Button>
              )}
              {shippingFee === 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const originalFee =
                      shippingOptions.find(
                        (opt) => opt.value === shippingMethod
                      )?.fee || 15000;
                    setShippingFee(originalFee);
                  }}
                >
                  Miễn phí vận chuyển <X className="ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="border rounded-xl p-4 space-y-2 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Thông tin khách hàng</h2>
          {userInfo.map((item) => (
            <p key={item.label}>
              <span className="font-medium">{item.label}:</span> {item.value}
            </p>
          ))}
          <Dialog open={openAddressModal} onOpenChange={setOpenAddressModal}>
            <DialogTrigger asChild>
              <span className="text-black underline hover:text-[var(--chart-1)] cursor-pointer ">
                Thay đổi địa chỉ
              </span>
            </DialogTrigger>
            <ModalAddress
              addresses={addresses}
              selectedAddress={selectedAddress}
              onClose={() => setOpenAddressModal(false)}
              onSelect={(addr) => setSelectedAddress(addr)}
            />
          </Dialog>
        </div>
        <div className="border rounded-xl p-4 shadow-sm space-y-2">
          <h2 className="text-lg font-semibold mb-2">Tổng kết đơn hàng</h2>
          {orderFinish.map((item, index) => (
            <p className={`flex justify-between ${item.class}`} key={index}>
              <span>{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </p>
          ))}
          <hr />
          <p className="flex justify-between text-lg font-bold">
            <span>Tổng cộng</span>
            <span>{formatCurrency(totalPrice)}</span>
          </p>
          <Button
            className="w-full mt-2 bg-black text-white hover:bg-gray-800"
            onClick={handleOrder}
          >
            Đặt hàng
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
