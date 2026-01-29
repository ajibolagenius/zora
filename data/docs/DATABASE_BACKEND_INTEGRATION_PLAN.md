# Zora Database & Backend Integration Plan

**Document Version:** 3.0
**Date:** January 29, 2026
**Last Updated:** January 29, 2026
**Status:** Implementation Complete

---

## 1. Executive Summary

This document outlines the comprehensive plan to integrate database and backend systems across all three Zora applications (Mobile, Vendor Portal, Admin Dashboard) to enable **bidirectional real-time data updates**. The integration leverages Supabase Realtime, TanStack Query, and Zustand for seamless data synchronization.

### 1.1 Goals

- **Real-time Sync**: Instant data updates across all apps when changes occur
- **Bidirectional Flow**: Data changes from any app reflect immediately in all connected clients
- **Optimistic Updates**: Immediate UI feedback with background sync
- **Offline Resilience**: Graceful handling of network disruptions
- **Type Safety**: End-to-end TypeScript types from database to UI

### 1.2 Applications Scope

| App | Platform | Primary Data Operations |
|-----|----------|------------------------|
| **Mobile** | React Native (Expo) | Orders, Cart, Products, Profile, Notifications |
| **Vendor Portal** | Next.js 15 | Products, Orders, Analytics, Shop Profile |
| **Admin Dashboard** | Next.js 15 | All entities, User Management, System Config |

### 1.3 Domain Configuration

| App | Production URL | Development URL |
|-----|---------------|-----------------|
| **Web (Landing)** | https://zoraapp.co.uk | http://localhost:3000 |
| **Vendor Portal** | https://vendor.zoraapp.co.uk | http://localhost:3001 |
| **Admin Dashboard** | https://admin.zoraapp.co.uk | http://localhost:3002 |

---

## 2. Current State Analysis

### 2.1 Existing Infrastructure

#### Database (Supabase PostgreSQL)
- ✅ Complete schema with 20+ tables (18 migrations)
- ✅ Row Level Security (RLS) policies on all tables
- ✅ Triggers for notifications on order status changes
- ✅ Functions for nearby vendors, rating updates
- ✅ Vendor applications workflow (migration 016)
- ✅ Admin activity logging (migration 017)
- ✅ Email threading system (migration 018)
- ⚠️ Realtime publication needs explicit setup for all tables

#### API Client (`@zora/api-client`)
- ✅ Supabase client configuration with platform detection
- ✅ Basic CRUD services (products, orders, auth, vendors)
- ✅ Pagination support
- ✅ **RealtimeManager** - Centralized real-time subscriptions
- ✅ **New Services** - cart, vendor-applications, email-threads, admin-activity
- ✅ **Connection Store** - Zustand-based connection state management
- ✅ **Realtime Hooks** - useRealtimeSubscription, usePresence, useBroadcast, etc.

#### Mobile App (`apps/mobile`)
- ✅ **RealtimeService** - Basic implementation exists at `services/realtimeService.ts`
- ✅ **Zustand Stores** - authStore, cartStore, orderStore, notificationStore, wishlistStore
- ✅ **Order Store** - Already integrates with realtimeService for order updates
- ✅ **QueryProvider** - TanStack Query configured
- ⚠️ Partial realtime integration (notifications, orders only)

#### Shared Packages
- ✅ `@zora/types` - Comprehensive type definitions including:
  - VendorApplication, VendorApplicationStatus
  - AdminActivityLog, AdminActionCategory
  - EmailThread, EmailMessage, EmailTemplate
- ✅ `@zora/config` - Domain configuration (`domains.ts`)
- ✅ `@zora/shared` - URL utilities (`urls.ts`)
- ✅ `@zora/design-tokens` - Colors, typography, spacing
- ✅ `@zora/ui-web` - Shared web components

### 2.2 Database Migrations (Current State)

| Migration | Description | Status |
|-----------|-------------|--------|
| 000-015 | Core schema, tables, RLS | ✅ Complete |
| 016 | Vendor applications system | ✅ Complete |
| 017 | Admin activity log | ✅ Complete |
| 018 | Email threading system | ✅ Complete |
| 019 | Enable Realtime publications | ✅ Complete |
| 020 | Vendor order notifications | ✅ Complete |

### 2.3 Gap Analysis

