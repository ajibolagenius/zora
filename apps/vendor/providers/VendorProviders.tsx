'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VendorRealtimeProvider } from './VendorRealtimeProvider';
import { useVendorId } from '../hooks/useAuth';

export function VendorProviders({ children }: { children: React.ReactNode }) {
    // Create a client for the provider
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // With SSR, we usually want to set some default staleTime
                        // above 0 to avoid refetching immediately on the client
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    // Get vendor ID for realtime subscriptions
    const vendorId = useVendorId();

    return (
        <QueryClientProvider client={queryClient}>
            <VendorRealtimeProvider vendorId={vendorId}>
                {children}
            </VendorRealtimeProvider>
        </QueryClientProvider>
    );
}
