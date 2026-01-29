# Zora Backend/Database Integration Execution Plan

**Document Version:** 1.0  
**Date:** January 30, 2026  
**Status:** Ready for Implementation

---

## Executive Summary

This document provides a detailed execution plan for integrating database and backend systems across all Zora applications (Mobile, Vendor Portal, Admin Dashboard) to enable **real-time data updates**. The goal is to ensure that when data changes in one application, it reflects immediately across all connected clients.

---

## 1. What Elements Need Integration in Admin and Vendor Apps?

### 1.1 Admin Dashboard (`apps/admin`) - Current State

| Component | Status | What Needs Work |
|-----------|--------|-----------------|
| `AdminRealtimeProvider` | ✅ Created | Needs to be wired into dashboard layout |
| `useAdminData.ts` hooks | ✅ Created | Need real-time query invalidation refinement |
| Dashboard page | ✅ Using hooks | Needs real-time connection status UI |
| Orders page | ⚠️ Partial | Needs real-time order status updates |
| Vendors page | ⚠️ Partial | Needs real-time application updates |
| Layout integration | ❌ Missing | Provider not in layout.tsx |

**Admin Elements Requiring Integration:**

```typescript
// Required: apps/admin/app/(dashboard)/layout.tsx
// The AdminRealtimeProvider needs to wrap the dashboard content
```

1. **Provider Integration** - Wire `AdminRealtimeProvider` into dashboard layout
2. **Connection Status UI** - Add visible indicator for real-time connection status
3. **Query Invalidation** - Ensure TanStack Query keys match what AdminRealtimeProvider invalidates
4. **Toast Notifications** - Show toasts for new orders, applications, etc.
5. **Sound Notifications** - Play audio on critical events (new orders)

### 1.2 Vendor Portal (`apps/vendor`) - Current State

| Component | Status | What Needs Work |
|-----------|--------|-----------------|
| `VendorRealtimeProvider` | ✅ Created | Needs to be wired into dashboard layout |
| `useVendorData.ts` hooks | ✅ Created | Need real-time query invalidation refinement |
| Dashboard page | ✅ Using hooks | Needs real-time connection status UI |
| Orders page | ⚠️ Partial | Needs real-time order notifications |
| Products page | ⚠️ Partial | Needs real-time inventory sync |
| Layout integration | ❌ Missing | Provider not in layout.tsx |

**Vendor Elements Requiring Integration:**

1. **Provider Integration** - Wire `VendorRealtimeProvider` into dashboard layout
2. **New Order Alerts** - Visual + audio notifications for incoming orders
3. **Order Status Sync** - Real-time updates when customers track orders
4. **Inventory Sync** - Real-time product inventory updates
5. **Connection Status** - Show online/offline indicator

### 1.3 Key Query Key Alignment Issue

**Problem:** The realtime providers invalidate different query keys than the data hooks use.

```typescript
// AdminRealtimeProvider invalidates:
queryClient.invalidateQueries({ queryKey: ['orders'] });
queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });

// But useAdminData.ts uses:
adminQueryKeys.stats() → ['admin', 'stats']
adminQueryKeys.orders() → ['admin', 'orders']
```

**Solution:** Align query keys between providers and hooks.

---

## 2. How Are Admin and Vendor Apps Connected to the Mobile App?

### 2.1 Connection Architecture

All three applications connect through **Supabase** as the central data hub:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SUPABASE BACKEND                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  PostgreSQL │  │  Realtime   │  │    Auth     │  │   Storage   │     │
│  │   Database  │◄─┤   Server    │  │   Server    │  │   Bucket    │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────────────┘     │
│         │                │                │                              │
│         └────────────────┼────────────────┘                              │
│                          │ WebSocket Connections                         │
└──────────────────────────┼───────────────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Mobile App    │ │  Vendor Portal  │ │ Admin Dashboard │
│  (Customer)     │ │  (Merchant)     │ │  (Platform)     │
│                 │ │                 │ │                 │
│ • Places orders │ │ • Receives      │ │ • Monitors all  │
│ • Tracks status │ │   orders        │ │   activity      │
│ • Browses       │ │ • Updates       │ │ • Manages       │
│   products      │ │   status        │ │   vendors       │
│ • Sends msgs    │ │ • Manages       │ │ • Handles       │
│                 │ │   products      │ │   support       │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 2.2 Data Flow Examples

