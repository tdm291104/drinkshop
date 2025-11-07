import { NextRequest, NextResponse } from "next/server";
import { publicApi } from "@/lib/api/axios";
import { User } from "@/types/user.types";
import { EmailService } from "@/lib/email";
import { TokenService } from "@/lib/tokenService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const users = await publicApi.get<User[]>(`/users?email=${email}`);

    // Always return success to prevent email enumeration
    // Don't reveal if email exists or not
    if (!users || !Array.isArray(users) || users.length === 0) {
      return NextResponse.json({
        success: true,
        message:
          "If your email exists in our system, you will receive a password reset link",
      });
    }

    const user = users[0];

    // Generate reset token (expires in 15 minutes)
    const resetToken = TokenService.generateResetToken();

    // Save token to database
    await TokenService.saveEmailToken(user.id, resetToken, "reset", email, 15);

    // Create reset link
    const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

    // Send email
    await EmailService.sendResetPasswordLink(email, {
      userName: `${user.firstName} ${user.lastName}`,
      resetLink,
    });

    return NextResponse.json({
      success: true,
      message:
        "If your email exists in our system, you will receive a password reset link",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    // Always return success to prevent information disclosure
    return NextResponse.json({
      success: true,
      message:
        "If your email exists in our system, you will receive a password reset link",
    });
  }
}
