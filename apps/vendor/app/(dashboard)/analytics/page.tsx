"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    TrendUp,
    TrendDown,
    CurrencyDollar,
    ShoppingCart,
    Users,
    Package,
    ArrowUpRight,
    Calendar,
} from "@phosphor-icons/react";
import { Header } from "../../../components/Header";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    Badge,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    StatsCard,
    formatCurrency,
    staggerContainer,
    staggerItem,
} from "@zora/ui-web";

// Mock analytics data
const revenueData = [
    { month: "Jan", revenue: 4200, orders: 89 },
    { month: "Feb", revenue: 5100, orders: 112 },
    { month: "Mar", revenue: 4800, orders: 98 },
    { month: "Apr", revenue: 6200, orders: 145 },
    { month: "May", revenue: 7100, orders: 167 },
    { month: "Jun", revenue: 6800, orders: 156 },
];

const topProducts = [
    { name: "Premium Suya Spice Mix", sales: 234, revenue: 2103.66, trend: 12 },
    { name: "Nigerian Palm Oil (1L)", sales: 189, revenue: 2362.50, trend: 8 },
    { name: "Jollof Rice Seasoning", sales: 312, revenue: 1712.88, trend: 15 },
    { name: "Dried Stockfish", sales: 156, revenue: 3898.44, trend: -3 },
    { name: "Egusi Seeds (500g)", sales: 98, revenue: 685.02, trend: 5 },
];

const customerStats = {
    totalCustomers: 1247,
    newThisMonth: 89,
    returningRate: 67,
    avgOrderValue: 34.50,
};

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("30d");

    const stats = [
        {
            title: "Total Revenue",
            value: formatCurrency(34100),
            change: 12,
            icon: CurrencyDollar,
            iconColor: "text-green-600",
            iconBgColor: "bg-green-100",
        },
        {
            title: "Total Orders",
            value: "767",
            change: 8,
            icon: ShoppingCart,
            iconColor: "text-blue-600",
            iconBgColor: "bg-blue-100",
        },
        {
            title: "Products Sold",
            value: "989",
            change: 15,
            icon: Package,
            iconColor: "text-purple-600",
            iconBgColor: "bg-purple-100",
        },
        {
            title: "Unique Customers",
            value: "423",
            change: -2,
            icon: Users,
            iconColor: "text-orange-600",
            iconBgColor: "bg-orange-100",
        },
    ];

    return (
        <>
            <Header title="Analytics" description="Track your store performance" />

            <div className="p-8">
                {/* Time Range Selector */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-40">
                            <Calendar size={16} weight="duotone" className="mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                            <SelectItem value="12m">Last 12 months</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Stats Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {stats.map((stat) => (
                        <motion.div key={stat.title} variants={staggerItem}>
                            <StatsCard {...stat} />
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Revenue Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Revenue Overview</CardTitle>
                                    <Badge variant="success" className="gap-1">
                                        <TrendUp size={12} weight="duotone" />
                                        +12% vs last period
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Simple bar chart visualization */}
                                <div className="h-64 flex items-end justify-between gap-4 pt-8">
                                    {revenueData.map((data, index) => (
                                        <motion.div
                                            key={data.month}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(data.revenue / 8000) * 100}%` }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="flex-1 flex flex-col items-center"
                                        >
                                            <div
                                                className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg relative group cursor-pointer hover:from-primary-dark hover:to-primary transition-colors"
                                                style={{ height: "100%" }}
                                            >
                                                {/* Tooltip */}
                                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    <p className="font-semibold">{formatCurrency(data.revenue)}</p>
                                                    <p className="text-gray-400 text-xs">{data.orders} orders</p>
                                                </div>
                                            </div>
                                            <span className="mt-2 text-sm text-gray-500">{data.month}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Customer Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Insights</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="text-center pb-6 border-b border-gray-100">
                                    <motion.p
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        className="text-4xl font-bold text-gray-900"
                                    >
                                        {customerStats.totalCustomers}
                                    </motion.p>
                                    <p className="text-sm text-gray-500">Total Customers</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">New This Month</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{customerStats.newThisMonth}</span>
                                            <Badge variant="success" size="sm">
                                                <ArrowUpRight size={12} weight="duotone" />
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Returning Rate</span>
                                        <span className="font-semibold">{customerStats.returningRate}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Avg. Order Value</span>
                                        <span className="font-semibold">{formatCurrency(customerStats.avgOrderValue)}</span>
                                    </div>
                                </div>

                                {/* Returning vs New visualization */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Returning vs New</span>
                                        <span className="text-gray-500">{customerStats.returningRate}%</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${customerStats.returningRate}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>Returning</span>
                                        <span>New</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Top Products */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8"
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Top Performing Products</CardTitle>
                                <Button variant="ghost" size="sm">
                                    View All Products
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topProducts.map((product, index) => (
                                    <motion.div
                                        key={product.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            #{index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{product.name}</p>
                                            <p className="text-sm text-gray-500">{product.sales} sales</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                                            <div className={`flex items-center justify-end gap-1 text-sm ${product.trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                                                {product.trend >= 0 ? <TrendUp size={12} weight="duotone" /> : <TrendDown size={12} weight="duotone" />}
                                                {Math.abs(product.trend)}%
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </>
    );
}