| Component | Current | Required | Priority | Status |
|-----------|---------|----------|----------|--------|
| Realtime Publications | Full | Full | P0 | ✅ Complete |
| Mobile Realtime | Basic | Enhanced | P0 | ✅ Enhanced via @zora/api-client |
| Optimistic Updates | None | Core entities | P0 | ✅ In services |
| Connection Handling | Basic | Robust | P1 | ✅ Complete |
| Vendor/Admin Realtime | None | Full | P0 | ✅ Complete |
| Offline Queue | None | Basic | P1 | 🟡 Future enhancement |
| Cache Invalidation | Manual | Automatic | P0 | ✅ Complete |

---

## 3. Architecture Design

### 3.1 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SUPABASE BACKEND                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  PostgreSQL │  │  Realtime   │  │    Auth     │  │   Storage   │     │
│  │   Database  │◄─┤   Server    │  │   Server    │  │   Bucket    │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────────────┘     │
│         │                │                │                              │
│         └────────────────┼────────────────┘                              │
│                          │                                               │
└──────────────────────────┼───────────────────────────────────────────────┘
                           │
                           │ WebSocket + REST
                           │
┌──────────────────────────┼───────────────────────────────────────────────┐
│                    @zora/api-client                                       │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │                    Realtime Manager                              │     │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐│     │
│  │  │ Connection │  │ Channel    │  │ Presence   │  │ Broadcast  ││     │
│  │  │ Handler    │  │ Manager    │  │ Manager    │  │ Manager    ││     │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘│     │
│  └─────────────────────────────────────────────────────────────────┘     │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │                    Service Layer                                 │     │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐│     │
│  │  │ Products   │  │ Orders     │  │ Vendors    │  │ Users      ││     │
│  │  │ Service    │  │ Service    │  │ Service    │  │ Service    ││     │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘│     │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐                │     │
│  │  │ Cart       │  │ Email      │  │ Vendor App │                │     │
│  │  │ Service    │  │ Service    │  │ Service    │                │     │
│  │  └────────────┘  └────────────┘  └────────────┘                │     │
│  └─────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Mobile App    │ │  Vendor Portal  │ │ Admin Dashboard │
│  ┌───────────┐  │ │  ┌───────────┐  │ │  ┌───────────┐  │
│  │  Zustand  │  │ │  │  Zustand  │  │ │  │  Zustand  │  │
│  │  Stores   │  │ │  │  Stores   │  │ │  │  Stores   │  │
│  └─────┬─────┘  │ │  └─────┬─────┘  │ │  └─────┬─────┘  │
│        │        │ │        │        │ │        │        │
│  ┌─────▼─────┐  │ │  ┌─────▼─────┐  │ │  ┌─────▼─────┐  │
│  │ TanStack  │  │ │  │ TanStack  │  │ │  │ TanStack  │  │
│  │  Query    │  │ │  │  Query    │  │ │  │  Query    │  │
│  └───────────┘  │ │  └───────────┘  │ │  └───────────┘  │
│                 │ │                 │ │                 │
│  React Native   │ │  Next.js 15     │ │  Next.js 15     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 3.2 Real-time Event Types

| Event Type | Tables | Publishers | Subscribers |
|------------|--------|------------|-------------|
| `INSERT` | orders, products, reviews, vendor_applications | Mobile, Vendor, Web | All |
| `UPDATE` | orders, products, vendors, profiles, email_threads | All | All |
| `DELETE` | products, cart_items | Vendor, Admin | Mobile, Vendor |
| `PRESENCE` | - | All | All (for online status) |
| `BROADCAST` | - | Admin | All (for announcements) |

### 3.3 Existing Mobile Realtime Service

The mobile app already has a basic realtime service implementation:

```typescript
// apps/mobile/services/realtimeService.ts (EXISTING)

class RealtimeService {
    private channels: Map<string, RealtimeChannel> = new Map();

    async subscribeToTable(table, event, callback, filter?) { ... }
    async subscribeToNotifications(userId, callback) { ... }
    async subscribeToOrderUpdates(userId, callback) { ... }
    async unsubscribeAll() { ... }
}

export const realtimeService = new RealtimeService();
```

### 3.4 Existing Mobile Stores

