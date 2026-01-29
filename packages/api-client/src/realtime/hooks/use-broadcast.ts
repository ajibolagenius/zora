/**
 * useBroadcast Hook
 * React hook for sending and receiving broadcast messages
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { RealtimeManager } from '../realtime-manager';
import type { SubscriptionHandle } from '../types';

interface UseBroadcastReturn<T = unknown> {
    /** Send a broadcast message */
    broadcast: (payload: T) => Promise<void>;
    /** Whether currently sending */
    isSending: boolean;
    /** Last error, if any */
    error: Error | null;
}

/**
 * Hook for sending broadcast messages
 */
export function useBroadcast<T = unknown>(
    channelName: string,
    eventName: string
): UseBroadcastReturn<T> {
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const broadcast = useCallback(
        async (payload: T) => {
            setIsSending(true);
            setError(null);
            try {
                await RealtimeManager.broadcast(channelName, eventName, payload);
            } catch (err) {
                setError(err as Error);
                throw err;
            } finally {
                setIsSending(false);
            }
        },
        [channelName, eventName]
    );

    return { broadcast, isSending, error };
}

interface UseBroadcastListenerOptions<T = unknown> {
    /** Channel name to listen on */
    channelName: string;
    /** Event name to listen for */
    eventName: string;
    /** Whether listening is enabled */
    enabled?: boolean;
    /** Callback when message is received */
    onMessage: (payload: T) => void;
}

/**
 * Hook for listening to broadcast messages
 */
export function useBroadcastListener<T = unknown>(
    options: UseBroadcastListenerOptions<T>
): void {
    const { channelName, eventName, enabled = true, onMessage } = options;
    const subscriptionRef = useRef<SubscriptionHandle | null>(null);

    const handleMessage = useCallback(
        (payload: unknown) => {
            onMessage(payload as T);
        },
        [onMessage]
    );

    useEffect(() => {
        if (!enabled) {
            subscriptionRef.current?.unsubscribe();
            subscriptionRef.current = null;
            return;
        }

        subscriptionRef.current = RealtimeManager.listenToBroadcast(
            channelName,
            eventName,
            handleMessage
        );

        return () => {
            subscriptionRef.current?.unsubscribe();
            subscriptionRef.current = null;
        };
    }, [channelName, eventName, enabled, handleMessage]);
}

/**
 * Hook for platform-wide announcements (admin -> all users)
 */
export function usePlatformAnnouncements(
    onAnnouncement: (message: { title: string; message: string; timestamp: string }) => void,
    enabled: boolean = true
): void {
    useBroadcastListener({
        channelName: 'platform-announcements',
        eventName: 'announcement',
        enabled,
        onMessage: onAnnouncement,
    });
}

/**
 * Hook for admin to send platform announcements
 */
export function useAdminBroadcast(): UseBroadcastReturn<{
    title: string;
    message: string;
}> {
    return useBroadcast('platform-announcements', 'announcement');
}
