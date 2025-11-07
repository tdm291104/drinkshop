"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "sonner";
import { useLayoutStore } from "@/stores/layout.store";
import { useUserStore } from "@/stores/user.store";
import { useCartStore } from "@/stores/cart.store";
import { useNextAuthSync } from "@/hooks/useNextAuthSync";
import { useEffect } from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

function LayoutContent({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const hideHeaderFooter = useLayoutStore((state) => state.hideHeaderFooter);

  const userId = useUserStore((state) => state.user?.id);
  const fetchCart = useCartStore((state) => state.fetchCart);

  // Sync NextAuth with Zustand (this handles initUser internally)
  useNextAuthSync();

  const shouldHideHeaderFooter =
    pathname?.startsWith("/admin") || hideHeaderFooter;

  // Lấy cart khi đã có userId
  useEffect(() => {
    if (userId) {
      fetchCart(userId);
    }
  }, [userId, fetchCart]);

  return (
    <>
      {!shouldHideHeaderFooter && <Header />}
      <Toaster position="top-right" richColors />
      <div className={shouldHideHeaderFooter ? "" : "px-72"}>{children}</div>
      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return <LayoutContent>{children}</LayoutContent>;
}
