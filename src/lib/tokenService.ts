import { nanoid } from "nanoid";
import { publicApi } from "./api/axios";

export interface EmailToken {
  id: string;
  userId: string;
  token: string;
  type: "2fa" | "reset";
  email: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}

export class TokenService {
  /**
   * Sinh mã số ngẫu nhiên cho 2FA (6 chữ số)
   */
  static generateTwoFactorCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Sinh token ngẫu nhiên cho reset password
   */
  static generateResetToken(): string {
    return nanoid(32); // 32 characters random string
  }

  /**
   * Lưu token vào database
   */
  static async saveEmailToken(
    userId: string,
    token: string,
    type: "2fa" | "reset",
    email: string,
    expiryMinutes: number = 5
  ): Promise<EmailToken> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiryMinutes * 60 * 1000);

    const tokenData: Omit<EmailToken, "id"> = {
      userId,
      token,
      type,
      email,
      expiresAt: expiresAt.toISOString(),
      used: false,
      createdAt: now.toISOString(),
    };

    try {
      // Xóa token cũ chưa sử dụng của user này (cùng type)
      await this.cleanupUserTokens(userId, type);

      // Tạo token mới
      const response: any = await publicApi.post("/emailTokens", tokenData);
      return (response.data || response) as EmailToken;
    } catch (error) {
      throw new Error(
        `Failed to save token: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Verify và sử dụng token
   */
  static async verifyAndUseToken(
    token: string,
    type: "2fa" | "reset",
    email?: string
  ): Promise<{
    valid: boolean;
    userId?: string;
    expired?: boolean;
    used?: boolean;
  }> {
    try {
      // Tìm token
      const response: any = await publicApi.get(
        `/emailTokens?token=${token}&type=${type}`
      );
      const tokens = (response.data || response) as EmailToken[];

      if (!tokens || tokens.length === 0) {
        return { valid: false };
      }

      const emailToken = tokens[0];

      // Kiểm tra email nếu được provide
      if (email && emailToken.email !== email) {
        return { valid: false };
      }

      // Kiểm tra đã sử dụng
      if (emailToken.used) {
        return { valid: false, used: true };
      }

      // Kiểm tra hết hạn
      const now = new Date();
      const expiresAt = new Date(emailToken.expiresAt);
      if (now > expiresAt) {
        return { valid: false, expired: true };
      }

      // Token hợp lệ - đánh dấu đã sử dụng
      await publicApi.patch(`/emailTokens/${emailToken.id}`, {
        used: true,
        usedAt: now.toISOString(),
      });

      return { valid: true, userId: emailToken.userId };
    } catch (error) {
      throw new Error(
        `Failed to verify token: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Tìm token hợp lệ của user
   */
  static async findValidToken(
    userId: string,
    type: "2fa" | "reset"
  ): Promise<EmailToken | null> {
    try {
      const response: any = await publicApi.get(
        `/emailTokens?userId=${userId}&type=${type}&used=false`
      );
      const tokens = (response.data || response) as EmailToken[];

      if (!tokens || tokens.length === 0) {
        return null;
      }

      // Tìm token chưa hết hạn
      const now = new Date();
      const validToken = tokens.find((token) => {
        const expiresAt = new Date(token.expiresAt);
        return now <= expiresAt;
      });

      return validToken || null;
    } catch (error) {
      throw new Error(
        `Failed to find token: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Xóa token cũ chưa sử dụng của user
   */
  static async cleanupUserTokens(
    userId: string,
    type: "2fa" | "reset"
  ): Promise<void> {
    try {
      const response: any = await publicApi.get(
        `/emailTokens?userId=${userId}&type=${type}&used=false`
      );
      const tokens = (response.data || response) as EmailToken[];

      if (tokens && tokens.length > 0) {
        // Xóa tất cả token cũ
        await Promise.all(
          tokens.map((token) => publicApi.delete(`/emailTokens/${token.id}`))
        );
      }
    } catch (error) {
      // Không throw error cho cleanup - log thôi
      console.warn("Failed to cleanup tokens:", error);
    }
  }

  /**
   * Xóa tất cả token hết hạn (cleanup job)
   */
  static async cleanupExpiredTokens(): Promise<number> {
    try {
      const response: any = await publicApi.get("/emailTokens");
      const allTokens = (response.data || response) as EmailToken[];

      if (!allTokens || allTokens.length === 0) {
        return 0;
      }

      const now = new Date();
      const expiredTokens = allTokens.filter((token) => {
        const expiresAt = new Date(token.expiresAt);
        return now > expiresAt;
      });

      if (expiredTokens.length > 0) {
        await Promise.all(
          expiredTokens.map((token) =>
            publicApi.delete(`/emailTokens/${token.id}`)
          )
        );
      }

      return expiredTokens.length;
    } catch (error) {
      console.warn("Failed to cleanup expired tokens:", error);
      return 0;
    }
  }
}
