"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Package,
    ShoppingCart,
    BarChart3,
    Store,
    DollarSign,
    Users,
    Clock,
    TrendingUp,
    ArrowRight,
    Plus,
    MapPin,
} from "lucide-react";
import { Header } from "../../components/Header";
import {
    StatsCard,
    Card,
    Button,
    Badge,
    Avatar,
    AvatarFallback,
    staggerContainer,
    staggerItem,
    formatCurrency,
    SkeletonStats,
    SkeletonCard,
} from "@zora/ui-web";

// Mock data
const stats = [
    { title: "Today's Orders", value: "23", change: 12, icon: ShoppingCart, iconColor: "text-blue-600", iconBgColor: "bg-blue-100" },
    { title: "Total Revenue", value: "£4,521", change: 8, icon: DollarSign, iconColor: "text-green-600", iconBgColor: "bg-green-100" },
    { title: "Product Views", value: "1,429", change: -3, icon: Users, iconColor: "text-purple-600", iconBgColor: "bg-purple-100" },
    { title: "Avg. Fulfillment", value: "2.4h", change: 15, icon: Clock, iconColor: "text-orange-600", iconBgColor: "bg-orange-100" },
];

const recentOrders = [
    { id: "ORD-001", customer: "John Doe", items: 3, total: 45.99, status: "pending", time: "5 min ago" },
    { id: "ORD-002", customer: "Jane Smith", items: 5, total: 89.50, status: "confirmed", time: "12 min ago" },
    { id: "ORD-003", customer: "Mike Johnson", items: 2, total: 23.00, status: "preparing", time: "25 min ago" },
    { id: "ORD-004", customer: "Sarah Wilson", items: 4, total: 67.25, status: "ready", time: "1 hour ago" },
];

const statusColors = {
    pending: "warning",
    confirmed: "info",
    preparing: "primary",
    ready: "success",
} as const;

export default function VendorDashboard() {
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading state
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Header title="Dashboard" description="Welcome back, African Spice House" />

            <div className="p-4 sm:p-6 lg:p-8">
                {/* Stats Grid */}
                {isLoading ? (
                    <SkeletonStats />
                ) : (
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    >
                        {stats.map((stat, index) => (
                            <motion.div key={stat.title} variants={staggerItem}>
                                <StatsCard
                                    title={stat.title}
                                    value={stat.value}
                                    change={stat.change}
                                    icon={stat.icon}
                                    iconColor={stat.iconColor}
                                    iconBgColor={stat.iconBgColor}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Card padding="none">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                                    <p className="text-sm text-gray-500">Latest orders requiring attention</p>
                                </div>
                                <Link href="/orders">
                                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                        View All
                                    </Button>
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {recentOrders.map((order, index) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Avatar size="sm">
                                                    <AvatarFallback>
                                                        {order.customer.split(" ").map(n => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-gray-900">{order.customer}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {order.id} • {order.items} items
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">
                                                    {formatCurrency(order.total)}
                                                </p>
                                                <div className="flex items-center gap-2 justify-end mt-1">
                                                    <Badge variant={statusColors[order.status as keyof typeof statusColors]} size="sm">
                                                        {order.status}
                                                    </Badge>
                                                    <span className="text-xs text-gray-400">{order.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <Link href="/products/new" className="block">
                                    <motion.div
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Plus className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Add New Product</p>
                                            <p className="text-xs text-gray-500">List a new item for sale</p>
                                        </div>
                                    </motion.div>
                                </Link>
                                <Link href="/orders?status=pending" className="block">
                                    <motion.div
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                            <ShoppingCart className="w-5 h-5 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Pending Orders</p>
                                            <p className="text-xs text-gray-500">5 orders awaiting action</p>
                                        </div>
                                    </motion.div>
                                </Link>
                                <Link href="/shop" className="block">
                                    <motion.div
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <Store className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Update Shop Profile</p>
                                            <p className="text-xs text-gray-500">Edit your store details</p>
                                        </div>
                                    </motion.div>
                                </Link>
                                <Link href="/analytics" className="block">
                                    <motion.div
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <BarChart3 className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">View Analytics</p>
                                            <p className="text-xs text-gray-500">Track your performance</p>
                                        </div>
                                    </motion.div>
                                </Link>
                                <Link href="/settings" className="block">
                                    <motion.div
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Delivery Settings</p>
                                            <p className="text-xs text-gray-500">Configure delivery options</p>
                                        </div>
                                    </motion.div>
                                </Link>
                            </div>
                        </Card>

                        {/* Performance Summary */}
                        <Card className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Orders Completed</span>
                                    <span className="font-semibold text-gray-900">48</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "78%" }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="bg-green-500 h-2 rounded-full"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Revenue Target</span>
                                    <span className="font-semibold text-gray-900">78% achieved</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
