import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  FaCcMastercard,
  FaCcPaypal,
  FaFacebookF,
  FaGooglePlusG,
  FaLinkedinIn,
  FaPhoneAlt,
  FaSignal,
  FaTwitter,
} from "react-icons/fa";
import { PiMapPinFill } from "react-icons/pi";
import { IoIosMail } from "react-icons/io";
import { RiVisaLine } from "react-icons/ri";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import { cn } from "@/lib/utils";

const footerLogos = [
  "/Image_Rudu/footer_logo1.png",
  "/Image_Rudu/footer_logo2.png",
  "/Image_Rudu/footer_logo3.png",
];

const infoItems = [
  "VỀ CHÚNG TÔI",
  "GIAO HÀNG",
  "CẢM NGHĨ",
  "LƯU TRỮ",
  "CHÍNH SÁCH RIÊNG TƯ",
];

const shoppingItems = [
  "VẬN CHUYỂN VÀ TRẢ HÀNG",
  "MUA HÀNG AN TOÀN",
  "VẬN QUỐC TẾ",
  "LIÊN KẾT",
  "DỊCH VỤ GIẢM GIÁ",
];

const socialIcons = [
  { Icon: FaTwitter, color: "text-gray-500" },
  { Icon: FaGooglePlusG, color: "text-yellow-500" },
  { Icon: FaFacebookF, color: "text-gray-500" },
  { Icon: FaLinkedinIn, color: "text-gray-500" },
  { Icon: FaSignal, color: "text-gray-500" },
];

const Footer = () => {
  return (
    <footer>
      <div className="px-72 w-full flex flex-col items-center space-y-12 py-6">
        <div className="w-full h-42 grid grid-cols-3 border-b-2 border-gray-200">
          {footerLogos.map((logo, index) => (
            <div
              key={logo}
              className={cn(
                "w-full flex items-center justify-center last",
                index !== footerLogos.length - 1 && "border-r-2 border-gray-100"
              )}
            >
              <Image
                src={logo}
                alt="logo"
                width={150}
                height={100}
                className="object-contain"
              />
            </div>
          ))}
        </div>
        <div className="flex items-start space-x-12">
          <div className="flex flex-col items-start justify-center gap-1 text-nowrap tracking-tight text-xs text-gray-700">
            <h1 className="text-sm tracking-widest font-normal pb-4 text-black">
              THÔNG TIN
            </h1>
            {infoItems.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </div>
          <div className="flex flex-col items-start justify-center gap-1 text-nowrap tracking-tight text-xs text-gray-700">
            <h1 className="text-sm tracking-widest font-normal pb-4 text-black">
              MUA HÀNG
            </h1>
            {shoppingItems.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </div>
          <div className="flex flex-col items-start gap-3 tracking-tight text-xs text-gray-700">
            <h1 className="text-sm tracking-widest font-normal pb-2 text-black">
              GỬI EMAIL
            </h1>
            <span>Gửi email cho chúng tôi để được hỗ trợ</span>
            <div className="w-64 flex items-center">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full placeholder:italic placeholder:text-gray-500 rounded-none !text-xs border-black"
              />
              <Button className="rounded-none bg-black dark:bg-gray-800 hover:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer">
                Gửi
              </Button>
            </div>
            <div className="flex items-center gap-4">
              {socialIcons.map(({ Icon, color }, index) => (
                <Icon key={index} className={`size-3 ${color}`} />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 tracking-tight text-xs text-black">
            <h1 className="text-sm tracking-widest font-normal pb-4">
              LIÊN HỆ
            </h1>
            <div className="flex gap-2">
              <PiMapPinFill className="size-6" />
              <span className="text-xs">
                Tầng 4, Tòa nhà Hanoi Group Số 442 Đội Cấn, P. Cổng Vị, Q. Ba
                Đình, Hà Nội
              </span>
            </div>
            <div className="flex gap-2 font-sans text-gray-700">
              <FaPhoneAlt className="size-3" />
              <span className="text-xs">(04) 6677 2332 - </span>
              <FaPhoneAlt className="size-3" />
              <span className="text-xs">(04) 3786 8904</span>
            </div>
            <div className="flex gap-2 font-sans text-gray-700">
              <FaPhoneAlt className="size-3" />
              <span className="text-xs text-nowrap">(08) 6680 9686 </span>
              <IoIosMail className="size-4" />
              <span className="text-xs italic text-yellow-500">
                Support@bizweb.com
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t font-sans">
        <div className="flex items-center justify-between px-72 w-full flex-nowrap text-nowrap">
          <span className="text-xs text-gray-500">
            &copy; Copyright 2008-2014 DKT Technology JSC
          </span>
          <div className="flex items-center gap-8 text-gray-600">
            <FaCcMastercard className="size-8" />
            <RiVisaLine className="size-10" />
            <FaCcPaypal className="size-8" />
            <BsFillCreditCard2FrontFill className="size-8" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
