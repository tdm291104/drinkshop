import {
  getAbout,
  getBestSellers,
  getFeatured,
  getGallery,
  getNewProducts,
  getRecentBlogPosts,
  getTestimonials,
} from "@/lib/api";
import AboutSection from "@/components/sections/AboutSection";
import FeaturedProductSection from "@/components/sections/FeaturedProductSection";
import NewProductsSection from "@/components/sections/NewProductsSection";
import GallerySection from "@/components/sections/GallerySection";
import BestSellersSection from "@/components/sections/BestSellersSection";
import BlogSection from "@/components/sections/BlogSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import ProductCompareButton from "@/components/ProductCompareButton";

export default async function HomePage() {
  // Fetch data in parallel
  const [newProducts, bestSellers, blogPosts, testimonials, about, featured] =
    await Promise.all([
      getNewProducts().catch(() => []),
      getBestSellers().catch(() => []),
      getRecentBlogPosts().catch(() => []),
      getTestimonials().catch(() => []),
      getAbout().catch(() => ({
        title: "GIỚI THIỆU",
        content:
          "Chào mừng đến với DinkShop - nơi cung cấp những chai rượu vang tuyệt hảo từ khắp nơi trên thế giới.",
        image: "/Image_Rudu/df3218bb45274009c6c3d5de8a6b98bf.jpg",
      })),
      getFeatured().catch(() => null),
      getGallery().catch(() => []),
    ]);

  // Fetch gallery data separately
  const galleryData = await getGallery().catch(() => []);

  return (
    <div className="min-h-screen bg-white">
      <AboutSection about={about} />
      <FeaturedProductSection product={featured} />
      <NewProductsSection products={newProducts} />
      <GallerySection gallery={galleryData} />
      <BestSellersSection products={bestSellers} />
      <BlogSection posts={blogPosts} />
      <TestimonialSection testimonials={testimonials} />
      <ProductCompareButton />
    </div>
  );
}
