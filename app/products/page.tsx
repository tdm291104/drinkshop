"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent";
import { products } from "@/lib/products";
import styles from "./products.module.css";
import CustomPagination from "@/components/pagination/CustomPagination";
import ProductSidebar from "@/components/products/ProductSidebar";
import ProductToolbar from "@/components/products/ProductToolbar";
import ProductGrid from "@/components/products/ProductGrid";
import ProductCompareButton from "@/components/ProductCompareButton";
import ProductEmptyState from "@/components/products/ProductEmptyState";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [urlSearchQuery, setUrlSearchQuery] = useState<string>(""); // Separate state for URL search
  const itemsPerPage = 6;

  // Set category and search from URL params when component mounts
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const searchFromUrl = searchParams.get("search");

    if (categoryFromUrl) {
      setSelectedCategory(decodeURIComponent(categoryFromUrl));
    }

    if (searchFromUrl) {
      setUrlSearchQuery(decodeURIComponent(searchFromUrl)); // Set URL search but don't populate input
    } else {
      setUrlSearchQuery(""); // Clear URL search if no param
    }
  }, [searchParams]);

  // Reset current page when search query or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, urlSearchQuery, selectedCategory]);

  const categories = [
    { name: "Tất cả", value: "all", count: products.length },
    {
      name: "Rượu Vang Đỏ",
      value: "Rượu Vang Đỏ",
      count: products.filter((p) => p.category === "Rượu Vang Đỏ").length,
    },
    {
      name: "Rượu Vang Trắng",
      value: "Rượu Vang Trắng",
      count: products.filter((p) => p.category === "Rượu Vang Trắng").length,
    },
    {
      name: "Champagne",
      value: "Champagne",
      count: products.filter((p) => p.category === "Champagne").length,
    },
    {
      name: "Rượu Vang Rosé",
      value: "Rượu Vang Rosé",
      count: products.filter((p) => p.category === "Rượu Vang Rosé").length,
    },
    {
      name: "Rượu Vang Ngọt",
      value: "Rượu Vang Ngọt",
      count: products.filter((p) => p.category === "Rượu Vang Ngọt").length,
    },
  ];

  const tags = [
    "Rượu Ngoại",
    "Tết",
    "Phụ kiện",
    "Cao cấp",
    "Giá tốt",
    "Ấn tượng",
    "Thơm ngon",
    "Tết mới",
    "Đặc biệt",
  ];

  // Filter, search, and sort products with useMemo
  const activeSearchQuery = searchQuery.trim() || urlSearchQuery.trim();
  const filteredProducts = useMemo(() => {
    let result =
      selectedCategory === "all"
        ? products
        : products.filter((product) => product.category === selectedCategory);

    if (activeSearchQuery !== "") {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(activeSearchQuery.toLowerCase())
      );
    }

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, activeSearchQuery, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Prepare breadcrumb items
  const breadcrumbItems: Array<{ label: string; href?: string }> = [
    { label: "Trang chủ", href: "/" },
  ];

  if (selectedCategory !== "all") {
    // Khi có category được chọn, "Sản phẩm" là link và category là trang hiện tại
    breadcrumbItems.push({ label: "Sản phẩm", href: "/products" });
    breadcrumbItems.push({ label: selectedCategory });
  } else {
    // Khi không có category (all), "Sản phẩm" là trang hiện tại
    breadcrumbItems.push({ label: "Sản phẩm" });
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <BreadcrumbComponent items={breadcrumbItems} />
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative overflow-hidden">
        <Image
          src="/Image_Rudu/slide-3.jpg"
          alt="Banner rượu vang cao cấp"
          width={800}
          height={400}
          className={styles.heroBanner}
        />
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <ProductSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            tags={tags}
          />

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <ProductToolbar
              totalProducts={filteredProducts.length}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              <ProductGrid products={currentProducts} viewMode={viewMode} />
            ) : (
              <ProductEmptyState
                activeSearchQuery={activeSearchQuery}
                setSearchQuery={setSearchQuery}
                setUrlSearchQuery={setUrlSearchQuery}
                setCurrentPage={setCurrentPage}
              />
            )}

            {/* Pagination */}
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      <ProductCompareButton />
    </div>
  );
}
