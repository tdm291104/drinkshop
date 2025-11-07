"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/user.store";
import { useAccount } from "@/hooks/useAccount";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shield, Mail } from "lucide-react";
import { toast, Toaster } from "sonner";
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent";
import Image from "next/image";
import titleleftdark from "@/public/Image_Rudu/titleleft-dark.png";
import { authService } from "@/services/authService";
import { PasswordManagementCard, AccountInfoCard } from "@/components/security";

export default function SecurityPage() {
  const user = useUserStore((state) => state.user);
  const { getUserById, updateUser } = useAccount();
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  // Load user details
  useEffect(() => {
    if (user?.id) {
      const loadUserDetails = async () => {
        try {
          const details = await getUserById(user.id);
          if (details) {
            setUserDetails(details);
            setTwoFactorEnabled(details.twoFactorEnabled || false);
          }
        } catch (error) {
          toast.error("Lỗi khi tải thông tin tài khoản");
        }
      };
      loadUserDetails();
    }
  }, [user?.id, getUserById]);

  const handleToggle2FA = async (enabled: boolean) => {
    if (!user?.id) return;

    try {
      setLoading(true);

      await authService.twoFactor.setup(user.id, enabled);

      setTwoFactorEnabled(enabled);
      toast.success(
        enabled
          ? "Xác thực hai bước đã được bật thành công!"
          : "Xác thực hai bước đã được tắt thành công!"
      );

      // Update user details
      if (userDetails) {
        setUserDetails({
          ...userDetails,
          twoFactorEnabled: enabled,
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Có lỗi xảy ra");
      // Revert the switch
      setTwoFactorEnabled(!enabled);
    } finally {
      setLoading(false);
    }
  };

  const sendTestCode = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);

      await authService.twoFactor.sendCode(user.email);
      toast.success("Mã test đã được gửi đến email của bạn!");
    } catch (err: any) {
      toast.error(err.message || "Không thể gửi mã test");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Vui lòng đăng nhập để truy cập trang này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Toaster position="top-right" richColors />
      <BreadcrumbComponent
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Tài khoản của tôi", href: "/account" },
          { label: "Cài đặt bảo mật" },
        ]}
      />

      <div className="my-6">
        <h1 className="text-2xl font-semibold mb-2">CÀI ĐẶT BẢO MẬT</h1>
        <Image src={titleleftdark} alt="Underline" width={70} height={20} />
      </div>

      <div className="space-y-6">
        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>Xác thực hai bước (2FA)</CardTitle>
                <CardDescription>
                  Tăng cường bảo mật tài khoản với mã xác thực qua email
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Bật xác thực hai bước</p>
                  <p className="text-sm text-gray-600">
                    Mã xác thực sẽ được gửi đến email: {user.email}
                  </p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={handleToggle2FA}
                  disabled={loading}
                />
              </div>

              {twoFactorEnabled && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Khi đăng nhập, bạn sẽ nhận mã xác thực qua email
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={sendTestCode}
                    disabled={loading}
                  >
                    {loading ? "Đang gửi..." : "Gửi mã test"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Password Security */}
        <PasswordManagementCard userId={user.id} userEmail={user.email} />

        {/* Account Info */}
        <AccountInfoCard user={user} twoFactorEnabled={twoFactorEnabled} />
      </div>
    </div>
  );
}
