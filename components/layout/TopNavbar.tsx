"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
import { useUserStore } from "@/stores/user.store";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { ThemeSwitcher } from "@/components/theme";
import { ROUTE_MAP } from "@/constants/route-map";
const commonNavItems = [
  { href: "/account", label: "Tài khoản của tôi" },
  { href: "/account/addresses", label: "Địa chỉ" },
  { href: "/account/orders", label: "Trạng thái đơn hàng" },
  { href: "/account/wishlist", label: "Danh sách ưa thích" },
  { href: "/cart", label: "Giỏ hàng" },
];

const guestNavItems = [
  { href: "/login", label: "Đăng nhập" },
  { href: "/register", label: "Đăng ký" },
];

// Route mappings for smart search
const routeMap = ROUTE_MAP;
const TopNavbar = () => {
  const { user } = useUserStore();
  const { logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();

    // Check if the search query matches any route
    const matchedRoute = routeMap[query as keyof typeof routeMap];

    if (matchedRoute) {
      // Navigate to the matched route
      router.push(matchedRoute);
    } else {
      // Check if there are any products matching the search
      // Import products to check if search has results
      const { products } = require("@/lib/products");
      const hasProductResults = products.some((product: any) =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );

      if (hasProductResults) {
        // If products found, go to product search
        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        // If no products found, go to 404 with search info
        router.push(`/not-found?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }

    // Clear search after navigation
    setSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <nav className="w-full bg-background border-b px-72">
      <div className="flex justify-between items-center h-7 text-xs tracking-tight">
        <div className="flex items-center space-x-6 text-foreground">
          {commonNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ))}
          {user ? (
            <Button
              variant="link"
              className="text-xs p-0 h-auto cursor-pointer text-red-700"
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          ) : (
            guestNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:underline"
              >
                {item.label}
              </Link>
            ))
          )}
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="placeholder:text-xs placeholder:italic placeholder:text-gray-400 border-none focus-visible:ring-0 pr-8 w-48"
              placeholder="Tìm kiếm sản phẩm hoặc điều hướng..."
            />
            <Search
              className="absolute right-2 top-1/2 transform -translate-y-1/2 size-4 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
              onClick={handleSearch}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
