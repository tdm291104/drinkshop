"use client";

import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent";
import Image from "next/image";
import titleleftdark from "@/public/Image_Rudu/titleleft-dark.png";
import logo3 from "@/public/Image_Rudu/logo3.jpg";
import { PiMapPinFill } from "react-icons/pi";
import {
  FaGooglePlusG,
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaPhoneAlt,
  FaSignal,
} from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GoogleMap from "@/components/ui/GoogleMap";
import { Button } from "@/components/ui/button";

const socialIcons = [
  { Icon: FaTwitter },
  { Icon: FaGooglePlusG },
  { Icon: FaFacebookF },
  { Icon: FaLinkedinIn },
  { Icon: FaSignal },
];

export default function LienHePage() {
  return (
    <div className="flex flex-col items-start py-4">
      <BreadcrumbComponent
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Liên hệ" },
          { label: "Đề xuất sản phẩm", href: "/lien-he/de-xuat" },
        ]}
      />

      <div className="my-6">
        <h1 className="text-2xl font-semibold mb-2">LIÊN HỆ</h1>
        <Image src={titleleftdark} alt="Underline" width={70} height={20} />
      </div>

      <div className="w-full flex gap-4">
        <div className="w-2/3 flex flex-col gap-4">
          <div className="h-[20rem] w-full">
            <GoogleMap />
          </div>
          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-nowrap">Your Name</div>
            <Input className="w-[80%] rounded-none border border-gray-300 bg-gray-100" />
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-nowrap">Your Email</div>
            <Input className="w-[80%] rounded-none border border-gray-300 bg-gray-100" />
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-nowrap">Subject</div>
            <Input className="w-[80%] rounded-none border border-gray-300 bg-gray-100" />
          </div>
          <div className="flex justify-between">
            <div className="text-sm text-nowrap">Your Message</div>
            <Textarea className="w-[80%] rounded-none border border-gray-300 bg-gray-100" />
          </div>
          <Button className="ml-[20%] w-fit bg-black text-white hover:bg-gray-800">
            GỬI
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <Image src={logo3} alt="logo" width={120} height={120} />
          <div className="flex flex-col items-start gap-2 tracking-tight text-xs text-black">
            <div className="flex gap-2">
              <PiMapPinFill className="size-3" />
              <span className="text-xs">
                Tầng 4, Tòa nhà Hanoi Group Số 442 Đội <br /> Cấn, P. Cổng Vị,
                Q. Ba Đình, Hà Nội
              </span>
            </div>
            <div className="flex gap-2 font-sans text-gray-700">
              <FaPhoneAlt className="size-3" />
              <span className="text-xs">(04) 6677 2332</span>
            </div>
            <div className="flex gap-2 font-sans text-gray-700">
              <IoIosMail className="size-4" />
              <span className="text-xs">support@milano.com</span>
            </div>
            <h1 className="text-sm tracking-widest font-normal pt-4">
              FOLLOW US
            </h1>
            <div className="flex items-center gap-4">
              {socialIcons.map(({ Icon }, index) => (
                <Icon key={index} className={`size-4 text-gray-500`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
