"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ShoppingCart,
    Users,
    Store,
    DollarSign,
    TrendingUp,
    UserPlus,
    Star,
    RefreshCw,
    Mail,
    AlertCircle,
    CheckCircle,
    ArrowRight,
    Clock,
} from "lucide-react";
import { Header } from "../../components/Header";
import {
    StatsCard,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    Badge,
    Avatar,
    AvatarFallback,
    staggerContainer,
    staggerItem,
    formatCurrency,
    formatRelativeTime,
} from "@zora/ui-web";

// Mock data
const stats = [
    { title: "Total Orders", value: "1,234", change: 12, icon: ShoppingCart, iconColor: "text-blue-600", iconBgColor: "bg-blue-100" },
    { title: "Total Revenue", value: "£89,432", change: 8, icon: DollarSign, iconColor: "text-green-600", iconBgColor: "bg-green-100" },
    { title: "Active Vendors", value: "156", change: 5, icon: Store, iconColor: "text-purple-600", iconBgColor: "bg-purple-100" },
    { title: "Total Customers", value: "8,421", change: 15, icon: Users, iconColor: "text-orange-600", iconBgColor: "bg-orange-100" },
];

const pendingItems = [
    { type: "Vendor Applications", count: 8, icon: UserPlus, href: "/vendors?tab=applications", color: "bg-blue-100 text-blue-600" },
    { type: "Pending Reviews", count: 23, icon: Star, href: "/reviews?status=pending", color: "bg-yellow-100 text-yellow-600" },
    { type: "Refund Requests", count: 5, icon: RefreshCw, href: "/refunds", color: "bg-red-100 text-red-600" },
    { type: "Support Tickets", count: 12, icon: Mail, href: "/emails", color: "bg-purple-100 text-purple-600" },
];

const recentOrders = [
    { id: "ORD-1234", customer: "John Doe", vendor: "African Spice House", total: 45.99, status: "delivered", time: new Date(Date.now() - 1000 * 60 * 30) },
    { id: "ORD-1235", customer: "Jane Smith", vendor: "Mama's Kitchen", total: 89.50, status: "preparing", time: new Date(Date.now() - 1000 * 60 * 60) },
    { id: "ORD-1236", customer: "Mike Johnson", vendor: "Lagos Foods", total: 23.00, status: "pending", time: new Date(Date.now() - 1000 * 60 * 90) },
    { id: "ORD-1237", customer: "Sarah Wilson", vendor: "African Spice House", total: 67.25, status: "out_for_delivery", time: new Date(Date.now() - 1000 * 60 * 120) },
    { id: "ORD-1238", customer: "Chris Brown", vendor: "Naija Delights", total: 112.00, status: "confirmed", time: new Date(Date.now() - 1000 * 60 * 180) },
];

const statusColors = {
    pending: "warning",
    confirmed: "info",
    preparing: "primary",
    ready: "success",
    out_for_delivery: "info",
    delivered: "success",
} as const;

const vendorApplications = [
    { name: "Afro Bites London", type: "Restaurant", submitted: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { name: "Ghana Grocery", type: "Grocery Store", submitted: new Date(Date.now() - 1000 * 60 * 60 * 5) },
    { name: "Naija Spice Co", type: "Wholesaler", submitted: new Date(Date.now() - 1000 * 60 * 60 * 24) },
];

export default function AdminDashboard() {
    return (
        <>
            <Header title="Admin Dashboard" description="Platform overview and management" />

            <div className="p-4 sm:p-6 lg:p-8">
                {/* Stats Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {stats.map((stat) => (
                        <motion.div key={stat.title} variants={staggerItem}>
                            <StatsCard {...stat} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Pending Items */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    {pendingItems.map((item) => (
                        <motion.div key={item.type} variants={staggerItem}>
                            <Link href={item.href}>
                                <Card hover className="cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-900">{item.count}</p>
                                            <p className="text-sm text-slate-500">{item.type}</p>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Card padding="none">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
                                    <p className="text-sm text-slate-500">Latest platform orders</p>
                                </div>
                                <Link href="/orders">
                                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                        View All
                                    </Button>
                                </Link>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {recentOrders.map((order, index) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * index }}
                                        className="p-4 hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Avatar size="sm">
                                                    <AvatarFallback className="bg-slate-100 text-slate-600">
                                                        {order.customer.split(" ").map(n => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-primary">{order.id}</p>
                                                        <Badge variant={statusColors[order.status as keyof typeof statusColors]} size="sm">
                                                            {order.status.replace("_", " ")}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-slate-500">
                                                        {order.customer} • {order.vendor}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-slate-900">{formatCurrency(order.total)}</p>
                                                <p className="text-xs text-slate-400">{formatRelativeTime(order.time)}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* System Alerts */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>System Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl">
                                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">8 vendors pending approval</p>
                                            <p className="text-xs text-slate-500">Review required</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">All systems operational</p>
                                            <p className="text-xs text-slate-500">Last checked 5 min ago</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Vendor Applications */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>New Applications</CardTitle>
                                        <Link href="/vendors?tab=applications">
                                            <Button variant="ghost" size="sm">View All</Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {vendorApplications.map((app, index) => (
                                        <motion.div
                                            key={app.name}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                                        >
                                            <Avatar size="sm">
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {app.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-900 truncate">{app.name}</p>
                                                <p className="text-xs text-slate-500">{app.type}</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                                <Clock className="w-3 h-3" />
                                                {formatRelativeTime(app.submitted)}
                                            </div>
                                        </motion.div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
