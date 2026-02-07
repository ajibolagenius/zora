'use client';

/**
 * VendorRealtimeProvider
 * Provides realtime subscriptions for the vendor portal
 */

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    RealtimeManager,
    useConnectionStore,
    useVendorOrdersRealtime,
    useProductsRealtime,
    type SubscriptionHandle,
    type ConnectionStatus,
} from '@zora/api-client';
import type { Order, Product } from '@zora/types';

// =============================================================================
// Types
// =============================================================================

interface VendorRealtimeContextValue {
    /** Current connection status */
    connectionStatus: ConnectionStatus;
    /** Whether connected to realtime */
    isConnected: boolean;
    /** Number of new orders since last viewed */
    newOrdersCount: number;
    /** Reset new orders count */
    resetNewOrdersCount: () => void;
    /** Number of active subscriptions */
    activeSubscriptions: number;
    /** Last received order */
    lastOrder: Order | null;
}

// =============================================================================
// Context
// =============================================================================

const VendorRealtimeContext = createContext<VendorRealtimeContextValue | null>(null);

// =============================================================================
// Provider Component
// =============================================================================

interface VendorRealtimeProviderProps {
    children: React.ReactNode;
    /** Vendor ID to subscribe to */
    vendorId: string | null;
    /** User ID to subscribe to notifications */
    userId: string | null;
    /** Whether realtime is enabled */
    enabled?: boolean;
    /** Callback when new order is received */
    onNewOrder?: (order: Order) => void;
    /** Callback when product is updated */
    onProductUpdate?: (product: Product) => void;
}

