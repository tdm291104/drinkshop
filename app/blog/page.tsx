
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Eye } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

import { getAllBlogPosts } from "@/lib/api"
import type { BlogPost } from "@/lib/api"
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent"
import BlogCardSkeleton from "@/components/products/BlogCardSkeleton"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import "./blog.css"
import CustomPagination from "@/components/pagination/CustomPagination"
export default async function BlogPage() {
    // Fetch blog posts với try-catch để xử lý lỗi
    let blogPosts: BlogPost[] = []
    try {
        blogPosts = await getAllBlogPosts()
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu bài viết:", error)
        // Fallback về mảng rỗng khi có lỗi
        blogPosts = []
    }

    return (
        <div className="flex flex-col min-h-screen bg-white blog-page">
            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4 w-full">
                <div className="container mx-auto px-4">
                    <BreadcrumbComponent
                        items={[
                            { label: "Trang chủ", href: "/" },
                            { label: "Blog" }, // current page, no href
                        ]}
                    />
                </div>
            </div>

            <div className="container mx-auto px-4">
                <h2 className="text-lg font-bold mb-4 mt-4">
                    BLOG
                    <Image
                        src="/Image_Rudu/titleleft-dark.png"
                        alt="arrow-trang-tri"
                        width={50}
                        height={20}
                    />
                </h2>
            </div>

            {/* Hero Section */}
            <div className="w-full flex-1">
                <div className="container mx-auto px-4">
                    <div className="relative rounded-lg overflow-hidden">
                        <Image
                            src="/Image_Rudu/slide-1.jpg"
                            alt="anh-banner"
                            width={1920}
                            height={400}
                            className="w-full h-auto object-cover max-h-[400px]"
                        />
                    </div>
                </div>


                <div className="container mx-auto px-4 py-6 lg:py-8">
                    <div className="text-center mb-8 lg:mb-12">
                        <h2 className="text-2xl lg:text-3xl font-bold mb-4">TIN TỨC & BÀI VIẾT</h2>
                        <Image
                            src="/Image_Rudu/title-dark.png"
                            alt="trang-tri"
                            width={250}
                            height={30}
                            className="mx-auto"
                        />
                    </div>
                </div>


                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                        {blogPosts.length > 0
                            ? blogPosts.map((post) => (
                                <Card key={post.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                                    <div className="relative">
                                        <Image
                                            src={post.image || "/placeholder.svg"}
                                            alt={post.title}
                                            width={400}
                                            height={250}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <Badge className="absolute top-4 left-4 bg-yellow-500 text-black text-xs">{post.category}</Badge>
                                    </div>
                                    <CardContent className="p-4 lg:p-6">
                                        <Link href={`/blog/${post.id}`}>
                                            <h3 className="font-bold text-base lg:text-lg mb-3 group-hover:text-yellow-600 transition-colors line-clamp-2 cursor-pointer">
                                                {post.title}
                                            </h3>
                                        </Link>

                                        <div className="flex flex-wrap items-center text-xs lg:text-sm text-gray-500 mb-3 gap-2 lg:gap-4">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                                                <span>{new Date(post.date).toLocaleDateString("vi-VN")}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <User className="w-3 h-3 lg:w-4 lg:h-4" />
                                                <span>{post.author}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                                                <span>{post.views}</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>

                                        <Link
                                            href={`/blog/${post.id}`}
                                            className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                                        >
                                            Đọc thêm
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))
                            : // Skeleton loading for blog posts
                            Array(6)
                                .fill(0)
                                .map((_, i) => (
                                    <BlogCardSkeleton key={i} />
                                ))}
                    </div>

                    {/* Pagination */}
                    <CustomPagination />
                </div>
            </div>
        </div>
    )
}
