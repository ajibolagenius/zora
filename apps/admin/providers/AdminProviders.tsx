'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminRealtimeProvider } from './AdminRealtimeProvider';
import { useAdminId } from '../hooks/useAuth';

export function AdminProviders({ children }: { children: React.ReactNode }) {
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

    // Get admin ID for realtime subscriptions
    const adminId = useAdminId();

    return (
        <QueryClientProvider client={queryClient}>
            <AdminRealtimeProvider adminId={adminId}>
                {children}
            </AdminRealtimeProvider>
        </QueryClientProvider>
    );
}
