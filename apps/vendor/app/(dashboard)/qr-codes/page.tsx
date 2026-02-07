"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    QrCode,
    DownloadSimple,
    Plus,
    Trash,
    Clock,
    CheckCircle,
    Package,
    Tag,
    Users,
    ShoppingCart,
    Ticket,
    Storefront,
    CaretDown,
    CaretUp,
    CaretLeft,
    CaretRight,
} from "@phosphor-icons/react";
import { Header } from "../../../components/Header";
import {
    Card,
    Button,
    Badge,
    Input,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    formatCurrency,
    formatRelativeTime,
    DataTable,
    staggerContainer,
    staggerItem,
} from "@zora/ui-web";

interface QRCode {
    id: string;
    type: "order" | "product" | "vendor" | "coupon";
    title: string;
    data: any;
    createdAt: string;
    expiresAt?: string;
    usageCount: number;
    isActive: boolean;
}

const mockQRCodes: QRCode[] = [
    {
        id: "1",
        type: "order",
        title: "Order #12345",
        data: {
            orderNumber: "12345",
            customerName: "John Doe",
            total: 45.99,
            status: "ready",
            items: ["Jollof Rice", "Egusi Soup"]
        },
        createdAt: "2024-02-07T10:30:00Z",
        usageCount: 12,
        isActive: true
    },
    {
        id: "2",
        type: "product",
        title: "Premium Jollof Rice",
        data: {
            name: "Premium Jollof Rice 5kg",
            price: 25.99,
            category: "Grains",
            stock: 45,
            sku: "JOL-001"
        },
        createdAt: "2024-02-06T14:20:00Z",
        usageCount: 8,
        isActive: true
    },
    {
        id: "3",
        type: "vendor",
        title: "African Spice House",
        data: {
            vendorName: "African Spice House",
            vendorId: "VENDOR-001",
            category: "Food & Beverages",
            rating: 4.8,
            location: "Lagos, Nigeria"
        },
        createdAt: "2024-02-05T09:15:00Z",
        usageCount: 23,
        isActive: true
    },
    {
        id: "4",
        type: "coupon",
        title: "10% Off First Order",
        data: {
            code: "WELCOME10",
            discount: 10,
            minimumOrder: 20.00,
            expiry: "2024-03-01T23:59:59Z",
            description: "Get 10% off your first order"
        },
        createdAt: "2024-02-07T08:00:00Z",
        usageCount: 5,
        isActive: false
    }
];

