// Zora API Client - Central export file
// Provides unified access to Supabase services, realtime functionality, and state management

// =============================================================================
// Supabase Client
// =============================================================================

export {
    createSupabaseClient,
    getSupabaseClient,
    resetSupabaseClient,
    type SupabaseClient,
} from './supabase';

// =============================================================================
// Services
// =============================================================================

export {
    // Core services
    productsService,
    vendorsService,
    ordersService,
    authService,
    // New services
    cartService,
    vendorApplicationsService,
    emailThreadsService,
    adminActivityService,
    // Types
    type CartItemWithDetails,
    type CartSummary,
    type VendorApplicationQueryParams,
    type EmailThreadQueryParams,
    type AdminActivityQueryParams,
} from './services';

// =============================================================================
// Realtime
// =============================================================================

export {
    // Core manager
    RealtimeManager,
    RealtimeManagerClass,
    // Types
    type RealtimeTable,
    type RealtimeEvent,
    type ConnectionStatus,
    type ConnectionState,
    type SubscriptionConfig,
    type PresenceUserInfo,
    type PresenceState,
    type BroadcastPayload,
    type SubscriptionHandle,
    type ChannelStatus,
    type UseRealtimeOptions,
    type UsePresenceOptions,
    // Subscription hooks
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
    // Presence hooks
    usePresence,
    useAdminPresence,
    useVendorPresence,
    useChatPresence,
    // Connection hooks
    useConnectionStatus,
    useIsOnline,
    useActiveSubscriptionsCount,
    // Broadcast hooks
    useBroadcast,
    useBroadcastListener,
    usePlatformAnnouncements,
    useAdminBroadcast,
} from './realtime';

// =============================================================================
// Stores
// =============================================================================

export {
    useConnectionStore,
    useIsConnected,
    useLastConnected,
    useConnectionError,
    useActiveSubscriptions,
} from './stores';
