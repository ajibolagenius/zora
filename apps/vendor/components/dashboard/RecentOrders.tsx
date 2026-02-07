"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ShoppingCart,
    ArrowRight,
} from "@phosphor-icons/react";
import {
    Card,
    Button,
    Badge,
    Avatar,
    AvatarFallback,
    formatCurrency,
} from "@zora/ui-web";
import { useRecentOrders, useAuth } from "../../hooks";
import { useVendorRealtime } from "../../providers";

// Status colors mapping
const statusColors = {
    pending: "warning",
    confirmed: "info",
    preparing: "primary",
    ready: "success",
    out_for_delivery: "info",
    delivered: "success",
    cancelled: "error",
} as const;

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export function RecentOrders() {
    const { vendor } = useAuth();
    const { newOrdersCount } = useVendorRealtime();

    const {
        data: recentOrders,
        isLoading: ordersLoading,
    } = useRecentOrders(vendor?.id ?? null, 5);

    return (
        <Card padding="none" className="bg-white h-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Recent Orders
                        {newOrdersCount > 0 && (
                            <Badge variant="error" size="sm" className="ml-2 animate-pulse">
                                {newOrdersCount} new
                            </Badge>
                        )}
                    </h2>
                    <p className="text-sm text-gray-500">
                        Latest orders requiring attention
                    </p>
                </div>
                <Link href="/orders">
                    <Button
                        variant="ghost"
                        size="sm"
                        rightIcon={<ArrowRight size={16} weight="duotone" />}
                    >
                        View All
                    </Button>
                </Link>
            </div>

            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {ordersLoading ? (
                    <div className="p-8 text-center text-gray-500">
                        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                        Loading orders...
                    </div>
                ) : !recentOrders || recentOrders.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-64">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <ShoppingCart size={32} weight="duotone" className="text-gray-400" />
                        </div>
                        <p className="font-medium text-gray-900 mb-1">No orders yet</p>
                        <p className="text-sm text-gray-500 max-w-[200px]">
                            Orders will appear here when customers place them
                        </p>
                    </div>
                ) : (
                    recentOrders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * index }}
                            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                            <Link href={`/orders/${order.id}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar size="sm" className="ring-2 ring-transparent group-hover:ring-primary/10 transition-all">
                                            <AvatarFallback className="bg-primary/5 text-primary">
                                                {(order as any).customer?.full_name
                                                    ?.split(" ")
                                                    .map((n: string) => n[0])
                                                    .join("") || "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                                                {(order as any).customer?.full_name || "Customer"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                #{order.order_number || order.id.slice(0, 8)} •{" "}
                                                {(order as any).items?.length || 0} items
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(order.total || 0)}
                                        </p>
                                        <div className="flex items-center gap-2 justify-end mt-1">
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
                                            <span className="text-xs text-gray-400">
                                                {formatTimeAgo(order.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))
                )}
            </div>
        </Card>
    );
}