**Example 1: Customer Places Order**
```
1. Mobile App → Creates order in Supabase
2. Supabase Realtime → Broadcasts INSERT to orders table
3. Vendor Portal → Receives order, shows notification, updates dashboard
4. Admin Dashboard → Receives order, updates platform stats
```

**Example 2: Vendor Updates Order Status**
```
1. Vendor Portal → Updates order status to "preparing"
2. Supabase Realtime → Broadcasts UPDATE to orders table
3. Mobile App → Receives update, shows status change to customer
4. Admin Dashboard → Receives update, reflects in order list
```

**Example 3: Admin Approves Vendor**
```
1. Admin Dashboard → Updates vendor_applications status to "approved"
2. Supabase Trigger → Creates vendor record, sends notification
3. Vendor Portal → Vendor can now login and access dashboard
4. Mobile App → New vendor appears in vendor listings
```

### 2.3 Shared Resources

| Package | Purpose | Used By |
|---------|---------|---------|
| `@zora/api-client` | Supabase client, services, realtime manager | All apps |
| `@zora/types` | TypeScript types for all entities | All apps |
| `@zora/shared` | Utility functions, URL helpers | All apps |
| `@zora/design-tokens` | Colors, typography, spacing | All apps |
| `@zora/ui-web` | Shared web UI components | Admin, Vendor |

---

## 3. Establishing Connections for Real-Time Execution

### 3.1 Implementation Tasks

#### Task 1: Wire Realtime Providers into Layouts

**Admin Dashboard Layout:**
```typescript
// apps/admin/app/(dashboard)/layout.tsx
import { AdminRealtimeProvider } from '../../providers';

export default function DashboardLayout({ children }) {
    const { user } = useAuth();
    
    return (
        <AdminRealtimeProvider 
            adminId={user?.id ?? null}
            enabled={!!user}
            onNewOrder={(order) => {
                toast.success(`New order #${order.order_number}`);
            }}
        >
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1">{children}</main>
            </div>
        </AdminRealtimeProvider>
    );
}
```

**Vendor Portal Layout:**
```typescript
// apps/vendor/app/(dashboard)/layout.tsx
import { VendorRealtimeProvider } from '../../providers';

export default function DashboardLayout({ children }) {
    const { vendor } = useAuth();
    
    return (
        <VendorRealtimeProvider 
            vendorId={vendor?.id ?? null}
            enabled={!!vendor}
            onNewOrder={(order) => {
                toast.success(`New order! £${order.total}`);
                playNotificationSound();
            }}
        >
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1">{children}</main>
            </div>
        </VendorRealtimeProvider>
    );
}
```

#### Task 2: Align Query Keys

**Update Admin Realtime Provider:**
```typescript
// apps/admin/providers/AdminRealtimeProvider.tsx

const handleNewOrder = useCallback((order: Order) => {
    // Use the same keys as useAdminData hooks
    queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'recentOrders'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'pendingItems'] });
    
    onNewOrder?.(order);
}, [queryClient, onNewOrder]);
```

**Update Vendor Realtime Provider:**
```typescript
// apps/vendor/providers/VendorRealtimeProvider.tsx

const handleNewOrder = useCallback((order: Order) => {
    // Use the same keys as useVendorData hooks
    queryClient.invalidateQueries({ queryKey: ['vendor', 'orders', vendorId] });
    queryClient.invalidateQueries({ queryKey: ['vendor', 'recentOrders', vendorId] });
    queryClient.invalidateQueries({ queryKey: ['vendor', 'stats', vendorId] });
    
    onNewOrder?.(order);
}, [vendorId, queryClient, onNewOrder]);
```

#### Task 3: Mobile App Integration with Centralized Realtime

**Migrate Mobile to use @zora/api-client RealtimeManager:**
```typescript
// apps/mobile/providers/RealtimeProvider.tsx (NEW)

import { RealtimeManager, useConnectionStore } from '@zora/api-client';
import { useAuthStore } from '../stores/authStore';

