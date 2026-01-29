"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ShoppingCart,
    Users,
    Store,
    DollarSign,
    TrendingUp,
    UserPlus,
    Star,
    RefreshCw,
    Mail,
    AlertCircle,
    CheckCircle,
    ArrowRight,
    Clock,
} from "lucide-react";
import { Header } from "../../components/Header";
import {
    StatsCard,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    Badge,
    Avatar,
    AvatarFallback,
    staggerContainer,
    staggerItem,
    formatCurrency,
    formatRelativeTime,
    SkeletonStats,
    SkeletonCard,
} from "@zora/ui-web";
import {
    useAdminStats,
    usePendingItems,
    useRecentOrders,
    useVendorApplications,
} from "../../hooks";
import { useAdminRealtime } from "../../providers";

const statusColors = {
    pending: "warning",
    confirmed: "info",
    preparing: "primary",
    ready: "success",
    out_for_delivery: "info",
    delivered: "success",
    cancelled: "error",
} as const;

export default function AdminDashboard() {
    const { isConnected, stats: realtimeStats } = useAdminRealtime();

    // Fetch real data
    const {
        data: stats,
        isLoading: statsLoading,
        refetch: refetchStats,
    } = useAdminStats();

    const {
        data: pendingItems,
        isLoading: pendingLoading,
        refetch: refetchPending,
    } = usePendingItems();

    const {
        data: recentOrders,
        isLoading: ordersLoading,
        refetch: refetchOrders,
    } = useRecentOrders(5);

    const {
        data: applicationsData,
        isLoading: applicationsLoading,
    } = useVendorApplications('pending');

    const isLoading = statsLoading || pendingLoading || ordersLoading;

    // Transform stats for display
    const statsCards = useMemo(() => {
        if (!stats) return [];
        return [
            {
                title: "Total Orders",
                value: stats.totalOrders.toLocaleString(),
                change: stats.ordersChange,
                icon: ShoppingCart,
                iconColor: "text-blue-600",
                iconBgColor: "bg-blue-100",
            },
            {
                title: "Total Revenue",
                value: formatCurrency(stats.totalRevenue),
                change: stats.revenueChange,
                icon: DollarSign,
                iconColor: "text-green-600",
                iconBgColor: "bg-green-100",
            },
            {
                title: "Active Vendors",
                value: stats.activeVendors.toString(),
                change: stats.vendorsChange,
                icon: Store,
                iconColor: "text-purple-600",
                iconBgColor: "bg-purple-100",
            },
            {
                title: "Total Customers",
                value: stats.totalCustomers.toLocaleString(),
                change: stats.customersChange,
                icon: Users,
                iconColor: "text-orange-600",
                iconBgColor: "bg-orange-100",
            },
        ];
    }, [stats]);

    // Transform pending items for display
    const pendingItemsList = useMemo(() => {
        if (!pendingItems) return [];
        return [
            {
                type: "Vendor Applications",
                count: pendingItems.vendorApplications,
                icon: UserPlus,
                href: "/vendors",
                color: "bg-blue-100 text-blue-600",
            },
            {
                type: "Pending Reviews",
                count: pendingItems.pendingReviews,
                icon: Star,
                href: "/reviews",
                color: "bg-yellow-100 text-yellow-600",
            },
            {
                type: "Refund Requests",
                count: pendingItems.refundRequests,
                icon: RefreshCw,
                href: "/refunds",
                color: "bg-red-100 text-red-600",
            },
            {
                type: "Open Emails",
                count: pendingItems.openEmails,
                icon: Mail,
                href: "/emails",
                color: "bg-purple-100 text-purple-600",
            },
        ];
    }, [pendingItems]);

    const handleRefresh = () => {
        refetchStats();
        refetchPending();
        refetchOrders();
    };

    return (
        <>
            <Header
                title="Admin Dashboard"
                description="Platform overview and management"
                action={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        leftIcon={<RefreshCw className="w-4 h-4" />}
                    >
                        Refresh
                    </Button>
                }
            />

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
                        {statsCards.map((stat) => (
                            <motion.div key={stat.title} variants={staggerItem}>
                                <StatsCard {...stat} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Pending Items */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    {pendingItemsList.map((item) => (
                        <motion.div key={item.type} variants={staggerItem}>
                            <Link href={item.href}>
                                <Card hover className="cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}
                                        >
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-900">{item.count}</p>
                                            <p className="text-sm text-slate-500">{item.type}</p>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Card padding="none">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Recent Orders
                                        {realtimeStats.newOrdersToday > 0 && (
                                            <Badge variant="success" size="sm" className="ml-2">
                                                {realtimeStats.newOrdersToday} today
                                            </Badge>
                                        )}
                                    </h2>
                                    <p className="text-sm text-slate-500">Latest platform orders</p>
                                </div>
                                <Link href="/orders">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        rightIcon={<ArrowRight className="w-4 h-4" />}
                                    >
                                        View All
                                    </Button>
                                </Link>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {ordersLoading ? (
                                    <div className="p-8 text-center text-slate-500">Loading orders...</div>
                                ) : !recentOrders || recentOrders.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500">
                                        <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                        <p>No orders yet</p>
                                    </div>
                                ) : (
                                    recentOrders.map((order, index) => (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * index }}
                                            className="p-4 hover:bg-slate-50 transition-colors"
                                        >
                                            <Link href={`/orders/${order.id}`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar size="sm">
                                                            <AvatarFallback className="bg-slate-100 text-slate-600">
                                                                {(order as any).user?.full_name
                                                                    ?.split(" ")
                                                                    .map((n: string) => n[0])
                                                                    .join("") || "?"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium text-primary">
                                                                    {order.order_number || order.id.slice(0, 8)}
                                                                </p>
                                                                <Badge
                                                                    variant={
                                                                        statusColors[
                                                                        order.status as keyof typeof statusColors
                                                                        ] || "default"
                                                                    }
                                                                    size="sm"
                                                                >
                                                                    {order.status?.replace(/_/g, " ")}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-slate-500">
                                                                {(order as any).user?.full_name || "Customer"} •{" "}
                                                                {(order as any).vendor?.shop_name || "Vendor"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-slate-900">
                                                            {formatCurrency(order.total || 0)}
                                                        </p>
                                                        <p className="text-xs text-slate-400">
                                                            {formatRelativeTime(new Date(order.created_at))}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* System Alerts */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>System Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {(pendingItems?.vendorApplications ?? 0) > 0 && (
                                        <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl">
                                            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {pendingItems?.vendorApplications} vendors pending approval
                                                </p>
                                                <p className="text-xs text-slate-500">Review required</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">
                                                {isConnected ? "All systems operational" : "Connecting..."}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {isConnected ? "Real-time connected" : "Establishing connection"}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Vendor Applications */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>New Applications</CardTitle>
                                        <Link href="/vendors">
                                            <Button variant="ghost" size="sm">
                                                View All
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {applicationsLoading ? (
                                        <div className="text-center text-slate-500 py-4">Loading...</div>
                                    ) : !applicationsData?.data || applicationsData.data.length === 0 ? (
                                        <div className="text-center text-slate-500 py-4">
                                            No pending applications
                                        </div>
                                    ) : (
                                        applicationsData.data.slice(0, 3).map((app, index) => (
                                            <motion.div
                                                key={app.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                                            >
                                                <Link href={`/vendors/${app.id}`} className="flex-1 flex items-center gap-3">
                                                    <Avatar size="sm">
                                                        <AvatarFallback className="bg-primary/10 text-primary">
                                                            {app.business_name
                                                                ?.split(" ")
                                                                .map((n) => n[0])
                                                                .join("")
                                                                .slice(0, 2) || "??"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-slate-900 truncate">
                                                            {app.business_name}
                                                        </p>
                                                        <p className="text-xs text-slate-500">{app.business_type}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                                        <Clock className="w-3 h-3" />
                                                        {formatRelativeTime(new Date(app.created_at))}
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-2">
                                    <Link href="/analytics">
                                        <div className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-center cursor-pointer">
                                            <TrendingUp className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                                            <span className="text-xs font-medium text-blue-700">Analytics</span>
                                        </div>
                                    </Link>
                                    <Link href="/products">
                                        <div className="p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors text-center cursor-pointer">
                                            <Store className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                                            <span className="text-xs font-medium text-purple-700">Products</span>
                                        </div>
                                    </Link>
                                    <Link href="/settings">
                                        <div className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-center cursor-pointer">
                                            <AlertCircle className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                                            <span className="text-xs font-medium text-gray-700">Settings</span>
                                        </div>
                                    </Link>
                                    <Link href="/customers">
                                        <div className="p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors text-center cursor-pointer">
                                            <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
                                            <span className="text-xs font-medium text-green-700">Customers</span>
                                        </div>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
