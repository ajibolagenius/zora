"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar } from "../../components/Sidebar";
import { List, WifiHigh, WifiX } from "@phosphor-icons/react";
import { VendorRealtimeProvider, useVendorRealtime } from "../../providers";
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
    const { isConnected, newOrdersCount } = useVendorRealtime();

    return (
        <div className="flex items-center gap-2">
            {newOrdersCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                    {newOrdersCount} new
                </span>
            )}
            <div
                className={`flex items-center gap-1 text-xs ${isConnected ? "text-green-600" : "text-gray-400"
                    }`}
                title={isConnected ? "Connected" : "Disconnected"}
            >
                {isConnected ? (
                    <WifiHigh size={14} weight="duotone" />
                ) : (
                    <WifiX size={14} weight="duotone" />
                )}
            </div>
        </div>
    );
}

// Inner layout with realtime context
function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
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
                        <List size={24} weight="duotone" className="text-gray-600" aria-hidden="true" />
                    </button>
                    <span className="text-xl font-bold text-primary">ZORA</span>
                    <span className="text-xs bg-[#342418] px-2 py-0.5 rounded text-[#CBA990]">Vendor</span>
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
    const { vendor, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            <VendorRealtimeProvider
                vendorId={vendor?.id ?? null}
                enabled={!!vendor?.id}
                onNewOrder={(order) => {
                    console.log("[Vendor] New order received:", order.id);
                    // You can show a toast notification here
                }}
            >
                <DashboardLayoutInner>{children}</DashboardLayoutInner>
            </VendorRealtimeProvider>
        </QueryClientProvider>
    );
}