export function VendorRealtimeProvider({
    children,
    vendorId,
    userId,
    enabled = true,
    onNewOrder,
    onProductUpdate,
}: VendorRealtimeProviderProps) {
    const queryClient = useQueryClient();

    // Connection state from store
    const connectionStatus = useConnectionStore((s) => s.status);
    const initConnection = useConnectionStore((s) => s.initialize);
    const activeSubscriptions = useConnectionStore((s) => s.activeSubscriptions);

    // Local state
    const [newOrdersCount, setNewOrdersCount] = useState(0);
    const [lastOrder, setLastOrder] = useState<Order | null>(null);

    // Refs for subscription handles
    const subscriptionsRef = useRef<SubscriptionHandle[]>([]);

    // Initialize connection store
    useEffect(() => {
        const unsubscribe = initConnection();
        return () => unsubscribe();
    }, [initConnection]);

    // Reset new orders count
    const resetNewOrdersCount = useCallback(() => {
        setNewOrdersCount(0);
    }, []);

    // Handle new order
    const handleNewOrder = useCallback((order: Order) => {
        console.log('[VendorRealtime] New order received:', order.id);

        // Update count
        setNewOrdersCount((prev) => prev + 1);
        setLastOrder(order);

        // Invalidate orders query - aligned with vendorQueryKeys in useVendorData.ts
        queryClient.invalidateQueries({ queryKey: ['vendor', 'orders', vendorId] });
        queryClient.invalidateQueries({ queryKey: ['vendor', 'recentOrders', vendorId] });
        queryClient.invalidateQueries({ queryKey: ['vendor', 'stats', vendorId] });

        // Call external handler
        onNewOrder?.(order);

        // Play notification sound if available
        if (typeof window !== 'undefined' && 'Audio' in window) {
            try {
                const audio = new Audio('/sounds/new-order.mp3');
                audio.volume = 0.5;
                audio.play().catch(() => {
                    // Ignore autoplay errors
                });
            } catch {
                // Audio not available
            }
        }
    }, [vendorId, queryClient, onNewOrder]);

    // Handle order update
    const handleOrderUpdate = useCallback(({ old: oldOrder, new: newOrder }: { old: Order; new: Order }) => {
        console.log('[VendorRealtime] Order updated:', newOrder.id, oldOrder.status, '->', newOrder.status);

        // Invalidate specific order and orders list - aligned with vendorQueryKeys
        queryClient.invalidateQueries({ queryKey: ['vendor', 'order', newOrder.id] });
        queryClient.invalidateQueries({ queryKey: ['vendor', 'orders', vendorId] });
        queryClient.invalidateQueries({ queryKey: ['vendor', 'recentOrders', vendorId] });
    }, [vendorId, queryClient]);

    // Handle product update
    const handleProductUpdate = useCallback(({ new: product }: { old: Product; new: Product }) => {
        console.log('[VendorRealtime] Product updated:', product.id);

        // Invalidate products queries - aligned with vendorQueryKeys
        queryClient.invalidateQueries({ queryKey: ['vendor', 'products', vendorId] });
        queryClient.invalidateQueries({ queryKey: ['vendor', 'product', product.id] });

        onProductUpdate?.(product);
    }, [vendorId, queryClient, onProductUpdate]);

    // Subscribe to realtime updates
    useEffect(() => {
        if (!enabled || !vendorId) {
            // Unsubscribe all
            subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
            subscriptionsRef.current = [];
            return;
        }

        console.log('[VendorRealtime] Setting up subscriptions for vendor:', vendorId);

        // Subscribe to new orders
        const ordersSub = RealtimeManager.subscribe<Order>({
            table: 'orders',
            filter: `vendor_id=eq.${vendorId}`,
            onInsert: handleNewOrder,
            onUpdate: handleOrderUpdate,
        });

        // Subscribe to product updates
        const productsSub = RealtimeManager.subscribe<Product>({
            table: 'products',
            filter: `vendor_id=eq.${vendorId}`,
            onUpdate: handleProductUpdate,
            onDelete: (product) => {
                console.log('[VendorRealtime] Product deleted:', product.id);
                queryClient.invalidateQueries({ queryKey: ['vendor', 'products', vendorId] });
                queryClient.invalidateQueries({ queryKey: ['vendor', 'stats', vendorId] });
            },
        });

        // Subscribe to notifications
        let notificationsSub: SubscriptionHandle | null = null;
        if (userId) {
            notificationsSub = RealtimeManager.subscribe({
                table: 'notifications',
                filter: `user_id=eq.${userId}`,
                onInsert: () => {
                    queryClient.invalidateQueries({ queryKey: ['vendor', 'notifications'] });
                },
            });
        }

        subscriptionsRef.current = [ordersSub, productsSub, ...(notificationsSub ? [notificationsSub] : [])];

        // Cleanup
        return () => {
            console.log('[VendorRealtime] Cleaning up subscriptions');
            subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
            subscriptionsRef.current = [];
        };
    }, [
        enabled,
        vendorId,
        userId,
        handleNewOrder,
        handleOrderUpdate,
        handleProductUpdate,
        queryClient,
    ]);

    // Context value
    const value: VendorRealtimeContextValue = {
        connectionStatus,
        isConnected: connectionStatus === 'connected',
        newOrdersCount,
        resetNewOrdersCount,
        activeSubscriptions,
        lastOrder,
    };

    return (
        <VendorRealtimeContext.Provider value={value}>
            {children}
        </VendorRealtimeContext.Provider>
    );
}

// =============================================================================
// Hook
// =============================================================================

export function useVendorRealtime(): VendorRealtimeContextValue {
    const context = useContext(VendorRealtimeContext);
    if (!context) {
        throw new Error('useVendorRealtime must be used within VendorRealtimeProvider');
    }
    return context;
}

// =============================================================================
// Convenience Hooks
// =============================================================================

/**
 * Hook to check if there are new orders
 */
export function useHasNewOrders(): boolean {
    const { newOrdersCount } = useVendorRealtime();
    return newOrdersCount > 0;
}

/**
 * Hook to get vendor connection status
 */
export function useVendorConnectionStatus(): ConnectionStatus {
    const { connectionStatus } = useVendorRealtime();
    return connectionStatus;
}
