import { useState } from "react";
import { privateApi, publicApi } from "@/lib/api/axios";
import { User, UserWithoutPassword } from "@/types/user.types";
import { useUserStore } from "@/stores/user.store";

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  receiveNews?: boolean;
}

export const useAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser, setUser } = useUserStore();

  const getUserById = async (
    userId: string | number
  ): Promise<UserWithoutPassword | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await publicApi.get<User>(`/users/${userId}`);

      // Extract data from response (handle both intercepted and non-intercepted cases)
      let userData: User;
      if (response && typeof response === "object" && "data" in response) {
        // Response is full Axios response object
        userData = response.data as User;
      } else {
        // Response is already the data (interceptor worked)
        userData = response as User;
      }

      // Validate that we have a valid user object
      if (!userData || typeof userData !== "object" || !userData.email) {
        throw new Error("Invalid user data received");
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = userData;

      return userWithoutPassword;
    } catch (err: any) {
      const message = err.message || "Failed to fetch user";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (
    userId: string | number,
    data: UpdateUserData
  ): Promise<UserWithoutPassword | null> => {
    try {
      setLoading(true);
      setError(null);

      // Get current user data first
      const currentResponse = await publicApi.get<User>(`/users/${userId}`);
      let currentData: User;
      if (
        currentResponse &&
        typeof currentResponse === "object" &&
        "data" in currentResponse
      ) {
        currentData = currentResponse.data as User;
      } else {
        currentData = currentResponse as User;
      }

      // Merge current data with updates
      const updatedData = {
        ...currentData,
        ...data,
      };

      const updateResponse = await publicApi.put<User>(
        `/users/${userId}`,
        updatedData
      );
      let updatedUser: User;
      if (
        updateResponse &&
        typeof updateResponse === "object" &&
        "data" in updateResponse
      ) {
        updatedUser = updateResponse.data as User;
      } else {
        updatedUser = updateResponse as User;
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;

      // If updating current user, update context
      if (currentUser && currentUser.id === userId) {
        setUser(userWithoutPassword);
      }

      return userWithoutPassword;
    } catch (err: any) {
      const message = err.message || "Failed to update user";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getUserById,
    updateUser,
    loading,
    error,
  };
};
