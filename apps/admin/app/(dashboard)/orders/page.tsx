"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    MagnifyingGlass,
    DownloadSimple,
    Eye,
    Package,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    ArrowsClockwise,
    WarningCircle,
} from "@phosphor-icons/react";
import { Header } from "../../../components/Header";
import {
    Button,
    Input,
    Card,
    Badge,
    DataTable,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Avatar,
    AvatarFallback,
    EmptyState,
    formatCurrency,
    formatRelativeTime,
    staggerContainer,
    staggerItem,
    SkeletonCard,
} from "@zora/ui-web";
import { useAllOrders, useUpdateOrderStatus } from "../../../hooks";
import { useAdminRealtime } from "../../../providers";
import type { Order, OrderStatus } from "@zora/types";

const statusConfig = {
    pending: { label: "Pending", variant: "warning" as const, icon: Clock },
    confirmed: { label: "Confirmed", variant: "info" as const, icon: CheckCircle },
    preparing: { label: "Preparing", variant: "primary" as const, icon: Package },
    ready: { label: "Ready", variant: "success" as const, icon: CheckCircle },
    out_for_delivery: { label: "In Transit", variant: "info" as const, icon: Truck },
    delivered: { label: "Delivered", variant: "success" as const, icon: CheckCircle },
    cancelled: { label: "Cancelled", variant: "error" as const, icon: XCircle },
};

const paymentStatusConfig = {
    pending: { label: "Pending", variant: "warning" as const },
    paid: { label: "Paid", variant: "success" as const },
    failed: { label: "Failed", variant: "error" as const },
    refunded: { label: "Refunded", variant: "default" as const },
    refund_requested: { label: "Refund Requested", variant: "warning" as const },
};

interface OrderWithDetails extends Order {
    customer?: {
        id: string;
        full_name: string;
        email: string;
        avatar_url?: string;
    };
    vendor?: {
        id: string;
        shop_name: string;
    };
    items?: Array<{
        id: string;
        quantity: number;
        price: number;
        product?: {
            id: string;
            name: string;
            image_url?: string;
        };
    }>;
}

