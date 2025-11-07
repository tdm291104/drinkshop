import { NextRequest, NextResponse } from "next/server";
import { EmailService } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    // Test SMTP connection
    const connectionTest = await EmailService.testConnection();
    if (!connectionTest.success) {
      return NextResponse.json(
        {
          success: false,
          message: "SMTP connection failed",
          error: connectionTest.message,
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, type = "2fa" } = body;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    if (type === "2fa") {
      // Test 2FA email
      const result = await EmailService.sendTwoFactorCode(email, {
        userName: "Test User",
        code: "123456",
      });

      return NextResponse.json({
        success: true,
        message: `Test 2FA email sent to ${email}`,
        messageId: (result as any).messageId,
        instructions: "Check your email inbox to view the email",
      });
    } else if (type === "reset") {
      // Test reset password email
      const result = await EmailService.sendResetPasswordLink(email, {
        userName: "Test User",
        resetLink: `${process.env.APP_URL}/reset-password?token=test-token-123`,
      });

      return NextResponse.json({
        success: true,
        message: `Test reset password email sent to ${email}`,
        messageId: (result as any).messageId,
        instructions: "Check your email inbox to view the email",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email type. Use 'tfa' or 'reset'",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