```typescript
// apps/mobile/stores/index.ts (EXISTING)

export { useAuthStore } from './authStore';
export { useWishlistStore } from './wishlistStore';
export { useCartStore } from './cartStore';
export { useNotificationStore } from './notificationStore';
export { useOrderStore } from './orderStore';
```

The `orderStore` already integrates with `realtimeService` for real-time order updates.

---

## 4. Implementation Plan

### Phase 1: Database Realtime Setup ✅ Partially Complete

#### 4.1.1 Current Migrations (Completed)

The following migrations are already in place:

**Migration 016: Vendor Applications**
- `vendor_applications` table with full workflow
- `vendor_application_status_history` for audit trail
- RLS policies for admin/user access
- Auto-logging status change trigger

**Migration 017: Admin Activity Log**
- `admin_activity_log` table with comprehensive tracking
- `log_admin_activity()` helper function
- Indexed for efficient querying
- Immutable audit trail (no updates/deletes)

**Migration 018: Email Threading**
- `email_threads` table for customer communication
- `email_messages` for individual messages
- `email_templates` for quick responses
- Auto-update triggers for thread metadata
- RLS for admin/customer access

#### 4.1.2 Required Migration: Enable Realtime Publications

```sql
-- File: supabase/migrations/019_enable_realtime.sql

-- Enable realtime for core tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vendors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cart_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.vendor_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.email_threads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.email_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
```

#### 4.1.3 Required Migration: Vendor Order Notifications

```sql
-- File: supabase/migrations/020_vendor_order_notifications.sql

-- Function to notify vendor of new orders
CREATE OR REPLACE FUNCTION public.handle_new_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Get vendor user_id and create notification
    INSERT INTO public.notifications (user_id, type, title, description, action_url)
    SELECT
        v.user_id,
        'order',
        'New Order Received!',
        'You have received a new order worth £' || NEW.total,
        '/orders/' || NEW.id
    FROM public.vendors v
    WHERE v.id = NEW.vendor_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new orders
DROP TRIGGER IF EXISTS on_new_order ON public.orders;
CREATE TRIGGER on_new_order
    AFTER INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_order();
```

### Phase 2: Centralized Realtime Manager (API Client)

#### 4.2.1 Create Centralized Realtime Manager

This will be a more robust version than the mobile-only service, available to all apps:

```typescript
// packages/api-client/src/realtime/realtime-manager.ts

import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { getSupabaseClient } from '../supabase';

type TableName =
    | 'orders'
    | 'products'
    | 'vendors'
    | 'cart_items'
    | 'notifications'
    | 'reviews'
    | 'profiles'
    | 'vendor_applications'
    | 'email_threads'
    | 'email_messages';

type EventType = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface SubscriptionConfig<T = any> {
    table: TableName;
    event?: EventType;
    filter?: string;
    schema?: string;
    onInsert?: (payload: T) => void;
    onUpdate?: (payload: { old: T; new: T }) => void;
    onDelete?: (payload: T) => void;
    onChange?: (payload: RealtimePostgresChangesPayload<T>) => void;
}

interface ConnectionState {
    status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
    lastConnected?: Date;
    error?: Error;
}

class RealtimeManagerClass {
    private channels: Map<string, RealtimeChannel> = new Map();
    private connectionState: ConnectionState = { status: 'disconnected' };
    private listeners: Set<(state: ConnectionState) => void> = new Set();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;

    subscribe<T = any>(config: SubscriptionConfig<T>): () => void { /* ... */ }
    subscribeToUser<T = any>(userId: string, table: TableName, callbacks): () => void { /* ... */ }
    subscribeToVendor<T = any>(vendorId: string, table: TableName, callbacks): () => void { /* ... */ }
    trackPresence(channelName: string, userInfo: { userId: string; role: string }) { /* ... */ }
    async broadcast(channelName: string, event: string, payload: any) { /* ... */ }
    listenToBroadcast(channelName: string, event: string, callback): () => void { /* ... */ }
    getConnectionState(): ConnectionState { /* ... */ }
    onConnectionStateChange(listener: (state: ConnectionState) => void): () => void { /* ... */ }
    disconnectAll() { /* ... */ }
}

export const RealtimeManager = new RealtimeManagerClass();
```

#### 4.2.2 React Hooks for Realtime

