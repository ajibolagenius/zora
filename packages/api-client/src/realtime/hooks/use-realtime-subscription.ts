/**
 * useRealtimeSubscription Hook
 * React hook for subscribing to Supabase Realtime table changes
 */

import { useEffect, useRef, useCallback } from 'react';
import { RealtimeManager } from '../realtime-manager';
import type { UseRealtimeOptions, RealtimeTable, SubscriptionHandle } from '../types';

/**
 * Hook for subscribing to realtime table changes
 * Automatically invalidates React Query cache on changes
 */
export function useRealtimeSubscription<T = any>(options: UseRealtimeOptions<T>): void {
    const {
        table,
        filter,
        queryKey,
        enabled = true,
        onInsert,
        onUpdate,
        onDelete,
    } = options;

    const subscriptionRef = useRef<SubscriptionHandle | null>(null);

    // Memoize callbacks to prevent unnecessary re-subscriptions
    const handleInsert = useCallback(
        (data: T) => {
            onInsert?.(data);
        },
        [onInsert]
    );

    const handleUpdate = useCallback(
        (data: { old: T; new: T }) => {
            onUpdate?.(data);
        },
        [onUpdate]
    );

    const handleDelete = useCallback(
        (data: T) => {
            onDelete?.(data);
        },
        [onDelete]
    );

    useEffect(() => {
        if (!enabled) {
            // Unsubscribe if disabled
            subscriptionRef.current?.unsubscribe();
            subscriptionRef.current = null;
            return;
        }

        // Subscribe to realtime changes
        subscriptionRef.current = RealtimeManager.subscribe<T>({
            table,
            filter,
            onInsert: handleInsert,
            onUpdate: handleUpdate,
            onDelete: handleDelete,
            onError: (error) => {
                console.error(`[useRealtimeSubscription] Error for ${table}:`, error);
            },
        });

        // Cleanup on unmount or when dependencies change
        return () => {
            subscriptionRef.current?.unsubscribe();
            subscriptionRef.current = null;
        };
    }, [table, filter, enabled, handleInsert, handleUpdate, handleDelete]);
}

/**
 * Hook for subscribing to user-specific order updates
 */
export function useOrdersRealtime<T = any>(
    userId: string,
    options?: Partial<Omit<UseRealtimeOptions<T>, 'table' | 'filter' | 'queryKey'>>
): void {
    useRealtimeSubscription({
        table: 'orders',
        filter: `user_id=eq.${userId}`,
        queryKey: ['orders', 'user', userId],
        enabled: !!userId,
        ...options,
    });
}

/**
 * Hook for subscribing to vendor order updates
 */
export function useVendorOrdersRealtime<T = any>(
    vendorId: string,
    options?: Partial<Omit<UseRealtimeOptions<T>, 'table' | 'filter' | 'queryKey'>>
): void {
    useRealtimeSubscription({
        table: 'orders',
        filter: `vendor_id=eq.${vendorId}`,
        queryKey: ['orders', 'vendor', vendorId],
        enabled: !!vendorId,
        ...options,
    });
}

/**
 * Hook for subscribing to product updates
 */
export function useProductsRealtime<T = any>(
    vendorId?: string,
    options?: Partial<Omit<UseRealtimeOptions<T>, 'table' | 'filter' | 'queryKey'>>
): void {
    useRealtimeSubscription({
        table: 'products',
        filter: vendorId ? `vendor_id=eq.${vendorId}` : undefined,
        queryKey: vendorId ? ['products', 'vendor', vendorId] : ['products'],
        enabled: true,
        ...options,
    });
}

/**
 * Hook for subscribing to user notifications
 */
export function useNotificationsRealtime<T = any>(
    userId: string,
    options?: Partial<Omit<UseRealtimeOptions<T>, 'table' | 'filter' | 'queryKey'>>
): void {
    useRealtimeSubscription({
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
        queryKey: ['notifications', userId],
        enabled: !!userId,
        ...options,
    });
}

/**
 * Hook for subscribing to cart items
 */
export function useCartRealtime<T = any>(
    userId: string,
    options?: Partial<Omit<UseRealtimeOptions<T>, 'table' | 'filter' | 'queryKey'>>
): void {
    useRealtimeSubscription({
        table: 'cart_items',
        filter: `user_id=eq.${userId}`,
        queryKey: ['cart', userId],
        enabled: !!userId,
        ...options,
    });
}

/**
 * Hook for subscribing to vendor application updates
 */
export function useVendorApplicationRealtime<T = any>(
    applicationId: string,
    options?: Partial<Omit<UseRealtimeOptions<T>, 'table' | 'filter' | 'queryKey'>>
): void {
    useRealtimeSubscription({
        table: 'vendor_applications',
        filter: `id=eq.${applicationId}`,
        queryKey: ['vendor-applications', applicationId],
        enabled: !!applicationId,
        ...options,
    });
}

/**
 * Hook for subscribing to all vendor applications (admin)
 */
export function useVendorApplicationsRealtime<T = any>(
    options?: Partial<Omit<UseRealtimeOptions<T>, 'table' | 'queryKey'>>
): void {
    useRealtimeSubscription({
        table: 'vendor_applications',
        queryKey: ['vendor-applications'],
        enabled: true,
        ...options,
    });
}

/**
 * Hook for subscribing to email thread updates
 */
export function useEmailThreadsRealtime<T = any>(
    options?: Partial<Omit<UseRealtimeOptions<T>, 'table' | 'queryKey'>>
): void {
    useRealtimeSubscription({
        table: 'email_threads',
        queryKey: ['email-threads'],
        enabled: true,
        ...options,
    });
}

/**
 * Hook for subscribing to a specific order's updates
 */
export function useOrderTrackingRealtime<T = any>(
    orderId: string,
    options?: Partial<Omit<UseRealtimeOptions<T>, 'table' | 'filter' | 'queryKey'>>
): void {
    useRealtimeSubscription({
        table: 'orders',
        filter: `id=eq.${orderId}`,
        queryKey: ['order', orderId],
        enabled: !!orderId,
        ...options,
    });
}
