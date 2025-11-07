import { UserWithoutPassword } from "@/types/user.types";

// Base API call helper
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "API call failed");
  }

  return result;
};

// Forgot Password Service
export const authService = {
  // Send forgot password email
  sendForgotPasswordEmail: async (email: string) => {
    return apiCall("/api/auth/forgot-password", {
      body: JSON.stringify({ email }),
    });
  },

  // Reset password with token
  resetPassword: async (token: string, newPassword: string) => {
    return apiCall("/api/auth/reset-password", {
      body: JSON.stringify({ token, newPassword }),
    });
  },

  // 2FA Services
  twoFactor: {
    // Setup 2FA (enable/disable)
    setup: async (userId: string, enabled: boolean) => {
      return apiCall("/api/auth/2fa/setup", {
        body: JSON.stringify({ userId, enabled }),
      });
    },

    // Send 2FA code to email
    sendCode: async (email: string) => {
      return apiCall("/api/auth/2fa/send-code", {
        body: JSON.stringify({ email }),
      });
    },

    // Verify 2FA code
    verify: async (
      code: string,
      email: string
    ): Promise<{
      success: boolean;
      data: UserWithoutPassword;
      message: string;
    }> => {
      return apiCall("/api/auth/2fa/verify", {
        body: JSON.stringify({ code, email }),
      });
    },
  },
};
