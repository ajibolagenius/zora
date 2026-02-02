"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MagnifyingGlass,
    Package,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    CaretRight,
    Calendar,
    MapPin,
    Phone,
    Envelope,
    Printer,
    ArrowsClockwise,
    WarningCircle,
} from "@phosphor-icons/react";
import { Header } from "../../../components/Header";
import {
    Button,
    Input,
    Card,
    Badge,
    Tabs,
    TabsList,
    TabsTrigger,
    Avatar,
    AvatarFallback,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    EmptyState,
    formatCurrency,
    formatRelativeTime,
    staggerContainer,
    staggerItem,
    SkeletonCard,
} from "@zora/ui-web";
import { useAuth, useVendorOrders, useUpdateOrderStatus } from "../../../hooks";
import { useVendorRealtime } from "../../../providers";
import type { Order, OrderStatus } from "@zora/types";

const statusConfig = {
    pending: { label: "Pending", variant: "warning" as const, icon: Clock, color: "text-yellow-600 bg-yellow-100" },
    confirmed: { label: "Confirmed", variant: "info" as const, icon: CheckCircle, color: "text-blue-600 bg-blue-100" },
    preparing: { label: "Preparing", variant: "primary" as const, icon: Package, color: "text-purple-600 bg-purple-100" },
    ready: { label: "Ready", variant: "success" as const, icon: CheckCircle, color: "text-green-600 bg-green-100" },
    ready_for_pickup: { label: "Ready for Pickup", variant: "success" as const, icon: CheckCircle, color: "text-green-600 bg-green-100" },
    out_for_delivery: { label: "Out for Delivery", variant: "info" as const, icon: Truck, color: "text-blue-600 bg-blue-100" },
    delivered: { label: "Delivered", variant: "success" as const, icon: CheckCircle, color: "text-green-600 bg-green-100" },
    cancelled: { label: "Cancelled", variant: "error" as const, icon: XCircle, color: "text-red-600 bg-red-100" },
    refunded: { label: "Refunded", variant: "default" as const, icon: XCircle, color: "text-gray-600 bg-gray-100" },
};

const nextStatusMap: Record<string, OrderStatus> = {
    pending: "confirmed",
    confirmed: "preparing",
    preparing: "ready",
    ready: "out_for_delivery",
    out_for_delivery: "delivered",
};

interface OrderWithDetails extends Omit<Order, 'items'> {
    [key: string]: unknown;
    customer?: {
        id: string;
        full_name: string;
        email: string;
        phone?: string;
        avatar_url?: string;
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
    const { vendor } = useAuth();
    const { newOrdersCount, resetNewOrdersCount } = useVendorRealtime();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTab, setSelectedTab] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    // Fetch orders from database
    const statusFilter = selectedTab === "all" ? undefined : selectedTab as OrderStatus;
    const {
        data: ordersData,
        isLoading,
        isError,
        refetch,
    } = useVendorOrders(vendor?.id ?? null, { status: statusFilter });

    // Update order status mutation
    const updateStatusMutation = useUpdateOrderStatus();

