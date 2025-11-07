import React from 'react';
import Image from 'next/image';
import GallerySkeleton from "@/components/products/gallery-skeleton";

interface GallerySectionProps {
    gallery: any[];
}

export default function GallerySection({
    gallery,
}: GallerySectionProps) {
    return (
        <section className="py-12 lg:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Gallery Grid với layout tùy chỉnh */}
                {gallery.length > 0 ? (
                    <div className="grid grid-cols-12 grid-rows-4 gap-2 h-[600px] lg:h-[800px]">
                        {gallery.map((image) => (
                            <div key={image.id} className={image.gridClass}>
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={image.width}
                                    height={image.height}
                                    className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <GallerySkeleton />
                )}
            </div>
        </section>
    );
}
