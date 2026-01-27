
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

type RealtimeCallback = (payload: any) => void;

class RealtimeService {
    private channels: Map<string, RealtimeChannel> = new Map();

    /**
     * Subscribe to specific table changes
     */
    async subscribeToTable(
        table: string,
        event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
        callback: RealtimeCallback,
        filter?: string
    ) {
        if (!isSupabaseConfigured()) {
            console.log(`[Mock Realtime] Subscribing to ${table} (${event})`);
            return;
        }

        const channelId = `${table}:${event}:${filter || 'all'}`;

        if (this.channels.has(channelId)) {
            // Already subscribed
            return;
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
        } catch (error) {
            console.error('Failed to subscribe to realtime channel:', error);
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
