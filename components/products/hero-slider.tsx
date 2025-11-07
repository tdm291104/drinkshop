"use client";

import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { getSlides, type Slide } from "@/lib/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroSlider() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [api, setApi] = useState<any>(null);

    // Fetch slides data
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                setLoading(true);
                const data = await getSlides();
                setSlides(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch slides:", err);
                setError("Không thể tải dữ liệu slider. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, []);

    // Update current slide when API changes slide
    useEffect(() => {
        if (!api) {
            return;
        }

        const onSelect = () => {
            setCurrentSlide(api.selectedScrollSnap());
        };

        api.on("select", onSelect);
        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || !api || slides.length === 0) return;

        const interval = setInterval(() => {
            api.scrollNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, slides.length, api]);

    const goToSlide = (index: number) => {
        if (api) {
            api.scrollTo(index);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="relative w-full h-[70vh] md:h-[80vh] lg:h-screen bg-gray-100">
                <Skeleton className="w-full h-full" />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="relative w-full h-[70vh] md:h-[80vh] lg:h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center p-8">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Lỗi
                    </h2>
                    <p className="text-gray-700">{error}</p>
                </div>
            </div>
        );
    }

    // No slides
    if (slides.length === 0) {
        return (
            <div className="relative w-full h-[70vh] md:h-[80vh] lg:h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center p-8">
                    <h2 className="text-2xl font-bold mb-4">
                        Không có dữ liệu
                    </h2>
                    <p className="text-gray-700">Không tìm thấy slider nào.</p>
                </div>
            </div>
        );
    }

    return (
        <Carousel
            className="w-full h-[70vh] md:h-[80vh] lg:h-screen"
            opts={{
                loop: true,
                align: "start",
                skipSnaps: false,
                inViewThreshold: 0,
                dragFree: false,
                duration: 25,
            }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            setApi={setApi}
        >
            <CarouselContent>
                {slides.map((slide: Slide) => (
                    <CarouselItem key={slide.id} className="relative h-full">
                        <div className="relative w-full h-[70vh] md:h-[80vh] lg:h-screen">
                            <Image
                                src={slide.image || "/placeholder.svg"}
                                alt={slide.title}
                                fill
                                priority={slide.id === slides[0].id}
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30" />
                            <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
                                <div className="max-w-4xl px-4">
                                    <div className="mb-6 lg:mb-8">
                                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-serif italic mb-4 animate-fade-in-up">
                                            {slide.title}
                                        </h1>
                                        <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl font-serif italic animate-fade-in-up animation-delay-300">
                                            {slide.subtitle}
                                        </h2>
                                        <div className="mt-6 lg:mt-8 animate-fade-in-up animation-delay-600">
                                            <Button
                                                className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg transition-all duration-300 hover:scale-105"
                                                asChild
                                            >
                                                <a href={slide.buttonLink}>
                                                    {slide.buttonText}
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            {/* Custom Navigation Arrows */}
            <div className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20">
                <CarouselPrevious
                    variant="outline"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-none h-10 w-10 md:h-12 md:w-12 text-white"
                >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                </CarouselPrevious>
            </div>

            <div className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20">
                <CarouselNext
                    variant="outline"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-none h-10 w-10 md:h-12 md:w-12 text-white"
                >
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </CarouselNext>
            </div>

            {/* Custom Dots Indicator */}
            <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                {slides.map((slide: Slide, index: number) => (
                    <button
                        key={slide.id}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${index === currentSlide
                                ? "bg-yellow-600 scale-125"
                                : "bg-white/50 hover:bg-white/75"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </Carousel>
    );
}
