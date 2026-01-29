"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    BarChart3,
    Store,
    MapPin,
    Settings,
    LogOut,
    ChevronLeft,
    Menu,
} from "lucide-react";
import { cn } from "@zora/ui-web";
import { useState } from "react";

const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "Products", icon: Package, href: "/products" },
    { name: "Orders", icon: ShoppingCart, href: "/orders" },
    { name: "Analytics", icon: BarChart3, href: "/analytics" },
    { name: "Shop Profile", icon: Store, href: "/shop" },
    { name: "Coverage Area", icon: MapPin, href: "/coverage" },
    { name: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 256 }}
            transition={{ duration: 0.2, ease: [0.0, 0.0, 0.2, 1] }}
            className="bg-[#221710] text-white flex flex-col h-screen sticky top-0"
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/10">
                <Link href="/" className="flex items-center gap-2 overflow-hidden">
                    <motion.span
                        initial={false}
                        animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
                        className="text-2xl font-bold text-primary"
                    >
                        ZORA
                    </motion.span>
                    {!collapsed && (
                        <span className="text-xs text-[#CBA990]">Vendor</span>
                    )}
                </Link>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    {collapsed ? (
                        <Menu className="w-5 h-5" />
                    ) : (
                        <ChevronLeft className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 group relative",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-[#CBA990] hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <motion.span
                                initial={false}
                                animate={{
                                    opacity: collapsed ? 0 : 1,
                                    width: collapsed ? 0 : "auto"
                                }}
                                className="whitespace-nowrap overflow-hidden"
                            >
                                {item.name}
                            </motion.span>
                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-white/10">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-[#CBA990] hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <motion.span
                        initial={false}
                        animate={{
                            opacity: collapsed ? 0 : 1,
                            width: collapsed ? 0 : "auto"
                        }}
                        className="whitespace-nowrap overflow-hidden"
                    >
                        Log Out
                    </motion.span>
                </button>
            </div>
        </motion.aside>
    );
}
