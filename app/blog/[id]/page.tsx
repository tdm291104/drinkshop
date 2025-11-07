import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

import { getBlogPostById, getAllBlogPosts } from "@/lib/api"
import CommentsSection from "./commentSection"
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent"
import SocialShare from "@/components/blog/SocialShare"
import BlogMeta from "@/components/blog/BlogMeta"
import BackButton from "@/components/blog/BackButton"
import BlogContent from "@/components/blog/BlogContent"

// Tạo các tham số tĩnh cho trang
export async function generateStaticParams() {
    try {
        const posts = await getAllBlogPosts()
        return posts.map((post) => ({
            id: post.id.toString(),
        }))
    } catch (error) {
        console.error("Error generating static params for blog posts:", error)
        return []
    }
}

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
    try {
        const post = await getBlogPostById(Number.parseInt(params.id))

        // Tạo mảng breadcrumb items
        const breadcrumbItems = [
            { label: "Trang chủ", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title }
        ];

        return (
            <div className="min-h-screen bg-white">
                {/* Breadcrumb */}
                <div className="bg-gray-50 py-4">
                    <div className="container mx-auto px-4">
                        <BreadcrumbComponent items={breadcrumbItems} />
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6 lg:py-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Button */}
                        <div className="mb-6">
                            <BackButton href="/blog" text="Quay lại Blog" />
                        </div>

                        {/* Blog Header */}
                        <div className="mb-6 lg:mb-8">
                            <h1 className="text-2xl lg:text-3xl font-bold mb-4">{post.title}</h1>
                            <BlogMeta
                                date={post.date}
                                author={post.author}
                                views={post.views}
                                category={post.category}
                                className="mb-4 lg:mb-6"
                            />
                        </div>

                        {/* Featured Image */}
                        <div className="mb-6 lg:mb-8">
                            <Image
                                src={post.image || "/placeholder.svg"}
                                alt={post.title}
                                width={800}
                                height={450}
                                className="w-full h-auto rounded-lg shadow-lg"
                            />
                        </div>

                        {/* Blog Content */}
                        <BlogContent content={post.content} />

                        {/* Social Share */}
                        <SocialShare title="Chia sẻ bài viết:" />

                        <CommentsSection />

                        {/* Back to Blog */}
                        <BackButton href="/blog" text="Quay lại Blog" className="mt-6" />
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        console.error("Error fetching blog post:", error)
        notFound()
    }
}
