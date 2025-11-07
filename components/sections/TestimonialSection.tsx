import React from 'react';
import Image from "next/image";
import TestimonialCard from "@/components/products/TestimonialCard";
import TestimonialSkeleton from "@/components/products/TestimonialSkeleton";

interface TestimonialSectionProps {
    testimonials: any[];
    title?: string;
    imageUrl?: string;
}

export default function TestimonialSection({
    testimonials,
    imageUrl = "/Image_Rudu/title-dark.png",
    title = "KHÁCH HÀNG NÓI GÌ",
}: TestimonialSectionProps) {
    return (
        <section className="py-12 lg:py-16">
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
                {testimonials.length > 0 ? (
                    <TestimonialCard testimonial={testimonials[0]} />
                ) : (
                    <TestimonialSkeleton />
                )}
            </div>
        </section>
    );
}
