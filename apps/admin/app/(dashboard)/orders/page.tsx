"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Filter,
    Download,
    Eye,
    MoreVertical,
    Package,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    RefreshCw,
} from "lucide-react";
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
    Tabs,
    TabsList,
    TabsTrigger,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Avatar,
    AvatarFallback,
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
        customer: { name: "John Doe", email: "john@example.com" },
        vendor: { name: "African Spice House", id: "v1" },
        items: 3,
        total: 45.99,
        status: "pending",
        paymentStatus: "paid",
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
        id: "ORD-2024-002",
        customer: { name: "Jane Smith", email: "jane@example.com" },
        vendor: { name: "Mama's Kitchen", id: "v2" },
        items: 5,
        total: 89.50,
        status: "preparing",
        paymentStatus: "paid",
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
        id: "ORD-2024-003",
        customer: { name: "Mike Johnson", email: "mike@example.com" },
        vendor: { name: "Lagos Foods", id: "v3" },
        items: 2,
        total: 23.00,
        status: "delivered",
        paymentStatus: "paid",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
        id: "ORD-2024-004",
        customer: { name: "Sarah Wilson", email: "sarah@example.com" },
        vendor: { name: "African Spice House", id: "v1" },
        items: 4,
        total: 67.25,
        status: "cancelled",
        paymentStatus: "refunded",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    },
    {
        id: "ORD-2024-005",
        customer: { name: "Chris Brown", email: "chris@example.com" },
        vendor: { name: "Naija Delights", id: "v4" },
        items: 7,
        total: 112.00,
        status: "out_for_delivery",
        paymentStatus: "paid",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
];

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
};

export default function OrdersPage() {
    const [orders] = useState(mockOrders);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
    const [refundDialogOpen, setRefundDialogOpen] = useState(false);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const orderCounts = {
        all: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        preparing: orders.filter((o) => o.status === "preparing" || o.status === "confirmed").length,
        in_transit: orders.filter((o) => o.status === "out_for_delivery").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
        cancelled: orders.filter((o) => o.status === "cancelled").length,
    };

    const columns = [
        {
            key: "id",
            header: "Order ID",
            sortable: true,
            render: (order: typeof mockOrders[0]) => (
                <span className="font-medium text-primary">{order.id}</span>
            ),
        },
        {
            key: "customer",
            header: "Customer",
            render: (order: typeof mockOrders[0]) => (
                <div className="flex items-center gap-3">
                    <Avatar size="sm">
                        <AvatarFallback className="bg-slate-100 text-slate-600">
                            {order.customer.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-slate-900">{order.customer.name}</p>
                        <p className="text-xs text-slate-500">{order.customer.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "vendor",
            header: "Vendor",
            sortable: true,
            render: (order: typeof mockOrders[0]) => (
                <span className="text-slate-600">{order.vendor.name}</span>
            ),
        },
        {
            key: "total",
            header: "Total",
            sortable: true,
            render: (order: typeof mockOrders[0]) => (
                <span className="font-semibold">{formatCurrency(order.total)}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (order: typeof mockOrders[0]) => {
                const config = statusConfig[order.status as keyof typeof statusConfig];
                return <Badge variant={config.variant}>{config.label}</Badge>;
            },
        },
        {
            key: "paymentStatus",
            header: "Payment",
            render: (order: typeof mockOrders[0]) => {
                const config = paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig];
                return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
            },
        },
        {
            key: "createdAt",
            header: "Date",
            sortable: true,
            render: (order: typeof mockOrders[0]) => (
                <span className="text-slate-500 text-sm">{formatRelativeTime(order.createdAt)}</span>
            ),
        },
        {
            key: "actions",
            header: "",
            width: "100px",
            render: (order: typeof mockOrders[0]) => (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedOrder(order)}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    {order.paymentStatus === "paid" && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                            onClick={() => {
                                setSelectedOrder(order);
                                setRefundDialogOpen(true);
                            }}
                        >
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Header title="Orders" description="Manage all platform orders" />

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
                                <p className={`text-2xl font-bold mb-1`}>{stat.count}</p>
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
                                    leftIcon={<Search className="w-4 h-4" />}
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
                            <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />} className="w-full sm:w-auto">
                                Export Orders
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Orders Table */}
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
            </div>

            {/* Refund Dialog */}
            <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
                <DialogContent size="sm">
                    <DialogHeader>
                        <DialogTitle>Process Refund</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to refund {selectedOrder?.id}? This will refund {formatCurrency(selectedOrder?.total || 0)} to the customer.
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
                        <Button onClick={() => setRefundDialogOpen(false)}>
                            Process Refund
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
