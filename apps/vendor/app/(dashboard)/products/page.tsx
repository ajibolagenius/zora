"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    Plus,
    MagnifyingGlass,
    Package,
    PencilSimple,
    Trash,
    Eye,
    DownloadSimple,
    UploadSimple,
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
    formatCurrency,
    staggerContainer,
    staggerItem,
    SkeletonCard,
} from "@zora/ui-web";
import { useAuth, useVendorProducts, useDeleteProduct } from "../../../hooks";
import type { Product } from "@zora/types";

const categories = ["All", "Spices", "Oils", "Seafood", "Seeds", "Grains", "Vegetables", "Meat", "Beverages"];

const statusConfig = {
    active: { label: "Active", variant: "success" as const },
    low_stock: { label: "Low Stock", variant: "warning" as const },
    out_of_stock: { label: "Out of Stock", variant: "error" as const },
    draft: { label: "Draft", variant: "default" as const },
};

function getProductStatus(product: Product): string {
    if (!product.in_stock || product.stock_quantity === 0) return "out_of_stock";
    if (product.stock_quantity && product.stock_quantity < 20) return "low_stock";
    return "active";
}

export default function ProductsPage() {
    const { vendor } = useAuth();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    // Fetch products from database
    const {
        data: productsData,
        isLoading,
        isError,
        refetch,
    } = useVendorProducts(vendor?.id ?? null);

    // Delete product mutation
    const deleteProductMutation = useDeleteProduct();

    // Filter products
    const filteredProducts = useMemo(() => {
        if (!productsData?.data) return [];

        return productsData.data.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory =
                selectedCategory === "All" || product.category === selectedCategory;
            const productStatus = getProductStatus(product);
            const matchesStatus = selectedStatus === "all" || productStatus === selectedStatus;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [productsData?.data, searchTerm, selectedCategory, selectedStatus]);

    // Calculate stats
    const stats = useMemo(() => {
        const products = productsData?.data || [];
        return {
            total: products.length,
            active: products.filter((p) => getProductStatus(p) === "active").length,
            lowStock: products.filter((p) => getProductStatus(p) === "low_stock").length,
            outOfStock: products.filter((p) => getProductStatus(p) === "out_of_stock").length,
        };
    }, [productsData?.data]);

    const handleDelete = async () => {
        if (productToDelete) {
            try {
                await deleteProductMutation.mutateAsync(productToDelete.id);
                setDeleteDialogOpen(false);
                setProductToDelete(null);
            } catch (error) {
                console.error("Failed to delete product:", error);
            }
        }
    };

    const columns = [
        {
            key: "name",
            header: "Product",
            sortable: true,
            render: (product: Product) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.image_url ? (
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package size={24} weight="duotone" className="text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.id.slice(0, 8)}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "category",
            header: "Category",
            sortable: true,
            render: (product: Product) => (
                <span className="capitalize">{product.category || "Uncategorized"}</span>
            ),
        },
        {
            key: "price",
            header: "Price",
            sortable: true,
            render: (product: Product) => (
                <span className="font-medium">{formatCurrency(product.price)}</span>
            ),
        },
        {
            key: "stock",
            header: "Stock",
            sortable: true,
            render: (product: Product) => {
                const stock = product.stock_quantity ?? 0;
                return (
                    <span
                        className={
                            stock === 0
                                ? "text-red-600"
                                : stock < 20
                                    ? "text-yellow-600"
                                    : "text-gray-900"
                        }
                    >
                        {stock} units
                    </span>
                );
            },
        },
        {
            key: "status",
            header: "Status",
            render: (product: Product) => {
                const status = getProductStatus(product);
                const config = statusConfig[status as keyof typeof statusConfig];
                return <Badge variant={config.variant}>{config.label}</Badge>;
            },
        },
        {
            key: "rating",
            header: "Rating",
            sortable: true,
            render: (product: Product) => (
                <span className="text-gray-600">
                    {product.rating?.toFixed(1) || "N/A"} ({product.review_count || 0})
                </span>
            ),
        },
        {
            key: "actions",
            header: "",
            width: "100px",
            render: (product: Product) => (
                <div className="flex items-center gap-1">
                    <Link href={`/products/${product.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye size={16} weight="duotone" />
                        </Button>
                    </Link>
                    <Link href={`/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <PencilSimple size={16} weight="duotone" />
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
                        <Trash size={16} weight="duotone" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Header
                title="Products"
                description="Manage your product catalog"
                action={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        leftIcon={<ArrowsClockwise size={16} weight="duotone" />}
                    >
                        Refresh
                    </Button>
                }
            />

            <div className="p-4 sm:p-6 lg:p-8">
                {/* Stats Row */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: "Total Products", value: stats.total, color: "bg-blue-100 text-blue-600" },
                        { label: "Active", value: stats.active, color: "bg-green-100 text-green-600" },
                        { label: "Low Stock", value: stats.lowStock, color: "bg-yellow-100 text-yellow-600" },
                        { label: "Out of Stock", value: stats.outOfStock, color: "bg-red-100 text-red-600" },
                    ].map((stat) => (
                        <motion.div key={stat.label} variants={staggerItem}>
                            <Card className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                    <Package size={24} weight="duotone" />
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
                                    leftIcon={<MagnifyingGlass size={16} weight="duotone" />}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-full sm:w-36">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
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
                            <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<DownloadSimple size={16} weight="duotone" />}
                                className="flex-1 sm:flex-none"
                            >
                                <span className="hidden sm:inline">Export</span>
                                <span className="sm:hidden">Export</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<UploadSimple size={16} weight="duotone" />}
                                className="flex-1 sm:flex-none"
                            >
                                <span className="hidden sm:inline">Import</span>
                                <span className="sm:hidden">Import</span>
                            </Button>
                            <Link href="/products/new" className="flex-1 sm:flex-none">
                                <Button size="sm" leftIcon={<Plus size={16} weight="duotone" />} className="w-full">
                                    <span className="hidden sm:inline">Add Product</span>
                                    <span className="sm:hidden">Add</span>
                                </Button>
                            </Link>
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load products</h3>
                        <p className="text-gray-500 mb-4">There was an error loading your products.</p>
                        <Button onClick={() => refetch()}>Try Again</Button>
                    </Card>
                )}

                {/* Products Table/Grid */}
                {!isLoading && !isError && filteredProducts.length === 0 && (
                    <EmptyState
                        icon={Package}
                        title="No products found"
                        description={
                            searchTerm
                                ? "Try adjusting your search or filters"
                                : "Get started by adding your first product"
                        }
                        action={{
                            label: "Add Product",
                            onClick: () => { },
                        }}
                    />
                )}

                {!isLoading && !isError && filteredProducts.length > 0 && (
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
                            Are you sure you want to delete "{productToDelete?.name}"? This action cannot
                            be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            isLoading={deleteProductMutation.isPending}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
