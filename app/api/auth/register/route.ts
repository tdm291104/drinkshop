import { NextRequest, NextResponse } from "next/server";
import { publicApi } from "@/lib/api/axios";
import { User, UserResponse } from "@/types/user.types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      receiveNews = false,
    } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== "admin" && role !== "customer") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role. Must be either 'admin' or 'customer'",
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUsers: User[] = await publicApi.get(`/users?email=${email}`);

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const newUser: Partial<User> = {
      email,
      password, // Note: In production, password should be hashed
      firstName,
      lastName,
      avatar: "placeholder/avatar.png",
      role,
      receiveNews,
    };

    // Send POST request to json-server
    const createdUser: User = await publicApi.post("/users", newUser);

    // Return success response (excluding password)
    const { password: _, ...userWithoutPassword } = createdUser;
    const successResponse: UserResponse = {
      success: true,
      data: userWithoutPassword,
      message: "Registration successful",
    };

    return NextResponse.json(successResponse, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
