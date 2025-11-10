'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">R</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Rượu</h3>
                                <p className="text-xs text-gray-400">Since 1980</p>
                            </div>
                        </div>
                        <p className="text-gray-300 mb-4">
                            Chuyên cung cấp các loại rượu vang và rượu ngoại cao cấp với chất lượng tuyệt vời và giá cả hợp lý.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-gray-400 hover:text-amber-600 transition-colors">
                                <Facebook size={20} />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-amber-600 transition-colors">
                                <Instagram size={20} />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-amber-600 transition-colors">
                                <Twitter size={20} />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-amber-600 transition-colors">
                                <Youtube size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-300 hover:text-amber-600 transition-colors">
                                    Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-300 hover:text-amber-600 transition-colors">
                                    Sản phẩm
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-300 hover:text-amber-600 transition-colors">
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-300 hover:text-amber-600 transition-colors">
                                    Liên hệ
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-gray-300 hover:text-amber-600 transition-colors">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Product Categories */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Danh mục sản phẩm</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/products?category=ruou-vang" className="text-gray-300 hover:text-amber-600 transition-colors">
                                    Rượu vang
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=ruou-ngoai" className="text-gray-300 hover:text-amber-600 transition-colors">
                                    Rượu ngoại
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=champagne" className="text-gray-300 hover:text-amber-600 transition-colors">
                                    Champagne
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?filter=hot" className="text-gray-300 hover:text-amber-600 transition-colors">
                                    Sản phẩm Hot
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?filter=sale" className="text-gray-300 hover:text-amber-600 transition-colors">
                                    Khuyến mãi
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <MapPin size={16} className="text-amber-600" />
                                <span className="text-gray-300">123 Đường ABC, Quận 1, TP.HCM</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone size={16} className="text-amber-600" />
                                <span className="text-gray-300">1900-1234</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail size={16} className="text-amber-600" />
                                <span className="text-gray-300">info@drinkshop.com</span>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="mt-6">
                            <h5 className="font-semibold mb-2">Đăng ký nhận tin</h5>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-600"
                                />
                                <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-r-md transition-colors">
                                    Đăng ký
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © 2024 Drink Shop. Tất cả quyền được bảo lưu.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link href="/privacy" className="text-gray-400 hover:text-amber-600 text-sm transition-colors">
                                Chính sách bảo mật
                            </Link>
                            <Link href="/terms" className="text-gray-400 hover:text-amber-600 text-sm transition-colors">
                                Điều khoản sử dụng
                            </Link>
                            <Link href="/shipping" className="text-gray-400 hover:text-amber-600 text-sm transition-colors">
                                Chính sách vận chuyển
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
