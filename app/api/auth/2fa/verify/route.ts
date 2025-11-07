import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "@/lib/tokenService";
import { UserWithoutPassword } from "@/types/user.types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, email } = body;

    // Validate required fields
    if (!code || !email) {
      return NextResponse.json(
        { success: false, message: "Code and email are required" },
        { status: 400 }
      );
    }

    // Verify token
    const verification = await TokenService.verifyAndUseToken(
      code,
      "2fa",
      email
    );

    if (!verification.valid) {
      let message = "Invalid 2FA code";
      if (verification.expired) {
        message = "2FA code has expired";
      } else if (verification.used) {
        message = "2FA code has already been used";
      }

      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    // Get user data (without password)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/users/${verification.userId}`
    );
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    const userData = await response.json();

    // Remove password from response
    const { password, ...userWithoutPassword } = userData;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword as UserWithoutPassword,
      message: "2FA verification successful",
    });
  } catch (error) {
    console.error("2FA verification error:", error);
    return NextResponse.json(
      { success: false, message: "2FA verification failed" },
      { status: 500 }
    );
  }
}
