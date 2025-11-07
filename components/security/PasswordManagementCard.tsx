"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { ChangePasswordDialog } from "@/components/ui/change-password-dialog";

interface PasswordManagementCardProps {
  userId: string;
  userEmail: string;
}

export function PasswordManagementCard({
  userId,
  userEmail,
}: PasswordManagementCardProps) {
  const handleForgotPassword = () => {
    window.open("/forgot-password", "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Key className="h-6 w-6 text-green-600" />
          <div>
            <CardTitle>Mật khẩu</CardTitle>
            <CardDescription>
              Quản lý mật khẩu và cài đặt đặt lại mật khẩu
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Đổi mật khẩu</p>
              <p className="text-sm text-gray-600">
                Cập nhật mật khẩu để bảo mật tài khoản
              </p>
            </div>
            <ChangePasswordDialog userId={userId}>
              <Button variant="outline" size="sm">
                Đổi mật khẩu
              </Button>
            </ChangePasswordDialog>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Quên mật khẩu hiện tại?</p>
                <p className="text-sm text-gray-600">
                  Nhận link đặt lại mật khẩu qua email: {userEmail}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleForgotPassword}
              >
                Đặt lại qua email
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
