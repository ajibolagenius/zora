/**
 * Connection Store
 * Zustand store for tracking realtime connection state
 */

import { create } from 'zustand';
import { RealtimeManager } from '../realtime/realtime-manager';
import type { ConnectionState, ConnectionStatus } from '../realtime/types';

interface ConnectionStore {
    // State
    status: ConnectionStatus;
    lastConnected: Date | null;
    error: Error | null;
    reconnectAttempts: number;
    activeSubscriptions: number;

    // Computed
    isConnected: boolean;
    isConnecting: boolean;
    isDisconnected: boolean;
    isReconnecting: boolean;

    // Actions
    setStatus: (status: ConnectionStatus) => void;
    setError: (error: Error | null) => void;
    updateFromState: (state: ConnectionState) => void;
    initialize: () => () => void;
    disconnect: () => void;
}

export const useConnectionStore = create<ConnectionStore>((set, get) => ({
    // Initial state
    status: 'disconnected',
    lastConnected: null,
    error: null,
    reconnectAttempts: 0,
    activeSubscriptions: 0,

    // Computed getters
    get isConnected() {
        return get().status === 'connected';
    },
    get isConnecting() {
        return get().status === 'connecting';
    },
    get isDisconnected() {
        return get().status === 'disconnected';
    },
    get isReconnecting() {
        return get().status === 'reconnecting';
    },

    // Actions
    setStatus: (status) => set({ status }),

    setError: (error) => set({ error }),

    updateFromState: (state) =>
        set({
            status: state.status,
            lastConnected: state.lastConnected,
            error: state.error,
            reconnectAttempts: state.reconnectAttempts,
            activeSubscriptions: RealtimeManager.getActiveSubscriptionsCount(),
        }),

    initialize: () => {
        // Get initial state
        const initialState = RealtimeManager.getConnectionState();
        get().updateFromState(initialState);

        // Subscribe to state changes
        const unsubscribe = RealtimeManager.onConnectionStateChange((state) => {
            get().updateFromState(state);
        });

        return unsubscribe;
    },

    disconnect: () => {
        RealtimeManager.disconnectAll();
        set({
            status: 'disconnected',
            error: null,
            activeSubscriptions: 0,
        });
    },
}));

/**
 * Hook to get simple connection status
 */
export function useIsConnected(): boolean {
    return useConnectionStore((state) => state.status === 'connected');
}

/**
 * Hook to get connection status string
 */
export function useConnectionStatus(): ConnectionStatus {
    return useConnectionStore((state) => state.status);
}

/**
 * Hook to get last connected time
 */
export function useLastConnected(): Date | null {
    return useConnectionStore((state) => state.lastConnected);
}

/**
 * Hook to get connection error
 */
export function useConnectionError(): Error | null {
    return useConnectionStore((state) => state.error);
}

/**
 * Hook to get active subscriptions count
 */
export function useActiveSubscriptions(): number {
    return useConnectionStore((state) => state.activeSubscriptions);
}
