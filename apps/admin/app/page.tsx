import Link from "next/link";
import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    Store,
    Package,
    Star,
    BarChart3,
    Mail,
    RefreshCw,
    Settings,
    LogOut,
    Bell,
    TrendingUp,
    TrendingDown,
    DollarSign,
    UserPlus,
    AlertCircle,
    CheckCircle,
} from "lucide-react";

// Mock data for demo
const stats = [
    {
        name: "Total Orders",
        value: "1,234",
        change: "+12%",
        trend: "up",
        icon: ShoppingCart,
        color: "blue",
    },
    {
        name: "Total Revenue",
        value: "£89,432",
        change: "+8%",
        trend: "up",
        icon: DollarSign,
        color: "green",
    },
    {
        name: "Active Vendors",
        value: "156",
        change: "+5",
        trend: "up",
        icon: Store,
        color: "purple",
    },
    {
        name: "Active Customers",
        value: "8,421",
        change: "+324",
        trend: "up",
        icon: Users,
        color: "orange",
    },
];

const pendingItems = [
    { type: "Vendor Applications", count: 8, icon: UserPlus, href: "/vendors/applications" },
    { type: "Pending Reviews", count: 23, icon: Star, href: "/reviews" },
    { type: "Refund Requests", count: 5, icon: RefreshCw, href: "/refunds" },
    { type: "Support Tickets", count: 12, icon: Mail, href: "/support" },
];

const recentOrders = [
    { id: "ORD-1234", customer: "John Doe", vendor: "African Spice House", total: "£45.99", status: "delivered" },
    { id: "ORD-1235", customer: "Jane Smith", vendor: "Mama's Kitchen", total: "£89.50", status: "preparing" },
    { id: "ORD-1236", customer: "Mike Johnson", vendor: "Lagos Foods", total: "£23.00", status: "pending" },
    { id: "ORD-1237", customer: "Sarah Wilson", vendor: "African Spice House", total: "£67.25", status: "out_for_delivery" },
    { id: "ORD-1238", customer: "Chris Brown", vendor: "Naija Delights", total: "£112.00", status: "confirmed" },
];

const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/", active: true },
    { name: "Orders", icon: ShoppingCart, href: "/orders" },
    { name: "Customers", icon: Users, href: "/customers" },
    { name: "Vendors", icon: Store, href: "/vendors" },
    { name: "Products", icon: Package, href: "/products" },
    { name: "Reviews", icon: Star, href: "/reviews" },
    { name: "Analytics", icon: BarChart3, href: "/analytics" },
    { name: "Emails", icon: Mail, href: "/emails" },
    { name: "Refunds", icon: RefreshCw, href: "/refunds" },
    { name: "Settings", icon: Settings, href: "/settings" },
];

export default function AdminDashboard() {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
                <div className="p-6">
                    <span className="text-2xl font-bold font-display text-primary">ZORA</span>
                    <span className="text-xs text-sidebar-muted ml-2">Admin</span>
                </div>

                <nav className="flex-1 px-4 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${item.active
                                    ? "bg-primary text-white"
                                    : "text-sidebar-muted hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button className="flex items-center gap-3 px-4 py-3 text-sidebar-muted hover:text-white transition-colors w-full">
                        <LogOut className="w-5 h-5" />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold font-display">Admin Dashboard</h1>
                        <p className="text-slate-500 text-sm">Overview of your platform</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-500 hover:text-slate-700">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                        </button>
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">AD</span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat) => (
                            <div
                                key={stat.name}
                                className="bg-white rounded-xl p-6 border border-slate-200"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === "blue"
                                                ? "bg-blue-100"
                                                : stat.color === "green"
                                                    ? "bg-green-100"
                                                    : stat.color === "purple"
                                                        ? "bg-purple-100"
                                                        : "bg-orange-100"
                                            }`}
                                    >
                                        <stat.icon
                                            className={`w-6 h-6 ${stat.color === "blue"
                                                    ? "text-blue-600"
                                                    : stat.color === "green"
                                                        ? "text-green-600"
                                                        : stat.color === "purple"
                                                            ? "text-purple-600"
                                                            : "text-orange-600"
                                                }`}
                                        />
                                    </div>
                                    <span
                                        className={`flex items-center text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"
                                            }`}
                                    >
                                        {stat.trend === "up" ? (
                                            <TrendingUp className="w-4 h-4 mr-1" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4 mr-1" />
                                        )}
                                        {stat.change}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
                                <p className="text-slate-500 text-sm">{stat.name}</p>
                            </div>
                        ))}
                    </div>

                    {/* Pending Items */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {pendingItems.map((item) => (
                            <Link
                                key={item.type}
                                href={item.href}
                                className="bg-white rounded-xl p-4 border border-slate-200 hover:border-primary transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <item.icon className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold">{item.count}</div>
                                        <div className="text-sm text-slate-500">{item.type}</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
                            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Recent Orders</h2>
                                <Link
                                    href="/orders"
                                    className="text-primary text-sm font-medium hover:underline"
                                >
                                    View All
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">
                                                Order ID
                                            </th>
                                            <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">
                                                Customer
                                            </th>
                                            <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">
                                                Vendor
                                            </th>
                                            <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">
                                                Total
                                            </th>
                                            <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="border-b border-slate-50 hover:bg-slate-50"
                                            >
                                                <td className="py-4 px-6 font-medium text-primary">
                                                    {order.id}
                                                </td>
                                                <td className="py-4 px-6">{order.customer}</td>
                                                <td className="py-4 px-6 text-slate-600">{order.vendor}</td>
                                                <td className="py-4 px-6 font-medium">{order.total}</td>
                                                <td className="py-4 px-6">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "delivered"
                                                                ? "bg-green-100 text-green-700"
                                                                : order.status === "preparing"
                                                                    ? "bg-purple-100 text-purple-700"
                                                                    : order.status === "pending"
                                                                        ? "bg-yellow-100 text-yellow-700"
                                                                        : order.status === "out_for_delivery"
                                                                            ? "bg-blue-100 text-blue-700"
                                                                            : "bg-slate-100 text-slate-700"
                                                            }`}
                                                    >
                                                        {order.status.replace("_", " ")}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Quick Actions & Alerts */}
                        <div className="space-y-6">
                            {/* Alerts */}
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-lg font-semibold mb-4">System Alerts</h2>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">8 vendors pending approval</p>
                                            <p className="text-xs text-slate-500">Review required</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">All systems operational</p>
                                            <p className="text-xs text-slate-500">Last checked 5 min ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    <Link
                                        href="/vendors/applications"
                                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <Store className="w-5 h-5 text-slate-600" />
                                        <span className="text-sm font-medium">Review Vendor Applications</span>
                                    </Link>
                                    <Link
                                        href="/refunds"
                                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <RefreshCw className="w-5 h-5 text-slate-600" />
                                        <span className="text-sm font-medium">Process Refunds</span>
                                    </Link>
                                    <Link
                                        href="/analytics"
                                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <BarChart3 className="w-5 h-5 text-slate-600" />
                                        <span className="text-sm font-medium">View Analytics</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
