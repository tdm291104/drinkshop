import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CiMenuBurger } from "react-icons/ci";
import {
    FaHome,
    FaPlus,
    FaUser,
    FaShoppingCart,
} from "react-icons/fa";
import { IconType } from "react-icons";

interface MenuItem {
    icon: IconType;
    text: string;
    href: string;
}

const menuItems: MenuItem[] = [
    {
        icon: FaHome,
        text: "Dashboard",
        href: "/admin",
    },
    {
        icon: FaPlus,
        text: "Thêm sản phẩm",
        href: "/admin/add-product",
    },
    {
        icon: FaUser,
        text: "Thêm người dùng",
        href: "/admin/users",
    },
    {
        icon: FaShoppingCart,
        text: "Quản lý đơn hàng",
        href: "/admin/orders",
    },
    {
        icon: FaPlus,
        text: "Thêm slider",
        href: "/admin/add-slider",
    },
];

export function AdminSidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 text-gray-600 p-2 hover:bg-gray-200 rounded bg-white shadow-md"
                onClick={toggleSidebar}
                aria-label="Open sidebar"
            >
                <CiMenuBurger className="text-2xl" />
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 z-40
                        transform transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                        md:translate-x-0`}
            >
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Drinkshop</h2>
                    <Button
                        variant="ghost"
                        className="md:hidden text-white p-2 hover:bg-gray-700 rounded"
                        onClick={toggleSidebar}
                        aria-label="Close sidebar"
                    >
                        <span className="text-red-500">✕</span>
                    </Button>
                </div>
                <nav>
                    <ul>
                        {menuItems.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <li key={index} className="mb-2">
                                    <Link
                                        href={item.href}
                                        className={`flex items-center p-3 hover:bg-gray-700 rounded transition-colors duration-200 ${isActive ? "bg-gray-700" : ""
                                            }`}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <Icon className="mr-2" />
                                        {item.text}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                />
            )}
        </>
    );
}
