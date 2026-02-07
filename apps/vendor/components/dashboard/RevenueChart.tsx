"use client";

import { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { formatCurrency, Card } from "@zora/ui-web";
import { useVendorStats } from "../../hooks";
import { useAuth } from "../../hooks";

export function RevenueChart() {
    const { vendor } = useAuth();
    const { data: stats } = useVendorStats(vendor?.id ?? null);

    // Mock data for weekly trend if real historical data isn't available in stats
    // Ideally, we would fetch historical data from a separate endpoint
    const data = useMemo(() => {
        // Generate mock trend based on current revenue
        // This is a placeholder until we have a proper analytics endpoint
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const baseRevenue = (stats?.weeklyRevenue || 0) / 7;

        return days.map((day) => ({
            name: day,
            value: Math.max(0, baseRevenue + (Math.random() - 0.5) * baseRevenue * 0.5),
        }));
    }, [stats?.weeklyRevenue]);

    return (
        <Card className="h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
                    <p className="text-sm text-gray-500">Weekly earnings performance</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(stats?.weeklyRevenue || 0)}
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                        Based on this week
                    </p>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickFormatter={(value) => `£${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }}
                            formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#22c55e"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
