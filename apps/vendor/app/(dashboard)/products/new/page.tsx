"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Upload,
    X,
    Plus,
    Image as ImageIcon,
    Package,
    DollarSign,
    Tag,
    Layers,
    Info,
} from "lucide-react";
import { Header } from "../../../../components/Header";
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
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Badge,
} from "@zora/ui-web";

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

export default function NewProductPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const addTag = () => {
        if (newTag && !formData.tags.includes(newTag)) {
            setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
            setNewTag("");
        }
    };

    const removeTag = (tag: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tag),
        }));
    };

    const handleSubmit = async (status: "draft" | "active") => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        router.push("/products");
    };

    return (
        <>
            <Header title="Add New Product" description="Create a new product listing" />

            <div className="p-8 max-w-5xl mx-auto">
                {/* Back Button */}
                <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Products
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
                                        <Package className="w-5 h-5 text-primary" />
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
                                        <ImageIcon className="w-5 h-5 text-primary" />
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
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                                                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-colors"
                                        >
                                            <Upload className="w-6 h-6" />
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
                                        <DollarSign className="w-5 h-5 text-primary" />
                                        Pricing
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <Input
                                            label="Price"
                                            placeholder="0.00"
                                            value={formData.price}
                                            onChange={(e) => updateField("price", e.target.value)}
                                            leftIcon={<span className="text-gray-400">£</span>}
                                        />
                                        <Input
                                            label="Compare at Price"
                                            placeholder="0.00"
                                            value={formData.compareAtPrice}
                                            onChange={(e) => updateField("compareAtPrice", e.target.value)}
                                            leftIcon={<span className="text-gray-400">£</span>}
                                            hint="Original price for sale display"
                                        />
                                        <Input
                                            label="Cost per Item"
                                            placeholder="0.00"
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
                                        <Layers className="w-5 h-5 text-primary" />
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
                        {/* Status & Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card>
                                <CardContent className="space-y-4">
                                    <Button
                                        className="w-full"
                                        onClick={() => handleSubmit("active")}
                                        isLoading={isSubmitting}
                                        loadingText="Publishing..."
                                    >
                                        Publish Product
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => handleSubmit("draft")}
                                        disabled={isSubmitting}
                                    >
                                        Save as Draft
                                    </Button>
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
                                        <Tag className="w-5 h-5 text-primary" />
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
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag) => (
                                            <Badge key={tag} variant="outline" className="gap-1">
                                                {tag}
                                                <button onClick={() => removeTag(tag)}>
                                                    <X className="w-3 h-3" />
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
