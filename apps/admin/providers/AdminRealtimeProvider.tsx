'use client';

/**
 * AdminRealtimeProvider
 * Provides realtime subscriptions for the admin dashboard
 */

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    RealtimeManager,
    useConnectionStore,
    useAdminBroadcast,
    type SubscriptionHandle,
    type ConnectionStatus,
} from '@zora/api-client';
import type { Order, VendorApplication, EmailThread } from '@zora/types';

// =============================================================================
// Types
// =============================================================================

interface PlatformStats {
    pendingOrders: number;
    pendingVendorApplications: number;
    unreadEmailThreads: number;
    activeUsers: number;
}

interface AdminRealtimeContextValue {
    /** Current connection status */
    connectionStatus: ConnectionStatus;
    /** Whether connected to realtime */
    isConnected: boolean;
    /** Platform-wide stats (updated in realtime) */
    stats: PlatformStats;
    /** Number of active subscriptions */
    activeSubscriptions: number;
    /** Broadcast an announcement to all users */
    broadcastAnnouncement: (title: string, message: string) => Promise<void>;
    /** Whether currently sending a broadcast */
    isBroadcasting: boolean;
}

// =============================================================================
// Context
// =============================================================================

const AdminRealtimeContext = createContext<AdminRealtimeContextValue | null>(null);

// =============================================================================
// Provider Component
// =============================================================================

interface AdminRealtimeProviderProps {
    children: React.ReactNode;
    /** Admin user ID */
    adminId: string | null;
    /** Whether realtime is enabled */
    enabled?: boolean;
    /** Callback when new order is received */
    onNewOrder?: (order: Order) => void;
    /** Callback when new vendor application is received */
    onNewApplication?: (application: VendorApplication) => void;
    /** Callback when new email thread is created */
    onNewEmailThread?: (thread: EmailThread) => void;
}

