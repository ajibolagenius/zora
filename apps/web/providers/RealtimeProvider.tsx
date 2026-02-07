"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSupabaseClient } from '@zora/api-client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeContextType {
    isConnected: boolean;
    subscribe: (table: string, callback: (payload: any) => void) => () => void;
    unsubscribe: (table: string) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

interface RealtimeProviderProps {
    children: ReactNode;
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
    const [isConnected, setIsConnected] = useState(false);
    const [channels, setChannels] = useState<Map<string, RealtimeChannel>>(new Map());
    const supabase = getSupabaseClient();

    useEffect(() => {
        // Connect to Supabase Realtime
        const channel = supabase
            .channel('web-realtime')
            .on('presence', { event: 'sync' }, () => {
                setIsConnected(true);
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    setIsConnected(true);
                    console.log('Connected to Supabase Realtime');
                }
            });

        return () => {
            supabase.removeChannel(channel);
            setIsConnected(false);
        };
    }, [supabase]);

    const subscribe = (table: string, callback: (payload: any) => void) => {
        const channelName = `web-${table}`;
        
        // Remove existing channel if it exists
        if (channels.has(channelName)) {
            supabase.removeChannel(channels.get(channelName)!);
        }

        // Create new channel for the table
        const channel = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
                    schema: 'public',
                    table: table,
                },
                (payload) => {
                    console.log(`Realtime update for ${table}:`, payload);
                    callback(payload);
                }
            )
            .subscribe();

        // Store the channel
        setChannels(prev => new Map(prev.set(channelName, channel)));

        // Return unsubscribe function
        return () => {
            supabase.removeChannel(channel);
            setChannels(prev => {
                const newMap = new Map(prev);
                newMap.delete(channelName);
                return newMap;
            });
        };
    };

    const unsubscribe = (table: string) => {
        const channelName = `web-${table}`;
        const channel = channels.get(channelName);
        
        if (channel) {
            supabase.removeChannel(channel);
            setChannels(prev => {
                const newMap = new Map(prev);
                newMap.delete(channelName);
                return newMap;
            });
        }
    };

    const value: RealtimeContextType = {
        isConnected,
        subscribe,
        unsubscribe,
    };

    return (
        <RealtimeContext.Provider value={value}>
            {children}
        </RealtimeContext.Provider>
    );
}

export function useRealtime() {
    const context = useContext(RealtimeContext);
    if (context === undefined) {
        throw new Error('useRealtime must be used within a RealtimeProvider');
    }
    return context;
}

// Hook for subscribing to product updates
export function useProductUpdates(callback: (payload: any) => void) {
    const { subscribe, unsubscribe } = useRealtime();

    useEffect(() => {
        const unsubscribeFn = subscribe('products', callback);
        return unsubscribeFn;
    }, [subscribe, callback]);
}

// Hook for subscribing to testimonial updates
export function useTestimonialUpdates(callback: (payload: any) => void) {
    const { subscribe, unsubscribe } = useRealtime();

    useEffect(() => {
        const unsubscribeFn = subscribe('testimonials', callback);
        return unsubscribeFn;
    }, [subscribe, callback]);
}

// Hook for subscribing to vendor updates
export function useVendorUpdates(callback: (payload: any) => void) {
    const { subscribe, unsubscribe } = useRealtime();

    useEffect(() => {
        const unsubscribeFn = subscribe('profiles', callback);
        return unsubscribeFn;
    }, [subscribe, callback]);
}
