/**
 * Realtime Manager
 * Centralized manager for Supabase Realtime subscriptions
 */

import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { getSupabaseClient } from '../supabase';
import type {
    RealtimeTable,
    RealtimeEvent,
    ConnectionState,
    ConnectionStatus,
    SubscriptionConfig,
    PresenceUserInfo,
    PresenceState,
    SubscriptionHandle,
    ChannelStatus,
} from './types';

class RealtimeManagerClass {
    private channels: Map<string, RealtimeChannel> = new Map();
    private subscriptionConfigs: Map<string, SubscriptionConfig> = new Map();
    private connectionState: ConnectionState = {
        status: 'disconnected',
        lastConnected: null,
        error: null,
        reconnectAttempts: 0,
    };
    private listeners: Set<(state: ConnectionState) => void> = new Set();
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private isReconnecting = false;

    /**
     * Subscribe to table changes
     */
    subscribe<T = any>(config: SubscriptionConfig<T>): SubscriptionHandle {
        const supabase = getSupabaseClient();
        const channelId = this.generateChannelId(config.table, config.filter);

        // Check if already subscribed
        if (this.channels.has(channelId)) {
            console.log(`[Realtime] Already subscribed to ${channelId}`);
            return {
                id: channelId,
                table: config.table,
                unsubscribe: () => this.unsubscribe(channelId),
            };
        }

        const channel = supabase.channel(channelId);

        channel
            .on(
                'postgres_changes',
                {
                    event: config.event || '*',
                    schema: config.schema || 'public',
                    table: config.table,
                    filter: config.filter,
                },
                (payload: RealtimePostgresChangesPayload<T>) => {
                    this.handlePayload(payload, config);
                }
            )
            .subscribe((status: string) => {
                this.handleChannelStatus(status as ChannelStatus, channelId, config);
            });

        this.channels.set(channelId, channel);
        this.subscriptionConfigs.set(channelId, config as SubscriptionConfig);

        console.log(`[Realtime] Subscribed to ${channelId}`);

        return {
            id: channelId,
            table: config.table,
            unsubscribe: () => this.unsubscribe(channelId),
        };
    }

    /**
     * Subscribe to user-specific changes
     */
    subscribeToUser<T = any>(
        userId: string,
        table: RealtimeTable,
        callbacks: Pick<SubscriptionConfig<T>, 'onInsert' | 'onUpdate' | 'onDelete' | 'onError'>
    ): SubscriptionHandle {
        return this.subscribe({
            table,
            filter: `user_id=eq.${userId}`,
            ...callbacks,
        });
    }

    /**
     * Subscribe to vendor-specific changes
     */
    subscribeToVendor<T = any>(
        vendorId: string,
        table: RealtimeTable,
        callbacks: Pick<SubscriptionConfig<T>, 'onInsert' | 'onUpdate' | 'onDelete' | 'onError'>
    ): SubscriptionHandle {
        return this.subscribe({
            table,
            filter: `vendor_id=eq.${vendorId}`,
            ...callbacks,
        });
    }

    /**
     * Subscribe to a specific order
     */
    subscribeToOrder<T = any>(
        orderId: string,
        callbacks: Pick<SubscriptionConfig<T>, 'onUpdate' | 'onError'>
    ): SubscriptionHandle {
        return this.subscribe({
            table: 'orders',
            event: 'UPDATE',
            filter: `id=eq.${orderId}`,
            ...callbacks,
        });
    }

    /**
     * Track presence in a channel
     */
    trackPresence(
        channelName: string,
        userInfo: PresenceUserInfo,
        callbacks?: {
            onSync?: (state: PresenceState) => void;
            onJoin?: (key: string, presences: PresenceUserInfo[]) => void;
            onLeave?: (key: string, presences: PresenceUserInfo[]) => void;
        }
    ): SubscriptionHandle {
        const supabase = getSupabaseClient();
        const channelId = `presence-${channelName}`;

        const channel = supabase.channel(channelId, {
            config: { presence: { key: userInfo.userId } },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState() as PresenceState;
                callbacks?.onSync?.(state);
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                callbacks?.onJoin?.(key, newPresences as PresenceUserInfo[]);
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                callbacks?.onLeave?.(key, leftPresences as PresenceUserInfo[]);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track(userInfo);
                    console.log(`[Realtime] Tracking presence in ${channelName}`);
                }
            });

        this.channels.set(channelId, channel);

