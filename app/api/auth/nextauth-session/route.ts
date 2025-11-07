import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "No session found" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session.user,
      message: "Session retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting NextAuth session:", error);
    return NextResponse.json({ message: "Session error" }, { status: 500 });
  }
}
