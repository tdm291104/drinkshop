import { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatCurrency } from "@/utils/format.currency";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface RevenueChartProps {
    chartData: {
        labels?: string[];
        revenue?: number[];
        orders?: number[];
    };
    loading: boolean;
}

export const RevenueChart = ({ chartData, loading }: RevenueChartProps) => {
    const chartDataConfig = useMemo(
        () => ({
            labels: chartData?.labels || [],
            datasets: [
                {
                    label: "Doanh thu (VND)",
                    data: chartData?.revenue || [],
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    fill: true,
                    tension: 0.4,
                    yAxisID: "y",
                },
                {
                    label: "Số lượng đơn hàng",
                    data: chartData?.orders || [],
                    borderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    fill: true,
                    tension: 0.4,
                    yAxisID: "y1",
                },
            ],
        }),
        [chartData]
    );

    const chartOptions = {
        responsive: true,
        interaction: {
            mode: "index" as const,
            intersect: false,
        },
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Doanh thu và Số lượng đơn hàng (7 ngày gần nhất)",
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: "Ngày",
                },
            },
            y: {
                type: "linear" as const,
                display: true,
                position: "left" as const,
                title: {
                    display: true,
                    text: "Doanh thu (VND)",
                },
                ticks: {
                    callback: function (value: unknown) {
                        return formatCurrency(value as number);
                    },
                },
            },
            y1: {
                type: "linear" as const,
                display: true,
                position: "right" as const,
                title: {
                    display: true,
                    text: "Số đơn hàng",
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4 text-center">
                Biểu đồ Doanh thu và Đơn hàng
            </h2>
            {loading ? (
                <div className="h-64 w-full flex items-center justify-center">
                    <div className="animate-pulse text-gray-500">Đang tải dữ liệu...</div>
                </div>
            ) : (
                <div className="h-64 w-full flex items-center justify-center">
                    <Line data={chartDataConfig} options={chartOptions} />
                </div>
            )}
        </div>
    );
};
