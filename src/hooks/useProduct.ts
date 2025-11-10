import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Product } from '@/types/product.types';
import { Category } from '@/types/category.types';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/products`);
            setProducts(response.data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err);
            } else {
                setError(new Error('An unknown error occurred'));
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const addProduct = useCallback(async (product: Partial<Product>) => {
        try {
            const response = await axios.post(`${API_BASE}/products`, product);
            setProducts((prev) => [...prev, response.data]);
            return response.data;
        } catch (err) {
            console.error('Error adding product:', err);
            throw err;
        }
    }, []);

    const updateProduct = useCallback(async (id: string, product: Partial<Product>) => {
        try {
            const response = await axios.put(`${API_BASE}/products/${id}`, product);
            setProducts((prev) =>
                prev.map((p) => (String(p.id) === id ? { ...response.data, id } : p))
            );
            return response.data;
        } catch (err) {
            console.error('Error updating product:', err);
            throw err;
        }
    }, []);

    const deleteProduct = useCallback(async (id: string) => {
        try {
            await axios.delete(`${API_BASE}/products/${id}`);
            setProducts((prev) => prev.filter((p) => String(p.id) !== id));
        } catch (err) {
            console.error('Error deleting product:', err);
            throw err;
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts: fetchProducts,
    };
};

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_BASE}/categories`);
                setCategories(response.data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error('An unknown error occurred'));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return {
        categories,
        loading,
        error,
    };
};