export default function OrdersPage() {
    const { stats: realtimeStats } = useAdminRealtime();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
    const [refundDialogOpen, setRefundDialogOpen] = useState(false);

    // Fetch orders from database
    const statusFilter = selectedStatus === "all" ? undefined : selectedStatus as OrderStatus;
    const {
        data: ordersData,
        isLoading,
        isError,
        refetch,
    } = useAllOrders({ status: statusFilter });

    // Update order status mutation
    const updateStatusMutation = useUpdateOrderStatus();

    // Filter orders by search
    const filteredOrders = useMemo(() => {
        if (!ordersData?.data) return [];
        if (!searchTerm) return ordersData.data as OrderWithDetails[];

        const searchLower = searchTerm.toLowerCase();
        return (ordersData.data as OrderWithDetails[]).filter((order) => {
            return (
                order.order_number?.toLowerCase().includes(searchLower) ||
                order.id.toLowerCase().includes(searchLower) ||
                order.customer?.full_name?.toLowerCase().includes(searchLower) ||
                order.customer?.email?.toLowerCase().includes(searchLower) ||
                order.vendor?.shop_name?.toLowerCase().includes(searchLower)
            );
        });
    }, [ordersData?.data, searchTerm]);

    // Calculate order counts
    const orderCounts = useMemo(() => {
        const orders = ordersData?.data || [];
        return {
            all: orders.length,
            pending: orders.filter((o) => o.status === "pending").length,
            preparing: orders.filter((o) => o.status === "preparing" || o.status === "confirmed").length,
            in_transit: orders.filter((o) => o.status === "out_for_delivery").length,
            delivered: orders.filter((o) => o.status === "delivered").length,
            cancelled: orders.filter((o) => o.status === "cancelled").length,
        };
    }, [ordersData?.data]);

    const handleProcessRefund = async () => {
        if (selectedOrder) {
            try {
                await updateStatusMutation.mutateAsync({
                    orderId: selectedOrder.id,
                    status: "cancelled" as OrderStatus,
                });
                setRefundDialogOpen(false);
                setSelectedOrder(null);
            } catch (error) {
                console.error("Failed to process refund:", error);
            }
        }
    };

    const columns = [
        {
            key: "id",
            header: "Order ID",
            sortable: true,
            render: (order: OrderWithDetails) => (
                <Link href={`/orders/${order.id}`}>
                    <span className="font-medium text-primary hover:underline">
                        {order.order_number || order.id.slice(0, 8)}
                    </span>
                </Link>
            ),
        },
        {
            key: "customer",
            header: "Customer",
            render: (order: OrderWithDetails) => (
                <div className="flex items-center gap-3">
                    <Avatar size="sm">
                        <AvatarFallback className="bg-slate-100 text-slate-600">
                            {order.customer?.full_name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "?"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-slate-900">{order.customer?.full_name || "Customer"}</p>
                        <p className="text-xs text-slate-500">{order.customer?.email || ""}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "vendor",
            header: "Vendor",
            sortable: true,
            render: (order: OrderWithDetails) => (
                <span className="text-slate-600">{order.vendor?.shop_name || "N/A"}</span>
            ),
        },
        {
            key: "total",
            header: "Total",
            sortable: true,
            render: (order: OrderWithDetails) => (
                <span className="font-semibold">{formatCurrency(order.total || 0)}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (order: OrderWithDetails) => {
                const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                return <Badge variant={config.variant}>{config.label}</Badge>;
            },
        },
        {
            key: "paymentStatus",
            header: "Payment",
            render: (order: OrderWithDetails) => {
                const status = order.payment_status || "pending";
                const config = paymentStatusConfig[status as keyof typeof paymentStatusConfig] || paymentStatusConfig.pending;
                return (
                    <Badge variant={config.variant} size="sm">
                        {config.label}
                    </Badge>
                );
            },
        },
        {
            key: "createdAt",
            header: "Date",
            sortable: true,
            render: (order: OrderWithDetails) => (
                <span className="text-slate-500 text-sm">
                    {formatRelativeTime(new Date(order.created_at))}
                </span>
            ),
        },
        {
            key: "actions",
            header: "",
            width: "100px",
            render: (order: OrderWithDetails) => (
                <div className="flex items-center gap-1">
                    <Link href={`/orders/${order.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye size={16} weight="duotone" />
                        </Button>
                    </Link>
                    {order.payment_status === "paid" && order.status !== "cancelled" && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                            onClick={() => {
                                setSelectedOrder(order);
                                setRefundDialogOpen(true);
                            }}
                        >
                            <ArrowsClockwise size={16} weight="duotone" />
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Header
                title="Orders"
                description="Manage all platform orders"
                action={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        leftIcon={<ArrowsClockwise size={16} weight="duotone" />}
                    >
                        Refresh
                        {realtimeStats.pendingOrders > 0 && (
                            <Badge variant="warning" size="sm" className="ml-2">
                                {realtimeStats.pendingOrders} pending
                            </Badge>
                        )}
                    </Button>
                }
            />

            <div className="p-4 sm:p-6 lg:p-8">
                {/* Stats Row */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
                >
                    {[
                        { label: "All Orders", count: orderCounts.all, color: "bg-slate-100 text-slate-600" },
                        { label: "Pending", count: orderCounts.pending, color: "bg-yellow-100 text-yellow-600" },
                        { label: "Preparing", count: orderCounts.preparing, color: "bg-blue-100 text-blue-600" },
                        { label: "In Transit", count: orderCounts.in_transit, color: "bg-purple-100 text-purple-600" },
                        { label: "Delivered", count: orderCounts.delivered, color: "bg-green-100 text-green-600" },
                        { label: "Cancelled", count: orderCounts.cancelled, color: "bg-red-100 text-red-600" },
                    ].map((stat) => (
                        <motion.div key={stat.label} variants={staggerItem}>
                            <Card className="text-center py-4">
                                <p className="text-2xl font-bold mb-1">{stat.count}</p>
                                <p className="text-sm text-slate-500">{stat.label}</p>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Filters */}
                <Card className="mb-6">
                    <div className="flex flex-col gap-4">
                        {/* Search and Filter Row */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="w-full sm:flex-1 lg:max-w-md">
                                <Input
                                    placeholder="Search by order ID, customer, or vendor..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    leftIcon={<MagnifyingGlass size={16} weight="duotone" />}
                                />
                            </div>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="preparing">Preparing</SelectItem>
                                    <SelectItem value="out_for_delivery">In Transit</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Actions Row */}
                        <div className="flex justify-end">
                            <Button variant="outline" size="sm" leftIcon={<DownloadSimple size={16} weight="duotone" />}>
                                Export Orders
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Loading State */}
                {isLoading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <Card className="p-8 text-center">
                        <WarningCircle size={48} weight="duotone" className="mx-auto mb-4 text-red-500" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Failed to load orders</h3>
                        <p className="text-slate-500 mb-4">There was an error loading orders.</p>
                        <Button onClick={() => refetch()}>Try Again</Button>
                    </Card>
                )}

                {/* Empty State */}
                {!isLoading && !isError && filteredOrders.length === 0 && (
                    <EmptyState
                        icon={Package}
                        title="No orders found"
                        description={searchTerm ? "Try adjusting your search or filters" : "Orders will appear here"}
                    />
                )}

                {/* Orders Table */}
                {!isLoading && !isError && filteredOrders.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card padding="none">
                            <DataTable
                                data={filteredOrders}
                                columns={columns}
                                getRowId={(item) => item.id}
                                searchable={false}
                            />
                        </Card>
                    </motion.div>
                )}
            </div>

            {/* Refund Dialog */}
            <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
                <DialogContent size="sm">
                    <DialogHeader>
                        <DialogTitle>Process Refund</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to refund{" "}
                            {selectedOrder?.order_number || selectedOrder?.id.slice(0, 8)}? This will refund{" "}
                            {formatCurrency(selectedOrder?.total || 0)} to the customer.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Refund Reason
                        </label>
                        <textarea
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            rows={3}
                            placeholder="Enter reason for refund..."
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRefundDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleProcessRefund} loading={updateStatusMutation.isPending}>
                            Process Refund
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
