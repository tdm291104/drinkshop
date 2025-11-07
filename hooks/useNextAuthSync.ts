"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/stores/user.store";

/**
 * Hook để sync NextAuth session với Zustand store
 * Sử dụng trong app layout hoặc root component
 */
export function useNextAuthSync() {
  const { data: session, status } = useSession();
  const initFromNextAuth = useUserStore((state) => state.initFromNextAuth);
  const initUser = useUserStore((state) => state.initUser);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    // Priority 1: NextAuth session
    if (status === "authenticated" && session?.user && session.user.id) {
      // Only sync if user is different or doesn't exist
      if (!user || user.id !== session.user.id) {
        console.log("Syncing NextAuth session to Zustand");
        initFromNextAuth(session);
      }
    }
    // Priority 2: Traditional cookie session (fallback)
    else if (status === "unauthenticated" && !user) {
      console.log("Loading traditional session to Zustand");
      initUser();
    }
  }, [session?.user?.id, status, user?.id]); // Only depend on IDs and status

  return { session, status, user };
}
