"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserWithoutPassword } from "@/types/user.types";

interface AccountInfoCardProps {
  user: UserWithoutPassword;
  twoFactorEnabled: boolean;
}

export function AccountInfoCard({
  user,
  twoFactorEnabled,
}: AccountInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin tài khoản</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Vai trò</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Trạng thái 2FA</p>
            <p className="font-medium">
              {twoFactorEnabled ? (
                <span className="text-green-600">Đã bật</span>
              ) : (
                <span className="text-gray-500">Chưa bật</span>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
