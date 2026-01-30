"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    PencilSimple,
    Trash,
    Package,
    WarningCircle,
    Star,
    TrendUp,
    Clock,
    Tag,
    MapPin,
    Scales,
    CurrencyDollar,
    Stack,
} from "@phosphor-icons/react";
import { Header } from "../../../../components/Header";
import {
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Badge,
    formatCurrency,
    SkeletonCard,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@zora/ui-web";
import { useAuth, useProductDetail, useDeleteProduct } from "../../../../hooks";
import { useState } from "react";

const statusConfig = {
    active: { label: "Active", variant: "success" as const },
    low_stock: { label: "Low Stock", variant: "warning" as const },
    out_of_stock: { label: "Out of Stock", variant: "error" as const },
    draft: { label: "Draft", variant: "default" as const },
};

function getProductStatus(product: { in_stock?: boolean; stock_quantity?: number | null }): string {
    if (!product.in_stock || product.stock_quantity === 0) return "out_of_stock";
    if (product.stock_quantity && product.stock_quantity < 20) return "low_stock";
    return "active";
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const productId = resolvedParams.id;
    const router = useRouter();
    const { vendor } = useAuth();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const { data: product, isLoading, isError, refetch } = useProductDetail(productId);
    const deleteProductMutation = useDeleteProduct();

    const handleDelete = async () => {
        try {
            await deleteProductMutation.mutateAsync(productId);
            router.push("/products");
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    if (isLoading) {
        return (
            <>
                <Header title="Product Details" description="Loading..." />
                <div className="p-8">
                    <SkeletonCard />
                </div>
            </>
        );
    }

    if (isError || !product) {
        return (
            <>
                <Header title="Product Details" description="Error loading product" />
                <div className="p-8">
                    <Card className="p-8 text-center">
                        <WarningCircle size={48} weight="duotone" className="mx-auto mb-4 text-red-500" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Product not found</h3>
                        <p className="text-gray-500 mb-4">The product you're looking for doesn't exist or you don't have access to it.</p>
                        <Link href="/products">
                            <Button>Back to Products</Button>
                        </Link>
                    </Card>
                </div>
            </>
        );
    }

    const status = getProductStatus(product);
    const config = statusConfig[status as keyof typeof statusConfig];

    return (
        <>
            <Header
                title={product.name}
                description="Product details and management"
                action={
                    <div className="flex items-center gap-2">
                        <Link href={`/products/${productId}/edit`}>
                            <Button variant="outline" size="sm" leftIcon={<PencilSimple size={16} weight="duotone" />}>
                                Edit
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            size="sm"
                            leftIcon={<Trash size={16} weight="duotone" />}
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            Delete
                        </Button>
                    </div>
                }
            />

            <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
                {/* Back Button */}
                <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft size={16} weight="duotone" />
                    Back to Products
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Image & Basic Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card>
                                <CardContent>
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Image */}
                                        <div className="w-full sm:w-48 h-48 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                            {product.image_url ? (
                                                <Image
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    width={192}
                                                    height={192}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package size={64} weight="duotone" className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                                                <Badge variant={config.variant}>{config.label}</Badge>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-4">SKU: {product.sku || product.id.slice(0, 8)}</p>
                                            <p className="text-gray-600 mb-4">{product.description || "No description provided."}</p>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <Star size={20} weight="duotone" className="text-yellow-400 fill-yellow-400" />
                                                    <span className="font-medium">{product.rating?.toFixed(1) || "N/A"}</span>
                                                    <span className="text-gray-500">({product.review_count || 0} reviews)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Pricing */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CurrencyDollar size={20} weight="duotone" className="text-primary" />
                                        Pricing
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Current Price</p>
                                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(product.price)}</p>
                                        </div>
                                        {product.compare_at_price && (
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Compare at Price</p>
                                                <p className="text-xl text-gray-400 line-through">{formatCurrency(product.compare_at_price)}</p>
                                            </div>
                                        )}
                                        {product.cost_per_item && (
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Cost per Item</p>
                                                <p className="text-xl text-gray-700">{formatCurrency(product.cost_per_item)}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Inventory */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Stack size={20} weight="duotone" className="text-primary" />
                                        Inventory
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Stock Quantity</p>
                                            <p className={`text-2xl font-bold ${(product.stock_quantity ?? 0) === 0
                                                    ? "text-red-600"
                                                    : (product.stock_quantity ?? 0) < 20
                                                        ? "text-yellow-600"
                                                        : "text-gray-900"
                                                }`}>
                                                {product.stock_quantity ?? 0} units
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Low Stock Threshold</p>
                                            <p className="text-xl text-gray-700">{product.low_stock_threshold || 10} units</p>
                                        </div>
                                        {product.weight && (
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Weight</p>
                                                <p className="text-xl text-gray-700">{product.weight} {product.weight_unit || 'g'}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">In Stock</p>
                                            <p className={`text-xl font-medium ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                                                {product.in_stock ? 'Yes' : 'No'}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Link href={`/products/${productId}/edit`} className="block">
                                        <Button className="w-full" leftIcon={<PencilSimple size={16} weight="duotone" />}>
                                            Edit Product
                                        </Button>
                                    </Link>
                                    <Link href={`/products/${productId}/edit`} className="block">
                                        <Button variant="outline" className="w-full" leftIcon={<Stack size={16} weight="duotone" />}>
                                            Update Stock
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Organization */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Tag size={20} weight="duotone" className="text-primary" />
                                        Organization
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Category</p>
                                        <p className="font-medium capitalize">{product.category || "Uncategorized"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Region</p>
                                        <p className="font-medium capitalize">{product.region || "Not specified"}</p>
                                    </div>
                                    {product.tags && product.tags.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2">Tags</p>
                                            <div className="flex flex-wrap gap-2">
                                                {product.tags.map((tag: string) => (
                                                    <Badge key={tag} variant="outline">{tag}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Metadata */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock size={20} weight="duotone" className="text-primary" />
                                        Metadata
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Created</span>
                                        <span className="text-gray-900">
                                            {new Date(product.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Last Updated</span>
                                        <span className="text-gray-900">
                                            {new Date(product.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Product ID</span>
                                        <span className="text-gray-900 font-mono text-xs">{product.id.slice(0, 8)}...</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent size="sm">
                    <DialogHeader>
                        <DialogTitle>Delete Product</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{product.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            loading={deleteProductMutation.isPending}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