```typescript
// packages/api-client/src/realtime/hooks/use-realtime-subscription.ts

export function useRealtimeSubscription<T = any>(options: UseRealtimeOptions<T>) { /* ... */ }
export function useOrdersRealtime(userId: string, options?) { /* ... */ }
export function useProductsRealtime(vendorId?: string, options?) { /* ... */ }
export function useNotificationsRealtime(userId: string, options?) { /* ... */ }
export function useVendorApplicationsRealtime(options?) { /* ... */ } // For admin
export function useEmailThreadsRealtime(options?) { /* ... */ } // For admin
```

### Phase 3: Service Layer Enhancement

#### 4.3.1 New Services to Create

```typescript
// packages/api-client/src/services/cart.ts (NEW)
export const cartService = {
    getCart(): Promise<CartItem[]>,
    addToCart(productId: string, quantity?: number): Promise<CartItem>,
    updateQuantity(cartItemId: string, quantity: number): Promise<CartItem>,
    removeFromCart(cartItemId: string): Promise<void>,
    clearCart(): Promise<void>,
    getCartCount(): Promise<number>,
};

// packages/api-client/src/services/vendor-applications.ts (NEW)
export const vendorApplicationsService = {
    submit(data: CreateVendorApplicationInput): Promise<VendorApplication>,
    getById(id: string): Promise<VendorApplication>,
    getAll(params?: QueryParams): Promise<PaginatedResponse<VendorApplication>>,
    updateStatus(id: string, status: VendorApplicationStatus, reason?: string): Promise<VendorApplication>,
    getStatusHistory(applicationId: string): Promise<VendorApplicationStatusHistory[]>,
};

// packages/api-client/src/services/email-threads.ts (NEW)
export const emailThreadsService = {
    getThreads(params?: QueryParams): Promise<PaginatedResponse<EmailThread>>,
    getThread(id: string): Promise<EmailThread>,
    createThread(data: CreateEmailThreadInput): Promise<EmailThread>,
    updateThread(id: string, data: UpdateEmailThreadInput): Promise<EmailThread>,
    sendMessage(data: CreateEmailMessageInput): Promise<EmailMessage>,
    getMessages(threadId: string): Promise<EmailMessage[]>,
    getTemplates(): Promise<EmailTemplate[]>,
};

// packages/api-client/src/services/admin-activity.ts (NEW)
export const adminActivityService = {
    log(data: LogAdminActivityInput): Promise<AdminActivityLog>,
    getActivity(params?: QueryParams): Promise<PaginatedResponse<AdminActivityLog>>,
    getByEntity(entityType: string, entityId: string): Promise<AdminActivityLog[]>,
};
```

#### 4.3.2 Enhanced Existing Services with Optimistic Updates

Add TanStack Query hooks to existing services:

```typescript
// packages/api-client/src/services/orders.ts (ENHANCE)

export const orderKeys = {
    all: ['orders'] as const,
    lists: () => [...orderKeys.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...orderKeys.lists(), filters] as const,
    details: () => [...orderKeys.all, 'detail'] as const,
    detail: (id: string) => [...orderKeys.details(), id] as const,
    user: (userId: string) => [...orderKeys.all, 'user', userId] as const,
    vendor: (vendorId: string) => [...orderKeys.all, 'vendor', vendorId] as const,
};

export function useOrders(userId: string) { /* TanStack Query hook */ }
export function useOrder(orderId: string) { /* TanStack Query hook */ }
export function useCreateOrder() { /* Mutation with optimistic updates */ }
export function useUpdateOrderStatus() { /* Mutation with optimistic updates */ }
```

### Phase 4: Zustand Store Integration

#### 4.4.1 Connection State Store (Shared)

```typescript
// packages/api-client/src/stores/connection-store.ts

export const useConnectionStore = create<ConnectionStore>((set) => ({
    status: 'disconnected',
    lastConnected: null,
    error: null,
    setStatus: (status) => set({ status }),
    setError: (error) => set({ error }),
    initialize: () => { /* Subscribe to RealtimeManager state */ },
}));
```

#### 4.4.2 Migrate Mobile Stores (Partial - Already Exists)

The mobile app already has stores. We need to:
1. Keep existing stores working
2. Gradually enhance with centralized realtime from `@zora/api-client`
3. Add new stores for vendor/admin apps

### Phase 5: App-Specific Integration

#### 4.5.1 Mobile App Enhancement

