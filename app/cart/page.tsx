"use client";

import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent";
import Image from "next/image";
import titleleftdark from "@/public/Image_Rudu/titleleft-dark.png";
import Link from "next/link";
import axios from "axios";
import { useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirmdialog/ConfirmDialog";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/utils/format.currency";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useCartStore } from "@/stores/cart.store";
const CartPage = () => {
  const router = useRouter();
  const { cart, setCart, isChange, setIsChange } = useCartStore();
  const ready = useRequireAuth();

  const cartLabel = useMemo(
    () => [
      { label: "ẢNH" },
      { label: "TÊN SẢN PHẨM" },
      { label: "GIÁ" },
      { label: "SỐ LƯỢNG" },
      { label: "TỔNG TIỀN" },
      { label: "XÓA" },
    ],
    []
  );

  useEffect(() => {
    if (!cart) return;
    const totalPrice = cart.items.reduce((sum, item) => {
      return item.product ? sum + item.quantity * item.product.price : sum;
    }, 0);
    setCart({ ...cart, totalPrice });
  }, [cart?.items, setCart]);

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (!cart) return;
    const updatedItems = cart.items.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    );
    setCart({ ...cart, items: updatedItems });
    setIsChange(true);
  };

  const handleRemoveItem = (index: number) => {
    if (!cart) return;
    const updatedItems = cart.items.filter((_, i) => i !== index);
    setCart({ ...cart, items: updatedItems });
    setIsChange(true);
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const handleClearCart = () => {
    if (!cart) {
      toast.error("Không tìm thấy giỏ hàng để xóa");
      return;
    }
    setCart({ ...cart, items: [] });
    setIsChange(true);
    toast.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
  };

  const handleSaveCart = async () => {
    if (!cart) {
      toast.error("Không tìm thấy giỏ hàng để cập nhật");
      return;
    }

    const updatedCart = {
      ...cart,
      updatedAt: new Date().toISOString(),
    };

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE}/carts/${cart.id}`,
        updatedCart
      );
      toast.success("Cập nhật giỏ hàng thành công");
      setIsChange(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật giỏ hàng");
      console.error(error);
      throw error;
    }
  };

  const handleConfirmOrder = async () => {
    if (isChange) await handleSaveCart();
    router.push("/cart/checkout");
  };

  if (!ready) return null;
  return (
    <div className="py-6">
      <BreadcrumbComponent
        items={[{ label: "Trang chủ", href: "/" }, { label: "Giỏ hàng" }]}
      />
      <div className="my-6">
        <h1 className="text-2xl font-semibold mb-2">GIỎ HÀNG</h1>
        <Image src={titleleftdark} alt="Underline" width={70} height={20} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {cartLabel.map((item, index) => (
              <TableCell key={index} className="font-semibold text-center">
                {item.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!cart || cart?.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={cartLabel.length} className="text-center">
                Giỏ hàng của bạn đang trống
              </TableCell>
            </TableRow>
          ) : (
            cart?.items.map((cartItem, index) => (
              <TableRow key={index}>
                <TableCell className="flex justify-center">
                  <Image
                    src={`${cartItem.product?.image}`}
                    alt={cartItem.product?.name || "Product Image"}
                    width={70}
                    height={140}
                    className="w-[70px] h-[140px]"
                  />
                </TableCell>
                <TableCell className="text-center uppercase">
                  {cartItem.product?.name}
                </TableCell>
                <TableCell className="text-center">
                  {formatCurrency(cartItem.product?.price) || "0 đ"}
                </TableCell>
                <TableCell className="text-center">
                  <div className="grid place-items-center">
                    <Input
                      type="number"
                      value={cartItem.quantity}
                      min={1}
                      className="w-20 text-center"
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value);
                        if (!isNaN(newQuantity) && newQuantity > 0) {
                          handleQuantityChange(index, newQuantity);
                        }
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {cartItem.product?.price
                    ? formatCurrency(cartItem.product.price * cartItem.quantity)
                    : 0}
                </TableCell>
                <TableCell className="text-center">
                  <ConfirmDialog
                    trigger={
                      <Button className="cursor-pointer bg-black hover:bg-gray-800">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    }
                    title="Xóa sản phẩm"
                    description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
                    confirmText="Xóa"
                    cancelText="Hủy"
                    onConfirm={() => handleRemoveItem(index)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex justify-end items-center gap-4 mt-6">
        <Link href="/">
          <Button className="cursor-pointer bg-black hover:bg-gray-800">
            Tiếp tục mua hàng
          </Button>
        </Link>
        <ConfirmDialog
          trigger={
            <Button
              disabled={cart?.items.length === 0}
              className="cursor-pointer bg-black hover:bg-gray-800"
            >
              Xóa
            </Button>
          }
          title="Xóa giỏ hàng"
          description="Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?"
          confirmText="Xóa"
          cancelText="Hủy"
          onConfirm={handleClearCart}
        />
        <Button
          disabled={!isChange}
          className="cursor-pointer bg-black hover:bg-gray-800"
          onClick={handleSaveCart}
        >
          Cập nhật
        </Button>
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              disabled={cart?.items.length === 0}
              variant="outline"
              className="cursor-pointer bg-black hover:bg-gray-800 text-white hover:text-white"
            >
              Tiến hành đặt hàng
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="max-w-md mx-auto">
              <DrawerHeader>
                <DrawerTitle>Xác nhận đơn hàng</DrawerTitle>
                <DrawerDescription>
                  Bạn có chắc chắn muốn đặt hàng với các sản phẩm đã chọn?
                  <br />
                  <strong>Tổng tiền:</strong> {formatCurrency(cart?.totalPrice)}
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-center"
                  onClick={handleConfirmOrder}
                >
                  Xác nhận đặt hàng
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Đóng</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default CartPage;
