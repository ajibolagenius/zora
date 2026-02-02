
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import {
    RealtimeManager,
    useConnectionStore,
    type SubscriptionHandle,
    type ConnectionStatus,
} from '@zora/api-client';
import { useAuthStore } from '../stores/authStore';
import { useOrderStore } from '../stores/orderStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useToast } from '../components/ui/ToastProvider';

// =============================================================================
// Types
// =============================================================================

interface MobileRealtimeContextValue {
    /** Current connection status */
    connectionStatus: ConnectionStatus;
    /** Whether connected to realtime */
    isConnected: boolean;
    /** Number of active subscriptions */
    activeSubscriptions: number;
}

// =============================================================================
// Context
// =============================================================================

const MobileRealtimeContext = createContext<MobileRealtimeContextValue | null>(null);

// =============================================================================
// Provider Component
// =============================================================================

interface MobileRealtimeProviderProps {
    children: React.ReactNode;
}

export function MobileRealtimeProvider({ children }: MobileRealtimeProviderProps) {
    // Auth state
    const { user } = useAuthStore();
    const { showToast } = useToast();
    const { updateOrderStatus } = useOrderStore();
    const { addNotification } = useNotificationStore();

    // Connection state from store
    const connectionStatus = useConnectionStore((s) => s.status);
    const initConnection = useConnectionStore((s) => s.initialize);
    const activeSubscriptions = useConnectionStore((s) => s.activeSubscriptions);

    // Refs for subscription handles
    const subscriptionsRef = useRef<SubscriptionHandle[]>([]);

    // Initialize connection store
    useEffect(() => {
        const unsubscribe = initConnection();
        return () => unsubscribe();
    }, [initConnection]);

    // Handle new notification
    const handleNewNotification = useCallback((notification: any) => {
        console.log('[MobileRealtime] New notification:', notification);

        // Add to store
        addNotification(notification);

        // Show toast
        showToast(
            notification.title || 'New Notification',
            'info',
            3000
        );
    }, [addNotification, showToast]);

    // Handle order update
    const handleOrderUpdate = useCallback((payload: any) => {
        const order = payload.new;
        console.log('[MobileRealtime] Order updated:', order.id, order.status);

        // Update store
        updateOrderStatus(order.id, order.status);

        // Show toast for status changes
        if (payload.old && payload.old.status !== order.status) {
            let message = `Order #${order.qr_code || order.id.slice(0, 8)} updated to ${order.status}`;
            let type: 'success' | 'info' | 'error' = 'info';

            switch (order.status) {
                case 'confirmed':
                    message = 'Order confirmed!';
                    type = 'success';
                    break;
                case 'preparing':
                    message = 'Your order is being prepared';
                    type = 'info';
                    break;
                case 'ready':
                    message = 'Your order is ready!';
                    type = 'success';
                    break;
                case 'out_for_delivery':
                    message = 'Order is on the way!';
                    type = 'success';
                    break;
                case 'delivered':
                    message = 'Order delivered!';
                    type = 'success';
                    break;
                case 'cancelled':
                    message = 'Order was cancelled';
                    type = 'error';
                    break;
            }

            showToast(
                message,
                type,
                4000
            );
        }
    }, [updateOrderStatus, showToast]);

    // Subscribe to realtime updates
    useEffect(() => {
        if (!user?.user_id) { // key is user_id in AuthStore
            // Unsubscribe all if logged out
            subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
            subscriptionsRef.current = [];
            return;
        }

        console.log('[MobileRealtime] Setting up subscriptions for user:', user.user_id);

        // Subscribe to user notifications
        const notificationsSub = RealtimeManager.subscribe({
            table: 'notifications',
            filter: `user_id=eq.${user.user_id}`,
            onInsert: handleNewNotification,
        });

        // Subscribe to user orders updates
        const ordersSub = RealtimeManager.subscribe({
            table: 'orders',
            filter: `user_id=eq.${user.user_id}`,
            onUpdate: handleOrderUpdate,
        });

        subscriptionsRef.current = [notificationsSub, ordersSub];

        // Cleanup
        return () => {
            console.log('[MobileRealtime] Cleaning up subscriptions');
            subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
            subscriptionsRef.current = [];
        };
    }, [user?.user_id, handleNewNotification, handleOrderUpdate]);

    // Context value
    const value: MobileRealtimeContextValue = {
        connectionStatus,
        isConnected: connectionStatus === 'connected',
        activeSubscriptions,
    };

    return (
        <MobileRealtimeContext.Provider value={value}>
            {children}
        </MobileRealtimeContext.Provider>
    );
}

// =============================================================================
// Hook
// =============================================================================

export function useMobileRealtime(): MobileRealtimeContextValue {
    const context = useContext(MobileRealtimeContext);
    if (!context) {
        throw new Error('useMobileRealtime must be used within MobileRealtimeProvider');
    }
    return context;
}
