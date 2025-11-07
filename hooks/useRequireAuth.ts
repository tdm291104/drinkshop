"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/utils";
import { toast } from "sonner";

export const useRequireAuth = () => {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.info("Bạn cần đăng nhập để truy cập trang này.");
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  return ready;
};
