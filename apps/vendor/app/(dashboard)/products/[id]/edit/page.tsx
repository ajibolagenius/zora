"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    UploadSimple,
    X,
    Plus,
    Image as ImageIcon,
    Package,
    CurrencyGbp,
    Tag,
    Stack,
    FloppyDisk,
    WarningCircle,
} from "@phosphor-icons/react";
import { Header } from "../../../../../components/Header";
import {
    Button,
    Input,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Badge,
    SkeletonCard,
} from "@zora/ui-web";
import { useAuth, useProductDetail, useUpdateProduct } from "../../../../../hooks";

const categories = [
    { value: "spices", label: "Spices & Seasonings" },
    { value: "oils", label: "Oils & Condiments" },
    { value: "grains", label: "Grains & Cereals" },
    { value: "vegetables", label: "Vegetables" },
    { value: "seafood", label: "Seafood" },
    { value: "meat", label: "Meat & Poultry" },
    { value: "beverages", label: "Beverages" },
    { value: "snacks", label: "Snacks" },
];

const regions = [
    { value: "west", label: "West Africa" },
    { value: "east", label: "East Africa" },
    { value: "north", label: "North Africa" },
    { value: "south", label: "South Africa" },
    { value: "central", label: "Central Africa" },
];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const productId = resolvedParams.id;
    const router = useRouter();
    const { vendor } = useAuth();

    const { data: product, isLoading, isError } = useProductDetail(productId);
    const updateProductMutation = useUpdateProduct();

    const [images, setImages] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        description: "",
        price: "",
        compareAtPrice: "",
        cost: "",
        category: "",
        region: "",
        stock: "",
        lowStockThreshold: "10",
        weight: "",
        weightUnit: "g",
        tags: [] as string[],
    });
    const [newTag, setNewTag] = useState("");
    const [hasChanges, setHasChanges] = useState(false);

    // Populate form when product loads
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                sku: "", // Not in Product type - keep for UI but don't read from product
                description: product.description || "",
                price: product.price?.toString() || "",
                compareAtPrice: product.original_price?.toString() || "",
                cost: "", // Not in Product type
                category: product.category || "",
                region: product.region || "",
                stock: product.stock_quantity?.toString() || "",
                lowStockThreshold: "10", // Not in Product type
                weight: product.weight || "",
                weightUnit: product.unit || "g",
                tags: product.certifications || [],
            });
            if (product.images && product.images.length > 0) {
                setImages(product.images);
            } else if (product.image_url) {
                setImages([product.image_url]);
            }
        }
    }, [product]);

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const addTag = () => {
        if (newTag && !formData.tags.includes(newTag)) {
            setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
            setNewTag("");
            setHasChanges(true);
        }
    };

    const removeTag = (tag: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tag),
        }));
        setHasChanges(true);
    };

    const handleSubmit = async () => {
        if (!product) return;

        try {
            await updateProductMutation.mutateAsync({
                id: product.id,
                name: formData.name,
                description: formData.description || undefined,
                price: parseFloat(formData.price) || 0,
                original_price: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
                category: formData.category || undefined,
                region: formData.region || undefined,
                stock_quantity: parseInt(formData.stock) || 0,
                weight: formData.weight || undefined,
                unit: formData.weightUnit || undefined,
                certifications: formData.tags.length > 0 ? formData.tags : undefined,
            });
            router.push(`/products/${productId}`);
        } catch (error) {
            console.error("Failed to update product:", error);
        }
    };

    if (isLoading) {
        return (
            <>
                <Header title="Edit Product" description="Loading..." />
                <div className="p-8 max-w-5xl mx-auto">
                    <SkeletonCard />
                </div>
            </>
        );
    }

    if (isError || !product) {
        return (
            <>
                <Header title="Edit Product" description="Error loading product" />
                <div className="p-8 max-w-5xl mx-auto">
                    <Card className="p-8 text-center">
                        <WarningCircle size={48} weight="duotone" className="mx-auto mb-4 text-red-500" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Product not found</h3>
                        <p className="text-gray-500 mb-4">The product you&apos;re trying to edit doesn&apos;t exist.</p>
                        <Link href="/products">
                            <Button>Back to Products</Button>
                        </Link>
                    </Card>
                </div>
            </>
        );
    }

    return (
        <>
            <Header title="Edit Product" description={`Editing: ${product.name}`} />

            <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
                {/* Back Button */}
                <Link href={`/products/${productId}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft size={16} weight="duotone" />
                    Back to Product
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package size={20} weight="duotone" className="text-primary" />
                                        Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Input
                                        label="Product Name"
                                        placeholder="e.g., Premium Suya Spice Mix"
                                        value={formData.name}
                                        onChange={(e) => updateField("name", e.target.value)}
                                    />
                                    <Input
                                        label="SKU"
                                        placeholder="e.g., SSM-001"
                                        value={formData.sku}
                                        onChange={(e) => updateField("sku", e.target.value)}
                                        hint="Stock Keeping Unit - unique identifier for this product"
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Description
                                        </label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[120px]"
                                            placeholder="Describe your product..."
                                            value={formData.description}
                                            onChange={(e) => updateField("description", e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Images */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ImageIcon size={20} weight="duotone" className="text-primary" />
                                        Product Images
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {images.map((img, index) => (
                                            <div
                                                key={index}
                                                className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group"
                                            >
                                                <Image
                                                    src={img}
                                                    alt="Product image"
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                />
                                                <button
                                                    onClick={() => {
                                                        setImages(images.filter((_, i) => i !== index));
                                                        setHasChanges(true);
                                                    }}
                                                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={16} weight="duotone" />
                                                </button>
                                            </div>
                                        ))}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-colors"
                                        >
                                            <UploadSimple size={24} weight="duotone" />
                                            <span className="text-xs">Upload</span>
                                        </motion.button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3">
                                        Upload up to 8 images. First image will be the main product image.
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Pricing */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CurrencyGbp size={20} weight="duotone" className="text-primary" />
                                        Pricing
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <Input
                                            label="Price"
                                            placeholder="0.00"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => updateField("price", e.target.value)}
                                            leftIcon={<span className="text-gray-400">£</span>}
                                        />
                                        <Input
                                            label="Compare at Price"
                                            placeholder="0.00"
                                            type="number"
                                            step="0.01"
                                            value={formData.compareAtPrice}
                                            onChange={(e) => updateField("compareAtPrice", e.target.value)}
                                            leftIcon={<span className="text-gray-400">£</span>}
                                            hint="Original price for sale display"
                                        />
                                        <Input
                                            label="Cost per Item"
                                            placeholder="0.00"
                                            type="number"
                                            step="0.01"
                                            value={formData.cost}
                                            onChange={(e) => updateField("cost", e.target.value)}
                                            leftIcon={<span className="text-gray-400">£</span>}
                                            hint="For profit calculation"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Inventory */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Stack size={20} weight="duotone" className="text-primary" />
                                        Inventory
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Stock Quantity"
                                            type="number"
                                            placeholder="0"
                                            value={formData.stock}
                                            onChange={(e) => updateField("stock", e.target.value)}
                                        />
                                        <Input
                                            label="Low Stock Threshold"
                                            type="number"
                                            placeholder="10"
                                            value={formData.lowStockThreshold}
                                            onChange={(e) => updateField("lowStockThreshold", e.target.value)}
                                            hint="Alert when stock falls below this"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <Input
                                            label="Weight"
                                            type="number"
                                            placeholder="0"
                                            value={formData.weight}
                                            onChange={(e) => updateField("weight", e.target.value)}
                                        />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Weight Unit
                                            </label>
                                            <Select
                                                value={formData.weightUnit}
                                                onValueChange={(value) => updateField("weightUnit", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="g">Grams (g)</SelectItem>
                                                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                                                    <SelectItem value="lb">Pounds (lb)</SelectItem>
                                                    <SelectItem value="oz">Ounces (oz)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Save Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card>
                                <CardContent className="space-y-4">
                                    <Button
                                        className="w-full"
                                        onClick={handleSubmit}
                                        isLoading={updateProductMutation.isPending}
                                        loadingText="Saving..."
                                        leftIcon={<FloppyDisk size={16} weight="duotone" />}
                                    >
                                        Save Changes
                                    </Button>
                                    <Link href={`/products/${productId}`} className="block">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Cancel
                                        </Button>
                                    </Link>
                                    {hasChanges && (
                                        <p className="text-xs text-yellow-600 text-center">
                                            You have unsaved changes
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Category & Region */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Category
                                        </label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) => updateField("category", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.value} value={cat.value}>
                                                        {cat.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Region
                                        </label>
                                        <Select
                                            value={formData.region}
                                            onValueChange={(value) => updateField("region", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select region" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {regions.map((region) => (
                                                    <SelectItem key={region.value} value={region.value}>
                                                        {region.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Tags */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tags</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2 mb-3">
                                        <Input
                                            placeholder="Add tag..."
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                            inputSize="sm"
                                        />
                                        <Button size="sm" onClick={addTag}>
                                            <Plus size={16} weight="duotone" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag) => (
                                            <Badge key={tag} variant="outline" className="gap-1">
                                                {tag}
                                                <button onClick={() => removeTag(tag)}>
                                                    <X size={12} weight="duotone" />
                                                </button>
                                            </Badge>
                                        ))}
                                        {formData.tags.length === 0 && (
                                            <p className="text-sm text-gray-400">No tags added</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
