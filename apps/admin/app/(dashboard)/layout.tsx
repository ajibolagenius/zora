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
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar
                mobileOpen={mobileMenuOpen}
                onMobileClose={() => setMobileMenuOpen(false)}
            />
            <main id="main-content" className="flex-1 overflow-auto w-full">
                {/* Mobile Header Bar */}
                <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-4">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        aria-label="Open navigation menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        <Menu className="w-6 h-6 text-slate-600" aria-hidden="true" />
                    </button>
                    <span className="text-xl font-bold text-primary">ZORA</span>
                    <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">Admin</span>
                </div>
                {children}
            </main>
        </div>
    );
}