        return {
            id: channelId,
            table: 'profiles' as RealtimeTable, // Presence isn't really a table
            unsubscribe: () => {
                channel.untrack();
                this.unsubscribe(channelId);
            },
        };
    }

    /**
     * Broadcast a message to a channel
     */
    async broadcast(channelName: string, event: string, payload: unknown): Promise<void> {
        const supabase = getSupabaseClient();
        const channelId = `broadcast-${channelName}`;

        let channel = this.channels.get(channelId);
        if (!channel) {
            channel = supabase.channel(channelId);
            await new Promise<void>((resolve) => {
                channel!.subscribe((status) => {
                    if (status === 'SUBSCRIBED') resolve();
                });
            });
            this.channels.set(channelId, channel);
        }

        await channel.send({
            type: 'broadcast',
            event,
            payload,
        });

        console.log(`[Realtime] Broadcast ${event} to ${channelName}`);
    }

    /**
     * Listen for broadcast messages
     */
    listenToBroadcast(
        channelName: string,
        event: string,
        callback: (payload: unknown) => void
    ): SubscriptionHandle {
        const supabase = getSupabaseClient();
        const channelId = `broadcast-listen-${channelName}-${event}`;

        const channel = supabase
            .channel(channelId)
            .on('broadcast', { event }, ({ payload }) => {
                callback(payload);
            })
            .subscribe();

        this.channels.set(channelId, channel);

        return {
            id: channelId,
            table: 'notifications' as RealtimeTable,
            unsubscribe: () => this.unsubscribe(channelId),
        };
    }

    /**
     * Unsubscribe from a channel
     */
    unsubscribe(channelId: string): void {
        const channel = this.channels.get(channelId);
        if (channel) {
            channel.unsubscribe();
            this.channels.delete(channelId);
            this.subscriptionConfigs.delete(channelId);
            console.log(`[Realtime] Unsubscribed from ${channelId}`);
        }
    }

    /**
     * Disconnect all channels
     */
    disconnectAll(): void {
        this.channels.forEach((channel, id) => {
            channel.unsubscribe();
            console.log(`[Realtime] Disconnected ${id}`);
        });
        this.channels.clear();
        this.subscriptionConfigs.clear();
        this.updateConnectionState('disconnected');
    }

    /**
     * Get current connection state
     */
    getConnectionState(): ConnectionState {
        return { ...this.connectionState };
    }

    /**
     * Subscribe to connection state changes
     */
    onConnectionStateChange(listener: (state: ConnectionState) => void): () => void {
        this.listeners.add(listener);
        // Immediately notify of current state
        listener(this.connectionState);
        return () => this.listeners.delete(listener);
    }

    /**
     * Get active subscriptions count
     */
    getActiveSubscriptionsCount(): number {
        return this.channels.size;
    }

    /**
     * Check if subscribed to a table
     */
    isSubscribed(table: RealtimeTable, filter?: string): boolean {
        const channelId = this.generateChannelId(table, filter);
        return this.channels.has(channelId);
    }

    // Private methods

    private generateChannelId(table: RealtimeTable, filter?: string): string {
        return filter ? `${table}:${filter}` : `${table}:all`;
    }

    private handlePayload<T>(
        payload: RealtimePostgresChangesPayload<T>,
        config: SubscriptionConfig<T>
    ): void {
        try {
            // Call general onChange handler
            config.onChange?.(payload);

            // Call specific event handlers
            switch (payload.eventType) {
                case 'INSERT':
                    config.onInsert?.(payload.new as T);
                    break;
                case 'UPDATE':
                    config.onUpdate?.({
                        old: payload.old as T,
                        new: payload.new as T,
                    });
                    break;
                case 'DELETE':
                    config.onDelete?.(payload.old as T);
                    break;
            }
        } catch (error) {
            console.error('[Realtime] Error handling payload:', error);
            config.onError?.(error as Error);
        }
    }

    private handleChannelStatus(
        status: ChannelStatus,
        channelId: string,
        config: SubscriptionConfig
    ): void {
        switch (status) {
            case 'SUBSCRIBED':
                this.updateConnectionState('connected');
                this.connectionState.reconnectAttempts = 0;
                break;
            case 'CLOSED':
            case 'CHANNEL_ERROR':
                console.error(`[Realtime] Channel ${channelId} error: ${status}. Check RLS policies and table publication.`);
                this.updateConnectionState('disconnected', new Error(`Channel ${status}`));
                config.onError?.(new Error(`Channel ${status}`));
                this.attemptReconnect(channelId);
                break;
            case 'TIMED_OUT':
                console.warn(`[Realtime] Channel ${channelId} timed out`);
                this.updateConnectionState('reconnecting');
                this.attemptReconnect(channelId);
                break;
        }
    }

    private updateConnectionState(status: ConnectionStatus, error?: Error): void {
        const prevStatus = this.connectionState.status;

        this.connectionState = {
            ...this.connectionState,
            status,
            error: error || null,
            lastConnected: status === 'connected' ? new Date() : this.connectionState.lastConnected,
        };

        if (prevStatus !== status) {
            this.notifyListeners();
        }
    }

    private notifyListeners(): void {
        this.listeners.forEach((listener) => {
            try {
                listener(this.connectionState);
            } catch (error) {
                console.error('[Realtime] Error in connection state listener:', error);
            }
        });
    }

    private async attemptReconnect(channelId: string): Promise<void> {
        if (this.isReconnecting) return;
        if (this.connectionState.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('[Realtime] Max reconnection attempts reached');
            return;
        }

        this.isReconnecting = true;
        this.connectionState.reconnectAttempts++;

        const delay = this.reconnectDelay * Math.pow(2, this.connectionState.reconnectAttempts - 1);
        console.log(`[Realtime] Attempting reconnect in ${delay}ms (attempt ${this.connectionState.reconnectAttempts})`);

        await new Promise((resolve) => setTimeout(resolve, delay));

        const config = this.subscriptionConfigs.get(channelId);
        if (config) {
            // Remove old channel
            this.channels.delete(channelId);

            // Re-subscribe
            this.subscribe(config);
        }

        this.isReconnecting = false;
    }
}

// Export singleton instance
export const RealtimeManager = new RealtimeManagerClass();

// Also export the class for testing
export { RealtimeManagerClass };
