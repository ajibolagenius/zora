"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
    X,
} from "lucide-react";
import { cn } from "@zora/ui-web";
import { useState, useEffect, useRef } from "react";

const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "Products", icon: Package, href: "/products" },
    { name: "Orders", icon: ShoppingCart, href: "/orders" },
    { name: "Analytics", icon: BarChart3, href: "/analytics" },
    { name: "Shop Profile", icon: Store, href: "/shop" },
    { name: "Coverage Area", icon: MapPin, href: "/coverage" },
    { name: "Settings", icon: Settings, href: "/settings" },
];

interface SidebarProps {
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const prevPathnameRef = useRef(pathname);

    // Close mobile menu when route changes (not when mobileOpen changes)
    useEffect(() => {
        if (prevPathnameRef.current !== pathname) {
            prevPathnameRef.current = pathname;
            if (mobileOpen && onMobileClose) {
                onMobileClose();
            }
        }
    }, [pathname, mobileOpen, onMobileClose]);

    const sidebarContent = (
        <>
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/10">
                <Link href="/" className="flex items-center gap-2 overflow-hidden">
                    <span className="text-2xl font-bold text-primary">ZORA</span>
                    <span className="text-xs bg-[#342418] px-2 py-0.5 rounded text-[#CBA990] hidden lg:inline">Vendor</span>
                </Link>
                {/* Desktop collapse button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors hidden lg:block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    aria-expanded={!collapsed}
                >
                    {collapsed ? (
                        <Menu className="w-5 h-5" aria-hidden="true" />
                    ) : (
                        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                    )}
                </button>
                {/* Mobile close button */}
                <button
                    onClick={onMobileClose}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Close navigation menu"
                >
                    <X className="w-5 h-5" aria-hidden="true" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto" role="navigation" aria-label="Main navigation">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onMobileClose}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
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
                                className="whitespace-nowrap overflow-hidden lg:block"
                            >
                                {item.name}
                            </motion.span>
                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 hidden lg:block">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-white/10">
                <button
                    className="flex items-center gap-3 px-4 py-3 w-full text-[#CBA990] hover:text-white hover:bg-white/10 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Log out of your account"
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
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
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: collapsed ? 80 : 256 }}
                transition={{ duration: 0.2, ease: [0.0, 0.0, 0.2, 1] }}
                className="bg-[#221710] text-white flex-col h-screen sticky top-0 hidden lg:flex"
            >
                {sidebarContent}
            </motion.aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onMobileClose}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        />
                        {/* Sidebar */}
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ duration: 0.2, ease: [0.0, 0.0, 0.2, 1] }}
                            className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#221710] text-white flex flex-col z-50 lg:hidden"
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
