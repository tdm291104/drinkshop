import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface TwoFactorEmailData {
  userName: string;
  code: string;
}

interface ResetPasswordEmailData {
  userName: string;
  resetLink: string;
}

export class EmailService {
  private static async getTransporter() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  static async sendTwoFactorCode(to: string, data: TwoFactorEmailData) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background-color: #8B0000; color: #fff; padding: 20px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .code { font-size: 32px; font-weight: bold; color: #8B0000; text-align: center; 
                   background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Wine House</h1>
            </div>
            <div class="content">
              <h2>Mã xác thực 2FA</h2>
              <p>Xin chào <strong>${data.userName}</strong>,</p>
              <p>Mã xác thực hai yếu tố của bạn là:</p>
              <div class="code">${data.code}</div>
              <p>Mã này có hiệu lực trong <strong>5 phút</strong>.</p>
              <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
            </div>
            <div class="footer">
              <p>© 2025 Wine House. All right reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail({
      to,
      subject: "Wine House - Mã xác thực 2FA",
      html,
    });
  }

  static async sendResetPasswordLink(to: string, data: ResetPasswordEmailData) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background-color: #8B0000; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .button { display: inline-block; background-color: #8B0000; color: white; 
                     padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Wine House</h1>
            </div>
            <div class="content">
              <h2>Đặt lại mật khẩu</h2>
              <p>Xin chào <strong>${data.userName}</strong>,</p>
              <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
              <p>Nhấp vào liên kết bên dưới để đặt lại mật khẩu:</p>
              <div style="text-align: center;">
                <a href="${data.resetLink}" class="button">Đặt lại mật khẩu</a>
              </div>
              <p>Liên kết này có hiệu lực trong <strong>15 phút</strong>.</p>
              <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            </div>
            <div class="footer">
              <p>© 2024 Wine House. Tất cả quyền được bảo lưu.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail({
      to,
      subject: "Wine House - Đặt lại mật khẩu",
      html,
    });
  }

  private static async sendEmail(options: EmailOptions) {
    try {
      const transporter = await this.getTransporter();
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Wine House" <noreply@winehouse.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      // Gmail always sends real emails to actual inboxes
      return {
        success: true,
        messageId: info.messageId,
        emailSent: true,
      };
    } catch (error) {
      throw new Error(
        `Failed to send email: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Test function để kiểm tra kết nối SMTP
  static async testConnection() {
    try {
      // Debug environment variables
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;

      if (!user || !pass) {
        return {
          success: false,
          message: `Missing credentials - USER: ${
            user ? "SET" : "MISSING"
          }, PASS: ${pass ? "SET" : "MISSING"}`,
        };
      }

      const transporter = await this.getTransporter();
      await transporter.verify();
      return { success: true, message: "SMTP connection successful" };
    } catch (error) {
      return {
        success: false,
        message: `SMTP connection failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }
}
