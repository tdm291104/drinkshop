import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "@/lib/tokenService";
import { publicApi } from "@/lib/api/axios";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const { token, newPassword } = validation.data;

    // Verify reset token
    const verification = await TokenService.verifyAndUseToken(token, "reset");

    if (!verification.valid) {
      let message = "Invalid or expired reset token";
      if (verification.expired) {
        message = "Reset token has expired";
      } else if (verification.used) {
        message = "Reset token has already been used";
      }

      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    // Update user password (plain text for now - no bcrypt per requirements)
    await publicApi.patch(`/users/${verification.userId}`, {
      password: newPassword,
    });

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset password" },
      { status: 500 }
    );
  }
}
