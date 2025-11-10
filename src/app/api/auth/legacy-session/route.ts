import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userSession = request.cookies.get("user_session");

    if (!userSession) {
      return NextResponse.json(
        { message: "No user session found" },
        { status: 401 }
      );
    }

    const user = JSON.parse(decodeURIComponent(userSession.value));

    return NextResponse.json({
      data: user,
    });
  } catch (error) {
    console.error("Error parsing user session:", error);
    return NextResponse.json(
      { message: "Invalid user session" },
      { status: 401 }
    );
  }
}
