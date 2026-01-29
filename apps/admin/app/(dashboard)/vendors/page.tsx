"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Store,
    MapPin,
    Star,
    Clock,
    Mail,
    Phone,
    ExternalLink,
    MoreVertical,
    UserCheck,
    UserX,
    FileText,
} from "lucide-react";
import { Header } from "../../../components/Header";
import {
    Button,
    Input,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Badge,
    DataTable,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Avatar,
    AvatarFallback,
    EmptyState,
    formatCurrency,
    formatRelativeTime,
    staggerContainer,
    staggerItem,
} from "@zora/ui-web";

// Mock vendors data
const mockVendors = [
    {
        id: "v1",
        name: "African Spice House",
        email: "contact@africanspice.com",
        phone: "+44 7123 456789",
        status: "active",
        verified: true,
        rating: 4.8,
        reviewCount: 234,
        totalOrders: 1256,
        totalRevenue: 45678,
        joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180),
        location: "London, UK",
        category: "Spices & Seasonings",
    },
    {
        id: "v2",
        name: "Mama's Kitchen",
        email: "hello@mamaskitchen.com",
        phone: "+44 7234 567890",
        status: "active",
        verified: true,
        rating: 4.6,
        reviewCount: 189,
        totalOrders: 892,
        totalRevenue: 34521,
        joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120),
        location: "Birmingham, UK",
        category: "Prepared Foods",
    },
    {
        id: "v3",
        name: "Lagos Foods",
        email: "info@lagosfoods.co.uk",
        phone: "+44 7345 678901",
        status: "suspended",
        verified: true,
        rating: 3.9,
        reviewCount: 78,
        totalOrders: 234,
        totalRevenue: 12345,
        joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
        location: "Manchester, UK",
        category: "Groceries",
    },
];

const mockApplications = [
    {
        id: "app1",
        businessName: "Afro Bites London",
        email: "hello@afrobites.co.uk",
        phone: "+44 7456 789012",
        businessType: "Restaurant",
        location: "London, UK",
        status: "pending",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        documents: ["business_registration", "id_document"],
    },
    {
        id: "app2",
        businessName: "Ghana Grocery",
        email: "contact@ghanagrocery.com",
        phone: "+44 7567 890123",
        businessType: "Grocery Store",
        location: "Leeds, UK",
        status: "under_review",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
        documents: ["business_registration", "id_document", "proof_of_address"],
    },
    {
        id: "app3",
        businessName: "Naija Spice Co",
        email: "info@naijaspice.com",
        phone: "+44 7678 901234",
        businessType: "Wholesaler",
        location: "Bristol, UK",
        status: "pending",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        documents: ["business_registration", "id_document"],
    },
];

const statusConfig = {
    active: { label: "Active", variant: "success" as const },
    suspended: { label: "Suspended", variant: "error" as const },
    pending: { label: "Pending Review", variant: "warning" as const },
    under_review: { label: "Under Review", variant: "info" as const },
};

