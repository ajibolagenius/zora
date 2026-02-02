/**
 * Realtime Types
 * Type definitions for Supabase Realtime integration
 */

import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

/**
 * Tables that support realtime subscriptions
 */
export type RealtimeTable =
    | 'orders'
    | 'order_items'
    | 'products'
    | 'vendors'
    | 'cart_items'
    | 'notifications'
    | 'reviews'
    | 'profiles'
    | 'vendor_applications'
    | 'email_threads'
    | 'email_messages'
    | 'conversations'
    | 'messages'
    | 'wishlists'
    | 'vendor_follows';

/**
 * Realtime event types
 */
export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

/**
 * Connection status
 */
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

/**
 * Connection state
 */
export interface ConnectionState {
    status: ConnectionStatus;
    lastConnected: Date | null;
    error: Error | null;
    reconnectAttempts: number;
}

/**
 * Subscription configuration
 */
export interface SubscriptionConfig<T extends Record<string, any> = any> {
    /** Table to subscribe to */
    table: RealtimeTable;
    /** Event type to listen for */
    event?: RealtimeEvent;
    /** Filter condition (e.g., "user_id=eq.123") */
    filter?: string;
    /** Database schema (defaults to 'public') */
    schema?: string;
    /** Callback for INSERT events */
    onInsert?: (payload: T) => void;
    /** Callback for UPDATE events */
    onUpdate?: (payload: { old: T; new: T }) => void;
    /** Callback for DELETE events */
    onDelete?: (payload: T) => void;
    /** Callback for any change event */
    onChange?: (payload: RealtimePostgresChangesPayload<T>) => void;
    /** Callback for errors */
    onError?: (error: Error) => void;
}

/**
 * Presence user info
 */
export interface PresenceUserInfo {
    userId: string;
    role: 'customer' | 'vendor' | 'admin';
    name?: string;
    avatarUrl?: string;
    [key: string]: unknown;
}

/**
 * Presence state for a channel
 */
export interface PresenceState {
    [key: string]: PresenceUserInfo[];
}

/**
 * Broadcast event payload
 */
export interface BroadcastPayload {
    event: string;
    payload: unknown;
    timestamp: string;
}

/**
 * Subscription handle returned by subscribe methods
 */
export interface SubscriptionHandle {
    /** Unique identifier for this subscription */
    id: string;
    /** Table being subscribed to */
    table: RealtimeTable;
    /** Unsubscribe function */
    unsubscribe: () => void;
}

/**
 * Channel status from Supabase
 */
export type ChannelStatus =
    | 'SUBSCRIBED'
    | 'TIMED_OUT'
    | 'CLOSED'
    | 'CHANNEL_ERROR';

/**
 * Options for realtime hooks
 */
export interface UseRealtimeOptions<T extends Record<string, any> = any> {
    /** Table to subscribe to */
    table: RealtimeTable;
    /** Filter condition */
    filter?: string;
    /** Query key for cache invalidation */
    queryKey: readonly unknown[];
    /** Whether subscription is enabled */
    enabled?: boolean;
    /** Callback for INSERT events */
    onInsert?: (data: T) => void;
    /** Callback for UPDATE events */
    onUpdate?: (data: { old: T; new: T }) => void;
    /** Callback for DELETE events */
    onDelete?: (data: T) => void;
}

/**
 * Options for presence hook
 */
export interface UsePresenceOptions {
    /** Channel name for presence */
    channelName: string;
    /** User information to track */
    userInfo: PresenceUserInfo;
    /** Whether presence tracking is enabled */
    enabled?: boolean;
    /** Callback when presence state syncs */
    onSync?: (state: PresenceState) => void;
    /** Callback when user joins */
    onJoin?: (key: string, presences: PresenceUserInfo[]) => void;
    /** Callback when user leaves */
    onLeave?: (key: string, presences: PresenceUserInfo[]) => void;
}