export function MobileRealtimeProvider({ children }) {
    const user = useAuthStore((s) => s.user);
    const queryClient = useQueryClient();
    
    useEffect(() => {
        if (!user) return;
        
        // Subscribe to user's orders
        const ordersSub = RealtimeManager.subscribeToUser(
            user.user_id,
            'orders',
            {
                onUpdate: ({ new: order }) => {
                    // Update local store
                    useOrderStore.getState().updateOrderStatus(order.id, order.status);
                    // Invalidate queries
                    queryClient.invalidateQueries({ queryKey: ['orders'] });
                },
            }
        );
        
        // Subscribe to notifications
        const notifSub = RealtimeManager.subscribeToUser(
            user.user_id,
            'notifications',
            {
                onInsert: (notification) => {
                    useNotificationStore.getState().addNotification(notification);
                },
            }
        );
        
        // Subscribe to cart sync
        const cartSub = RealtimeManager.subscribeToUser(
            user.user_id,
            'cart_items',
            {
                onChange: () => {
                    queryClient.invalidateQueries({ queryKey: ['cart'] });
                },
            }
        );
        
        return () => {
            ordersSub.unsubscribe();
            notifSub.unsubscribe();
            cartSub.unsubscribe();
        };
    }, [user?.user_id]);
    
    return children;
}
```

#### Task 4: Connection Status Indicator Component

**Shared Connection Status Component:**
```typescript
// packages/ui-web/src/components/ConnectionStatus.tsx

export function ConnectionStatus() {
    const status = useConnectionStore((s) => s.status);
    
    if (status === 'connected') {
        return (
            <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs">Live</span>
            </div>
        );
    }
    
    if (status === 'reconnecting') {
        return (
            <div className="flex items-center gap-2 text-yellow-600">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span className="text-xs">Reconnecting...</span>
            </div>
        );
    }
    
    return (
        <div className="flex items-center gap-2 text-red-600">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs">Offline</span>
        </div>
    );
}
```

### 3.2 Real-Time Event Flow Matrix

| Event Source | Event Type | Affected Tables | Subscribers |
|--------------|------------|-----------------|-------------|
| **Mobile App** | | | |
| Customer places order | INSERT | orders, order_items | Vendor, Admin |
| Customer updates profile | UPDATE | profiles | Vendor (for order display) |
| Customer adds to cart | INSERT | cart_items | (Same user, cross-device) |
| Customer sends message | INSERT | messages, conversations | Vendor, Admin |
| **Vendor Portal** | | | |
| Vendor updates order status | UPDATE | orders | Mobile (customer), Admin |
| Vendor adds/updates product | INSERT/UPDATE | products | Mobile, Admin |
| Vendor updates shop profile | UPDATE | vendors | Mobile, Admin |
| **Admin Dashboard** | | | |
| Admin approves vendor | UPDATE | vendor_applications | (Applicant notification) |
| Admin creates announcement | BROADCAST | - | All apps |
| Admin updates product | UPDATE | products | Mobile, Vendor |

### 3.3 Database Triggers for Cross-App Notifications

**Already Implemented (Migration 020):**
```sql
-- Vendor receives notification when new order arrives
CREATE OR REPLACE FUNCTION public.handle_new_order()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, type, title, description, action_url)
    SELECT v.user_id, 'order', 'New Order Received!',
           'You have received a new order worth £' || NEW.total,
           '/orders/' || NEW.id
    FROM public.vendors v WHERE v.id = NEW.vendor_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Recommended Additional Triggers:**
```sql
-- Customer notification when order status changes
CREATE OR REPLACE FUNCTION public.handle_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.notifications (user_id, type, title, description, action_url)
        VALUES (
            NEW.user_id,
            'order',
            'Order Update',
            'Your order #' || NEW.order_number || ' is now ' || REPLACE(NEW.status, '_', ' '),
            '/orders/' || NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_status_change
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_order_status_change();
```

---

## 4. Implementation Checklist

### Phase 1: Provider Integration (Priority: HIGH)

- [ ] **Admin Dashboard**
  - [ ] Update `apps/admin/app/(dashboard)/layout.tsx` to include `AdminRealtimeProvider`
  - [ ] Add toast notifications for new orders
  - [ ] Add connection status indicator to Header
  - [ ] Align query keys in `AdminRealtimeProvider` with `useAdminData` hooks

