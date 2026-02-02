"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    MagnifyingGlass,
    Eye,
    CheckCircle,
    Storefront,
    MapPin,
    Star,
    Clock,
    Envelope,
    Phone,
    ArrowSquareOut,
    UserCheck,
    UserMinus,
    FileText,
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
    SkeletonCard,
} from "@zora/ui-web";
import {
    useAuth,
    useAllVendors,
    useVendorApplications,
    useApproveVendorApplication,
    useRejectVendorApplication,
    VendorWithProductCount,
} from "../../../hooks";
import { useAdminRealtime } from "../../../providers";
import type { Vendor, VendorApplication } from "@zora/types";

const statusConfig = {
    active: { label: "Active", variant: "success" as const },
    suspended: { label: "Suspended", variant: "error" as const },
    pending: { label: "Pending Review", variant: "warning" as const },
    under_review: { label: "Under Review", variant: "info" as const },
    documents_required: { label: "Docs Required", variant: "warning" as const },
    approved: { label: "Approved", variant: "success" as const },
    rejected: { label: "Rejected", variant: "error" as const },
};

export default function VendorsPage() {
    const { user } = useAuth();
    const { stats: realtimeStats } = useAdminRealtime();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTab, setSelectedTab] = useState("vendors");
    const [selectedApplication, setSelectedApplication] = useState<VendorApplication | null>(null);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    // Fetch vendors from database
    const {
        data: vendorsData,
        isLoading: vendorsLoading,
        isError: vendorsError,
        refetch: refetchVendors,
    } = useAllVendors();

    // Fetch pending applications
    const {
        data: applicationsData,
        isLoading: applicationsLoading,
        isError: applicationsError,
        refetch: refetchApplications,
    } = useVendorApplications("pending");

    // Mutations
    const approveApplicationMutation = useApproveVendorApplication();
    const rejectApplicationMutation = useRejectVendorApplication();

    // Filter vendors by search
    const filteredVendors = useMemo(() => {
        if (!vendorsData?.data) return [];
        if (!searchTerm) return vendorsData.data;

        const searchLower = searchTerm.toLowerCase();
        return vendorsData.data.filter((vendor) => {
            return (
                vendor.name?.toLowerCase().includes(searchLower) ||
                vendor.slug?.toLowerCase().includes(searchLower)
            );
        });
    }, [vendorsData?.data, searchTerm]);

    const handleApprove = async () => {
        if (selectedApplication && user?.id) {
            try {
                await approveApplicationMutation.mutateAsync({
                    applicationId: selectedApplication.id,
                    adminId: user.id,
                });
                setReviewDialogOpen(false);
                setSelectedApplication(null);
            } catch (error) {
                console.error("Failed to approve application:", error);
            }
        }
    };

    const handleReject = async () => {
        if (selectedApplication && user?.id) {
            try {
                await rejectApplicationMutation.mutateAsync({
                    applicationId: selectedApplication.id,
                    adminId: user.id,
                    reason: rejectReason || "Application rejected",
                });
                setReviewDialogOpen(false);
                setSelectedApplication(null);
                setRejectReason("");
            } catch (error) {
                console.error("Failed to reject application:", error);
            }
        }
    };

    const handleRefresh = () => {
        refetchVendors();
        refetchApplications();
    };

    const vendorColumns = [
        {
            key: "name",
            header: "Vendor",
            sortable: true,
            render: (vendor: Vendor) => (
                <div className="flex items-center gap-3">
                    <Avatar size="default">
                        {vendor.logo_url ? (
                            <img src={vendor.logo_url} alt={vendor.name} className="w-full h-full object-cover" />
                        ) : (
                            <AvatarFallback className="bg-primary/10 text-primary">
                                {vendor.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "??"}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900">{vendor.name}</p>
                            {vendor.is_verified && <CheckCircle size={16} weight="duotone" className="text-blue-500" />}
                        </div>
                        <p className="text-xs text-slate-500">{vendor.slug}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "location",
            header: "Location",
            render: (vendor: Vendor) => (
                <div className="flex items-center gap-1 text-slate-600">
                    <MapPin size={16} weight="duotone" />
                    {vendor.address || "N/A"}
                </div>
            ),
        },
        {
            key: "rating",
            header: "Rating",
            sortable: true,
            render: (vendor: Vendor) => (
                <div className="flex items-center gap-1">
                    <Star size={16} weight="fill" className="text-yellow-500" />
                    <span className="font-medium">{vendor.rating?.toFixed(1) || "N/A"}</span>
                    <span className="text-slate-400">({vendor.review_count || 0})</span>
                </div>
            ),
        },
        {
            key: "products",
            header: "Products",
            render: (vendor: VendorWithProductCount) => (
                <span className="text-slate-600">{vendor.product_count ?? 0}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (vendor: Vendor) => {
                const status = vendor.is_verified ? "active" : "pending";
                const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
                return <Badge variant={config.variant}>{config.label}</Badge>;
            },
        },
        {
            key: "actions",
            header: "",
            width: "80px",
            render: (vendor: Vendor) => (
                <Link href={`/vendors/${vendor.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye size={16} weight="duotone" />
                    </Button>
                </Link>
            ),
        },
    ];

    const activeVendorsCount = vendorsData?.data?.filter((v) => v.is_verified).length || 0;
    const pendingApplicationsCount = applicationsData?.data?.length || 0;

    return (
        <>
            <Header
                title="Vendors"
                description="Manage vendors and applications"
                actions={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        leftIcon={<ArrowsClockwise size={16} weight="duotone" />}
                    >
                        Refresh
                        {realtimeStats.pendingVendorApplications > 0 && (
                            <Badge variant="warning" size="sm" className="ml-2">
                                {realtimeStats.pendingVendorApplications} pending
                            </Badge>
                        )}
                    </Button>
                }
            />

            <div className="p-4 sm:p-6 lg:p-8">
                {/* Tabs */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <TabsList className="w-full sm:w-auto">
                            <TabsTrigger value="vendors" className="text-xs sm:text-sm">
                                Active Vendors ({activeVendorsCount})
                            </TabsTrigger>
                            <TabsTrigger value="applications" className="text-xs sm:text-sm">
                                Applications ({pendingApplicationsCount})
                            </TabsTrigger>
                        </TabsList>
                        <div className="w-full sm:w-72">
                            <Input
                                placeholder="Search vendors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                leftIcon={<MagnifyingGlass size={16} weight="duotone" />}
                            />
                        </div>
                    </div>

                    {/* Vendors Tab */}
                    <TabsContent value="vendors">
                        {vendorsLoading && (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        )}

                        {vendorsError && (
                            <Card className="p-8 text-center">
                                <WarningCircle size={48} weight="duotone" className="mx-auto mb-4 text-red-500" />
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Failed to load vendors</h3>
                                <p className="text-slate-500 mb-4">There was an error loading vendors.</p>
                                <Button onClick={() => refetchVendors()}>Try Again</Button>
                            </Card>
                        )}

                        {!vendorsLoading && !vendorsError && filteredVendors.length === 0 && (
                            <EmptyState
                                icon={Storefront}
                                title="No vendors found"
                                description={searchTerm ? "Try adjusting your search" : "Vendors will appear here"}
                            />
                        )}

                        {!vendorsLoading && !vendorsError && filteredVendors.length > 0 && (
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
                        )}
                    </TabsContent>

                    {/* Applications Tab */}
                    <TabsContent value="applications">
                        {applicationsLoading && (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        )}

                        {applicationsError && (
                            <Card className="p-8 text-center">
                                <WarningCircle size={48} weight="duotone" className="mx-auto mb-4 text-red-500" />
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Failed to load applications</h3>
                                <p className="text-slate-500 mb-4">There was an error loading applications.</p>
                                <Button onClick={() => refetchApplications()}>Try Again</Button>
                            </Card>
                        )}

                        {!applicationsLoading && !applicationsError && (!applicationsData?.data || applicationsData.data.length === 0) && (
                            <EmptyState
                                icon={Storefront}
                                title="No pending applications"
                                description="New vendor applications will appear here"
                            />
                        )}

                        {!applicationsLoading && !applicationsError && applicationsData?.data && applicationsData.data.length > 0 && (
                            <motion.div
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                                className="grid gap-4"
                            >
                                <AnimatePresence mode="popLayout">
                                    {applicationsData.data.map((app) => (
                                        <motion.div
                                            key={app.id}
                                            variants={staggerItem}
                                            layout
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <Card hover>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar size="lg">
                                                            <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                                                {app.business_name
                                                                    ?.split(" ")
                                                                    .map((n) => n[0])
                                                                    .join("")
                                                                    .slice(0, 2) || "??"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="flex items-center gap-3 flex-wrap">
                                                                <h3 className="font-semibold text-slate-900">
                                                                    {app.business_name}
                                                                </h3>
                                                                <Badge
                                                                    variant={
                                                                        statusConfig[app.status as keyof typeof statusConfig]
                                                                            ?.variant || "warning"
                                                                    }
                                                                >
                                                                    {statusConfig[app.status as keyof typeof statusConfig]
                                                                        ?.label || app.status}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-slate-500">{app.business_type}</p>
                                                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                                                                {app.city && (
                                                                    <span className="flex items-center gap-1">
                                                                        <MapPin size={16} weight="duotone" />
                                                                        {`${app.address_line_1}, ${app.city}`}
                                                                    </span>
                                                                )}
                                                                <span className="flex items-center gap-1">
                                                                    <Envelope size={16} weight="duotone" />
                                                                    {app.email}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock size={16} weight="duotone" />
                                                                    {formatRelativeTime(new Date(app.created_at))}
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
                                    Review the vendor application for {selectedApplication.business_name}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
                                <div>
                                    <h4 className="font-medium text-slate-900 mb-3">Business Information</h4>
                                    <Card padding="sm" className="space-y-3">
                                        <div>
                                            <p className="text-xs text-slate-500">Business Name</p>
                                            <p className="font-medium">{selectedApplication.business_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Business Type</p>
                                            <p className="font-medium">{selectedApplication.business_type}</p>
                                        </div>
                                        {selectedApplication.city && (
                                            <div>
                                                <p className="text-xs text-slate-500">Location</p>
                                                <p className="font-medium">{`${selectedApplication.address_line_1}, ${selectedApplication.city}, ${selectedApplication.postcode}`}</p>
                                            </div>
                                        )}
                                        {selectedApplication.description && (
                                            <div>
                                                <p className="text-xs text-slate-500">Description</p>
                                                <p className="text-sm">{selectedApplication.description}</p>
                                            </div>
                                        )}
                                    </Card>
                                </div>

                                <div>
                                    <h4 className="font-medium text-slate-900 mb-3">Contact Details</h4>
                                    <Card padding="sm" className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Envelope size={16} weight="duotone" className="text-slate-400" />
                                            <p className="text-sm">{selectedApplication.email}</p>
                                        </div>
                                        {selectedApplication.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={16} weight="duotone" className="text-slate-400" />
                                                <p className="text-sm">{selectedApplication.phone}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xs text-slate-500">Submitted</p>
                                            <p className="font-medium">
                                                {formatRelativeTime(new Date(selectedApplication.created_at))}
                                            </p>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            {selectedApplication.documents && Object.keys(selectedApplication.documents).length > 0 && (
                                <div>
                                    <h4 className="font-medium text-slate-900 mb-3">Submitted Documents</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {Object.entries(selectedApplication.documents).map(([key, url]: [string, string | undefined], index: number) => (
                                            url && (
                                                <Card key={index} padding="sm" className="flex items-center gap-2">
                                                    <FileText size={16} weight="duotone" className="text-primary" />
                                                    <span className="text-sm truncate">{key.replace(/_/g, ' ')}</span>
                                                    <ArrowSquareOut size={12} weight="duotone" className="text-slate-400 ml-auto" />
                                                </Card>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Rejection Reason (optional)
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    rows={2}
                                    placeholder="Enter reason if rejecting..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                />
                            </div>

                            <DialogFooter className="gap-2">
                                <Button
                                    variant="outline"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    leftIcon={<UserMinus size={16} weight="duotone" />}
                                    onClick={handleReject}
                                    isLoading={rejectApplicationMutation.isPending}
                                >
                                    Reject
                                </Button>
                                <Button
                                    variant="success"
                                    leftIcon={<UserCheck size={16} weight="duotone" />}
                                    onClick={handleApprove}
                                    isLoading={approveApplicationMutation.isPending}
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
