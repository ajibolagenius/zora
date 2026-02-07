"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Truck,
    Package,
    MapPin,
    MagnifyingGlass,
    Clock,
    CheckCircle,
} from "@phosphor-icons/react";
import { Header } from "../../../components/Header";
import {
    Button,
    Card,
    Badge,
    DataTable,
    Input,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Avatar,
    AvatarFallback,
    EmptyState,
} from "@zora/ui-web";
import { DeliveryStats } from "../../../components/delivery/DeliveryStats";
import { CourierBookingDialog } from "../../../components/orders/CourierBookingDialog";
import { useAllOrders, useUpdateOrderStatus } from "../../../hooks/useAdminData";
import { Order, OrderStatus } from "@zora/types";

export default function DeliveryPage() {
    const [activeTab, setActiveTab] = useState("ready_for_pickup");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

    // Fetch orders based on active tab
    const { data: readyOrdersData, refetch: refetchReady } = useAllOrders({
        status: ['preparing', 'ready'], // Need to make sure the hook handles array
        limit: 100,
    });

    const { data: inTransitOrdersData, refetch: refetchInTransit } = useAllOrders({
        status: 'out_for_delivery',
        limit: 100,
    });

    const updateStatusMutation = useUpdateOrderStatus();

    const handleMarkDelivered = async (orderId: string) => {
        try {
            await updateStatusMutation.mutateAsync({
                orderId,
                status: 'delivered' as OrderStatus,
            });
            refetchInTransit();
        } catch (error) {
            console.error("Failed to mark delivered:", error);
        }
    };

    const readyOrders = (readyOrdersData?.data || []).filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order as any).vendor?.shop_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const inTransitOrders = (inTransitOrdersData?.data || []).filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order as any).vendor?.shop_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats
    const stats = {
        readyForPickup: readyOrdersData?.total || 0,
        inTransit: inTransitOrdersData?.total || 0,
        pendingAssignments: (readyOrdersData?.total || 0), // Simplification for now
    };

    const columnsReady = [
        {
            key: "id",
            header: "Order ID",
            render: (order: Order) => (
                <Link href={`/orders/${order.id}`}>
                    <span className="font-medium text-primary hover:underline">
                        {order.order_number || order.id.slice(0, 8)}
                    </span>
                </Link>
            ),
        },
        {
            key: "vendor",
            header: "Vendor",
            render: (order: any) => (
                <span className="text-slate-600">{order.vendor?.shop_name || "N/A"}</span>
            ),
        },
        {
            key: "customer",
            header: "Customer",
            render: (order: any) => (
                <div className="flex items-center gap-3">
                    <Avatar size="sm">
                        <AvatarFallback className="bg-slate-100 text-slate-600">
                            {order.customer?.full_name?.split(" ").map((n: string) => n[0]).join("") || "?"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-slate-900">{order.customer?.full_name || "Customer"}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (order: Order) => (
                <Badge variant={order.status === 'ready' ? 'success' : 'primary'}>
                    {order.status === 'ready' ? 'Ready' : 'Preparing'}
                </Badge>
            )
        },
        {
            key: "actions",
            header: "",
            render: (order: Order) => (
                <Button
                    size="sm"
                    onClick={() => setSelectedOrder(order.id)}
                    leftIcon={<Truck size={16} />}
                >
                    Book Courier
                </Button>
            ),
        },
    ];

    const columnsInTransit = [
        {
            key: "id",
            header: "Order ID",
            render: (order: Order) => (
                <Link href={`/orders/${order.id}`}>
                    <span className="font-medium text-primary hover:underline">
                        {order.order_number || order.id.slice(0, 8)}
                    </span>
                </Link>
            ),
        },
        {
            key: "details",
            header: "Details",
            render: (order: any) => (
                <div className="text-sm">
                    <p><span className="text-slate-500">Courier:</span> {order.courier_name || 'Manual'}</p>
                    <p><span className="text-slate-500">Tracking:</span> {order.tracking_id || 'N/A'}</p>
                </div>
            ),
        },
        {
            key: "actions",
            header: "",
            render: (order: Order) => (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMarkDelivered(order.id)}
                    leftIcon={<CheckCircle size={16} />}
                    isLoading={updateStatusMutation.isPending}
                >
                    Mark Delivered
                </Button>
            ),
        },
    ];

    return (
        <>
            <Header
                title="Delivery Management"
                description="Manage logistics, pickups, and active deliveries."
            />

            <div className="p-4 sm:p-6 lg:p-8">
                <DeliveryStats
                    readyForPickup={stats.readyForPickup}
                    inTransit={stats.inTransit}
                    pendingAssignments={stats.pendingAssignments}
                />

                <Card className="mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 max-w-md">
                            <Input
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                leftIcon={<MagnifyingGlass size={16} weight="duotone" />}
                            />
                        </div>
                    </div>
                </Card>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                        <TabsTrigger value="ready_for_pickup" className="gap-2">
                            <Package size={16} />
                            Ready for Pickup
                            {stats.readyForPickup > 0 && (
                                <Badge variant="primary" size="sm" className="ml-2">{stats.readyForPickup}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="in_transit" className="gap-2">
                            <Truck size={16} />
                            In Transit
                            {stats.inTransit > 0 && (
                                <Badge variant="info" size="sm" className="ml-2">{stats.inTransit}</Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="ready_for_pickup">
                        <Card padding="none">
                            {readyOrders.length > 0 ? (
                                <DataTable
                                    data={readyOrders}
                                    columns={columnsReady}
                                    getRowId={(item) => item.id}
                                />
                            ) : (
                                <div className="p-12">
                                    <EmptyState
                                        icon={Package}
                                        title="No orders ready for pickup"
                                        description="Orders will appear here when they are prepared by vendors."
                                    />
                                </div>
                            )}
                        </Card>
                    </TabsContent>

                    <TabsContent value="in_transit">
                        <Card padding="none">
                            {inTransitOrders.length > 0 ? (
                                <DataTable
                                    data={inTransitOrders}
                                    columns={columnsInTransit}
                                    getRowId={(item) => item.id}
                                />
                            ) : (
                                <div className="p-12">
                                    <EmptyState
                                        icon={Truck}
                                        title="No active deliveries"
                                        description="Orders currently out for delivery will show up here."
                                    />
                                </div>
                            )}
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <CourierBookingDialog
                open={!!selectedOrder}
                onOpenChange={(open) => !open && setSelectedOrder(null)}
                orderId={selectedOrder || ""}
                onSuccess={() => {
                    refetchReady();
                    refetchInTransit();
                    setSelectedOrder(null);
                }}
            />
        </>
    );
}
