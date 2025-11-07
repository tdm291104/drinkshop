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
    if (!users || !Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const user = users[0];

    // Check if 2FA is enabled
    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { success: false, message: "2FA is not enabled for this user" },
        { status: 400 }
      );
    }

    // Generate 2FA code
    const code = TokenService.generateTwoFactorCode();

    // Save token to database (expires in 5 minutes)
    await TokenService.saveEmailToken(user.id, code, "2fa", email, 5);

    // Send email
    await EmailService.sendTwoFactorCode(email, {
      userName: `${user.firstName} ${user.lastName}`,
      code,
    });

    return NextResponse.json({
      success: true,
      message: "2FA code sent to your email",
    });
  } catch (error) {
    console.error("Send 2FA code error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send 2FA code" },
      { status: 500 }
    );
  }
}
