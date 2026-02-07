"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
    CheckCircle,
    XCircle,
    Storefront,
    User,
    EnvelopeSimple,
    Calendar,
    ArrowSquareOut
} from "@phosphor-icons/react";
import { Header } from "../../../../components/Header";
import {
    Button,
    Card,
    Badge,
    DataTable,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Input,
    EmptyState,
} from "@zora/ui-web";
import {
    useVendorApplications,
    useApproveVendorApplication,
    useRejectVendorApplication,
    useAdminId
} from "../../../../hooks";
import { VendorApplication } from "@zora/types";

export default function VendorApplicationsPage() {
    const adminId = useAdminId();
    const { data: applications, isLoading, refetch } = useVendorApplications('pending');

    const approveMutation = useApproveVendorApplication();
    const rejectMutation = useRejectVendorApplication();

    const [rejectionDialog, setRejectionDialog] = useState<{
        open: boolean;
        applicationId: string | null;
        reason: string;
    }>({
        open: false,
        applicationId: null,
        reason: "",
    });

    const handleApprove = async (app: VendorApplication) => {
        if (!adminId) {
            // toast.error("You must be logged in to perform this action");
            alert("You must be logged in to perform this action");
            return;
        }

        try {
            await approveMutation.mutateAsync({
                applicationId: app.id,
                adminId,
            });
            // toast.success(`Approved application for ${app.business_name}`);
            alert(`Approved application for ${app.business_name}`);
            refetch();
        } catch (error) {
            console.error("Failed to approve:", error);
            // toast.error("Failed to approve application");
            alert("Failed to approve application");
        }
    };

    const handleReject = async () => {
        if (!adminId || !rejectionDialog.applicationId) return;

        try {
            await rejectMutation.mutateAsync({
                applicationId: rejectionDialog.applicationId,
                adminId,
                reason: rejectionDialog.reason,
            });
            // toast.success("Application rejected");
            alert("Application rejected");
            setRejectionDialog({ open: false, applicationId: null, reason: "" });
            refetch();
        } catch (error) {
            console.error("Failed to reject:", error);
            // toast.error("Failed to reject application");
            alert("Failed to reject application");
        }
    };

    const columns = [
        {
            key: "shop",
            header: "Shop Details",
            render: (app: VendorApplication) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                        <Storefront size={20} weight="duotone" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{app.business_name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-[200px]">{app.description || "No description"}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "applicant",
            header: "Applicant",
            render: (app: VendorApplication) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                        <User size={14} className="text-gray-400" />
                        {app.contact_name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <EnvelopeSimple size={14} />
                        {app.email}
                    </div>
                </div>
            ),
        },
        {
            key: "date",
            header: "Applied",
            render: (app: VendorApplication) => (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    {app.created_at ? format(new Date(app.created_at), 'MMM d, yyyy') : 'N/A'}
                </div>
            ),
        },
        {
            key: "actions",
            header: "",
            render: (app: VendorApplication) => (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setRejectionDialog({
                            open: true,
                            applicationId: app.id,
                            reason: ""
                        })}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                        Reject
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => handleApprove(app)}
                        isLoading={approveMutation.isPending && approveMutation.variables?.applicationId === app.id}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                        leftIcon={<CheckCircle size={16} />}
                    >
                        Approve
                    </Button>
                </div>
            ),
        },
    ];

    if (isLoading) {
        return (
            <>
                <Header title="Vendor Applications" description="Review and manage incoming vendor requests." />
                <div className="p-8 flex justify-center">
                    <div className="animate-pulse text-gray-400">Loading applications...</div>
                </div>
            </>
        );
    }

    const applicationList = ((applications as any)?.data || []) as VendorApplication[];

    return (
        <>
            <Header
                title="Vendor Applications"
                description="Review and manage incoming vendor requests."
            />

            <div className="p-4 sm:p-6 lg:p-8">
                <Card padding="none">
                    {applicationList.length > 0 ? (
                        <DataTable
                            data={applicationList as any[]}
                            columns={columns as any}
                            getRowId={(item: any) => item.id}
                        />
                    ) : (
                        <div className="p-12">
                            <EmptyState
                                icon={Storefront}
                                title="No pending applications"
                                description="You're all caught up! New vendor applications will appear here."
                            />
                        </div>
                    )}
                </Card>
            </div>

            <Dialog
                open={rejectionDialog.open}
                onOpenChange={(open) => setRejectionDialog(prev => ({ ...prev, open }))}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Application</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this application. This will be sent to the applicant.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Input
                            label="Reason for Rejection"
                            value={rejectionDialog.reason}
                            onChange={(e) => setRejectionDialog(prev => ({ ...prev, reason: e.target.value }))}
                            placeholder="e.g. Incomplete documentation..."
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRejectionDialog(prev => ({ ...prev, open: false }))}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            isLoading={rejectMutation.isPending}
                            disabled={!rejectionDialog.reason.trim()}
                        >
                            Reject Application
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