export default function VendorsPage() {
    const [vendors] = useState(mockVendors);
    const [applications, setApplications] = useState(mockApplications);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTab, setSelectedTab] = useState("vendors");
    const [selectedApplication, setSelectedApplication] = useState<typeof mockApplications[0] | null>(null);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

    const filteredVendors = vendors.filter((vendor) =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleApprove = (appId: string) => {
        setApplications((prev) =>
            prev.filter((app) => app.id !== appId)
        );
        setReviewDialogOpen(false);
    };

    const handleReject = (appId: string) => {
        setApplications((prev) =>
            prev.filter((app) => app.id !== appId)
        );
        setReviewDialogOpen(false);
    };

    const vendorColumns = [
        {
            key: "name",
            header: "Vendor",
            sortable: true,
            render: (vendor: typeof mockVendors[0]) => (
                <div className="flex items-center gap-3">
                    <Avatar size="default">
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {vendor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900">{vendor.name}</p>
                            {vendor.verified && (
                                <CheckCircle className="w-4 h-4 text-blue-500" />
                            )}
                        </div>
                        <p className="text-xs text-slate-500">{vendor.category}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "location",
            header: "Location",
            render: (vendor: typeof mockVendors[0]) => (
                <div className="flex items-center gap-1 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    {vendor.location}
                </div>
            ),
        },
        {
            key: "rating",
            header: "Rating",
            sortable: true,
            render: (vendor: typeof mockVendors[0]) => (
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{vendor.rating}</span>
                    <span className="text-slate-400">({vendor.reviewCount})</span>
                </div>
            ),
        },
        {
            key: "totalOrders",
            header: "Orders",
            sortable: true,
            render: (vendor: typeof mockVendors[0]) => (
                <span className="text-slate-600">{vendor.totalOrders.toLocaleString()}</span>
            ),
        },
        {
            key: "totalRevenue",
            header: "Revenue",
            sortable: true,
            render: (vendor: typeof mockVendors[0]) => (
                <span className="font-semibold">{formatCurrency(vendor.totalRevenue)}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (vendor: typeof mockVendors[0]) => {
                const config = statusConfig[vendor.status as keyof typeof statusConfig];
                return <Badge variant={config.variant}>{config.label}</Badge>;
            },
        },
        {
            key: "actions",
            header: "",
            width: "80px",
            render: (vendor: typeof mockVendors[0]) => (
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="w-4 h-4" />
                </Button>
            ),
        },
    ];

    return (
        <>
            <Header title="Vendors" description="Manage vendors and applications" />

            <div className="p-4 sm:p-6 lg:p-8">
                {/* Tabs */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <TabsList className="w-full sm:w-auto">
                            <TabsTrigger value="vendors" className="text-xs sm:text-sm">
                                Active Vendors ({vendors.filter(v => v.status === "active").length})
                            </TabsTrigger>
                            <TabsTrigger value="applications" className="text-xs sm:text-sm">
                                Applications ({applications.length})
                            </TabsTrigger>
                        </TabsList>
                        <div className="w-full sm:w-72">
                            <Input
                                placeholder="Search vendors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                leftIcon={<Search className="w-4 h-4" />}
                            />
                        </div>
                    </div>

                    {/* Vendors Tab */}
                    <TabsContent value="vendors">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card padding="none">
                                <DataTable
                                    data={filteredVendors}
                                    columns={vendorColumns}
                                    getRowId={(item) => item.id}
                                    searchable={false}
                                />
                            </Card>
                        </motion.div>
                    </TabsContent>

                    {/* Applications Tab */}
                    <TabsContent value="applications">
                        {applications.length === 0 ? (
                            <EmptyState
                                icon={Store}
                                title="No pending applications"
                                description="New vendor applications will appear here"
                            />
                        ) : (
                            <motion.div
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                                className="grid gap-4"
                            >
                                <AnimatePresence mode="popLayout">
                                    {applications.map((app) => (
                                        <motion.div
                                            key={app.id}
                                            variants={staggerItem}
                                            layout
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <Card hover>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar size="lg">
                                                            <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                                                {app.businessName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <h3 className="font-semibold text-slate-900">{app.businessName}</h3>
                                                                <Badge variant={statusConfig[app.status as keyof typeof statusConfig].variant}>
                                                                    {statusConfig[app.status as keyof typeof statusConfig].label}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-slate-500">{app.businessType}</p>
                                                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="w-4 h-4" />
                                                                    {app.location}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Mail className="w-4 h-4" />
                                                                    {app.email}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-4 h-4" />
                                                                    {formatRelativeTime(app.submittedAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                                setSelectedApplication(app);
                                                                setReviewDialogOpen(true);
                                                            }}
                                                        >
                                                            Review Application
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Review Application Dialog */}
            <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                <DialogContent size="lg">
                    {selectedApplication && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Review Application</DialogTitle>
                                <DialogDescription>
                                    Review the vendor application for {selectedApplication.businessName}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
                                <div>
                                    <h4 className="font-medium text-slate-900 mb-3">Business Information</h4>
                                    <Card padding="sm" className="space-y-3">
                                        <div>
                                            <p className="text-xs text-slate-500">Business Name</p>
                                            <p className="font-medium">{selectedApplication.businessName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Business Type</p>
                                            <p className="font-medium">{selectedApplication.businessType}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Location</p>
                                            <p className="font-medium">{selectedApplication.location}</p>
                                        </div>
                                    </Card>
                                </div>

                                <div>
                                    <h4 className="font-medium text-slate-900 mb-3">Contact Details</h4>
                                    <Card padding="sm" className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <p className="text-sm">{selectedApplication.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            <p className="text-sm">{selectedApplication.phone}</p>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-slate-900 mb-3">Submitted Documents</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {selectedApplication.documents.map((doc) => (
                                        <Card key={doc} padding="sm" className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-primary" />
                                            <span className="text-sm capitalize">{doc.replace("_", " ")}</span>
                                            <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <DialogFooter className="gap-2">
                                <Button
                                    variant="outline"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    leftIcon={<UserX className="w-4 h-4" />}
                                    onClick={() => handleReject(selectedApplication.id)}
                                >
                                    Reject
                                </Button>
                                <Button
                                    variant="success"
                                    leftIcon={<UserCheck className="w-4 h-4" />}
                                    onClick={() => handleApprove(selectedApplication.id)}
                                >
                                    Approve Vendor
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
