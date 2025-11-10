export interface Voucher {
  id: string;
  code: string;
  discountType: "percentage" | "freeship" | string;
  discountValue: number;
  status: "active" | "inactive" | string;
  createdAt: string;
  updatedAt: string;
}
