
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

type RealtimeCallback = (payload: any) => void;

class RealtimeService {
    private channels: Map<string, RealtimeChannel> = new Map();

    /**
     * Subscribe to specific table changes
     * Returns an unsubscribe function
     */
    async subscribeToTable(
        table: string,
        event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
        callback: RealtimeCallback,
        filter?: string
    ): Promise<(() => void) | undefined> {
        if (!isSupabaseConfigured()) {
            console.log(`[Mock Realtime] Subscribing to ${table} (${event})`);
            return () => { }; // Return no-op unsubscribe
        }

        const channelId = `${table}:${event}:${filter || 'all'}`;

        if (this.channels.has(channelId)) {
            // Already subscribed, return no-op unsubscribe
            return () => { };
        }

        try {
            const client = await getSupabaseClient();
            const channel = client.channel(channelId);

            // Cast to any to bypass TypeScript error with generic event type
            (channel as any).on(
                'postgres_changes',
                {
                    event,
                    schema: 'public',
                    table,
                    filter,
                },
                (payload: any) => {
                    console.log(`[Realtime] Received update for ${table}:`, payload);
                    callback(payload);
                }
            )
                .subscribe((status: any) => {
                    if (status === 'SUBSCRIBED') {
                        console.log(`[Realtime] Subscribed to ${channelId}`);
                    }
                });

            this.channels.set(channelId, channel);

            // Return unsubscribe function
            return async () => {
                try {
                    await client.removeChannel(channel);
                    this.channels.delete(channelId);
                    console.log(`[Realtime] Unsubscribed from ${channelId}`);
                } catch (error) {
                    console.error(`Failed to unsubscribe from ${channelId}:`, error);
                }
            };
        } catch (error) {
            console.error('Failed to subscribe to realtime channel:', error);
            return () => { }; // Return no-op unsubscribe on error
        }
    }

    /**
     * Subscribe to user-specific notifications
     */
    async subscribeToNotifications(userId: string, callback: RealtimeCallback) {
        return this.subscribeToTable(
            'notifications',
            'INSERT',
            callback,
            `user_id=eq.${userId}`
        );
    }

    /**
     * Subscribe to user-specific order updates
     */
    async subscribeToOrderUpdates(userId: string, callback: RealtimeCallback) {
        return this.subscribeToTable(
            'orders',
            'UPDATE',
            callback,
            `user_id=eq.${userId}`
        );
    }

    /**
     * Unsubscribe from all channels
     */
    async unsubscribeAll() {
        try {
            const client = await getSupabaseClient();
            for (const [id, channel] of this.channels) {
                await client.removeChannel(channel);
            }
            this.channels.clear();
        } catch (error) {
            console.error('Failed to unsubscribe from realtime channels:', error);
        }
    }
}

export const realtimeService = new RealtimeService();
