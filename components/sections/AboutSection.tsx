import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";

interface AboutSectionProps {
    about: {
        title: string;
        content: string;
        image: string;
    };
    imageUrl?: string;
    buttonText?: string;
    buttonLink?: string;
}

export default function AboutSection({
    about,
    imageUrl = "/Image_Rudu/title-dark.png",
    buttonText = "ĐỌC THÊM",
    buttonLink = "/gioi-thieu",
}: AboutSectionProps) {
    return (
        <section className="py-12 lg:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 lg:mb-12">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-1">
                        {about.title}
                    </h2>
                    <Image
                        className="block mx-auto"
                        alt="Decorative title image"
                        src={imageUrl}
                        width={200}
                        height={20}
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <Image
                            src={
                                "/Image_Rudu/df3218bb45274009c6c3d5de8a6b98bf.jpg"
                            }
                            alt="Wine grapes"
                            width={600}
                            height={400}
                            className="rounded-lg w-full h-[300px] object-contain"
                        />
                    </div>
                    <div className="order-1 md:order-2">
                        <p className="text-gray-700 leading-relaxed mb-6 text-sm lg:text-base">
                            {about.content}
                        </p>
                        <Link href={buttonLink}>
                            <Button className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto">
                                {buttonText}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
