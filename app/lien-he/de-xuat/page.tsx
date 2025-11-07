import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent";
import Image from "next/image";
import titleleftdark from "@/public/Image_Rudu/titleleft-dark.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DeXuatPage = () => {
  const info = [
    {
      title: "Tên sản phẩm",
      placeholder: "Nhập tên sản phẩm bạn muốn đề xuất",
    },
    { title: "Mô tả", placeholder: "Nhập mô tả sản phẩm" },
    { title: "Giá", placeholder: "Nhập giá sản phẩm" },
  ];
  return (
    <div className="py-6">
      <BreadcrumbComponent
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Liên hệ", href: "/lien-he" },
          { label: "Đề xuất sản phẩm" },
        ]}
      />
      <div className="my-6">
        <h1 className="text-2xl font-semibold mb-2">ĐỀ XUẤT SẢN PHẨM</h1>
        <Image src={titleleftdark} alt="Underline" width={70} height={20} />
      </div>
      <div className="my-6">
        <p className="text-lg text-muted-foreground mb-2">
          Chúng tôi luôn lắng nghe và trân trọng ý kiến đóng góp của bạn. Nếu
          bạn có bất kỳ đề xuất nào về sản phẩm, xin vui lòng điền vào mẫu dưới
          đây.
        </p>
      </div>
      <div className="my-6">
        {info.map((item, index) => (
          <div key={index} className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {item.title}
            </label>
            <Input placeholder={item.placeholder} />
          </div>
        ))}
        <Button className="w-fit bg-black text-white hover:bg-gray-800">
          Gửi đề xuất
        </Button>
      </div>
    </div>
  );
};
export default DeXuatPage;
