/**
 * @jest-environment jsdom
 */
import { renderHook, act, waitFor } from "@testing-library/react";
import axios from "axios";
import { useProducts, useCategories } from "./useProduct";
import { Product } from "@/types/product.types";
import { Category } from "@/types/category.types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useProducts hook", () => {
  const mockProducts: Product[] = [
    {
      id: "1",
      status: "available",
      reviewCount: 5,
      name: "Product 2",
      price: 5000,
      originalPrice: 6000,
      image: "",
      category: "Category 2",
      description: "Description 2",
      rating: 4.0,
      reviews: 50,
      stock: 30,
      features: ["Feature 3", "Feature 4"],
    },
    {
      status: "available",
      reviewCount: 5,
      id: "p2",
      name: "Product 2",
      price: 5000,
      originalPrice: 6000,
      image: "",
      category: "Category 2",
      description: "Description 2",
      rating: 4.0,
      reviews: 50,
      stock: 30,
      features: ["Feature 3", "Feature 4"],
    },
  ];

  it("fetches products correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_BASE}/products`
    );
  });

  it("adds a product correctly", async () => {
    const newProduct = {
      id: "3",
      name: "Product 3",
      price: 300,
      description: "Desc 3",
      categoryId: "cat1",
    };
    mockedAxios.post.mockResolvedValueOnce({ data: newProduct });

    const { result } = renderHook(() => useProducts());

    await act(async () => {
      const added = await result.current.addProduct(newProduct);
      expect(added).toEqual(newProduct);
    });
  });

  it("updates a product correctly", async () => {
    const updatedProduct = {
      id: "1",
      name: "Updated",
      price: 150,
      description: "Updated Desc",
      categoryId: "cat1",
    };
    mockedAxios.put.mockResolvedValueOnce({ data: updatedProduct });

    const { result } = renderHook(() => useProducts());

    await act(async () => {
      const updated = await result.current.updateProduct("1", updatedProduct);
      expect(updated).toEqual(updatedProduct);
    });
  });

  it("deletes a product correctly", async () => {
    const initialProducts = [
      {
        id: "1",
        name: "Product 1",
        price: 100,
        description: "Desc 1",
        category: "cat1",
        status: "available",
        reviewCount: 5,
        originalPrice: 120,
        image: "",
        rating: 4.5,
        reviews: 10,
        stock: 20,
        features: ["Feature A", "Feature B"],
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: initialProducts });
    mockedAxios.delete.mockResolvedValueOnce({});

    const { result } = renderHook(() => useProducts());

    // chờ fetchProducts xong
    await waitFor(() => {
      expect(result.current.products).toEqual(initialProducts);
    });

    // delete
    await act(async () => {
      await result.current.deleteProduct("1");
    });

    expect(result.current.products).toEqual([]);
  });
});

describe("useCategories hook", () => {
  const mockCategories: Category[] = [
    {
      id: "1",
      name: "Category 1",
      slug: "category-1",
      description: "Description 1",
      status: "active",
    },
    {
      id: "2",
      name: "Category 2",
      slug: "category-2",
      description: "Description 2",
      status: "active",
    },
  ];

  it("fetches categories correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockCategories });

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.categories).toEqual(mockCategories);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_BASE}/categories`
    );
  });
});
