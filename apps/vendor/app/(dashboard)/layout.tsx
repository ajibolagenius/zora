"use client";

import { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar
                mobileOpen={mobileMenuOpen}
                onMobileClose={() => setMobileMenuOpen(false)}
            />
            <main id="main-content" className="flex-1 overflow-auto w-full">
                {/* Mobile Header Bar */}
                <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        aria-label="Open navigation menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        <Menu className="w-6 h-6 text-gray-600" aria-hidden="true" />
                    </button>
                    <span className="text-xl font-bold text-primary">ZORA</span>
                    <span className="text-xs text-[#CBA990]">Vendor</span>
                </div>
                {children}
            </main>
        </div>
    );
}
