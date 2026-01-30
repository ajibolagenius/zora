"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    MagnifyingGlass,
    Funnel,
    DownloadSimple,
    Eye,
    Envelope,
    Phone,
    Calendar,
    ShoppingCart,
    CurrencyDollar,
    Star,
    DotsThreeVertical,
    User,
    MapPin,
    Prohibit,
} from "@phosphor-icons/react";
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Avatar,
    AvatarFallback,
    formatCurrency,
    formatDate,
    staggerContainer,
    staggerItem,
} from "@zora/ui-web";

// Mock customers data
const mockCustomers = [
    {
        id: "c1",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+44 7123 456789",
        status: "active",
        totalOrders: 23,
        totalSpent: 567.89,
        lastOrderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180),
        location: "London, UK",
        favoriteVendor: "African Spice House",
    },
    {
        id: "c2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+44 7234 567890",
        status: "active",
        totalOrders: 45,
        totalSpent: 1234.56,
        lastOrderDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
        joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
        location: "Birmingham, UK",
        favoriteVendor: "Mama's Kitchen",
    },
    {
        id: "c3",
        name: "Mike Johnson",
        email: "mike.j@example.com",
        phone: "+44 7345 678901",
        status: "active",
        totalOrders: 12,
        totalSpent: 234.00,
        lastOrderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
        location: "Manchester, UK",
        favoriteVendor: "Lagos Foods",
    },
    {
        id: "c4",
        name: "Sarah Wilson",
        email: "sarah.w@example.com",
        phone: "+44 7456 789012",
        status: "inactive",
        totalOrders: 5,
        totalSpent: 89.50,
        lastOrderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
        joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200),
        location: "Leeds, UK",
        favoriteVendor: "African Spice House",
    },
    {
        id: "c5",
        name: "Chris Brown",
        email: "chris.b@example.com",
        phone: "+44 7567 890123",
        status: "blocked",
        totalOrders: 3,
        totalSpent: 45.00,
        lastOrderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
        joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120),
        location: "Bristol, UK",
        favoriteVendor: "Naija Delights",
    },
];

const statusConfig = {
    active: { label: "Active", variant: "success" as const },
    inactive: { label: "Inactive", variant: "warning" as const },
    blocked: { label: "Blocked", variant: "error" as const },
};

export default function CustomersPage() {
    const [customers] = useState(mockCustomers);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch =
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = [
        { label: "Total Customers", value: customers.length, icon: User, color: "bg-blue-100 text-blue-600" },
        { label: "Active", value: customers.filter(c => c.status === "active").length, icon: Star, color: "bg-green-100 text-green-600" },
        { label: "Total Orders", value: customers.reduce((sum, c) => sum + c.totalOrders, 0), icon: ShoppingCart, color: "bg-purple-100 text-purple-600" },
        { label: "Total Revenue", value: formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0)), icon: CurrencyDollar, color: "bg-orange-100 text-orange-600" },
    ];

    const columns = [
        {
            key: "name",
            header: "Customer",
            sortable: true,
            render: (customer: typeof mockCustomers[0]) => (
                <div className="flex items-center gap-3">
                    <Avatar size="default">
                        <AvatarFallback className="bg-slate-100 text-slate-600">
                            {customer.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-slate-900">{customer.name}</p>
                        <p className="text-xs text-slate-500">{customer.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "location",
            header: "Location",
            render: (customer: typeof mockCustomers[0]) => (
                <div className="flex items-center gap-1 text-slate-600">
                    <MapPin size={16} weight="duotone" />
                    {customer.location}
                </div>
            ),
        },
        {
            key: "totalOrders",
            header: "Orders",
            sortable: true,
            render: (customer: typeof mockCustomers[0]) => (
                <span className="font-medium">{customer.totalOrders}</span>
            ),
        },
        {
            key: "totalSpent",
            header: "Spent",
            sortable: true,
            render: (customer: typeof mockCustomers[0]) => (
                <span className="font-semibold">{formatCurrency(customer.totalSpent)}</span>
            ),
        },
        {
            key: "lastOrderDate",
            header: "Last Order",
            sortable: true,
            render: (customer: typeof mockCustomers[0]) => (
                <span className="text-slate-500">{formatDate(customer.lastOrderDate)}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (customer: typeof mockCustomers[0]) => {
                const config = statusConfig[customer.status as keyof typeof statusConfig];
                return <Badge variant={config.variant}>{config.label}</Badge>;
            },
        },
        {
            key: "actions",
            header: "",
            width: "80px",
            render: (customer: typeof mockCustomers[0]) => (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                            setSelectedCustomer(customer);
                            setDetailsOpen(true);
                        }}
                    >
                        <Eye size={16} weight="duotone" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Header title="Customers" description="Manage customer accounts" />

            <div className="p-4 sm:p-6 lg:p-8">
                {/* Stats Row */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
                >
                    {stats.map((stat) => (
                        <motion.div key={stat.label} variants={staggerItem}>
                            <Card className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                    <stat.icon size={24} weight="duotone" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                    <p className="text-sm text-slate-500">{stat.label}</p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Filters */}
                <Card className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-1 items-center gap-4">
                            <div className="w-full sm:w-80">
                                <Input
                                    placeholder="Search customers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    leftIcon={<MagnifyingGlass size={16} weight="duotone" />}
                                />
                            </div>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="blocked">Blocked</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline" leftIcon={<DownloadSimple size={16} weight="duotone" />}>
                            Export Customers
                        </Button>
                    </div>
                </Card>

                {/* Customers Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card padding="none">
                        <DataTable
                            data={filteredCustomers}
                            columns={columns}
                            getRowId={(item) => item.id}
                            searchable={false}
                        />
                    </Card>
                </motion.div>
            </div>

            {/* Customer Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent size="lg">
                    {selectedCustomer && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Customer Details</DialogTitle>
                            </DialogHeader>

                            <div className="py-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <Avatar size="xl">
                                        <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                            {selectedCustomer.name.split(" ").map(n => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-xl font-semibold text-slate-900">{selectedCustomer.name}</h3>
                                        <Badge variant={statusConfig[selectedCustomer.status as keyof typeof statusConfig].variant}>
                                            {statusConfig[selectedCustomer.status as keyof typeof statusConfig].label}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Card padding="sm">
                                        <h4 className="font-medium text-slate-900 mb-3">Contact Information</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Envelope size={16} weight="duotone" className="text-slate-400" />
                                                {selectedCustomer.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone size={16} weight="duotone" className="text-slate-400" />
                                                {selectedCustomer.phone}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin size={16} weight="duotone" className="text-slate-400" />
                                                {selectedCustomer.location}
                                            </div>
                                        </div>
                                    </Card>

                                    <Card padding="sm">
                                        <h4 className="font-medium text-slate-900 mb-3">Activity Summary</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Total Orders</span>
                                                <span className="font-medium">{selectedCustomer.totalOrders}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Total Spent</span>
                                                <span className="font-medium">{formatCurrency(selectedCustomer.totalSpent)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Favorite Vendor</span>
                                                <span className="font-medium">{selectedCustomer.favoriteVendor}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Member Since</span>
                                                <span className="font-medium">{formatDate(selectedCustomer.joinedDate)}</span>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <Button variant="outline" leftIcon={<Envelope size={16} weight="duotone" />}>
                                        Send Email
                                    </Button>
                                    {selectedCustomer.status !== "blocked" ? (
                                        <Button
                                            variant="outline"
                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                            leftIcon={<Prohibit size={16} weight="duotone" />}
                                        >
                                            Block Customer
                                        </Button>
                                    ) : (
                                        <Button variant="success">
                                            Unblock Customer
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
