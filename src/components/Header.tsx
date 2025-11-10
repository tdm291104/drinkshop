'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigationItems = [
        { label: 'Trang chủ', href: '/' },
        { label: 'Sản phẩm', href: '/products' },
        { label: 'Rượu vang', href: '/products?category=ruou-vang' },
        { label: 'Rượu ngoại', href: '/products?category=ruou-ngoai' },
        { label: 'Hot Trend', href: '/products?filter=hot' },
        { label: 'Giới thiệu', href: '/about' },
        { label: 'Liên hệ', href: '/contact' },
    ];

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            {/* Top Bar */}
            <div className="bg-amber-600 text-white py-2">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center text-sm">
                        <div>Hotline: 1900-1234 | Email: info@drinkshop.com</div>
                        <div className="hidden md:flex items-center space-x-4">
                            <Link href="/account" className="hover:underline">Tài khoản</Link>
                            <Link href="/account/orders" className="hover:underline">Đơn hàng</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl">R</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Rượu</h1>
                            <p className="text-xs text-gray-500">Since 1980</p>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                            <Button className="absolute right-0 top-0 h-full px-6 bg-amber-600 hover:bg-amber-700 rounded-r-lg rounded-l-none">
                                <Search size={20} />
                            </Button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Wishlist */}
                        <Button variant="ghost" size="icon" className="relative">
                            <Heart size={24} />
                            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                0
                            </Badge>
                        </Button>

                        {/* Cart */}
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart size={24} />
                            <Badge className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                0
                            </Badge>
                        </Button>

                        {/* User Account */}
                        <Button variant="ghost" size="icon">
                            <User size={24} />
                        </Button>

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden mt-4">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                        <Button className="absolute right-0 top-0 h-full px-4 bg-amber-600 hover:bg-amber-700 rounded-r-lg rounded-l-none">
                            <Search size={18} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className={`bg-gray-50 border-t ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
                <div className="container mx-auto px-4">
                    <ul className="flex flex-col md:flex-row md:items-center md:space-x-8 py-4">
                        {navigationItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    href={item.href}
                                    className="block py-2 px-4 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
