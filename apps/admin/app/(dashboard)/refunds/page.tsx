"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowsClockwise,
    MagnifyingGlass,
    CheckCircle,
    XCircle,
    Clock,
    CurrencyGbp,
    Eye,
    Warning,
    CreditCard,
    Wallet,
} from "@phosphor-icons/react";
import { Header } from "../../../components/Header";
import {
    Card,
    Button,
    Badge,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Avatar,
    AvatarFallback,
    DataTable,
    formatCurrency,
} from "@zora/ui-web";

// Mock refunds data
const refunds = [
    {
        id: "REF-001",
        orderId: "ORD-4523",
        customer: "Sarah Johnson",
        email: "sarah.j@email.com",
        amount: 45.99,
        reason: "Item not as described",
        status: "requested",
        paymentMethod: "card",
        requestedAt: "2 hours ago",
        items: ["Jollof Rice Spice Mix x2", "Suya Pepper x1"],
    },
    {
        id: "REF-002",
        orderId: "ORD-4501",
        customer: "Amara Diallo",
        email: "amara.d@email.com",
        amount: 8.99,
        reason: "Damaged product",
        status: "approved",
        paymentMethod: "card",
        requestedAt: "1 day ago",
        items: ["Palm Oil (1L) x1"],
    },
    {
        id: "REF-003",
        orderId: "ORD-4489",
        customer: "Michael Okonkwo",
        email: "m.okonkwo@email.com",
        amount: 23.50,
        reason: "Order not received",
        status: "processing",
        paymentMethod: "klarna",
        requestedAt: "2 days ago",
        items: ["Egusi Seeds x3", "Garri x1"],
    },
    {
        id: "REF-004",
        orderId: "ORD-4456",
        customer: "David Mensah",
        email: "david.m@email.com",
        amount: 15.00,
        reason: "Changed mind",
        status: "completed",
        paymentMethod: "card",
        requestedAt: "3 days ago",
        items: ["Plantain Chips x5"],
    },
    {
        id: "REF-005",
        orderId: "ORD-4423",
        customer: "Ngozi Eze",
        email: "ngozi.e@email.com",
        amount: 67.25,
        reason: "Wrong item sent",
        status: "rejected",
        paymentMethod: "clearpay",
        requestedAt: "5 days ago",
        items: ["Ogbono x2", "Stockfish x1"],
    },
];

const statusConfig = {
    requested: { label: "Requested", variant: "warning" as const, icon: Clock },
    approved: { label: "Approved", variant: "info" as const, icon: CheckCircle },
    processing: { label: "Processing", variant: "primary" as const, icon: ArrowsClockwise },
    completed: { label: "Completed", variant: "success" as const, icon: CheckCircle },
    rejected: { label: "Rejected", variant: "error" as const, icon: XCircle },
};