export function AdminRealtimeProvider({
    children,
    adminId,
    enabled = true,
    onNewOrder,
    onNewApplication,
    onNewEmailThread,
}: AdminRealtimeProviderProps) {
    const queryClient = useQueryClient();

    // Connection state from store
    const connectionStatus = useConnectionStore((s) => s.status);
    const initConnection = useConnectionStore((s) => s.initialize);
    const activeSubscriptions = useConnectionStore((s) => s.activeSubscriptions);

    // Broadcast hook
    const { broadcast: sendBroadcast, isSending: isBroadcasting } = useAdminBroadcast();

    // Local state
    const [stats, setStats] = useState<PlatformStats>({
        pendingOrders: 0,
        pendingVendorApplications: 0,
        unreadEmailThreads: 0,
        activeUsers: 0,
    });

    // Refs for subscription handles
    const subscriptionsRef = useRef<SubscriptionHandle[]>([]);

    // Initialize connection store
    useEffect(() => {
        const unsubscribe = initConnection();
        return () => unsubscribe();
    }, [initConnection]);

    // Broadcast announcement
    const broadcastAnnouncement = useCallback(async (title: string, message: string) => {
        await sendBroadcast({
            title,
            message,
        });
    }, [sendBroadcast]);

    // Handle new order
    const handleNewOrder = useCallback((order: Order) => {
        console.log('[AdminRealtime] New order:', order.id);

        // Update stats
        setStats((prev) => ({
            ...prev,
            pendingOrders: prev.pendingOrders + 1,
        }));

        // Invalidate queries - aligned with adminQueryKeys in useAdminData.ts
        queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'recentOrders'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'pendingItems'] });

        onNewOrder?.(order);
    }, [queryClient, onNewOrder]);

    // Handle order update
    const handleOrderUpdate = useCallback(({ new: order }: { old: Order; new: Order }) => {
        console.log('[AdminRealtime] Order updated:', order.id, 'status:', order.status);

        // Invalidate queries - aligned with adminQueryKeys in useAdminData.ts
        queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'order', order.id] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'recentOrders'] });
    }, [queryClient]);

    // Handle new vendor application
    const handleNewApplication = useCallback((application: VendorApplication) => {
        console.log('[AdminRealtime] New vendor application:', application.id);

        // Update stats
        setStats((prev) => ({
            ...prev,
            pendingVendorApplications: prev.pendingVendorApplications + 1,
        }));

        // Invalidate queries - aligned with adminQueryKeys in useAdminData.ts
        queryClient.invalidateQueries({ queryKey: ['admin', 'vendorApplications'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'pendingItems'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'vendors'] });

        onNewApplication?.(application);
    }, [queryClient, onNewApplication]);

    // Handle vendor application update
    const handleApplicationUpdate = useCallback(({ new: application }: { old: VendorApplication; new: VendorApplication }) => {
        console.log('[AdminRealtime] Vendor application updated:', application.id, 'status:', application.status);

        // Invalidate queries - aligned with adminQueryKeys in useAdminData.ts
        queryClient.invalidateQueries({ queryKey: ['admin', 'vendorApplications'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'vendorApplication', application.id] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'pendingItems'] });
    }, [queryClient]);

    // Handle new email thread
    const handleNewEmailThread = useCallback((thread: EmailThread) => {
        console.log('[AdminRealtime] New email thread:', thread.id);

        // Update stats
        setStats((prev) => ({
            ...prev,
            unreadEmailThreads: prev.unreadEmailThreads + 1,
        }));

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['email-threads'] });

        onNewEmailThread?.(thread);
    }, [queryClient, onNewEmailThread]);

    // Handle email thread update
    const handleEmailThreadUpdate = useCallback(({ new: thread }: { old: EmailThread; new: EmailThread }) => {
        console.log('[AdminRealtime] Email thread updated:', thread.id);

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['email-threads'] });
        queryClient.invalidateQueries({ queryKey: ['email-thread', thread.id] });
    }, [queryClient]);

    // Subscribe to realtime updates
    useEffect(() => {
        if (!enabled || !adminId) {
            // Unsubscribe all
            subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
            subscriptionsRef.current = [];
            return;
        }

        console.log('[AdminRealtime] Setting up subscriptions for admin:', adminId);

        // Subscribe to all orders (platform-wide)
        const ordersSub = RealtimeManager.subscribe<Order>({
            table: 'orders',
            onInsert: handleNewOrder,
            onUpdate: handleOrderUpdate,
        });

        // Subscribe to vendor applications
        const applicationsSub = RealtimeManager.subscribe<VendorApplication>({
            table: 'vendor_applications',
            onInsert: handleNewApplication,
            onUpdate: handleApplicationUpdate,
        });

        // Subscribe to email threads
        const emailThreadsSub = RealtimeManager.subscribe<EmailThread>({
            table: 'email_threads',
            onInsert: handleNewEmailThread,
            onUpdate: handleEmailThreadUpdate,
        });

        // Subscribe to email messages (for real-time chat)
        const emailMessagesSub = RealtimeManager.subscribe({
            table: 'email_messages',
            onInsert: () => {
                queryClient.invalidateQueries({ queryKey: ['email-messages'] });
            },
        });

        // Subscribe to admin notifications
        const notificationsSub = RealtimeManager.subscribe({
            table: 'notifications',
            filter: `user_id=eq.${adminId}`,
            onInsert: () => {
                queryClient.invalidateQueries({ queryKey: ['notifications'] });
            },
        });

        // Track admin presence
        const presenceSub = RealtimeManager.trackPresence('admin-dashboard', {
            userId: adminId,
            role: 'admin',
        });

        subscriptionsRef.current = [
            ordersSub,
            applicationsSub,
            emailThreadsSub,
            emailMessagesSub,
            notificationsSub,
            presenceSub,
        ];

        // Cleanup
        return () => {
            console.log('[AdminRealtime] Cleaning up subscriptions');
            subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
            subscriptionsRef.current = [];
        };
    }, [
        enabled,
        adminId,
        handleNewOrder,
        handleOrderUpdate,
        handleNewApplication,
        handleApplicationUpdate,
        handleNewEmailThread,
        handleEmailThreadUpdate,
        queryClient,
    ]);

    // Context value
    const value: AdminRealtimeContextValue = {
        connectionStatus,
        isConnected: connectionStatus === 'connected',
        stats,
        activeSubscriptions,
        broadcastAnnouncement,
        isBroadcasting,
    };

    return (
        <AdminRealtimeContext.Provider value={value}>
            {children}
        </AdminRealtimeContext.Provider>
    );
}

// =============================================================================
// Hook
// =============================================================================

export function useAdminRealtime(): AdminRealtimeContextValue {
    const context = useContext(AdminRealtimeContext);
    if (!context) {
        throw new Error('useAdminRealtime must be used within AdminRealtimeProvider');
    }
    return context;
}

// =============================================================================
// Convenience Hooks
// =============================================================================

/**
 * Hook to get platform stats
 */
export function usePlatformStats(): PlatformStats {
    const { stats } = useAdminRealtime();
    return stats;
}

/**
 * Hook to check if there are pending items
 */
export function useHasPendingItems(): boolean {
    const { stats } = useAdminRealtime();
    return (
        stats.pendingOrders > 0 ||
        stats.pendingVendorApplications > 0 ||
        stats.unreadEmailThreads > 0
    );
}

/**
 * Hook to get admin connection status
 */
export function useAdminConnectionStatus(): ConnectionStatus {
    const { connectionStatus } = useAdminRealtime();
    return connectionStatus;
}

/**
 * Hook for broadcasting
 */
export function useBroadcastAnnouncement() {
    const { broadcastAnnouncement, isBroadcasting } = useAdminRealtime();
    return { broadcastAnnouncement, isBroadcasting };
}
