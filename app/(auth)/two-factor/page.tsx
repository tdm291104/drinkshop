"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormLabel } from "@/components/ui/form-label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUserStore } from "@/stores/user.store";
import { setToken } from "@/lib/utils";
import { authService } from "@/services/authService";
import { AuthLayout } from "@/components/auth";

const twoFactorSchema = z.object({
  code: z.string().length(6, "Mã xác thực phải có 6 số"),
});

type FormValues = z.infer<typeof twoFactorSchema>;

export default function TwoFactorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const email = searchParams.get("email");

  const form = useForm<FormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
  }, [email, router]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const onSubmit = async (data: FormValues) => {
    if (!email) return;

    try {
      setLoading(true);
      setError(null);

      const result = await authService.twoFactor.verify(data.code, email);

      // Login successful
      setToken(result.data);
      setUser(result.data);

      // Redirect based on user role
      if (result.data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Xác thực thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email || resendCooldown > 0) return;

    try {
      setResendLoading(true);
      setError(null);

      await authService.twoFactor.sendCode(email);
      setResendCooldown(60); // 60 seconds cooldown
    } catch (err: any) {
      setError(err.message || "Không thể gửi lại mã");
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null; // Will redirect
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Xác thực hai bước
          </CardTitle>
          <CardDescription>
            Chúng tôi đã gửi mã xác thực 6 số đến email: <br />
            <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Mã xác thực</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nhập 6 số"
                        maxLength={6}
                        className="text-center text-lg tracking-widest"
                        autoComplete="one-time-code"
                        inputMode="numeric"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Đang xác thực..." : "Xác thực"}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">Không nhận được mã?</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={resendLoading || resendCooldown > 0}
                    onClick={handleResendCode}
                  >
                    {resendCooldown > 0
                      ? `Gửi lại sau ${resendCooldown}s`
                      : resendLoading
                      ? "Đang gửi..."
                      : "Gửi lại mã"}
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push("/login")}
                >
                  ← Quay lại đăng nhập
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
