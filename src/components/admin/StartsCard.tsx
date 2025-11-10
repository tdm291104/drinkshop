import { ReactNode } from "react";

export interface StatItem {
    icon: ReactNode;
    value: string | number;
    label: string;
    loading?: boolean;
}

interface StatsCardProps {
    stats: StatItem[];
}

export const StatsCard = ({ stats }: StatsCardProps) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((item, index) => (
            <div
                key={index}
                className="bg-white p-4 rounded shadow flex flex-col items-center justify-center text-center"
            >
                {item.icon}
                <p className={`text-2xl font-bold ${item.loading ? "animate-pulse" : ""}`}>
                    {item.value}
                </p>
                <p className="text-gray-600">{item.label}</p>
            </div>
        ))}
    </div>
);
