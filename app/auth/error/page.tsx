"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthLayout } from "@/components/auth";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "Có lỗi trong cấu hình xác thực.",
    AccessDenied: "Quyền truy cập bị từ chối.",
    Verification: "Không thể xác thực tài khoản.",
    AccountSuspended:
      "Tài khoản Google/GitHub của bạn đã bị khóa hoặc chưa xác thực email.",
  };

  const getErrorMessage = (error: string | null) => {
    return (
      errorMessages[error || ""] || "Đã xảy ra lỗi trong quá trình đăng nhập."
    );
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">
            Lỗi xác thực
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{getErrorMessage(error)}</p>

          <div className="space-y-2">
            <Link href="/login">
              <Button className="w-full">Thử lại</Button>
            </Link>

            <Link href="/">
              <Button variant="ghost" className="w-full">
                Về trang chủ
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
