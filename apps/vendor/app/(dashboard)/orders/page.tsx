"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    Package,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    Eye,
    ChevronRight,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Printer,
} from "lucide-react";
import { Header } from "../../../components/Header";
import {
    Button,
    Input,
    Card,
    Badge,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Avatar,
    AvatarFallback,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    EmptyState,
    formatCurrency,
    formatDate,
    formatRelativeTime,
    staggerContainer,
    staggerItem,
} from "@zora/ui-web";

// Mock orders data
const mockOrders = [
    {
        id: "ORD-2024-001",
        customer: { name: "John Doe", email: "john@example.com", phone: "+44 7123 456789", avatar: null },
        items: [
            { name: "Premium Suya Spice Mix", quantity: 2, price: 8.99 },
            { name: "Jollof Rice Seasoning", quantity: 1, price: 5.49 },
        ],
        total: 23.47,
        status: "pending",
        deliveryAddress: "123 High Street, London, SW1A 1AA",
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
        estimatedDelivery: "Jan 30, 2026",
    },
    {
        id: "ORD-2024-002",
        customer: { name: "Jane Smith", email: "jane@example.com", phone: "+44 7234 567890", avatar: null },
        items: [
            { name: "Nigerian Palm Oil (1L)", quantity: 3, price: 12.50 },
            { name: "Egusi Seeds (500g)", quantity: 2, price: 6.99 },
        ],
        total: 51.48,
        status: "confirmed",
        deliveryAddress: "456 Baker Street, London, NW1 6XE",
        createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
        estimatedDelivery: "Jan 30, 2026",
    },
    {
        id: "ORD-2024-003",
        customer: { name: "Mike Johnson", email: "mike@example.com", phone: "+44 7345 678901", avatar: null },
        items: [
            { name: "Dried Stockfish", quantity: 1, price: 24.99 },
        ],
        total: 24.99,
        status: "preparing",
        deliveryAddress: "789 Oxford Road, Manchester, M1 5AN",
        createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        estimatedDelivery: "Jan 31, 2026",
    },
    {
        id: "ORD-2024-004",
        customer: { name: "Sarah Wilson", email: "sarah@example.com", phone: "+44 7456 789012", avatar: null },
        items: [
            { name: "Premium Suya Spice Mix", quantity: 5, price: 8.99 },
        ],
        total: 44.95,
        status: "ready",
        deliveryAddress: "321 Queens Road, Birmingham, B1 1RS",
        createdAt: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
        estimatedDelivery: "Jan 30, 2026",
    },
    {
        id: "ORD-2024-005",
        customer: { name: "Chris Brown", email: "chris@example.com", phone: "+44 7567 890123", avatar: null },
        items: [
            { name: "Nigerian Palm Oil (1L)", quantity: 2, price: 12.50 },
            { name: "Jollof Rice Seasoning", quantity: 3, price: 5.49 },
        ],
        total: 41.47,
        status: "out_for_delivery",
        deliveryAddress: "654 Park Lane, Leeds, LS1 3BE",
        createdAt: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
        estimatedDelivery: "Jan 29, 2026",
    },
];

const statusConfig = {
    pending: { label: "Pending", variant: "warning" as const, icon: Clock, color: "text-yellow-600 bg-yellow-100" },
    confirmed: { label: "Confirmed", variant: "info" as const, icon: CheckCircle, color: "text-blue-600 bg-blue-100" },
    preparing: { label: "Preparing", variant: "primary" as const, icon: Package, color: "text-purple-600 bg-purple-100" },
    ready: { label: "Ready", variant: "success" as const, icon: CheckCircle, color: "text-green-600 bg-green-100" },
    out_for_delivery: { label: "Out for Delivery", variant: "info" as const, icon: Truck, color: "text-blue-600 bg-blue-100" },
    delivered: { label: "Delivered", variant: "success" as const, icon: CheckCircle, color: "text-green-600 bg-green-100" },
    cancelled: { label: "Cancelled", variant: "error" as const, icon: XCircle, color: "text-red-600 bg-red-100" },
};

const nextStatusMap: Record<string, string> = {
    pending: "confirmed",
    confirmed: "preparing",
    preparing: "ready",
    ready: "out_for_delivery",
    out_for_delivery: "delivered",
};

