import { useState, useEffect } from "react";
import axios from "axios";

interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  totalComments: number;
}

interface ChartData {
  labels: string[];
  revenue: number[];
  orders: number[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersResponse, ordersResponse, commentsResponse] =
        await Promise.all([
          axios.get(`${API_BASE_URL}/users`), //bỏ catch. nếu ko thì error luôn null
          axios.get(`${API_BASE_URL}/orders`),
          axios.get(`${API_BASE_URL}/reviews`),
        ]);

      const users = usersResponse.data;
      const orders = ordersResponse.data;
      const comments = commentsResponse.data;

      const totalUsers = users.length;
      const totalOrders = orders.length;
      const totalRevenue = orders
        .filter((order: any) => order.status === "Đã hoàn thành")
        .reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);

      const totalComments = comments.length;
      setStats({
        totalUsers,
        totalRevenue,
        totalOrders,
        totalComments,
      });

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date;
      });

      const labels = last7Days.map(
        (date) => `${date.getDate()}/${date.getMonth() + 1}`
      );

      const revenue: number[] = [];
      const orderCounts: number[] = [];

      last7Days.forEach((date) => {
        const dateStr = date.toISOString().split("T")[0];
        const dayOrders = orders.filter((order: any) => {
          if (!order.orderDate) return false;
          const orderDate = new Date(order.orderDate)
            .toISOString()
            .split("T")[0];
          return orderDate === dateStr && order.status === "Đã hoàn thành";
        });

        const dayRevenue = dayOrders.reduce(
          (sum: number, order: any) => sum + (order.totalPrice || 0),
          0
        );

        revenue.push(dayRevenue);
        orderCounts.push(dayOrders.length);
      });

      setChartData({
        labels,
        revenue,
        orders: orderCounts,
      });
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    stats,
    chartData,
    loading,
    error,
    refreshData: fetchDashboardData,
  };
};
