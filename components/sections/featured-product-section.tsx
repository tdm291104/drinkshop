import React from 'react';
import FeaturedProduct from "@/components/products/featured-product";
import FeaturedProductSkeleton from "@/components/products/featured-product-skeleton";

interface FeaturedProductSectionProps {
    product: any;
    backgroundImage?: string;
}

export default function FeaturedProductSection({
    product,
    backgroundImage = "/placeholder.svg?height=600&width=1200",
}: FeaturedProductSectionProps) {
    return (
        <section
            className="py-12 lg:py-16 bg-cover bg-center relative"
            style={{
                backgroundImage: `url('${backgroundImage}')`,
            }}
        >
            <div className="absolute inset-0 bg-black/60" />
            <div className="container mx-auto px-4 relative z-10">
                {product ? (
                    <FeaturedProduct product={product} />
                ) : (
                    <FeaturedProductSkeleton />
                )}
            </div>
        </section>
    );
}
