/**
 * Realtime Module
 * Centralized Supabase Realtime functionality for all Zora apps
 */

// Core manager
export { RealtimeManager, RealtimeManagerClass } from './realtime-manager';

// Types
export type {
    RealtimeTable,
    RealtimeEvent,
    ConnectionStatus,
    ConnectionState,
    SubscriptionConfig,
    PresenceUserInfo,
    PresenceState,
    BroadcastPayload,
    SubscriptionHandle,
    ChannelStatus,
    UseRealtimeOptions,
    UsePresenceOptions,
} from './types';

// Hooks
export * from './hooks';
