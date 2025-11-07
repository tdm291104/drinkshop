import { useState } from "react";
import { publicApi } from "@/lib/api/axios";
import { User } from "@/types/user.types";

interface ChangePasswordData {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

interface UseChangePassword {
  loading: boolean;
  error: string | null;
  changePassword: (data: ChangePasswordData) => Promise<void>;
}

export const useChangePassword = (): UseChangePassword => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = async (data: ChangePasswordData) => {
    try {
      setLoading(true);
      setError(null);

      // Get current user data (with password) directly from API
      const response = await publicApi.get<User>(`/users/${data.userId}`);

      // Handle response structure (same logic as useAccount.ts)
      let currentUser: User;
      if (response && typeof response === "object" && "data" in response) {
        // Response is full Axios response object
        currentUser = response.data as User;
      } else {
        // Response is already the data (interceptor worked)
        currentUser = response as User;
      }

      if (
        !currentUser ||
        typeof currentUser !== "object" ||
        !currentUser.email
      ) {
        throw new Error("Không thể lấy thông tin người dùng");
      }

      // Verify current password
      if (currentUser.password !== data.currentPassword) {
        throw new Error("Mật khẩu hiện tại không đúng");
      }

      // Update password directly via API
      const updatedUser = {
        ...currentUser,
        password: data.newPassword,
      };

      await publicApi.put(`/users/${data.userId}`, updatedUser);

      // Success - no need to return anything, just complete
    } catch (err: any) {
      const message = err.message || "Đổi mật khẩu thất bại";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    changePassword,
  };
};
