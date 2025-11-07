"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Share2, ShoppingCart, Plus, Minus } from "lucide-react";

import { getProductById, getAllProducts, getBestSellers } from "@/lib/api";
import type { Product as ApiProduct } from "@/lib/api";
import { Product as CartProduct } from "@/types/product.types";
import ProductCard from "@/components/products/ProductCard";
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent";
import SocialShare from "@/components/blog/SocialShare";
import { useAddToCart } from "@/hooks/useAddToCart";
import ProductCompareButton from "@/components/ProductCompareButton";

export default function ProductDetailPageClient() {
  const params = useParams();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product data
        const productData = await getProductById(params.id as string);
        setProduct(productData);

        // Fetch related products
        try {
          const related = await getBestSellers();
          setRelatedProducts(related);
        } catch (relatedError) {
          console.error("Lỗi khi lấy sản phẩm liên quan:", relatedError);
          setRelatedProducts([]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product as unknown as CartProduct);
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Sản phẩm", href: "/products" },
    {
      label: product.category,
      href: `/products?category=${encodeURIComponent(product.category)}`,
    },
    { label: product.name }, // current page, no href
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
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {[product.image, product.image, product.image, product.image].map(
                (image, index) => (
                  <button
                    key={index}
                    className={`w-16 h-16 lg:w-20 lg:h-20 border-2 rounded-lg overflow-hidden flex-shrink-0 ${
                      index === 0 ? "border-yellow-500" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </button>
                )
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 lg:space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                {product.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4 space-y-2 sm:space-y-0">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-yellow-500 text-base lg:text-lg ${
                        i < product.rating ? "" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-gray-500 ml-2">
                    ({product.reviews} đánh giá)
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  | Thêm đánh giá của bạn
                </span>
              </div>
              <div className="flex items-center space-x-4 mb-4 lg:mb-6">
                <span className="text-2xl lg:text-3xl font-bold text-yellow-600">
                  {product.price.toLocaleString("vi-VN")}
                </span>
                <span className="text-base lg:text-lg">đ</span>
                {product.originalPrice && (
                  <span className="text-base lg:text-lg text-gray-500 line-through">
                    {product.originalPrice.toLocaleString("vi-VN")}đ
                  </span>
                )}
              </div>
            </div>

            {/* Product Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  MÀU SẮC
                </label>
                <div className="flex space-x-2">
                  <button
                    className="w-8 h-8 rounded-full bg-red-600 border-2 border-gray-800"
                    aria-label="Red wine"
                  />
                  <button
                    className="w-8 h-8 rounded-full bg-yellow-100 border-2 border-gray-300"
                    aria-label="White wine"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  KÍCH CỠ
                </label>
                <select className="w-full sm:w-32 border border-gray-300 rounded-md p-2">
                  <option value="750ml">750ml</option>
                  <option value="1 Lít">1 Lít</option>
                  <option value="1.5 Lít">1.5 Lít</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  SỐ LƯỢNG
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-3"
                      onClick={decreaseQuantity}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 border-x border-gray-300">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-3"
                      onClick={increaseQuantity}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 px-6 py-3"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    THÊM VÀO GIỎ HÀNG
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2 bg-transparent"
              >
                <Heart className="w-4 h-4" />
                <span>Thêm vào yêu thích</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2 bg-transparent"
              >
                <Share2 className="w-4 h-4" />
                <span>So sánh sản phẩm</span>
              </Button>
              <Button variant="outline" className="bg-transparent">
                Chia sẻ qua Email
              </Button>
            </div>

            {/* Product Description */}
            <div>
              <h3 className="font-semibold mb-2">MÔ TẢ SẢN PHẨM</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Social Share - Replace with SocialShare component */}
            <SocialShare title="Chia sẻ sản phẩm:" className="pt-4 border-t" />
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-8 lg:mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description" className="text-xs lg:text-sm">
              ĐẶC ĐIỂM NỔI BẬT
            </TabsTrigger>
            <TabsTrigger value="specifications" className="text-xs lg:text-sm">
              THÔNG TIN SẢN PHẨM
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs lg:text-sm">
              ĐÁNH GIÁ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4 text-sm lg:text-base">
                Dòng sản phẩm rượu vang đỏ này được sản xuất từ những cây nho
                tốt nhất, qua quá trình lên men tự nhiên và ủ trong thùng gỗ sồi
                cao cấp. Sản phẩm có màu đỏ ruby đậm đà, hương thơm phức hợp của
                các loại trái cây chín mọng và gia vị tinh tế.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4 text-sm lg:text-base">
                Vị rượu cân bằng giữa độ chua và độ ngọt tự nhiên, với hậu vị
                kéo dài và đầy ấn tượng. Thích hợp thưởng thức cùng các món thịt
                đỏ, phô mai hoặc chocolate đen.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm lg:text-base">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <div>
                <h4 className="font-semibold mb-4">Thông tin chi tiết</h4>
                <table className="w-full text-sm">
                  <tbody className="space-y-2">
                    <tr className="border-b">
                      <td className="py-2 font-medium">Thương hiệu</td>
                      <td className="py-2">DinkShop Collection</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Xuất xứ</td>
                      <td className="py-2">
                        {product.features[0]?.split(": ")[1] ||
                          "Không xác định"}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Loại nho</td>
                      <td className="py-2">Cabernet Sauvignon</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Năm sản xuất</td>
                      <td className="py-2">2020</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Độ cồn</td>
                      <td className="py-2">
                        {product.features[1]?.split(": ")[1] || "13.5%"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Hướng dẫn bảo quản</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Bảo quản ở nhiệt độ 12-15°C</li>
                  <li>• Tránh ánh sáng trực tiếp</li>
                  <li>• Để chai nằm ngang</li>
                  <li>• Độ ẩm 70-75%</li>
                  <li>• Tránh rung động</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h4 className="font-semibold">Đánh giá khách hàng</h4>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent"
                >
                  Viết đánh giá
                </Button>
              </div>

              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2 space-y-2 sm:space-y-0">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-500">
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="font-medium">Nguyễn Văn A</span>
                    <span className="text-sm text-gray-500">2 ngày trước</span>
                  </div>
                  <p className="text-gray-700 text-sm lg:text-base">
                    Sản phẩm rất tốt, hương vị đậm đà và thơm ngon. Giao hàng
                    nhanh chóng và đóng gói cẩn thận.
                  </p>
                </div>

                <div className="border-b pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2 space-y-2 sm:space-y-0">
                    <div className="flex">
                      {[...Array(4)].map((_, i) => (
                        <span key={i} className="text-yellow-500">
                          ★
                        </span>
                      ))}
                      <span className="text-gray-300">★</span>
                    </div>
                    <span className="font-medium">Trần Thị B</span>
                    <span className="text-sm text-gray-500">1 tuần trước</span>
                  </div>
                  <p className="text-gray-700 text-sm lg:text-base">
                    Rượu có vị ngon, phù hợp với giá tiền. Sẽ mua lại lần sau.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div>
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-bold mb-4">
              SẢN PHẨM LIÊN QUAN
            </h2>
            <Image
              className="block mx-auto"
              alt="Hinhf anh"
              src="/Image_Rudu/title-dark.png"
              width={200}
              height={20}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {relatedProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
      <ProductCompareButton />
    </div>
  );
}