The mobile app already has basic realtime. Enhancements needed:
- Integrate with centralized `RealtimeManager` from `@zora/api-client`
- Add connection state UI indicator
- Enhance cart sync across devices

#### 4.5.2 Vendor Portal Integration (NEW)

```typescript
// apps/vendor/providers/VendorRealtimeProvider.tsx

export function VendorRealtimeProvider({ children }) {
    // Subscribe to:
    // - New orders for vendor
    // - Product updates (admin modifications)
    // - Vendor application status (if pending)
}
```

#### 4.5.3 Admin Dashboard Integration (NEW)

```typescript
// apps/admin/providers/AdminRealtimeProvider.tsx

export function AdminRealtimeProvider({ children }) {
    // Subscribe to:
    // - All new orders (platform-wide)
    // - New vendor applications
    // - Email thread updates
    // - System-wide presence tracking
}
```

---

## 5. Files Summary

### 5.1 Implemented ✅

```
supabase/migrations/
├── 016_vendor_applications.sql          ✅ Complete
├── 017_admin_activity_log.sql           ✅ Complete
├── 018_email_threading.sql              ✅ Complete
├── 019_enable_realtime.sql              ✅ Complete (NEW)
└── 020_vendor_order_notifications.sql   ✅ Complete (NEW)

packages/types/src/entities/
├── vendor-application.ts                 ✅ Complete
├── admin-activity.ts                     ✅ Complete
└── email-thread.ts                       ✅ Complete

packages/config/
└── domains.ts                            ✅ Complete

packages/shared/src/
└── urls.ts                               ✅ Complete

packages/api-client/src/
├── index.ts                              ✅ Updated with all exports
├── realtime/
│   ├── index.ts                          ✅ Complete (NEW)
│   ├── realtime-manager.ts               ✅ Complete (NEW)
│   ├── types.ts                          ✅ Complete (NEW)
│   └── hooks/
│       ├── index.ts                      ✅ Complete (NEW)
│       ├── use-realtime-subscription.ts  ✅ Complete (NEW)
│       ├── use-presence.ts               ✅ Complete (NEW)
│       ├── use-connection-status.ts      ✅ Complete (NEW)
│       └── use-broadcast.ts              ✅ Complete (NEW)
├── stores/
│   ├── index.ts                          ✅ Complete (NEW)
│   └── connection-store.ts               ✅ Complete (NEW)
├── services/
│   ├── index.ts                          ✅ Updated with new services
│   ├── cart.ts                           ✅ Complete (NEW)
│   ├── vendor-applications.ts            ✅ Complete (NEW)
│   ├── email-threads.ts                  ✅ Complete (NEW)
│   └── admin-activity.ts                 ✅ Complete (NEW)

apps/vendor/
└── providers/
    ├── index.ts                          ✅ Complete (NEW)
    └── VendorRealtimeProvider.tsx        ✅ Complete (NEW)

apps/admin/
└── providers/
    ├── index.ts                          ✅ Complete (NEW)
    └── AdminRealtimeProvider.tsx         ✅ Complete (NEW)

apps/mobile/
├── services/realtimeService.ts           ✅ Basic Implementation (existing)
├── stores/authStore.ts                   ✅ Complete
├── stores/cartStore.ts                   ✅ Complete
├── stores/orderStore.ts                  ✅ With realtime integration
├── stores/notificationStore.ts           ✅ Complete
└── stores/wishlistStore.ts               ✅ Complete
```

### 5.2 Future Enhancements 🟡

```
packages/api-client/src/
├── services/orders.ts                    🟡 Add TanStack Query mutation hooks
├── services/products.ts                  🟡 Add TanStack Query mutation hooks
└── services/vendors.ts                   🟡 Add TanStack Query mutation hooks

apps/mobile/
├── providers/index.ts                    🟡 Consider migrating to @zora/api-client realtime
└── services/realtimeService.ts           🟡 Can be deprecated in favor of centralized
```

---

## 6. Testing Strategy

### 6.1 Unit Tests

```typescript
// packages/api-client/src/__tests__/realtime-manager.test.ts
describe('RealtimeManager', () => {
    it('should subscribe to table changes', () => { /* ... */ });
    it('should handle connection state changes', () => { /* ... */ });
    it('should reconnect on disconnection', () => { /* ... */ });
});
```