export default function RefundsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedRefund, setSelectedRefund] = useState<typeof refunds[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refundType, setRefundType] = useState<"original" | "credit">("original");

    const filteredRefunds = refunds.filter(refund => {
        const matchesSearch = refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            refund.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            refund.orderId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || refund.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const pendingTotal = refunds.filter(r => r.status === "requested").reduce((acc, r) => acc + r.amount, 0);
    const processedTotal = refunds.filter(r => r.status === "completed").reduce((acc, r) => acc + r.amount, 0);

    const handleViewRefund = (refund: typeof refunds[0]) => {
        setSelectedRefund(refund);
        setIsModalOpen(true);
    };

    const columns = [
        {
            key: "id",
            header: "Refund ID",
            render: (refund: typeof refunds[0]) => (
                <span className="font-medium text-gray-900">{refund.id}</span>
            ),
        },
        {
            key: "customer",
            header: "Customer",
            render: (refund: typeof refunds[0]) => (
                <div className="flex items-center gap-3">
                    <Avatar size="sm">
                        <AvatarFallback>
                            {refund.customer.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-gray-900">{refund.customer}</p>
                        <p className="text-sm text-gray-500">{refund.orderId}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "amount",
            header: "Amount",
            render: (refund: typeof refunds[0]) => (
                <span className="font-semibold text-gray-900">{formatCurrency(refund.amount)}</span>
            ),
        },
        {
            key: "reason",
            header: "Reason",
            render: (refund: typeof refunds[0]) => (
                <span className="text-gray-600">{refund.reason}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (refund: typeof refunds[0]) => {
                const config = statusConfig[refund.status as keyof typeof statusConfig];
                return <Badge variant={config.variant}>{config.label}</Badge>;
            },
        },
        {
            key: "requestedAt",
            header: "Requested",
        },
        {
            key: "actions",
            header: "Actions",
            render: (refund: typeof refunds[0]) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewRefund(refund)}
                    >
                        <Eye size={16} weight="duotone" />
                    </Button>
                    {refund.status === "requested" && (
                        <>
                            <Button variant="ghost" size="sm" className="text-green-600">
                                <CheckCircle size={16} weight="duotone" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                                <XCircle size={16} weight="duotone" />
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Header
                title="Refund Processing"
                description="Manage customer refund requests"
            />

            <div className="p-4 sm:p-6 lg:p-8">
                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Clock size={24} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Pending Requests</p>
                                <p className="text-2xl font-bold">{refunds.filter(r => r.status === "requested").length}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <CurrencyGbp size={24} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Pending Amount</p>
                                <p className="text-2xl font-bold">{formatCurrency(pendingTotal)}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <ArrowsClockwise size={24} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Processing</p>
                                <p className="text-2xl font-bold">{refunds.filter(r => r.status === "processing").length}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <CheckCircle size={24} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Processed This Month</p>
                                <p className="text-2xl font-bold">{formatCurrency(processedTotal)}</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col sm:flex-row gap-4 mb-6"
                >
                    <div className="relative flex-1">
                        <MagnifyingGlass size={20} weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search refunds..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="requested">Requested</option>
                        <option value="approved">Approved</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </motion.div>

                {/* Refunds Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card padding="none">
                        <DataTable
                            columns={columns}
                            data={filteredRefunds}
                            emptyMessage="No refund requests found"
                            getRowId={(refund) => refund.id}
                        />
                    </Card>
                </motion.div>
            </div>

            {/* Refund Detail Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Refund Details</DialogTitle>
                    </DialogHeader>
                    {selectedRefund && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Refund ID</p>
                                    <p className="font-semibold text-lg">{selectedRefund.id}</p>
                                </div>
                                <Badge variant={statusConfig[selectedRefund.status as keyof typeof statusConfig].variant}>
                                    {statusConfig[selectedRefund.status as keyof typeof statusConfig].label}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Customer</p>
                                    <p className="font-medium">{selectedRefund.customer}</p>
                                    <p className="text-sm text-gray-500">{selectedRefund.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="font-medium">{selectedRefund.orderId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Amount</p>
                                    <p className="font-semibold text-lg text-primary">{formatCurrency(selectedRefund.amount)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Payment Method</p>
                                    <p className="font-medium capitalize">{selectedRefund.paymentMethod}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-2">Reason</p>
                                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRefund.reason}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-2">Items</p>
                                <ul className="bg-gray-50 p-3 rounded-lg space-y-1">
                                    {selectedRefund.items.map((item, index) => (
                                        <li key={index} className="text-gray-700">{item}</li>
                                    ))}
                                </ul>
                            </div>

                            {selectedRefund.status === "requested" && (
                                <>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-3">Refund to</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => setRefundType("original")}
                                                className={`p-4 rounded-xl border-2 transition-colors ${refundType === "original"
                                                    ? "border-primary bg-primary/5"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <CreditCard size={24} weight="duotone" className={`mx-auto mb-2 ${refundType === "original" ? "text-primary" : "text-gray-400"}`} />
                                                <p className="font-medium">Original Payment</p>
                                                <p className="text-xs text-gray-500">Refund to {selectedRefund.paymentMethod}</p>
                                            </button>
                                            <button
                                                onClick={() => setRefundType("credit")}
                                                className={`p-4 rounded-xl border-2 transition-colors ${refundType === "credit"
                                                    ? "border-primary bg-primary/5"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <Wallet size={24} weight="duotone" className={`mx-auto mb-2 ${refundType === "credit" ? "text-primary" : "text-gray-400"}`} />
                                                <p className="font-medium">Store Credit</p>
                                                <p className="text-xs text-gray-500">Add to customer balance</p>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t">
                                        <Button className="flex-1" leftIcon={<CheckCircle size={16} weight="duotone" />}>
                                            Approve Refund
                                        </Button>
                                        <Button variant="outline" className="flex-1 text-red-600 border-red-300" leftIcon={<XCircle size={16} weight="duotone" />}>
                                            Reject
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
