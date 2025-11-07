import { create } from "zustand";
import { UserWithoutPassword } from "@/types/user.types";
import { getToken, removeToken, setToken } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

interface UserState {
  user: UserWithoutPassword | null;
  setUser: (user: UserWithoutPassword | null) => void;
  clearUser: () => Promise<void>;
  initUser: () => void; // Load từ token khi vào web
  initFromNextAuth: (session: any) => void; // Load từ NextAuth session
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,

  setUser: (user: UserWithoutPassword | null) => {
    set({ user });
    if (user) {
      setToken(user);
    }
  },

  clearUser: async () => {
    removeToken();
    set({ user: null });

    // Also sign out from NextAuth if needed
    try {
      await signOut({ redirect: false });
    } catch (error) {
      toast.error("No NextAuth session to sign out from");
    }
  },

  initUser: () => {
    const userFromToken = getToken();
    if (userFromToken) {
      set({ user: userFromToken });
    }
  },

  // NEW: Initialize from NextAuth session
  initFromNextAuth: (session: any) => {
    if (session?.user) {
      const currentUser = get().user;

      // Prevent infinite updates by checking if user is already set
      if (currentUser && currentUser.id === session.user.id) {
        return;
      }

      const nextAuthUser: UserWithoutPassword = {
        id: session.user.id,
        email: session.user.email!,
        firstName: session.user.name?.split(" ")[0] || "OAuth",
        lastName: session.user.name?.split(" ").slice(1).join(" ") || "User",
        avatar: session.user.image || "placeholder/avatar.png",
        role: session.user.role as "admin" | "customer",
        receiveNews: false,
        twoFactorEnabled: false,
      };
      set({ user: nextAuthUser });
    }
  },
}));
