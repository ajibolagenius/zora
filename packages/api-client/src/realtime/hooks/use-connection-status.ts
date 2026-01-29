/**
 * useConnectionStatus Hook
 * React hook for monitoring realtime connection status
 */

import { useEffect, useState, useCallback } from 'react';
import { RealtimeManager } from '../realtime-manager';
import type { ConnectionState, ConnectionStatus } from '../types';

interface UseConnectionStatusReturn {
    /** Current connection status */
    status: ConnectionStatus;
    /** Whether connected to realtime */
    isConnected: boolean;
    /** Whether currently connecting */
    isConnecting: boolean;
    /** Whether disconnected */
    isDisconnected: boolean;
    /** Whether attempting to reconnect */
    isReconnecting: boolean;
    /** Last successful connection time */
    lastConnected: Date | null;
    /** Current error, if any */
    error: Error | null;
    /** Number of reconnect attempts */
    reconnectAttempts: number;
    /** Full connection state */
    connectionState: ConnectionState;
}

/**
 * Hook for monitoring realtime connection status
 */
export function useConnectionStatus(): UseConnectionStatusReturn {
    const [connectionState, setConnectionState] = useState<ConnectionState>(
        RealtimeManager.getConnectionState()
    );

    useEffect(() => {
        // Subscribe to connection state changes
        const unsubscribe = RealtimeManager.onConnectionStateChange((state) => {
            setConnectionState(state);
        });

        return unsubscribe;
    }, []);

    const { status, lastConnected, error, reconnectAttempts } = connectionState;

    return {
        status,
        isConnected: status === 'connected',
        isConnecting: status === 'connecting',
        isDisconnected: status === 'disconnected',
        isReconnecting: status === 'reconnecting',
        lastConnected,
        error,
        reconnectAttempts,
        connectionState,
    };
}

/**
 * Hook that returns a simple boolean for connection status
 */
export function useIsOnline(): boolean {
    const { isConnected } = useConnectionStatus();
    return isConnected;
}

/**
 * Hook for getting active subscriptions count
 */
export function useActiveSubscriptionsCount(): number {
    const [count, setCount] = useState(RealtimeManager.getActiveSubscriptionsCount());

    useEffect(() => {
        // Update count when connection state changes
        const unsubscribe = RealtimeManager.onConnectionStateChange(() => {
            setCount(RealtimeManager.getActiveSubscriptionsCount());
        });

        return unsubscribe;
    }, []);

    return count;
}