    // Filter orders by search term
    const filteredOrders = useMemo(() => {
        if (!ordersData?.data) return [];
        if (!searchTerm) return ordersData.data as OrderWithDetails[];

        return (ordersData.data as OrderWithDetails[]).filter((order) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                order.order_number?.toLowerCase().includes(searchLower) ||
                order.id.toLowerCase().includes(searchLower) ||
                order.customer?.full_name?.toLowerCase().includes(searchLower) ||
                order.customer?.email?.toLowerCase().includes(searchLower)
            );
        });
    }, [ordersData?.data, searchTerm]);

    // Calculate order counts
    const orderCounts = useMemo(() => {
        const orders = ordersData?.data || [];
        return {
            all: orders.length,
            pending: orders.filter((o) => o.status === "pending").length,
            confirmed: orders.filter((o) => o.status === "confirmed").length,
            preparing: orders.filter((o) => o.status === "preparing").length,
            ready: orders.filter((o) => o.status === "ready").length,
            out_for_delivery: orders.filter((o) => o.status === "out_for_delivery").length,
        };
    }, [ordersData?.data]);

    const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
        try {
            await updateStatusMutation.mutateAsync({ orderId, status: newStatus });
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error("Failed to update order status:", error);
        }
    };

    const handleRefresh = () => {
        refetch();
        resetNewOrdersCount();
    };

    return (
        <>
            <Header
                title="Orders"
                description="Manage and fulfill customer orders"
                action={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        leftIcon={<ArrowsClockwise size={16} weight="duotone" />}
                    >
                        Refresh
                        {newOrdersCount > 0 && (
                            <Badge variant="error" size="sm" className="ml-2">
                                {newOrdersCount}
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
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
                >
                    {[
                        { label: "Pending", count: orderCounts.pending, color: "bg-yellow-100 text-yellow-600" },
                        { label: "Confirmed", count: orderCounts.confirmed, color: "bg-blue-100 text-blue-600" },
                        { label: "Preparing", count: orderCounts.preparing, color: "bg-purple-100 text-purple-600" },
                        { label: "Ready", count: orderCounts.ready, color: "bg-green-100 text-green-600" },
                        { label: "In Transit", count: orderCounts.out_for_delivery, color: "bg-indigo-100 text-indigo-600" },
                    ].map((stat) => (
                        <motion.div key={stat.label} variants={staggerItem}>
                            <Card className="text-center">
                                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${stat.color}`}>
                                    <span className="text-xl font-bold">{stat.count}</span>
                                </div>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Filters */}
                <Card className="mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full lg:w-auto">
                            <TabsList className="flex-wrap h-auto gap-1">
                                <TabsTrigger value="all" className="text-xs sm:text-sm">All ({orderCounts.all})</TabsTrigger>
                                <TabsTrigger value="pending" className="text-xs sm:text-sm">Pending ({orderCounts.pending})</TabsTrigger>
                                <TabsTrigger value="confirmed" className="text-xs sm:text-sm">Confirmed ({orderCounts.confirmed})</TabsTrigger>
                                <TabsTrigger value="preparing" className="text-xs sm:text-sm">Preparing ({orderCounts.preparing})</TabsTrigger>
                                <TabsTrigger value="ready" className="text-xs sm:text-sm">Ready ({orderCounts.ready})</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="w-full lg:w-64">
                            <Input
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                leftIcon={<MagnifyingGlass size={16} weight="duotone" />}
                                inputSize="sm"
                            />
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load orders</h3>
                        <p className="text-gray-500 mb-4">There was an error loading your orders.</p>
                        <Button onClick={() => refetch()}>Try Again</Button>
                    </Card>
                )}

                {/* Orders List */}
                {!isLoading && !isError && filteredOrders.length === 0 && (
                    <EmptyState
                        icon={Package}
                        title="No orders found"
                        description={searchTerm ? "Try adjusting your search" : "New orders will appear here when customers place them"}
                    />
                )}

                {!isLoading && !isError && filteredOrders.length > 0 && (
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="space-y-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredOrders.map((order) => {
                                const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                                const StatusIcon = status.icon;
                                const nextStatus = nextStatusMap[order.status];
                                const itemCount = order.items?.length || 0;

                                return (
                                    <motion.div
                                        key={order.id}
                                        variants={staggerItem}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                    >
                                        <Card
                                            hover
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setDetailsOpen(true);
                                            }}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-3 sm:gap-4">
                                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${status.color}`}>
                                                        <StatusIcon size={24} weight="duotone" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                                            <p className="font-semibold text-gray-900">
                                                                {order.order_number || order.id.slice(0, 8)}
                                                            </p>
                                                            <Badge variant={status.variant}>{status.label}</Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-500 truncate">
                                                            {order.customer?.full_name || "Customer"} • {itemCount} item{itemCount !== 1 ? "s" : ""} • {formatRelativeTime(new Date(order.created_at))}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pl-13 sm:pl-0">
                                                    <div className="text-left sm:text-right">
                                                        <p className="font-semibold text-gray-900">{formatCurrency(order.total || 0)}</p>
                                                        {order.estimated_delivery && (
                                                            <p className="text-sm text-gray-500">Est. {new Date(order.estimated_delivery).toLocaleDateString()}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {nextStatus && (
                                                            <Button
                                                                size="sm"
                                                                className="text-xs sm:text-sm whitespace-nowrap"
                                                                isLoading={updateStatusMutation.isPending}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleUpdateStatus(order.id, nextStatus);
                                                                }}
                                                            >
                                                                <span className="hidden sm:inline">Mark as </span>
                                                                {statusConfig[nextStatus]?.label || nextStatus}
                                                            </Button>
                                                        )}
                                                        <CaretRight size={20} weight="duotone" className="text-gray-400 hidden sm:block" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Order Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent size="lg">
                    {selectedOrder && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <DialogTitle>
                                            {selectedOrder.order_number || selectedOrder.id.slice(0, 8)}
                                        </DialogTitle>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Placed {formatRelativeTime(new Date(selectedOrder.created_at))}
                                        </p>
                                    </div>
                                    <Badge variant={statusConfig[selectedOrder.status as keyof typeof statusConfig]?.variant || "default"}>
                                        {statusConfig[selectedOrder.status as keyof typeof statusConfig]?.label || selectedOrder.status}
                                    </Badge>
                                </div>
                            </DialogHeader>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                                {/* Customer Info */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Customer</h3>
                                    <Card padding="sm" className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar size="sm">
                                                <AvatarFallback>
                                                    {selectedOrder.customer?.full_name
                                                        ?.split(" ")
                                                        .map((n) => n[0])
                                                        .join("") || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{selectedOrder.customer?.full_name || "Customer"}</p>
                                            </div>
                                        </div>
                                        {selectedOrder.customer?.email && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Envelope size={16} weight="duotone" />
                                                {selectedOrder.customer.email}
                                            </div>
                                        )}
                                        {selectedOrder.customer?.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone size={16} weight="duotone" />
                                                {selectedOrder.customer.phone}
                                            </div>
                                        )}
                                    </Card>
                                </div>

                                {/* Delivery Info */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Delivery</h3>
                                    <Card padding="sm" className="space-y-3">
                                        {selectedOrder.delivery_address && (
                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                <MapPin size={16} weight="duotone" className="mt-0.5" />
                                                <span>
                                                    {[
                                                        selectedOrder.delivery_address.line1,
                                                        selectedOrder.delivery_address.line2,
                                                        selectedOrder.delivery_address.city,
                                                        selectedOrder.delivery_address.postcode,
                                                    ].filter(Boolean).join(', ')}
                                                </span>
                                            </div>
                                        )}
                                        {selectedOrder.estimated_delivery && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar size={16} weight="duotone" />
                                                Est. delivery: {new Date(selectedOrder.estimated_delivery).toLocaleDateString()}
                                            </div>
                                        )}
                                    </Card>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mt-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                                <Card padding="none">
                                    <div className="divide-y divide-gray-100">
                                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                            selectedOrder.items.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between p-4">
                                                    <div className="flex items-center gap-3">
                                                        {item.product?.image_url ? (
                                                            <img
                                                                src={item.product.image_url}
                                                                alt={item.product.name}
                                                                className="w-12 h-12 rounded-lg object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-lg bg-gray-100" />
                                                        )}
                                                        <div>
                                                            <p className="font-medium">{item.product?.name || "Product"}</p>
                                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">
                                                No items found
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-t border-gray-200 p-4">
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Total</span>
                                            <span>{formatCurrency(selectedOrder.total || 0)}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" leftIcon={<Printer size={16} weight="duotone" />}>
                                    Print Label
                                </Button>
                                {nextStatusMap[selectedOrder.status] && (
                                    <Button
                                        isLoading={updateStatusMutation.isPending}
                                        onClick={() => {
                                            handleUpdateStatus(selectedOrder.id, nextStatusMap[selectedOrder.status]);
                                        }}
                                    >
                                        Mark as {statusConfig[nextStatusMap[selectedOrder.status]]?.label || nextStatusMap[selectedOrder.status]}
                                    </Button>
                                )}
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