### 6.2 Integration Tests

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Order Status Sync | 1. Customer places order<br>2. Vendor updates status<br>3. Customer app shows update | Real-time status change |
| Vendor Application | 1. Submit application<br>2. Admin approves<br>3. Applicant receives notification | Status update in real-time |
| Email Thread | 1. Customer sends message<br>2. Admin receives notification<br>3. Admin replies<br>4. Customer sees reply | Bidirectional real-time |

---

## 7. Execution Timeline

| Phase | Duration | Status | Dependencies |
|-------|----------|--------|--------------|
| **Phase 1**: DB Realtime Setup | 1-2 days | ✅ Complete | None |
| **Phase 2**: Centralized Realtime Manager | 3-4 days | ✅ Complete | Phase 1 |
| **Phase 3**: Service Enhancement | 3-4 days | ✅ Complete | Phase 2 |
| **Phase 4**: Zustand Integration | 2-3 days | ✅ Complete | Phase 2, 3 |
| **Phase 5**: App Integration | 4-5 days | ✅ Complete | Phase 4 |
| **Phase 6**: Testing | 2-3 days | 🟡 Ready for testing | Phase 5 |

**Implementation Status: Core infrastructure complete. Ready for integration testing.**

---

## 8. Risk Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Supabase Realtime limits | High | Medium | Monitor connections, implement connection pooling |
| Network disconnections | Medium | High | Robust reconnection logic (already partial in mobile) |
| Data conflicts | Medium | Low | Last-write-wins with conflict detection |
| Performance degradation | High | Low | Selective subscriptions, pagination |
| Type mismatches | Medium | Medium | Types already defined, maintain sync |

---

## 9. Success Criteria

### 9.1 Technical Metrics

- [ ] Real-time updates within < 500ms latency
- [ ] Connection recovery within 5 seconds of network restoration
- [ ] Zero data loss on optimistic updates
- [ ] 99.9% subscription reliability

### 9.2 User Experience Metrics

- [ ] Order status updates visible within 1 second
- [ ] Cart sync across devices without manual refresh
- [ ] Notifications delivered within 2 seconds
- [ ] Connection status indicator accuracy

---

## 10. Appendix

### A. Supabase Realtime Limits

| Plan | Connections | Messages/month | Bandwidth |
|------|-------------|----------------|-----------|
| Free | 200 | 2M | 2GB |
| Pro | 500 | 5M | 50GB |
| Team | 1000 | 10M | 200GB |

### B. Useful Commands

```bash
# Generate database types
pnpm supabase gen types typescript --project-id <id> > packages/types/src/database.types.ts

# Run specific app
pnpm dev --filter=mobile
pnpm dev --filter=vendor
pnpm dev --filter=admin

# Run tests
pnpm test --filter=@zora/api-client

# Apply migrations
pnpm supabase db push
```

### C. Existing Type Definitions

```typescript
// Vendor Application Types (packages/types/src/entities/vendor-application.ts)
export type VendorApplicationStatus = 'pending' | 'under_review' | 'documents_required' | 'approved' | 'rejected';
export type BusinessType = 'sole_trader' | 'limited_company' | 'partnership' | 'other';
export interface VendorApplication { /* ... */ }

// Admin Activity Types (packages/types/src/entities/admin-activity.ts)
export type AdminActionCategory = 'order' | 'vendor' | 'customer' | 'product' | 'review' | 'refund' | 'settings' | 'user' | 'other';
export interface AdminActivityLog { /* ... */ }
export const AdminActions = { /* Common action constants */ };

// Email Thread Types (packages/types/src/entities/email-thread.ts)
export type EmailThreadStatus = 'open' | 'pending' | 'closed' | 'spam';
export type EmailPriority = 'low' | 'normal' | 'high' | 'urgent';
export interface EmailThread { /* ... */ }
export interface EmailMessage { /* ... */ }
export interface EmailTemplate { /* ... */ }
```

### D. References

- [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Optimistic Updates Pattern](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)

---

*This document serves as the execution blueprint for integrating real-time capabilities across all Zora applications. Implementation should proceed phase-by-phase with testing at each stage.*

**Change Log:**
- v2.0 (Jan 29, 2026): Updated to reflect completed migrations (016-018), existing mobile realtime service, new shared packages, and revised timeline.
- v1.0 (Jan 29, 2026): Initial draft.
