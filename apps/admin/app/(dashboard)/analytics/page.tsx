"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    ChartBar,
    TrendUp,
    TrendDown,
    CurrencyDollar,
    ShoppingCart,
    Users,
    Package,
    Calendar,
    DownloadSimple,
    ArrowUpRight,
    Globe,
} from "@phosphor-icons/react";
import { Header } from "../../../components/Header";
import {
    Card,
    Button,
    Badge,
    formatCurrency,
} from "@zora/ui-web";

// Mock analytics data
const overviewStats = [
    { title: "Total Revenue", value: "£124,589", change: 12.5, icon: CurrencyDollar, color: "from-green-500 to-green-600" },
    { title: "Total Orders", value: "3,847", change: 8.2, icon: ShoppingCart, color: "from-blue-500 to-blue-600" },
    { title: "Active Customers", value: "12,456", change: 15.3, icon: Users, color: "from-purple-500 to-purple-600" },
    { title: "Active Vendors", value: "128", change: 5.1, icon: Package, color: "from-orange-500 to-orange-600" },
];

const topProducts = [
    { name: "Jollof Rice Spice Mix", sales: 1234, revenue: 7398.66 },
    { name: "Suya Pepper Blend", sales: 987, revenue: 6400.63 },
    { name: "Palm Oil (1L)", sales: 856, revenue: 7695.44 },
    { name: "Egusi Seeds (500g)", sales: 743, revenue: 3707.57 },
    { name: "Plantain Chips", sales: 698, revenue: 2436.02 },
];

const topVendors = [
    { name: "African Spice House", orders: 456, revenue: 12345.67 },
    { name: "Nigerian Delights", orders: 389, revenue: 10234.56 },
    { name: "West African Foods", orders: 312, revenue: 8765.43 },
    { name: "Lagos Street Food", orders: 287, revenue: 7654.32 },
    { name: "Mama Africa Store", orders: 234, revenue: 6543.21 },
];

const regionStats = [
    { region: "West Africa", percentage: 45, color: "bg-orange-500" },
    { region: "East Africa", percentage: 25, color: "bg-green-500" },
    { region: "North Africa", percentage: 15, color: "bg-blue-500" },
    { region: "Southern Africa", percentage: 10, color: "bg-purple-500" },
    { region: "Central Africa", percentage: 5, color: "bg-pink-500" },
];

const recentActivity = [
    { type: "order", message: "New order #ORD-4523 from Sarah J.", time: "2 min ago" },
    { type: "vendor", message: "Lagos Kitchen joined the platform", time: "15 min ago" },
    { type: "review", message: "5-star review on Jollof Spice Mix", time: "32 min ago" },
    { type: "order", message: "Order #ORD-4522 delivered", time: "1 hour ago" },
    { type: "milestone", message: "Revenue milestone: £100K this month!", time: "2 hours ago" },
];

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState("7d");

    return (
        <>
            <Header
                title="Analytics"
                description="Platform performance insights"
                actions={
                    <div className="flex gap-3">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-sm"
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="1y">Last year</option>
                        </select>
                        <Button variant="outline" leftIcon={<DownloadSimple size={16} weight="duotone" />}>
                            Export
                        </Button>
                    </div>
                }
            />

            <div className="p-4 sm:p-6 lg:p-8">
                {/* Overview Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {overviewStats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * index }}
                        >
                            <Card className={`bg-gradient-to-br ${stat.color} text-white`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white/80 text-sm">{stat.title}</p>
                                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                        <div className="flex items-center gap-1 mt-2">
                                            {stat.change > 0 ? (
                                                <TrendUp size={16} weight="duotone" />
                                            ) : (
                                                <TrendDown size={16} weight="duotone" />
                                            )}
                                            <span className="text-sm">
                                                {stat.change > 0 ? "+" : ""}{stat.change}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                        <stat.icon size={28} weight="duotone" />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    {/* Revenue Chart Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Card>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                                <Badge variant="success">
                                    <TrendUp size={12} weight="duotone" className="mr-1" />
                                    +12.5%
                                </Badge>
                            </div>
                            <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <ChartBar size={48} weight="duotone" className="mx-auto mb-2 text-gray-300" />
                                    <p>Revenue chart visualization</p>
                                    <p className="text-sm">Integration with Recharts pending</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Region Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <div className="flex items-center gap-2 mb-6">
                                <Globe size={20} weight="duotone" className="text-primary" />
                                <h3 className="text-lg font-semibold text-gray-900">Sales by Region</h3>
                            </div>
                            <div className="space-y-4">
                                {regionStats.map((region) => (
                                    <div key={region.region}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-700">{region.region}</span>
                                            <span className="font-medium text-gray-900">{region.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${region.percentage}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className={`${region.color} h-2 rounded-full`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Top Products */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                                <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight size={16} weight="duotone" />}>
                                    View All
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {topProducts.map((product, index) => (
                                    <div key={product.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                                                {index + 1}
                                            </span>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                                                <p className="text-xs text-gray-500">{product.sales} sales</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Top Vendors */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Top Vendors</h3>
                                <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight size={16} weight="duotone" />}>
                                    View All
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {topVendors.map((vendor, index) => (
                                    <div key={vendor.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                                                {index + 1}
                                            </span>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{vendor.name}</p>
                                                <p className="text-xs text-gray-500">{vendor.orders} orders</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-gray-900">{formatCurrency(vendor.revenue)}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === "order" ? "bg-blue-500" :
                                                activity.type === "vendor" ? "bg-green-500" :
                                                    activity.type === "review" ? "bg-yellow-500" :
                                                        "bg-purple-500"
                                            }`} />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-700">{activity.message}</p>
                                            <p className="text-xs text-gray-400">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
