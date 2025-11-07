import { NextRequest, NextResponse } from "next/server";
import { publicApi } from "@/lib/api/axios";
import { User } from "@/types/user.types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, enabled } = body;

    // Validate required fields
    if (!userId || typeof enabled !== "boolean") {
      return NextResponse.json(
        { success: false, message: "User ID and enabled status are required" },
        { status: 400 }
      );
    }

    // Get current user
    const user = await publicApi.get<User>(`/users/${userId}`);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Update 2FA status
    const updatedUser = await publicApi.patch(`/users/${userId}`, {
      twoFactorEnabled: enabled,
    });

    return NextResponse.json({
      success: true,
      data: {
        twoFactorEnabled: enabled,
      },
      message: enabled ? "2FA đã được bật" : "2FA đã được tắt",
    });
  } catch (error) {
    console.error("2FA setup error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
