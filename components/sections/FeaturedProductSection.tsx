import React from 'react';
import FeaturedProduct from "@/components/products/FeaturedProduct";
import FeaturedProductSkeleton from "@/components/products/FeaturedProductSkeleton";
import styles from './FeaturedProductSection.module.css';

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
            className={styles.featuredSection}
            style={{
                backgroundImage: `url('${backgroundImage}')`,
            }}
        >
            <div className={styles.overlay} />
            <div className={styles.container}>
                {product ? (
                    <FeaturedProduct product={product} />
                ) : (
                    <FeaturedProductSkeleton />
                )}
            </div>
        </section>
    );
}
