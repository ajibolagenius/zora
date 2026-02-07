"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
    Package,
    ShoppingCart,
    Clock,
    ArrowsClockwise,
    CurrencyGbp,
} from "@phosphor-icons/react";
import { Header } from "../../components/Header";
import {
    StatsCard,
    Button,
    staggerContainer,
    staggerItem,
    formatCurrency,
    SkeletonStats,
} from "@zora/ui-web";
import { useAuth, useVendorStats, useRecentOrders } from "../../hooks";
import { useVendorRealtime } from "../../providers";
import { RevenueChart } from "../../components/dashboard/RevenueChart";
import { RecentOrders } from "../../components/dashboard/RecentOrders";
import { QuickActions } from "../../components/dashboard/QuickActions";

export default function VendorDashboard() {
    const { vendor, isLoading: authLoading } = useAuth();
    const { newOrdersCount } = useVendorRealtime();

    // Fetch real data
    const {
        data: stats,
        isLoading: statsLoading,
        refetch: refetchStats,
    } = useVendorStats(vendor?.id ?? null);

    const {
        refetch: refetchOrders,
        isLoading: ordersLoading,
    } = useRecentOrders(vendor?.id ?? null, 5);

    const isLoading = authLoading || statsLoading || ordersLoading;

    // Transform stats for display
    const statsCards = useMemo(() => {
        if (!stats) return [];
        return [
            {
                title: "Today's Orders",
                value: stats.todayOrders.toString(),
                change: newOrdersCount > 0 ? newOrdersCount : undefined,
                icon: ShoppingCart,
                iconColor: "text-blue-600",
                iconBgColor: "bg-blue-100",
            },
            {
                title: "Today's Revenue",
                value: formatCurrency(stats.todayRevenue),
                icon: CurrencyGbp,
                iconColor: "text-green-600",
                iconBgColor: "bg-green-100",
            },
            {
                title: "Total Products",
                value: stats.totalProducts.toString(),
                icon: Package,
                iconColor: "text-purple-600",
                iconBgColor: "bg-purple-100",
            },
            {
                title: "Avg. Fulfillment",
                value: stats.avgFulfillmentTime,
                icon: Clock,
                iconColor: "text-orange-600",
                iconBgColor: "bg-orange-100",
            },
        ];
    }, [stats, newOrdersCount]);

    const handleRefresh = () => {
        refetchStats();
        refetchOrders();
    };

    return (
        <>
            <Header
                title="Dashboard"
                description={`Welcome back, ${vendor?.shop_name || "Vendor"}`}
                action={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        leftIcon={<ArrowsClockwise size={16} weight="duotone" />}
                    >
                        Refresh
                    </Button>
                }
            />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                {/* Stats Grid */}
                {isLoading ? (
                    <SkeletonStats />
                ) : (
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {statsCards.map((stat) => (
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Area (Chart + Orders) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Revenue Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <RevenueChart />
                        </motion.div>

                        {/* Recent Orders */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <RecentOrders />
                        </motion.div>
                    </div>

                    {/* Sidebar Area (Quick Actions + Summary) */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <QuickActions />
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
