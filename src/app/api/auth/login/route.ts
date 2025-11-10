import { NextRequest, NextResponse } from "next/server";
import { publicApi } from "@/src/lib/api/axios";
import { User, UserResponse, UserWithoutPassword } from "@/src/types/user.types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    console.log(email, password);

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email and password
    const users = await publicApi.get<User[]>(
      `/users?email=${email}&password=${password}`
    );

    if (!users || !Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user = users[0];

    // Check if user has 2FA enabled
    if (user.twoFactorEnabled) {
      // Send 2FA code but don't log user in yet
      try {
        await fetch(
          `${
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
          }/api/auth/2fa/send-code`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          }
        );

        return NextResponse.json({
          success: true,
          requiresTwoFactor: true,
          email: user.email,
          message: "2FA code sent to your email",
        });
      } catch (error) {
        console.error("Failed to send 2FA code:", error);
        return NextResponse.json(
          { success: false, message: "Failed to send 2FA code" },
          { status: 500 }
        );
      }
    }

    // Normal login (no 2FA)
    const { password: _, ...userWithoutPassword } = user;
    const successResponse: UserResponse = {
      success: true,
      data: userWithoutPassword,
      message: "Login successful",
    };

    return NextResponse.json(successResponse);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
