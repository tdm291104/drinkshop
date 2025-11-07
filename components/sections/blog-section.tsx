import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BlogCardSkeleton from "@/components/products/blog-card-skeleton";

interface BlogSectionProps {
    posts: any[];
    title?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonLink?: string;
}

export default function BlogSection({
    posts,
    title = "TIN TỨC & BLOG",
    imageUrl = "/Image_Rudu/title-dark.png",
    buttonText = "XEM TẤT CẢ BÀI VIẾT",
    buttonLink = "/blog",
}: BlogSectionProps) {
    return (
        <section className="py-12 lg:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 lg:mb-12">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                        {title}
                    </h2>
                    <Image
                        className="block mx-auto"
                        alt="Decorative title image"
                        src={imageUrl}
                        width={200}
                        height={20}
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {posts.length > 0
                        ? posts.map((post) => (
                            <Card
                                key={post.id}
                                className="overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <Image
                                    src={post.image || "/placeholder.svg"}
                                    alt={post.title}
                                    width={400}
                                    height={250}
                                    className="w-full h-48 object-cover"
                                />
                                <CardContent className="p-4 lg:p-6">
                                    <Link href={`/blog/${post.id}`}>
                                        <h3 className="font-bold text-lg mb-2 hover:text-yellow-600 transition-colors cursor-pointer">
                                            {post.title}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <Link
                                        href={`/blog/${post.id}`}
                                        className="text-yellow-600 hover:underline text-sm"
                                    >
                                        Đọc thêm
                                    </Link>
                                </CardContent>
                            </Card>
                        ))
                        : // Skeleton loading for blog posts
                        Array(2).fill(0).map((_, i) => (
                            <BlogCardSkeleton key={i} />
                        ))}
                </div>
                <div className="text-center mt-8">
                    <Link href={buttonLink}>
                        <Button
                            variant="outline"
                            className="bg-transparent"
                        >
                            {buttonText}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
