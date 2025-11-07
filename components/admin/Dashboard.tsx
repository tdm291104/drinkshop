import { useState, useMemo } from "react";
import Head from "next/head";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { FaUser, FaShoppingCart, FaComment, FaSync } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency } from "@/utils/format.currency";
import { RevenueChart } from "./RevenueChart";
import { StatsCard, StatItem } from "./StartsCard";
import { ExportData } from "./ExportData";
import AdminPageLayout from '@/components/layout/AdminPageLayout';

export default function Dashboard() {
  const router = useRouter();
  const { stats, chartData, loading, error, refreshData } = useDashboard();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const dashboardStats: StatItem[] = useMemo(
    () => [
      {
        icon: <FaUser className="text-2xl" />,
        value: loading ? "..." : formatNumber(stats?.totalUsers || 0),
        label: "Người dùng",
        loading,
      },
      {
        icon: <FaMoneyBill1Wave className="text-2xl" />,
        value: loading ? "..." : formatCurrency(stats?.totalRevenue || 0),
        label: "Tổng doanh thu",
        loading,
      },
      {
        icon: <FaShoppingCart className="text-2xl" />,
        value: loading ? "..." : formatNumber(stats?.totalOrders || 0),
        label: "Số lượng đơn hàng",
        loading,
      },
      {
        icon: <FaComment className="text-2xl" />,
        value: loading ? "..." : formatNumber(stats?.totalComments || 0),
        label: "Số bình luận",
        loading,
      },
    ],
    [loading, stats]
  );

  const handleAddProduct = useMemo(
    () => () => {
      router.push("/admin/add-product");
    },
    [router]
  );

  if (error) {
    return (
      <AdminPageLayout>
        <div className="flex min-h-screen bg-gray-100 items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Lỗi tải dữ liệu
            </h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <Button
              onClick={refreshData}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <FaSync className="mr-2" />
              Thử lại
            </Button>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout>
      <Head>
        <title>Dashboard - Drinkshop</title>
      </Head>
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <ExportData loading={loading} />
            <Button
              onClick={refreshData}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <FaSync className={`mr-2 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </Button>
            <div className="flex items-center">
              <RiAdminLine className="text-2xl text-gray-600 mr-2" />
              <span className="text-gray-700">Admin</span>
              <span className="text-green-500 ml-2">Online</span>
            </div>
          </div>
        </header>

        <main className="p-6 overflow-auto">
          <StatsCard stats={dashboardStats} />
          <RevenueChart chartData={chartData || {}} loading={loading} />
        </main>
      </div>
    </AdminPageLayout>
  );
}
