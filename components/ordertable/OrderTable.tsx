import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Product } from "@/types/product.types";
import { formatCurrency } from "@/utils/format.currency";

export interface ProductItem {
  id: string;
  product: Product | null;
  quantity: number;
  totalPrice: number;
}
export interface OrderTableProps {
  data: ProductItem[];
  footer?: React.ReactNode;
}
export var headers = [
  { label: "ẢNH" },
  { label: "TÊN SẢN PHẨM" },
  { label: "GIÁ" },
  { label: "SỐ LƯỢNG" },
  { label: "TỔNG TIỀN" },
];
const OrderTable = (props: OrderTableProps) => {
  const { data, footer } = props;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((item, index) => (
            <TableCell key={index} className="font-semibold text-center">
              {item.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => {
          const product = item.product;
          if (!product) {
            return (
              <TableRow key={item.id}>
                <TableCell
                  colSpan={headers.length}
                  className="text-center text-red-500"
                >
                  Không tìm thấy thông tin sản phẩm cho ID: {item.id}
                </TableCell>
              </TableRow>
            );
          }

          return (
            <TableRow key={item.id}>
              <TableCell className="flex justify-center">
                <Image
                  src={`${product.image || "default-product.png"}`}
                  alt={product.name}
                  width={70}
                  height={140}
                  className="w-[70px] h-[140px]"
                />
              </TableCell>
              <TableCell className="text-center">{product.name}</TableCell>
              <TableCell className="text-center">
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell className="text-center">{item.quantity}</TableCell>
              <TableCell className="text-center">
                {formatCurrency(product.price * item.quantity)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      {footer && <TableFooter>{footer}</TableFooter>}
    </Table>
  );
};
export default OrderTable;
