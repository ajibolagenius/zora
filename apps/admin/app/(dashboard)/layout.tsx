"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar } from "../../components/Sidebar";
import { ZoraLogo } from "../../components/ZoraLogo";
import { List, Bell } from "@phosphor-icons/react";
import { AdminRealtimeProvider, useAdminRealtime } from "../../providers";
import { ConnectionStatus } from "@zora/ui-web";
import { useAuth } from "../../hooks";

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

// Connection status indicator component
function ConnectionIndicator() {
    const { connectionStatus, stats } = useAdminRealtime();

    const totalPending =
        stats.pendingOrders +
        stats.pendingVendorApplications +
        stats.unreadEmailThreads;

    return (
        <div className="flex items-center gap-3">
            {totalPending > 0 && (
                <div className="flex items-center gap-1 bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">
                    <Bell size={12} weight="duotone" />
                    <span>{totalPending}</span>
                </div>
            )}
            <ConnectionStatus status={connectionStatus} />
        </div>
    );
}

// Inner layout with realtime context
function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
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
                        <List size={24} weight="duotone" className="text-slate-600" aria-hidden="true" />
                    </button>
                    <ZoraLogo className="w-8 h-8" outlineColor="#000" />
                    <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">Admin</span>
                    <div className="ml-auto">
                        <ConnectionIndicator />
                    </div>
                </div>
                {children}
            </main>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading, isAdmin } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            <AdminRealtimeProvider
                adminId={user?.id ?? null}
                enabled={!!user?.id && isAdmin}
                onNewOrder={(order) => {
                    console.log("[Admin] New order received:", order.id);
                    // You can show a toast notification here
                }}
                onNewApplication={(application) => {
                    console.log("[Admin] New vendor application:", application.id);
                    // You can show a toast notification here
                }}
            >
                <DashboardLayoutInner>{children}</DashboardLayoutInner>
            </AdminRealtimeProvider>
        </QueryClientProvider>
    );
}
