"use client";

import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import titleleftdark from "@/public/Image_Rudu/titleleft-dark.png";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormLabel } from "@/components/ui/form-label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OAuthButtons } from "@/components/auth";

const formSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const { login, loading, error } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    } as FormValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setServerError(null);
      await login({
        email: data.email,
        password: data.password,
      });
      // Redirect sẽ được xử lý trong useAuth
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    }
  };

  return (
    <div className="flex flex-col items-start py-4">
      <BreadcrumbComponent
        items={[{ label: "Trang chủ", href: "/" }, { label: "Đăng nhập" }]}
      />

      <div className="flex justify-between w-full my-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">ĐĂNG NHẬP</h1>
          <Image src={titleleftdark} alt="Underline" width={70} height={20} />
        </div>
        <Link href="/register">
          <Button className="bg-black text-white text-sm px-7 py-5 rounded-none cursor-pointer hover:bg-gray-700">
            ĐĂNG KÝ
          </Button>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="w-full flex flex-col gap-8 border px-12 py-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold">KHÁCH HÀNG ĐĂNG NHẬP</h1>
              <h2 className="text-sm text-nowrap">
                Nếu bạn có một tài khoản, xin vui lòng đăng nhập
              </h2>
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
                      className="w-[90%] rounded-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <FormLabel className="text-sm text-nowrap" required>
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      className="w-[90%] rounded-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between px-20">
              <div className="flex items-center gap-2">
                <FormControl>
                  <Checkbox className="border-gray-500 size-3 rounded-none" />
                </FormControl>
                <FormLabel className="text-sm text-nowrap">
                  Ghi nhớ đăng nhập
                </FormLabel>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {serverError && (
              <div className="text-red-500 text-sm">{serverError}</div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-min bg-black text-white text-xs mx-20 px-4 py-1 rounded-none cursor-pointer hover:bg-gray-700"
            >
              {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
            </Button>

            {/* OAuth Login Buttons */}
            <OAuthButtons />
          </div>
        </form>
      </Form>
    </div>
  );
}
