"use client";

import { useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Input,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@zora/ui-web";
import { useUpdateOrderStatus } from "../../hooks/useAdminData";
import type { OrderStatus } from "@zora/types";

interface CourierBookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderId: string;
    onSuccess?: () => void;
}

const COURIERS = [
    { id: "dhl", name: "DHL Express" },
    { id: "fedex", name: "FedEx" },
    { id: "ups", name: "UPS" },
    { id: "custom", name: "Custom / Local Courier" },
];

export function CourierBookingDialog({
    open,
    onOpenChange,
    orderId,
    onSuccess,
}: CourierBookingDialogProps) {
    const [courier, setCourier] = useState<string>("");
    const [trackingId, setTrackingId] = useState("");
    const [notes, setNotes] = useState("");

    // We'll update the status to 'out_for_delivery'
    const updateStatusMutation = useUpdateOrderStatus();

    const handleBooking = async () => {
        try {
            // Ideally, we would save the courier name and tracking ID to the backend.
            // For now, we are simulating this by just updating the status.
            // If the API supports metadata or specific fields, we would include them here.

            await updateStatusMutation.mutateAsync({
                orderId,
                status: "out_for_delivery" as OrderStatus,
                // courier: courier, // Future: pass courier details
                // trackingId: trackingId, // Future: pass tracking ID
            });

            onOpenChange(false);
            onSuccess?.();

            // Reset form
            setCourier("");
            setTrackingId("");
            setNotes("");

        } catch (error) {
            console.error("Failed to book courier:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Book Courier</DialogTitle>
                    <DialogDescription>
                        Manually assign a courier and tracking information for this order.
                        This will update the order status to "In Transit".
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Select Courier
                        </label>
                        <Select value={courier} onValueChange={setCourier}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a courier..." />
                            </SelectTrigger>
                            <SelectContent>
                                {COURIERS.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Tracking ID
                        </label>
                        <Input
                            placeholder="Enter tracking number"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Notes (Optional)
                        </label>
                        <Input
                            placeholder="Additional instructions..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleBooking}
                        isLoading={updateStatusMutation.isPending}
                        disabled={!courier || !trackingId}
                    >
                        Confirm Booking
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