export default function OrdersPage() {
    const [orders, setOrders] = useState(mockOrders);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTab, setSelectedTab] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = selectedTab === "all" || order.status === selectedTab;
        return matchesSearch && matchesTab;
    });

    const updateOrderStatus = (orderId: string, newStatus: string) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
        if (selectedOrder?.id === orderId) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
    };

    const orderCounts = {
        all: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        confirmed: orders.filter((o) => o.status === "confirmed").length,
        preparing: orders.filter((o) => o.status === "preparing").length,
        ready: orders.filter((o) => o.status === "ready").length,
        out_for_delivery: orders.filter((o) => o.status === "out_for_delivery").length,
    };

    return (
        <>
            <Header title="Orders" description="Manage and fulfill customer orders" />

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
                                leftIcon={<Search className="w-4 h-4" />}
                                inputSize="sm"
                            />
                        </div>
                    </div>
                </Card>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title="No orders found"
                        description={searchTerm ? "Try adjusting your search" : "New orders will appear here"}
                    />
                ) : (
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="space-y-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredOrders.map((order, index) => {
                                const status = statusConfig[order.status as keyof typeof statusConfig];
                                const StatusIcon = status.icon;
                                const nextStatus = nextStatusMap[order.status];

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
                                                                    <StatusIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                                                        <p className="font-semibold text-gray-900">{order.id}</p>
                                                                        <Badge variant={status.variant}>{status.label}</Badge>
                                                                    </div>
                                                                    <p className="text-sm text-gray-500 truncate">
                                                                        {order.customer.name} • {order.items.length} item{order.items.length > 1 ? "s" : ""} • {formatRelativeTime(order.createdAt)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pl-13 sm:pl-0">
                                                                <div className="text-left sm:text-right">
                                                                    <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                                                                    <p className="text-sm text-gray-500">Est. {order.estimatedDelivery}</p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {nextStatus && (
                                                                        <Button
                                                                            size="sm"
                                                                            className="text-xs sm:text-sm whitespace-nowrap"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                updateOrderStatus(order.id, nextStatus);
                                                                            }}
                                                                        >
                                                                            <span className="hidden sm:inline">Mark as </span>{statusConfig[nextStatus as keyof typeof statusConfig].label}
                                                                        </Button>
                                                                    )}
                                                                    <ChevronRight className="w-5 h-5 text-gray-400 hidden sm:block" />
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
                                        <DialogTitle>{selectedOrder.id}</DialogTitle>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Placed {formatRelativeTime(selectedOrder.createdAt)}
                                        </p>
                                    </div>
                                    <Badge variant={statusConfig[selectedOrder.status as keyof typeof statusConfig].variant}>
                                        {statusConfig[selectedOrder.status as keyof typeof statusConfig].label}
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
                                                    {selectedOrder.customer.name.split(" ").map((n) => n[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{selectedOrder.customer.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            {selectedOrder.customer.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="w-4 h-4" />
                                            {selectedOrder.customer.phone}
                                        </div>
                                    </Card>
                                </div>

                                {/* Delivery Info */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Delivery</h3>
                                    <Card padding="sm" className="space-y-3">
                                        <div className="flex items-start gap-2 text-sm text-gray-600">
                                            <MapPin className="w-4 h-4 mt-0.5" />
                                            {selectedOrder.deliveryAddress}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            Est. delivery: {selectedOrder.estimatedDelivery}
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mt-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                                <Card padding="none">
                                    <div className="divide-y divide-gray-100">
                                        {selectedOrder.items.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100" />
                                                    <div>
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-gray-200 p-4">
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Total</span>
                                            <span>{formatCurrency(selectedOrder.total)}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" leftIcon={<Printer className="w-4 h-4" />}>
                                    Print Label
                                </Button>
                                {nextStatusMap[selectedOrder.status] && (
                                    <Button
                                        onClick={() => {
                                            updateOrderStatus(selectedOrder.id, nextStatusMap[selectedOrder.status]);
                                        }}
                                    >
                                        Mark as {statusConfig[nextStatusMap[selectedOrder.status] as keyof typeof statusConfig].label}
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
