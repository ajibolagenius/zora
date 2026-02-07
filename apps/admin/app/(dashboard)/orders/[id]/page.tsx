"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Package,
    Truck,
    User,
    MapPin,
    CreditCard,
    CheckCircle,
    Clock,
    XCircle,
    WarningCircle,
    ArrowsClockwise,
} from "@phosphor-icons/react";
import {
    Button,
    Card,
    Badge,
    Avatar,
    AvatarFallback,
    formatCurrency,
    formatRelativeTime,
    SkeletonCard,
} from "@zora/ui-web";
import { useOrderDetail } from "../../../../hooks/useAdminData";
import { Header } from "../../../../components/Header";
import { CourierBookingDialog } from "../../../../components/orders/CourierBookingDialog";
import type { OrderStatus } from "@zora/types";

const statusConfig = {
    pending: { label: "Pending", variant: "warning" as const, icon: Clock },
    confirmed: { label: "Confirmed", variant: "info" as const, icon: CheckCircle },
    preparing: { label: "Preparing", variant: "primary" as const, icon: Package },
    ready: { label: "Ready", variant: "success" as const, icon: CheckCircle },
    out_for_delivery: { label: "In Transit", variant: "info" as const, icon: Truck },
    delivered: { label: "Delivered", variant: "success" as const, icon: CheckCircle },
    cancelled: { label: "Cancelled", variant: "error" as const, icon: XCircle },
    refunded: { label: "Refunded", variant: "default" as const, icon: ArrowsClockwise },
} as const;

export default function AdminOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params?.id as string;
    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

    const { data: order, isLoading, isError, refetch } = useOrderDetail(orderId);

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                    <div className="space-y-6">
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !order) {
        return (
            <div className="p-8 text-center">
                <WarningCircle size={48} weight="duotone" className="mx-auto mb-4 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Order not found</h3>
                <p className="text-gray-500 mb-4">The order you are looking for does not exist or an error occurred.</p>
                <div className="flex justify-center gap-4">
                    <Link href="/orders">
                        <Button variant="outline">Back to Orders</Button>
                    </Link>
                    <Button onClick={() => refetch()}>Try Again</Button>
                </div>
            </div>
        );
    }

    const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
    const canBookCourier =
        order.status === 'preparing' ||
        order.status === 'ready' ||
        order.status === 'confirmed';

    return (
        <>
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/orders">
                            <Button variant="ghost" size="icon" className="h-10 w-10">
                                <ArrowLeft size={20} weight="bold" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Order #{order.order_number || order.id.slice(0, 8)}
                                </h1>
                                <Badge variant={status.variant} size="lg" icon={<status.icon size={14} weight="fill" />}>
                                    {status.label}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Placed on {new Date(order.created_at).toLocaleDateString()} at{" "}
                                {new Date(order.created_at).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {canBookCourier && (
                            <Button
                                onClick={() => setBookingDialogOpen(true)}
                                leftIcon={<Truck size={18} weight="duotone" />}
                            >
                                Book Courier
                            </Button>
                        )}
                        {/* Add other actions like Cancel or Refund here if needed */}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                            <div className="divide-y divide-gray-100">
                                {((order as any).items || []).map((item: any, index: number) => (
                                    <div key={item.id || index} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                            {item.product?.image_url ? (
                                                <img
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Package size={24} weight="duotone" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {item.product?.name || item.name || "Product"}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Qty: {item.quantity} × {formatCurrency(item.price)}
                                                    </p>
                                                </div>
                                                <p className="font-semibold text-gray-900">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 my-4" />
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(order.subtotal || 0)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span>{formatCurrency(order.delivery_fee || 0)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Service Fee</span>
                                    <span>{formatCurrency(order.service_fee || 0)}</span>
                                </div>
                                <div className="border-t border-gray-100 my-2" />
                                <div className="flex justify-between font-semibold text-lg text-gray-900">
                                    <span>Total</span>
                                    <span>{formatCurrency(order.total || 0)}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Timeline / Activity - Placeholder for now */}
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h2>
                            <div className="space-y-6 relative pl-4 border-l-2 border-gray-100">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-white" />
                                    <p className="text-sm font-medium text-gray-900">Order Placed</p>
                                    <p className="text-xs text-gray-500">
                                        {formatRelativeTime(new Date(order.created_at))}
                                    </p>
                                </div>
                                {order.status === 'out_for_delivery' && (
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white" />
                                        <p className="text-sm font-medium text-gray-900">Out for Delivery</p>
                                        <p className="text-xs text-gray-500">
                                            Courier has picked up the package
                                        </p>
                                    </div>
                                )}
                                {order.status === 'delivered' && (
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white" />
                                        <p className="text-sm font-medium text-gray-900">Delivered</p>
                                        <p className="text-xs text-gray-500">
                                            Package delivered to customer
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <Card>
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                Customer
                            </h2>
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar>
                                    <AvatarFallback>
                                        {(order as any).customer?.full_name?.[0] || <User />}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {(order as any).customer?.full_name || "Guest User"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {(order as any).customer?.email || "No email provided"}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Delivery Address */}
                        <Card>
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                Delivery Details
                            </h2>
                            <div className="flex gap-3">
                                <MapPin size={24} weight="duotone" className="text-gray-400 shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-900 whitespace-pre-line">
                                        {order.delivery_address
                                            ? `${order.delivery_address.line1}\n${order.delivery_address.city}, ${order.delivery_address.postcode}`
                                            : "No delivery address provided"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2 font-medium">
                                        Option: {order.delivery_option === 'delivery' ? 'Home Delivery' : 'Pickup'}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Vendor Info */}
                        <Card>
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                Vendor
                            </h2>
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                    <Package size={20} weight="duotone" className="text-gray-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {(order as any).vendor?.shop_name || "Unknown Vendor"}
                                    </p>
                                    {(order as any).vendor?.id ? (
                                        <Link href={`/vendors/${(order as any).vendor?.id}`}>
                                            <Button variant="link" size="sm" className="h-auto p-0 mt-1">
                                                View Vendor
                                            </Button>
                                        </Link>
                                    ) : (
                                        <span className="text-xs text-gray-400 mt-1 block">
                                            Vendor details unavailable
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <CourierBookingDialog
                open={bookingDialogOpen}
                onOpenChange={setBookingDialogOpen}
                orderId={orderId}
                onSuccess={() => {
                    refetch();
                    // Could add a toast notification here
                }}
            />
        </>
    );
}
