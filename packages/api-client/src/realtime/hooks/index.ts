/**
 * Realtime Hooks
 * Export all realtime-related React hooks
 */

// Subscription hooks
export {
    useRealtimeSubscription,
    useOrdersRealtime,
    useVendorOrdersRealtime,
    useProductsRealtime,
    useNotificationsRealtime,
    useCartRealtime,
    useVendorApplicationRealtime,
    useVendorApplicationsRealtime,
    useEmailThreadsRealtime,
    useOrderTrackingRealtime,
} from './use-realtime-subscription';

// Presence hooks
export {
    usePresence,
    useAdminPresence,
    useVendorPresence,
    useChatPresence,
} from './use-presence';

// Connection status hooks
export {
    useConnectionStatus,
    useIsOnline,
    useActiveSubscriptionsCount,
} from './use-connection-status';

// Broadcast hooks
export {
    useBroadcast,
    useBroadcastListener,
    usePlatformAnnouncements,
    useAdminBroadcast,
} from './use-broadcast';
