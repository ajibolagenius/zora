import Link from "next/link";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    BarChart3,
    Store,
    MapPin,
    Settings,
    LogOut,
    Bell,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    Clock,
} from "lucide-react";

// Mock data for demo
const stats = [
    {
        name: "Today's Orders",
        value: "23",
        change: "+12%",
        trend: "up",
        icon: ShoppingCart,
    },
    {
        name: "Total Revenue",
        value: "£4,521",
        change: "+8%",
        trend: "up",
        icon: DollarSign,
    },
    {
        name: "Product Views",
        value: "1,429",
        change: "-3%",
        trend: "down",
        icon: Users,
    },
    {
        name: "Avg. Fulfillment",
        value: "2.4h",
        change: "-15%",
        trend: "up",
        icon: Clock,
    },
];

const recentOrders = [
    { id: "ORD-001", customer: "John Doe", items: 3, total: "£45.99", status: "pending" },
    { id: "ORD-002", customer: "Jane Smith", items: 5, total: "£89.50", status: "confirmed" },
    { id: "ORD-003", customer: "Mike Johnson", items: 2, total: "£23.00", status: "preparing" },
    { id: "ORD-004", customer: "Sarah Wilson", items: 4, total: "£67.25", status: "ready" },
];

const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/", active: true },
    { name: "Products", icon: Package, href: "/products" },
    { name: "Orders", icon: ShoppingCart, href: "/orders" },
    { name: "Analytics", icon: BarChart3, href: "/analytics" },
    { name: "Shop Profile", icon: Store, href: "/shop" },
    { name: "Coverage Area", icon: MapPin, href: "/coverage" },
    { name: "Settings", icon: Settings, href: "/settings" },
];

export default function VendorDashboard() {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
                <div className="p-6">
                    <span className="text-2xl font-bold font-display text-primary">ZORA</span>
                    <span className="text-xs text-sidebar-muted ml-2">Vendor</span>
                </div>

                <nav className="flex-1 px-4">
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
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold font-display">Dashboard</h1>
                        <p className="text-gray-500 text-sm">Welcome back, African Spice House</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-500 hover:text-gray-700">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                        </button>
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold">AS</span>
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
                                className="bg-white rounded-xl p-6 border border-gray-200"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <stat.icon className="w-6 h-6 text-primary" />
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
                                <p className="text-gray-500 text-sm">{stat.name}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
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
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">
                                                Order ID
                                            </th>
                                            <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">
                                                Customer
                                            </th>
                                            <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">
                                                Items
                                            </th>
                                            <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">
                                                Total
                                            </th>
                                            <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="border-b border-gray-100 hover:bg-gray-50"
                                            >
                                                <td className="py-4 px-6 font-medium">{order.id}</td>
                                                <td className="py-4 px-6">{order.customer}</td>
                                                <td className="py-4 px-6">{order.items}</td>
                                                <td className="py-4 px-6 font-medium">{order.total}</td>
                                                <td className="py-4 px-6">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "pending"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : order.status === "confirmed"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : order.status === "preparing"
                                                                        ? "bg-purple-100 text-purple-700"
                                                                        : "bg-green-100 text-green-700"
                                                            }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <Link
                                    href="/products/new"
                                    className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                                >
                                    <Package className="w-5 h-5 text-primary" />
                                    <span className="font-medium">Add New Product</span>
                                </Link>
                                <Link
                                    href="/orders?status=pending"
                                    className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                                >
                                    <ShoppingCart className="w-5 h-5 text-yellow-600" />
                                    <span className="font-medium">View Pending Orders</span>
                                </Link>
                                <Link
                                    href="/shop"
                                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <Store className="w-5 h-5 text-gray-600" />
                                    <span className="font-medium">Update Shop Profile</span>
                                </Link>
                                <Link
                                    href="/analytics"
                                    className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <BarChart3 className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">View Analytics</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
