"use client";

import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent";
import Image from "next/image";
import titleleftdark from "@/public/Image_Rudu/titleleft-dark.png";
import plant from "@/public/Image_Rudu/plant.jpg";

export default function GioiThieuPage() {
  return (
    <div className="flex flex-col items-start py-4">
      <BreadcrumbComponent
        items={[{ label: "Trang chủ", href: "/" }, { label: "Giới thiệu" }]}
      />

      <div className="my-6">
        <h1 className="text-2xl font-semibold mb-2">GIỚI THIỆU</h1>
        <Image src={titleleftdark} alt="Underline" width={70} height={20} />
      </div>

      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Image */}
          <div className="w-full">
            <Image
              src={plant}
              alt="Wine grapes"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          {/* Right side - Content */}
          <div className="space-y-6 text-xs">
            <h2 className="text-xl font-semibold text-gray-800 tracking-wider">
              CHÀO MỪNG ĐẾN VỚI WINE HOUSE
            </h2>

            <div className="space-y-0 text-gray-700 leading-relaxed">
              <p>
                Vang nổ Thăng Long có hương vị đặc trưng của sản phẩm lên men tự
                nhiên từ hoa quả với độ rượu nhẹ, bọt ga dây thăng minh. Vang Nổ
                thăng long tạo cảm giác hương phẩm, êm dịu, vui hưa.
              </p>

              <p>
                sản phẩm được đóng chai dung tích 750ml Vang nổ Thăng Long có
                hương vị đặc trưng của sản phẩm lên men tự nhiên từ hoa quả với
                độ rượu nhẹ, bọt ga dây thăng minh. Vang Nổ thăng long tạo cảm
                giác hương phẩm, êm dịu, vui hưa.
              </p>

              <p>
                sản phẩm được đóng chai dung tích 750ml Vang nổ Thăng Long có
                hương vị đặc trưng của sản phẩm lên men tự nhiên từ hoa quả với
                độ rượu nhẹ, bọt ga dây thăng minh. Vang Nổ thăng long tạo cảm
                giác hương phẩm, êm dịu, vui hưa.
              </p>

              <p>Sản phẩm được đóng chai dung tích 750ml.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
