import { useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Order } from '@/types/order.types';
import { User } from '@/types/user.types';
import { addNotification } from '@/utils/api/notification.api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

const apiService = {
    fetchOrders: async (): Promise<Order[]> => {
        const { data } = await axios.get(`${API_BASE_URL}/orders`);
        return data;
    },

    fetchUsers: async (): Promise<User[]> => {
        const { data } = await axios.get(`${API_BASE_URL}/users`);
        return data;
    },

    fetchAddresses: async (): Promise<Address[]> => {
        const { data } = await axios.get(`${API_BASE_URL}/addresses`);
        return data;
    },

    updateOrderStatus: async (orderId: string, newStatus: string): Promise<void> => {
        await axios.patch(`${API_BASE_URL}/orders/${orderId}`, {
            status: newStatus,
            updatedAt: new Date().toISOString(),
        });
    }
};

export interface Address {
    id: string;
    address: string;
    city: string;
    country: string;
    phone: string;
}

export const useOrderManagement = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const usersMap = useMemo(() => {
        return new Map(users.map(user => [user.id, user]));
    }, [users]);

    const addressesMap = useMemo(() => {
        return new Map(addresses.map(address => [address.id, address]));
    }, [addresses]);

    const loadInitialData = useCallback(async () => {
        try {
            setIsLoadingOrders(true);
            setError(null);

            const [ordersData, usersData, addressesData] = await Promise.all([
                apiService.fetchOrders(),
                apiService.fetchUsers(),
                apiService.fetchAddresses(),
            ]);

            setOrders(ordersData);
            setUsers(usersData);
            setAddresses(addressesData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
            setError(`Lỗi khi tải dữ liệu: ${errorMessage}`);
            console.error('Load initial data error:', err);
        } finally {
            setIsLoadingOrders(false);
        }
    }, []);

    const updateOrderStatus = useCallback(async (orderId: string, newStatus: string) => {
        try {
            await apiService.updateOrderStatus(orderId, newStatus);

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
                        : order
                )
            );

            const order = orders.find(o => o.id === orderId);
            if (order) {
                await addNotification(
                    order.userId,
                    `Cập nhật đơn hàng #${orderId}`,
                    `Trạng thái đơn hàng của bạn đã được cập nhật thành: ${newStatus}`,
                    `/orders/${orderId}`
                );
            }

            toast.success(`Cập nhật trạng thái đơn hàng #${orderId} thành công!`, {
                description: `Trạng thái đã được thay đổi thành: ${newStatus}`,
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định';
            setError(`Lỗi khi cập nhật trạng thái đơn hàng: ${errorMessage}`);
            toast.error('Cập nhật trạng thái thất bại!', {
                description: errorMessage,
            });
            await loadInitialData();
        }
    }, [loadInitialData, orders]);

    return {
        orders,
        usersMap,
        addressesMap,
        isLoadingOrders,
        error,
        loadInitialData,
        updateOrderStatus
    };
};
