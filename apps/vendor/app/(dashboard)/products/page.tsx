"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Package,
    ArrowUpDown,
    Download,
    Upload,
} from "lucide-react";
import { Header } from "../../../components/Header";
import {
    Button,
    Input,
    Card,
    Badge,
    DataTable,
    EmptyState,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    formatCurrency,
    staggerContainer,
    staggerItem,
} from "@zora/ui-web";

// Mock product data
const mockProducts = [
    {
        id: "1",
        name: "Premium Suya Spice Mix",
        sku: "SSM-001",
        price: 8.99,
        stock: 145,
        category: "Spices",
        status: "active",
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100",
        sales: 234,
    },
    {
        id: "2",
        name: "Nigerian Palm Oil (1L)",
        sku: "NPO-002",
        price: 12.50,
        stock: 67,
        category: "Oils",
        status: "active",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100",
        sales: 189,
    },
    {
        id: "3",
        name: "Dried Stockfish",
        sku: "DSF-003",
        price: 24.99,
        stock: 12,
        category: "Seafood",
        status: "low_stock",
        image: "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=100",
        sales: 156,
    },
    {
        id: "4",
        name: "Egusi Seeds (500g)",
        sku: "EGS-004",
        price: 6.99,
        stock: 0,
        category: "Seeds",
        status: "out_of_stock",
        image: "https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=100",
        sales: 98,
    },
    {
        id: "5",
        name: "Jollof Rice Seasoning",
        sku: "JRS-005",
        price: 5.49,
        stock: 234,
        category: "Spices",
        status: "active",
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100",
        sales: 312,
    },
];

const categories = ["All", "Spices", "Oils", "Seafood", "Seeds", "Grains", "Vegetables"];

const statusConfig = {
    active: { label: "Active", variant: "success" as const },
    low_stock: { label: "Low Stock", variant: "warning" as const },
    out_of_stock: { label: "Out of Stock", variant: "error" as const },
    draft: { label: "Draft", variant: "default" as const },
};

export default function ProductsPage() {
    const [products, setProducts] = useState(mockProducts);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<typeof mockProducts[0] | null>(null);
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");

    // Filter products
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesStatus = selectedStatus === "all" || product.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const handleDelete = () => {
        if (productToDelete) {
            setProducts(products.filter(p => p.id !== productToDelete.id));
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    const columns = [
        {
            key: "name",
            header: "Product",
            sortable: true,
            render: (product: typeof mockProducts[0]) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sku}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "category",
            header: "Category",
            sortable: true,
        },
        {
            key: "price",
            header: "Price",
            sortable: true,
            render: (product: typeof mockProducts[0]) => (
                <span className="font-medium">{formatCurrency(product.price)}</span>
            ),
        },
        {
            key: "stock",
            header: "Stock",
            sortable: true,
            render: (product: typeof mockProducts[0]) => (
                <span className={product.stock === 0 ? "text-red-600" : product.stock < 20 ? "text-yellow-600" : "text-gray-900"}>
                    {product.stock} units
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (product: typeof mockProducts[0]) => {
                const config = statusConfig[product.status as keyof typeof statusConfig];
                return <Badge variant={config.variant}>{config.label}</Badge>;
            },
        },
        {
            key: "sales",
            header: "Sales",
            sortable: true,
            render: (product: typeof mockProducts[0]) => (
                <span className="text-gray-600">{product.sales} sold</span>
            ),
        },
        {
            key: "actions",
            header: "",
            width: "100px",
            render: (product: typeof mockProducts[0]) => (
                <div className="flex items-center gap-1">
                    <Link href={`/products/${product.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Link href={`/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                            setProductToDelete(product);
                            setDeleteDialogOpen(true);
                        }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Header title="Products" description="Manage your product catalog" />

            <div className="p-4 sm:p-6 lg:p-8">
                {/* Stats Row */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: "Total Products", value: products.length, color: "bg-blue-100 text-blue-600" },
                        { label: "Active", value: products.filter(p => p.status === "active").length, color: "bg-green-100 text-green-600" },
                        { label: "Low Stock", value: products.filter(p => p.status === "low_stock").length, color: "bg-yellow-100 text-yellow-600" },
                        { label: "Out of Stock", value: products.filter(p => p.status === "out_of_stock").length, color: "bg-red-100 text-red-600" },
                    ].map((stat, index) => (
                        <motion.div key={stat.label} variants={staggerItem}>
                            <Card className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Filters & Actions */}
                <Card className="mb-6">
                    <div className="flex flex-col gap-4">
                        {/* Search and Filters Row */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="w-full sm:w-64 lg:w-80">
                                <Input
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    leftIcon={<Search className="w-4 h-4" />}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-full sm:w-36">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger className="w-full sm:w-36">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="low_stock">Low Stock</SelectItem>
                                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {/* Action Buttons Row */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 sm:border-0 sm:pt-0 sm:justify-end">
                            <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />} className="flex-1 sm:flex-none">
                                <span className="hidden sm:inline">Export</span>
                                <span className="sm:hidden">Export</span>
                            </Button>
                            <Button variant="outline" size="sm" leftIcon={<Upload className="w-4 h-4" />} className="flex-1 sm:flex-none">
                                <span className="hidden sm:inline">Import</span>
                                <span className="sm:hidden">Import</span>
                            </Button>
                            <Link href="/products/new" className="flex-1 sm:flex-none">
                                <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} className="w-full">
                                    <span className="hidden sm:inline">Add Product</span>
                                    <span className="sm:hidden">Add</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>

                {/* Products Table/Grid */}
                {filteredProducts.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title="No products found"
                        description={searchTerm ? "Try adjusting your search or filters" : "Get started by adding your first product"}
                        action={{
                            label: "Add Product",
                            onClick: () => { },
                        }}
                    />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card padding="none">
                            <DataTable
                                data={filteredProducts}
                                columns={columns}
                                getRowId={(item) => item.id}
                            />
                        </Card>
                    </motion.div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent size="sm">
                    <DialogHeader>
                        <DialogTitle>Delete Product</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
