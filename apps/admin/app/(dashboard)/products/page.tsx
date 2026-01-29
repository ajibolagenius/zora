"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Package,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Eye,
    MoreHorizontal,
    AlertTriangle,
    Clock,
    Store,
} from "lucide-react";
import { Header } from "../../../components/Header";
import {
    Card,
    Button,
    Badge,
    Input,
    DataTable,
    Modal,
    formatCurrency,
} from "@zora/ui-web";

// Mock products data
const products = [
    { id: "1", name: "Jollof Rice Spice Mix", vendor: "African Spice House", category: "Spices", price: 5.99, status: "pending", image: null, createdAt: "2 hours ago" },
    { id: "2", name: "Suya Pepper Blend", vendor: "Nigerian Delights", category: "Spices", price: 6.49, status: "approved", image: null, createdAt: "1 day ago" },
    { id: "3", name: "Palm Oil (1L)", vendor: "West African Foods", category: "Oils", price: 8.99, status: "pending", image: null, createdAt: "3 hours ago" },
    { id: "4", name: "Egusi Seeds (500g)", vendor: "African Spice House", category: "Groceries", price: 4.99, status: "flagged", image: null, createdAt: "5 hours ago" },
    { id: "5", name: "Plantain Chips", vendor: "Lagos Street Food", category: "Snacks", price: 3.49, status: "approved", image: null, createdAt: "2 days ago" },
    { id: "6", name: "Garri (2kg)", vendor: "Nigerian Delights", category: "Groceries", price: 7.99, status: "rejected", image: null, createdAt: "1 day ago" },
];

const statusConfig = {
    pending: { label: "Pending Review", variant: "warning" as const, icon: Clock },
    approved: { label: "Approved", variant: "success" as const, icon: CheckCircle },
    flagged: { label: "Flagged", variant: "error" as const, icon: AlertTriangle },
    rejected: { label: "Rejected", variant: "error" as const, icon: XCircle },
};

export default function ProductModerationPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.vendor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || product.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const pendingCount = products.filter(p => p.status === "pending").length;
    const flaggedCount = products.filter(p => p.status === "flagged").length;

    const handleViewProduct = (product: typeof products[0]) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const columns = [
        {
            header: "Product",
            accessor: "name" as const,
            cell: (product: typeof products[0]) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Vendor",
            accessor: "vendor" as const,
            cell: (product: typeof products[0]) => (
                <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{product.vendor}</span>
                </div>
            ),
        },
        {
            header: "Price",
            accessor: "price" as const,
            cell: (product: typeof products[0]) => (
                <span className="font-medium text-gray-900">{formatCurrency(product.price)}</span>
            ),
        },
        {
            header: "Status",
            accessor: "status" as const,
            cell: (product: typeof products[0]) => {
                const config = statusConfig[product.status as keyof typeof statusConfig];
                return <Badge variant={config.variant}>{config.label}</Badge>;
            },
        },
        {
            header: "Submitted",
            accessor: "createdAt" as const,
        },
        {
            header: "Actions",
            accessor: "id" as const,
            cell: (product: typeof products[0]) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewProduct(product)}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    {product.status === "pending" && (
                        <>
                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                                <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <XCircle className="w-4 h-4" />
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
                title="Product Moderation"
                description="Review and approve product listings"
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
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Pending Review</p>
                                <p className="text-2xl font-bold">{pendingCount}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Flagged</p>
                                <p className="text-2xl font-bold">{flaggedCount}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Approved Today</p>
                                <p className="text-2xl font-bold">12</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Total Products</p>
                                <p className="text-2xl font-bold">5,234</p>
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
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products or vendors..."
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
                        <option value="pending">Pending Review</option>
                        <option value="approved">Approved</option>
                        <option value="flagged">Flagged</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </motion.div>

                {/* Products Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card padding="none">
                        <DataTable
                            columns={columns}
                            data={filteredProducts}
                            emptyMessage="No products found"
                        />
                    </Card>
                </motion.div>
            </div>

            {/* Product Detail Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Product Details"
            >
                {selectedProduct && (
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                                <Package className="w-10 h-10 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{selectedProduct.name}</h3>
                                <p className="text-gray-500">{selectedProduct.vendor}</p>
                                <Badge variant={statusConfig[selectedProduct.status as keyof typeof statusConfig].variant} className="mt-2">
                                    {statusConfig[selectedProduct.status as keyof typeof statusConfig].label}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Category</p>
                                <p className="font-medium">{selectedProduct.category}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Price</p>
                                <p className="font-medium">{formatCurrency(selectedProduct.price)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Submitted</p>
                                <p className="font-medium">{selectedProduct.createdAt}</p>
                            </div>
                        </div>

                        {selectedProduct.status === "pending" && (
                            <div className="flex gap-3 pt-4 border-t">
                                <Button className="flex-1" leftIcon={<CheckCircle className="w-4 h-4" />}>
                                    Approve
                                </Button>
                                <Button variant="outline" className="flex-1 text-red-600 border-red-300" leftIcon={<XCircle className="w-4 h-4" />}>
                                    Reject
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
}
