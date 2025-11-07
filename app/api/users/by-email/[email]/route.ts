import { NextResponse } from "next/server";
import { publicApi } from "@/lib/api/axios";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const resolvedParams = await params;
    const email = decodeURIComponent(resolvedParams.email);

    // Get all users and find by email
    const response = await publicApi.get("/users");
    const users = response.data || response;

    const user = Array.isArray(users)
      ? users.find((u: any) => u.email === email)
      : null;

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Get user by email error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
