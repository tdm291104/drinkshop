"use client";

import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormLabel } from "@/components/ui/form-label";
import Image from "next/image";
import titleleftdark from "@/public/Image_Rudu/titleleft-dark.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAccount } from "@/hooks/useAccount";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { useUserStore } from "@/stores/user.store";

const formSchema = z.object({
  email: z.email({ message: "Email không hợp lệ" }).optional(),
  firstName: z.string().min(1, "Vui lòng nhập tên"),
  lastName: z.string().min(1, "Vui lòng nhập họ"),
  receiveNews: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AccountPage() {
  const { user: currentUser } = useUserStore();
  const { getUserById, updateUser, loading, error } = useAccount();
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      receiveNews: false,
    },
  });

  // Lấy thông tin user đầy đủ khi component mount hoặc currentUser thay đổi
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!currentUser?.id) return;

        const userData = await getUserById(currentUser.id);
        if (userData) {
          form.reset({
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            receiveNews: userData.receiveNews,
          });
        }
      } catch (err) {
        setServerError(
          err instanceof Error
            ? err.message
            : "Không thể lấy thông tin người dùng"
        );
      }
    };

    fetchUserData();
  }, [currentUser?.id]);

  const onSubmit = async (data: FormValues) => {
    try {
      setServerError(null);
      if (!currentUser?.id) return;

      // Lấy thông tin user hiện tại
      const currentData = await getUserById(currentUser.id);
      if (!currentData) {
        throw new Error("Không thể lấy thông tin user");
      }

      // Cập nhật với đầy đủ thông tin
      const updatedUser = await updateUser(currentUser.id, {
        ...currentData,
        firstName: data.firstName,
        lastName: data.lastName,
        receiveNews: data.receiveNews,
      });

      if (updatedUser) {
        // Hiển thị thông báo thành công
        toast.success("Cập nhật thông tin thành công!");
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Cập nhật thông tin thất bại"
      );
    }
  };

  return (
    <div className="flex flex-col items-start py-4">
      <Toaster position="top-right" richColors />
      <BreadcrumbComponent
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Tài khoản của tôi" },
        ]}
      />

      <div className="my-6">
        <h1 className="text-2xl font-semibold mb-2">TÀI KHOẢN CỦA TÔI</h1>
        <Image src={titleleftdark} alt="Underline" width={70} height={20} />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold">THÔNG TIN TÀI KHOẢN</h1>
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <FormLabel className="text-sm text-nowrap" required>
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      disabled
                      className="w-[90%] rounded-none bg-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <FormLabel className="text-sm text-nowrap" required>
                    Tên
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="w-[90%] rounded-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <FormLabel className="text-sm text-nowrap" required>
                    Họ
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="w-[90%] rounded-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="receiveNews"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 px-20">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-gray-500 size-3 rounded-none"
                    />
                  </FormControl>
                  <FormLabel className="text-sm text-nowrap">
                    Đăng ký nhận bản tin
                  </FormLabel>
                </FormItem>
              )}
            />

            {serverError && (
              <div className="text-red-500 text-sm">{serverError}</div>
            )}

            <div className="flex mx-20 gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-min bg-sky-400 text-white tracking-tighter text-sm px-4 py-1 rounded-none cursor-pointer hover:bg-sky-700"
              >
                {loading ? "ĐANG XỬ LÝ..." : "Cập nhật thông tin"}
              </Button>
              <Button
                type="button"
                onClick={() => router.push("/account/security")}
                variant="outline"
                className="w-min tracking-tighter text-sm px-4 py-1 rounded-none cursor-pointer"
              >
                Cài đặt bảo mật
              </Button>
              <Button
                type="button"
                onClick={() => router.push("/")}
                className="w-min bg-black text-white tracking-tighter text-sm px-4 py-1 rounded-none cursor-pointer hover:bg-gray-700"
              >
                Thoát
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