- [ ] **Vendor Portal**
  - [ ] Update `apps/vendor/app/(dashboard)/layout.tsx` to include `VendorRealtimeProvider`
  - [ ] Add toast + audio notifications for new orders
  - [ ] Add connection status indicator to Header
  - [ ] Align query keys in `VendorRealtimeProvider` with `useVendorData` hooks

### Phase 2: Mobile App Migration (Priority: HIGH)

- [ ] Create `apps/mobile/providers/RealtimeProvider.tsx`
- [ ] Update `apps/mobile/app/_layout.tsx` to include new provider
- [ ] Migrate from local `realtimeService.ts` to `@zora/api-client` RealtimeManager
- [ ] Update orderStore to work with new realtime system
- [ ] Add cross-device cart sync

### Phase 3: Additional Triggers (Priority: MEDIUM)

- [ ] Create migration `022_order_status_notifications.sql`
- [ ] Add customer notification trigger for order status changes
- [ ] Add vendor notification for low stock alerts

### Phase 4: UI Refinements (Priority: LOW)

- [ ] Add `ConnectionStatus` component to all app headers
- [ ] Implement notification sounds (new order beep)
- [ ] Add "New" badges to sidebar items when new data arrives
- [ ] Implement optimistic updates for order status changes

---

## 5. Testing Strategy

### 5.1 Integration Tests

| Test Scenario | Steps | Expected Result |
|---------------|-------|-----------------|
| Order Flow | 1. Customer places order (Mobile)<br>2. Check Vendor Portal<br>3. Check Admin Dashboard | Order appears in both within 1 second |
| Status Update | 1. Vendor updates status<br>2. Check Mobile app<br>3. Check Admin Dashboard | Status updates everywhere within 500ms |
| Cart Sync | 1. Add item on Mobile<br>2. Open same account on another device | Cart syncs within 2 seconds |

### 5.2 Connection Resilience Tests

| Test | Method | Expected |
|------|--------|----------|
| Reconnection | Kill network, restore | Reconnects within 5 seconds |
| Offline Queue | Update while offline | Syncs when connection restored |
| Multiple Tabs | Open same app in multiple tabs | All tabs stay in sync |

---

## 6. Files to Modify

### 6.1 Admin Dashboard
```
apps/admin/
├── app/(dashboard)/layout.tsx          # Add AdminRealtimeProvider
├── components/Header.tsx                # Add ConnectionStatus
├── providers/AdminRealtimeProvider.tsx  # Update query key alignment
└── hooks/useAdminData.ts               # Already complete
```

### 6.2 Vendor Portal
```
apps/vendor/
├── app/(dashboard)/layout.tsx           # Add VendorRealtimeProvider
├── components/Header.tsx                 # Add ConnectionStatus
├── providers/VendorRealtimeProvider.tsx  # Update query key alignment
└── hooks/useVendorData.ts               # Already complete
```

### 6.3 Mobile App
```
apps/mobile/
├── providers/
│   └── RealtimeProvider.tsx             # NEW: Centralized realtime provider
├── app/_layout.tsx                       # Add RealtimeProvider
├── stores/orderStore.ts                  # Update to work with centralized realtime
└── services/realtimeService.ts           # Deprecate (keep for fallback)
```

### 6.4 Shared Packages
```
packages/ui-web/src/components/
└── ConnectionStatus.tsx                  # NEW: Shared connection indicator
```

### 6.5 Database
```
supabase/migrations/
└── 022_order_status_notifications.sql    # NEW: Customer notification trigger
```

---

## 7. Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Realtime Latency | < 500ms | Time from DB change to UI update |
| Reconnection Time | < 5s | Time to recover after disconnect |
| Connection Reliability | 99.9% | Uptime of realtime connection |
| Notification Delivery | 100% | All events reach subscribers |

---

## 8. Rollout Plan

1. **Development Environment**
   - Implement all changes
   - Run integration tests
   - Verify cross-app communication

2. **Staging Environment**
   - Deploy all apps to staging
   - Perform end-to-end testing
   - Stress test with multiple concurrent users

3. **Production Rollout**
   - Deploy database migrations first
   - Deploy updated apps simultaneously
   - Monitor realtime connection metrics
   - Have rollback plan ready

---

*Document created: January 30, 2026*  
*This execution plan should be reviewed and updated as implementation progresses.*