export default function QRCodesPage() {
    const [activeTab, setActiveTab] = useState<"all" | "order" | "product" | "vendor" | "coupon">("all");
    const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [qrType, setQRType] = useState<"order" | "product" | "vendor" | "coupon">("order");
    const [qrData, setQRData] = useState<any>({});

    const filteredQRCodes = useMemo(() => {
        if (activeTab === "all") return mockQRCodes;
        return mockQRCodes.filter(qr => qr.type === activeTab);
    }, [activeTab]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "order": return ShoppingCart;
            case "product": return Package;
            case "vendor": return Storefront;
            case "coupon": return Ticket;
            default: return QrCode;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "order": return "text-blue-600 bg-blue-100";
            case "product": return "text-green-600 bg-green-100";
            case "vendor": return "text-purple-600 bg-purple-100";
            case "coupon": return "text-orange-600 bg-orange-100";
            default: return "text-gray-600 bg-gray-100";
        }
    };

    const handleGenerateQR = async () => {
        try {
            let qrData = {};

            switch (qrType) {
                case "order":
                    qrData = {
                        orderNumber: `ORD-${Date.now()}`,
                        customerName: qrData.customerName || "Walk-in Customer",
                        total: parseFloat(qrData.total) || 0,
                        status: "pending"
                    };
                    break;
                case "product":
                    qrData = {
                        name: qrData.name || "New Product",
                        price: parseFloat(qrData.price) || 0,
                        category: qrData.category || "General",
                        stock: parseInt(qrData.stock) || 0,
                        sku: qrData.sku || `PRD-${Date.now()}`
                    };
                    break;
                case "vendor":
                    qrData = {
                        vendorName: qrData.vendorName || "New Vendor",
                        vendorId: qrData.vendorId || `VENDOR-${Date.now()}`,
                        category: qrData.category || "General",
                        rating: parseFloat(qrData.rating) || 0,
                        location: qrData.location || "Store Location"
                    };
                    break;
                case "coupon":
                    qrData = {
                        code: qrData.code || `SAVE${Date.now()}`,
                        discount: parseFloat(qrData.discount) || 0,
                        minimumOrder: parseFloat(qrData.minimumOrder) || 0,
                        expiry: qrData.expiry || new Date(Date.now() + 30 * 24 * 60 * 1000).toISOString(),
                        description: qrData.description || "Special Discount"
                    };
                    break;
            }

            // In a real implementation, this would call an API to generate the QR code
            console.log("Generated QR data:", qrData);

            Alert.alert(
                "QR Code Generated",
                `${qrType.charAt(0).toUpperCase() + qrType.slice(1)} QR code has been generated successfully!`,
                [{ text: "OK", onPress: () => { } }]
            );

            setShowGenerateModal(false);
            setQRData({});
        } catch (error) {
            Alert.alert(
                "Generation Failed",
                "Failed to generate QR code. Please try again.",
                [{ text: "OK", onPress: () => { } }]
            );
        }
    };

    const handleDeleteQR = (qr: QRCode) => {
        Alert.alert(
            "Delete QR Code",
            `Are you sure you want to delete the ${qr.type} QR code: ${qr.title}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        // In a real implementation, this would call an API
                        console.log("Deleted QR:", qr.id);
                    }
                }
            ]
        );
    };

    const qrColumns = [
        { key: "title", label: "Title", sortable: true },
        { key: "type", label: "Type", sortable: true },
        { key: "createdAt", label: "Created", sortable: true },
        { key: "usageCount", label: "Usage", sortable: true },
        { key: "status", label: "Status", sortable: true },
        { key: "actions", label: "Actions", sortable: false }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="QR Code Management" />

            <div className="container mx-auto px-4 py-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">QR Code Management</h1>
                            <p className="text-gray-600 mt-2">
                                Generate and manage QR codes for in-store pickup, order verification, and vendor identification
                            </p>
                        </div>
                        <Button
                            onClick={() => setShowGenerateModal(true)}
                            className="flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Generate QR Code
                        </Button>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="all">All QR Codes</TabsTrigger>
                            <TabsTrigger value="order">Orders</TabsTrigger>
                            <TabsTrigger value="product">Products</TabsTrigger>
                            <TabsTrigger value="vendor">Vendors</TabsTrigger>
                            <TabsTrigger value="coupon">Coupons</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-6">
                            <DataTable
                                data={filteredQRCodes}
                                columns={qrColumns}
                                getRowActions={(qr) => (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedQR(qr)}
                                        >
                                            <QrCode size={16} />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteQR(qr)}
                                        >
                                            <Trash size={16} />
                                        </Button>
                                    </div>
                                )}
                                renderRow={(qr) => (
                                    <motion.tr
                                        key={qr.id}
                                        {...staggerItem(filteredQRCodes.indexOf(qr))}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${getTypeColor(qr.type)}`}>
                                                    {React.createElement(getTypeIcon(qr.type), { size: 24, className: "text-white" })}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{qr.title}</h3>
                                                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(qr.type)}`}>
                                                        {qr.type.toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm text-gray-600">
                                                    Created {formatRelativeTime(qr.createdAt)}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm text-gray-600">Used {qr.usageCount} times</span>
                                                    {qr.isActive ? (
                                                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                                                    ) : (
                                                        <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.tr>
                                )}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Generate QR Modal */}
            {showGenerateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Generate QR Code</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowGenerateModal(false)}
                            >
                                <Package name="x" size={20} />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">QR Type</label>
                                <select
                                    value={qrType}
                                    onChange={(e) => setQRType(e.target.value as any)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="order">Order Pickup</option>
                                    <option value="product">Product Information</option>
                                    <option value="vendor">Vendor Profile</option>
                                    <option value="coupon">Discount Coupon</option>
                                </select>
                            </div>

                            {(qrType === "order" || qrType === "product") && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {qrType === "order" ? "Customer Name" : "Product Name"}
                                    </label>
                                    <Input
                                        value={qrData[qrType === "order" ? "customerName" : "name"] || ""}
                                        onChange={(e) => setQRData(prev => ({ ...prev, [qrType === "order" ? "customerName" : "name"]: e.target.value }))}
                                        placeholder={qrType === "order" ? "Enter customer name" : "Enter product name"}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            {(qrType === "order" || qrType === "product") && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {qrType === "order" ? "Order Total" : "Price"}
                                    </label>
                                    <Input
                                        type="number"
                                        value={qrData[qrType === "order" ? "total" : "price"] || ""}
                                        onChange={(e) => setQRData(prev => ({ ...prev, [qrType === "order" ? "total" : "price"]: e.target.value }))}
                                        placeholder={qrType === "order" ? "0.00" : "0.00"}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            {qrType === "product" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <Input
                                        value={qrData.category || ""}
                                        onChange={(e) => setQRData(prev => ({ ...prev, category: e.target.value }))}
                                        placeholder="Select category"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            {qrType === "product" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                                    <Input
                                        type="number"
                                        value={qrData.stock || ""}
                                        onChange={(e) => setQRData(prev => ({ ...prev, stock: e.target.value }))}
                                        placeholder="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            {qrType === "product" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                                    <Input
                                        value={qrData.sku || ""}
                                        onChange={(e) => setQRData(prev => ({ ...prev, sku: e.target.value }))}
                                        placeholder="PRD-001"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            {qrType === "vendor" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
                                    <Input
                                        value={qrData.vendorName || ""}
                                        onChange={(e) => setQRData(prev => ({ ...prev, vendorName: e.target.value }))}
                                        placeholder="Enter vendor name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            {qrType === "vendor" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <Input
                                        value={qrData.location || ""}
                                        onChange={(e) => setQRData(prev => ({ ...prev, location: e.target.value }))}
                                        placeholder="Store location"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            {qrType === "coupon" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                                    <Input
                                        type="number"
                                        value={qrData.discount || ""}
                                        onChange={(e) => setQRData(prev => ({ ...prev, discount: e.target.value }))}
                                        placeholder="10"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            {qrType === "coupon" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order</label>
                                    <Input
                                        type="number"
                                        value={qrData.minimumOrder || ""}
                                        onChange={(e) => setQRData(prev => ({ ...prev, minimumOrder: e.target.value }))}
                                        placeholder="20.00"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            {qrType === "coupon" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        value={qrData.description || ""}
                                        onChange={(e) => setQRData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Enter coupon description"
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            {qrType === "coupon" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                                    <Input
                                        type="date"
                                        value={qrData.expiry || ""}
                                        onChange={(e) => setQRData(prev => ({ ...prev, expiry: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setShowGenerateModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleGenerateQR}>
                                <Plus size={20} />
                                Generate QR Code
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
