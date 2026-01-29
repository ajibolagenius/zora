/**
 * usePresence Hook
 * React hook for tracking user presence in realtime
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { RealtimeManager } from '../realtime-manager';
import type { UsePresenceOptions, PresenceState, PresenceUserInfo, SubscriptionHandle } from '../types';

interface UsePresenceReturn {
    /** Current presence state */
    presenceState: PresenceState;
    /** List of online users */
    onlineUsers: PresenceUserInfo[];
    /** Number of online users */
    onlineCount: number;
    /** Whether the current user is being tracked */
    isTracking: boolean;
}

/**
 * Hook for tracking presence in a channel
 */
export function usePresence(options: UsePresenceOptions): UsePresenceReturn {
    const { channelName, userInfo, enabled = true, onSync, onJoin, onLeave } = options;

    const subscriptionRef = useRef<SubscriptionHandle | null>(null);
    const [presenceState, setPresenceState] = useState<PresenceState>({});
    const [isTracking, setIsTracking] = useState(false);

    // Extract online users from presence state
    const onlineUsers = Object.values(presenceState).flat();
    const onlineCount = onlineUsers.length;

    const handleSync = useCallback(
        (state: PresenceState) => {
            setPresenceState(state);
            onSync?.(state);
        },
        [onSync]
    );

    const handleJoin = useCallback(
        (key: string, presences: PresenceUserInfo[]) => {
            onJoin?.(key, presences);
        },
        [onJoin]
    );

    const handleLeave = useCallback(
        (key: string, presences: PresenceUserInfo[]) => {
            onLeave?.(key, presences);
        },
        [onLeave]
    );

    useEffect(() => {
        if (!enabled || !userInfo.userId) {
            subscriptionRef.current?.unsubscribe();
            subscriptionRef.current = null;
            setIsTracking(false);
            return;
        }

        // Track presence
        subscriptionRef.current = RealtimeManager.trackPresence(channelName, userInfo, {
            onSync: handleSync,
            onJoin: handleJoin,
            onLeave: handleLeave,
        });

        setIsTracking(true);

        // Cleanup on unmount
        return () => {
            subscriptionRef.current?.unsubscribe();
            subscriptionRef.current = null;
            setIsTracking(false);
        };
    }, [channelName, userInfo.userId, enabled, handleSync, handleJoin, handleLeave]);

    return {
        presenceState,
        onlineUsers,
        onlineCount,
        isTracking,
    };
}

/**
 * Hook for tracking presence in admin dashboard
 */
export function useAdminPresence(
    userInfo: PresenceUserInfo,
    enabled: boolean = true
): UsePresenceReturn {
    return usePresence({
        channelName: 'admin-dashboard',
        userInfo: { ...userInfo, role: 'admin' },
        enabled,
    });
}

/**
 * Hook for tracking presence in vendor portal
 */
export function useVendorPresence(
    userInfo: PresenceUserInfo,
    vendorId: string,
    enabled: boolean = true
): UsePresenceReturn {
    return usePresence({
        channelName: `vendor-${vendorId}`,
        userInfo: { ...userInfo, role: 'vendor' },
        enabled: enabled && !!vendorId,
    });
}

/**
 * Hook for tracking presence in a conversation/chat
 */
export function useChatPresence(
    userInfo: PresenceUserInfo,
    conversationId: string,
    enabled: boolean = true
): UsePresenceReturn {
    return usePresence({
        channelName: `chat-${conversationId}`,
        userInfo,
        enabled: enabled && !!conversationId,
    });
}
