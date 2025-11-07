import { useState, useEffect } from 'react';
import { Product } from '@/types/product.types';
import { User } from '@/types/user.types';

interface Favorite {
    id: string;
    userId: number;
    productId: string;
}

async function getCurrentUser(): Promise<User | null> {
    try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}

export function useWishlist() {
    const [userId, setUserId] = useState<number | null>(null);
    const [products, setProducts] = useState<Product[] | null>(null);
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;


    useEffect(() => {
        fetchCurrentUserAndWishlist();
    }, []);

    const fetchCurrentUserAndWishlist = async () => {
        try {
            setLoading(true);
            const user = await getCurrentUser();

            if (user) {
                const uid = Number(user.id);
                setUserId(uid);
                setIsAuthenticated(true);
                await fetchWishlist(uid);
            } else {
                setIsAuthenticated(false);
                setUserId(null);
                setProducts([]);
            }
        } catch (error) {
            console.error('Error in fetchCurrentUserAndWishlist:', error);
            setError('Không thể tải thông tin user');
        } finally {
            setLoading(false);
        }
    };

    const fetchWishlist = async (uid: number) => {
        try {
            const favoritesRes = await fetch(`${API_BASE}/favorites?userId=${uid}`);
            if (!favoritesRes.ok) {
                throw new Error(`Failed to fetch favorites: ${favoritesRes.status}`);
            }

            const favoritesData = await favoritesRes.json();
            setFavorites(favoritesData);

            if (favoritesData.length === 0) {
                setProducts([]);
                return;
            }

            const productIds = favoritesData.map((fav: Favorite) => fav.productId);
            const productsRes = await fetch(`${API_BASE}/products`);
            if (!productsRes.ok) {
                throw new Error(`Failed to fetch products: ${productsRes.status}`);
            }

            const allProducts = await productsRes.json();
            const favProducts = allProducts.filter((p: Product) =>
                productIds.includes(String(p.id))
            );
            setProducts(favProducts);

        } catch (error) {
            console.error('Error fetching wishlist:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        }
    };

    const removeFromWishlist = async (favoriteId: string) => {
        try {
            const response = await fetch(`${API_BASE}/favorites/${favoriteId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
                const updatedFavorites = favorites.filter(fav => fav.id !== favoriteId);
                const updatedProductIds = updatedFavorites.map(fav => fav.productId);
                setProducts(prev => prev?.filter(p => updatedProductIds.includes(String(p.id))) || []);
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const addToWishlist = async (productId: string) => {
        if (!userId) {
            throw new Error('User not authenticated');
        }

        try {
            const response = await fetch('${API_BASE}/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    productId
                }),
            });

            if (response.ok) {
                // Refresh wishlist
                await fetchWishlist(userId);
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            throw error;
        }
    };

    const addToCart = async (productId: string) => {
        if (!userId) {
            throw new Error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
        }

        try {
            const response = await fetch('${API_BASE}/carts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    productId,
                    quantity: 1
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    const isProductInWishlist = (productId: string) => {
        return favorites.some(fav => fav.productId === productId);
    };

    return {
        userId,
        products,
        favorites,
        loading,
        error,
        isAuthenticated,
        removeFromWishlist,
        addToWishlist,
        addToCart,
        isProductInWishlist,
        refetch: fetchCurrentUserAndWishlist
    };
}