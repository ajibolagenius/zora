# Zora Database & Backend Integration Plan

**Document Version:** 1.0
**Date:** January 29, 2026
**Status:** Execution Plan

---

## 1. Executive Summary

This document outlines the comprehensive plan to integrate database and backend systems across all three Zora applications (Mobile, Vendor Portal, Admin Dashboard) to enable **bidirectional real-time data updates**. The integration will leverage Supabase Realtime, TanStack Query, and Zustand for seamless data synchronization.

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

---

## 2. Current State Analysis

### 2.1 Existing Infrastructure

#### Database (Supabase PostgreSQL)
- ✅ Complete schema with 15+ tables
- ✅ Row Level Security (RLS) policies
- ✅ Triggers for notifications on order status changes
- ✅ Functions for nearby vendors, rating updates
- ⚠️ No explicit Realtime publication setup

#### API Client (`@zora/api-client`)
- ✅ Supabase client configuration
- ✅ Basic CRUD services (products, orders, auth, vendors)
- ✅ Pagination support
- ❌ No real-time subscriptions
- ❌ No optimistic update patterns
- ❌ No connection state management

#### State Management
- ⚠️ Zustand stores (mobile app)
- ⚠️ TanStack Query (partial implementation)
- ❌ No centralized cache invalidation
- ❌ No cross-app sync strategy

### 2.2 Gap Analysis

| Component | Current | Required | Priority |
|-----------|---------|----------|----------|
| Realtime Subscriptions | None | Full | P0 |
| Optimistic Updates | None | Core entities | P0 |
| Connection Handling | Basic | Robust | P1 |
| Offline Queue | None | Basic | P1 |
| Cache Invalidation | Manual | Automatic | P0 |
| Type Generation | Manual | Auto from DB | P2 |

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
| `INSERT` | orders, products, reviews | Mobile, Vendor | All |
| `UPDATE` | orders, products, vendors, profiles | All | All |
| `DELETE` | products, cart_items | Vendor, Admin | Mobile, Vendor |
| `PRESENCE` | - | All | All (for online status) |
| `BROADCAST` | - | Admin | All (for announcements) |

---

## 4. Implementation Plan

### Phase 1: Foundation Setup (Week 1)

#### 4.1.1 Enable Supabase Realtime Publications

Create migration to enable realtime for required tables:

```sql
-- File: supabase/migrations/016_enable_realtime.sql

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vendors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cart_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Create function to broadcast custom events
CREATE OR REPLACE FUNCTION public.broadcast_event(
    channel_name TEXT,
    event_type TEXT,
    payload JSONB
)
RETURNS VOID AS $$
BEGIN
    PERFORM pg_notify(
        channel_name,
        json_build_object(
            'type', event_type,
            'payload', payload,
            'timestamp', NOW()
        )::TEXT
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 4.1.2 Create Realtime Manager in API Client

```typescript
// packages/api-client/src/realtime/index.ts

export { RealtimeManager } from './realtime-manager';
export { useRealtimeSubscription } from './hooks/use-realtime-subscription';
export { usePresence } from './hooks/use-presence';
export * from './types';
```

#### 4.1.3 Generate Database Types

```bash
# Add to package.json scripts
"generate:types": "supabase gen types typescript --project-id <project-id> > packages/types/src/database.types.ts"
```

### Phase 2: Real-time Infrastructure (Week 1-2)

#### 4.2.1 Realtime Manager Implementation

```typescript
// packages/api-client/src/realtime/realtime-manager.ts

import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { getSupabaseClient } from '../supabase';

type TableName = 'orders' | 'products' | 'vendors' | 'cart_items' | 'notifications' | 'reviews' | 'profiles';
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

    /**
     * Subscribe to table changes
     */
    subscribe<T = any>(config: SubscriptionConfig<T>): () => void {
        const supabase = getSupabaseClient();
        const channelName = `${config.table}-${config.filter || 'all'}-${Date.now()}`;

        const channel = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: config.event || '*',
                    schema: config.schema || 'public',
                    table: config.table,
                    filter: config.filter,
                },
                (payload) => {
                    this.handlePayload(payload, config);
                }
            )
            .subscribe((status) => {
                this.updateConnectionState(status);
            });

        this.channels.set(channelName, channel);

        // Return unsubscribe function
        return () => {
            channel.unsubscribe();
            this.channels.delete(channelName);
        };
    }

    /**
     * Subscribe to user-specific changes
     */
    subscribeToUser<T = any>(
        userId: string,
        table: TableName,
        callbacks: Pick<SubscriptionConfig<T>, 'onInsert' | 'onUpdate' | 'onDelete'>
    ): () => void {
        return this.subscribe({
            table,
            filter: `user_id=eq.${userId}`,
            ...callbacks,
        });
    }

    /**
     * Subscribe to vendor-specific changes
     */
    subscribeToVendor<T = any>(
        vendorId: string,
        table: TableName,
        callbacks: Pick<SubscriptionConfig<T>, 'onInsert' | 'onUpdate' | 'onDelete'>
    ): () => void {
        return this.subscribe({
            table,
            filter: `vendor_id=eq.${vendorId}`,
            ...callbacks,
        });
    }

    /**
     * Presence - track online users
     */
    trackPresence(channelName: string, userInfo: { userId: string; role: string }) {
        const supabase = getSupabaseClient();

        const channel = supabase.channel(channelName, {
            config: { presence: { key: userInfo.userId } },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                console.log('Presence sync:', state);
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                console.log('User joined:', key, newPresences);
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                console.log('User left:', key, leftPresences);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track(userInfo);
                }
            });

        this.channels.set(`presence-${channelName}`, channel);

        return () => {
            channel.untrack();
            channel.unsubscribe();
            this.channels.delete(`presence-${channelName}`);
        };
    }

    /**
     * Broadcast message to all connected clients
     */
    async broadcast(channelName: string, event: string, payload: any) {
        const supabase = getSupabaseClient();
        const channel = supabase.channel(channelName);

        await channel.send({
            type: 'broadcast',
            event,
            payload,
        });
    }

    /**
     * Listen for broadcast messages
     */
    listenToBroadcast(channelName: string, event: string, callback: (payload: any) => void): () => void {
        const supabase = getSupabaseClient();

        const channel = supabase
            .channel(channelName)
            .on('broadcast', { event }, ({ payload }) => {
                callback(payload);
            })
            .subscribe();

        this.channels.set(`broadcast-${channelName}-${event}`, channel);

        return () => {
            channel.unsubscribe();
            this.channels.delete(`broadcast-${channelName}-${event}`);
        };
    }

    /**
     * Get connection state
     */
    getConnectionState(): ConnectionState {
        return this.connectionState;
    }

    /**
     * Subscribe to connection state changes
     */
    onConnectionStateChange(listener: (state: ConnectionState) => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    /**
     * Disconnect all channels
     */
    disconnectAll() {
        this.channels.forEach((channel) => {
            channel.unsubscribe();
        });
        this.channels.clear();
        this.updateConnectionState('CLOSED');
    }

    private handlePayload<T>(
        payload: RealtimePostgresChangesPayload<T>,
        config: SubscriptionConfig<T>
    ) {
        config.onChange?.(payload);

        switch (payload.eventType) {
            case 'INSERT':
                config.onInsert?.(payload.new as T);
                break;
            case 'UPDATE':
                config.onUpdate?.({ old: payload.old as T, new: payload.new as T });
                break;
            case 'DELETE':
                config.onDelete?.(payload.old as T);
                break;
        }
    }

    private updateConnectionState(status: string) {
        const prevStatus = this.connectionState.status;

        switch (status) {
            case 'SUBSCRIBED':
                this.connectionState = {
                    status: 'connected',
                    lastConnected: new Date()
                };
                this.reconnectAttempts = 0;
                break;
            case 'CLOSED':
            case 'CHANNEL_ERROR':
                this.connectionState = {
                    status: 'disconnected',
                    error: new Error(`Channel ${status.toLowerCase()}`),
                };
                this.attemptReconnect();
                break;
            case 'TIMED_OUT':
                this.connectionState = { status: 'reconnecting' };
                this.attemptReconnect();
                break;
        }

        if (prevStatus !== this.connectionState.status) {
            this.listeners.forEach((listener) => listener(this.connectionState));
        }
    }

    private async attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

        await new Promise((resolve) => setTimeout(resolve, delay));

        // Re-establish subscriptions
        // Implementation depends on stored subscription configs
    }
}

export const RealtimeManager = new RealtimeManagerClass();
```

#### 4.2.2 React Hooks for Realtime

```typescript
// packages/api-client/src/realtime/hooks/use-realtime-subscription.ts

import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RealtimeManager } from '../realtime-manager';

interface UseRealtimeOptions<T> {
    table: 'orders' | 'products' | 'vendors' | 'cart_items' | 'notifications';
    filter?: string;
    queryKey: string[];
    enabled?: boolean;
    onInsert?: (data: T) => void;
    onUpdate?: (data: { old: T; new: T }) => void;
    onDelete?: (data: T) => void;
}

export function useRealtimeSubscription<T = any>(options: UseRealtimeOptions<T>) {
    const {
        table,
        filter,
        queryKey,
        enabled = true,
        onInsert,
        onUpdate,
        onDelete,
    } = options;

    const queryClient = useQueryClient();
    const unsubscribeRef = useRef<(() => void) | null>(null);

    const invalidateQueries = useCallback(() => {
        queryClient.invalidateQueries({ queryKey });
    }, [queryClient, queryKey]);

    useEffect(() => {
        if (!enabled) return;

        unsubscribeRef.current = RealtimeManager.subscribe<T>({
            table,
            filter,
            onInsert: (data) => {
                onInsert?.(data);
                invalidateQueries();
            },
            onUpdate: (data) => {
                onUpdate?.(data);
                // Optimistically update cache
                queryClient.setQueryData(queryKey, (old: T[] | undefined) => {
                    if (!old) return old;
                    return old.map((item: any) =>
                        item.id === (data.new as any).id ? data.new : item
                    );
                });
            },
            onDelete: (data) => {
                onDelete?.(data);
                invalidateQueries();
            },
        });

        return () => {
            unsubscribeRef.current?.();
        };
    }, [table, filter, enabled, queryKey, onInsert, onUpdate, onDelete, invalidateQueries, queryClient]);
}

// Convenience hooks for specific tables
export function useOrdersRealtime(userId: string, options?: Partial<UseRealtimeOptions<any>>) {
    return useRealtimeSubscription({
        table: 'orders',
        filter: `user_id=eq.${userId}`,
        queryKey: ['orders', userId],
        ...options,
    });
}

export function useProductsRealtime(vendorId?: string, options?: Partial<UseRealtimeOptions<any>>) {
    return useRealtimeSubscription({
        table: 'products',
        filter: vendorId ? `vendor_id=eq.${vendorId}` : undefined,
        queryKey: vendorId ? ['products', 'vendor', vendorId] : ['products'],
        ...options,
    });
}

export function useNotificationsRealtime(userId: string, options?: Partial<UseRealtimeOptions<any>>) {
    return useRealtimeSubscription({
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
        queryKey: ['notifications', userId],
        ...options,
    });
}
```

### Phase 3: Service Layer Enhancement (Week 2)

#### 4.3.1 Enhanced Orders Service with Optimistic Updates

```typescript
// packages/api-client/src/services/orders.ts (enhanced)

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSupabaseClient } from '../supabase';
import type { Order, CreateOrderInput, OrderStatus } from '@zora/types';

// Query keys factory
export const orderKeys = {
    all: ['orders'] as const,
    lists: () => [...orderKeys.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...orderKeys.lists(), filters] as const,
    details: () => [...orderKeys.all, 'detail'] as const,
    detail: (id: string) => [...orderKeys.details(), id] as const,
    user: (userId: string) => [...orderKeys.all, 'user', userId] as const,
    vendor: (vendorId: string) => [...orderKeys.all, 'vendor', vendorId] as const,
};

// React Query hooks
export function useOrders(userId: string) {
    return useQuery({
        queryKey: orderKeys.user(userId),
        queryFn: () => ordersService.getMyOrders(),
        staleTime: 30 * 1000, // 30 seconds
    });
}

export function useOrder(orderId: string) {
    return useQuery({
        queryKey: orderKeys.detail(orderId),
        queryFn: () => ordersService.getById(orderId),
        enabled: !!orderId,
    });
}

export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (order: CreateOrderInput) => ordersService.create(order),
        onMutate: async (newOrder) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: orderKeys.all });

            // Snapshot previous value
            const previousOrders = queryClient.getQueryData(orderKeys.lists());

            // Optimistically update
            queryClient.setQueryData(orderKeys.lists(), (old: Order[] = []) => [
                { ...newOrder, id: 'temp-id', status: 'pending', created_at: new Date().toISOString() },
                ...old,
            ]);

            return { previousOrders };
        },
        onError: (err, newOrder, context) => {
            // Rollback on error
            queryClient.setQueryData(orderKeys.lists(), context?.previousOrders);
        },
        onSettled: () => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
        },
    });
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
            ordersService.updateStatus(orderId, status),
        onMutate: async ({ orderId, status }) => {
            await queryClient.cancelQueries({ queryKey: orderKeys.detail(orderId) });

            const previousOrder = queryClient.getQueryData<Order>(orderKeys.detail(orderId));

            queryClient.setQueryData<Order>(orderKeys.detail(orderId), (old) =>
                old ? { ...old, status } : old
            );

            return { previousOrder };
        },
        onError: (err, { orderId }, context) => {
            queryClient.setQueryData(orderKeys.detail(orderId), context?.previousOrder);
        },
        onSettled: (data, error, { orderId }) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
}

// Base service (existing + enhancements)
export const ordersService = {
    // ... existing methods ...

    /**
     * Subscribe to order updates
     */
    subscribeToOrder(orderId: string, callback: (order: Order) => void) {
        const supabase = getSupabaseClient();

        const channel = supabase
            .channel(`order-${orderId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${orderId}`,
                },
                (payload) => {
                    callback(payload.new as Order);
                }
            )
            .subscribe();

        return () => channel.unsubscribe();
    },
};
```

#### 4.3.2 Cart Service with Real-time Sync

```typescript
// packages/api-client/src/services/cart.ts

import { getSupabaseClient } from '../supabase';
import type { CartItem, Product } from '@zora/types';

export const cartKeys = {
    all: ['cart'] as const,
    user: (userId: string) => [...cartKeys.all, userId] as const,
    count: (userId: string) => [...cartKeys.all, userId, 'count'] as const,
};

export const cartService = {
    /**
     * Get cart items for current user
     */
    async getCart(): Promise<CartItem[]> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('cart_items')
            .select(`
                *,
                product:products(*),
                vendor:vendors(id, shop_name, logo_url)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Add item to cart (with upsert for quantity)
     */
    async addToCart(productId: string, quantity: number = 1): Promise<CartItem> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        // Get product to get vendor_id
        const { data: product } = await supabase
            .from('products')
            .select('vendor_id')
            .eq('id', productId)
            .single();

        const { data, error } = await supabase
            .from('cart_items')
            .upsert({
                user_id: user.id,
                product_id: productId,
                vendor_id: product?.vendor_id,
                quantity,
            }, {
                onConflict: 'user_id,product_id',
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update cart item quantity
     */
    async updateQuantity(cartItemId: string, quantity: number): Promise<CartItem> {
        const supabase = getSupabaseClient();

        if (quantity <= 0) {
            await this.removeFromCart(cartItemId);
            return null as any;
        }

        const { data, error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', cartItemId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Remove item from cart
     */
    async removeFromCart(cartItemId: string): Promise<void> {
        const supabase = getSupabaseClient();
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', cartItemId);

        if (error) throw error;
    },

    /**
     * Clear entire cart
     */
    async clearCart(): Promise<void> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id);

        if (error) throw error;
    },

    /**
     * Get cart count
     */
    async getCartCount(): Promise<number> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return 0;

        const { count, error } = await supabase
            .from('cart_items')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        if (error) throw error;
        return count || 0;
    },
};
```

### Phase 4: Zustand Store Integration (Week 2-3)

#### 4.4.1 Connection State Store

```typescript
// packages/api-client/src/stores/connection-store.ts

import { create } from 'zustand';
import { RealtimeManager } from '../realtime/realtime-manager';

interface ConnectionState {
    status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
    lastConnected: Date | null;
    error: Error | null;
}

interface ConnectionStore extends ConnectionState {
    setStatus: (status: ConnectionState['status']) => void;
    setError: (error: Error | null) => void;
    initialize: () => () => void;
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
    status: 'disconnected',
    lastConnected: null,
    error: null,

    setStatus: (status) => set({ status }),
    setError: (error) => set({ error }),

    initialize: () => {
        const unsubscribe = RealtimeManager.onConnectionStateChange((state) => {
            set({
                status: state.status,
                lastConnected: state.lastConnected || null,
                error: state.error || null,
            });
        });

        return unsubscribe;
    },
}));
```

#### 4.4.2 Notifications Store with Real-time

```typescript
// packages/api-client/src/stores/notifications-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RealtimeManager } from '../realtime/realtime-manager';
import type { Notification } from '@zora/types';

interface NotificationsStore {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;

    // Actions
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;

    // Realtime
    subscribeToNotifications: (userId: string) => () => void;
}

export const useNotificationsStore = create<NotificationsStore>()(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,
            isLoading: false,

            setNotifications: (notifications) => set({
                notifications,
                unreadCount: notifications.filter((n) => !n.is_read).length,
            }),

            addNotification: (notification) => set((state) => ({
                notifications: [notification, ...state.notifications],
                unreadCount: state.unreadCount + (notification.is_read ? 0 : 1),
            })),

            markAsRead: (id) => set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.id === id ? { ...n, is_read: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            })),

            markAllAsRead: () => set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
                unreadCount: 0,
            })),

            clearAll: () => set({ notifications: [], unreadCount: 0 }),

            subscribeToNotifications: (userId) => {
                return RealtimeManager.subscribeToUser(userId, 'notifications', {
                    onInsert: (notification) => {
                        get().addNotification(notification);
                    },
                    onUpdate: ({ new: updated }) => {
                        set((state) => ({
                            notifications: state.notifications.map((n) =>
                                n.id === updated.id ? updated : n
                            ),
                        }));
                    },
                });
            },
        }),
        {
            name: 'zora-notifications',
            partialize: (state) => ({
                notifications: state.notifications.slice(0, 50), // Keep last 50
            }),
        }
    )
);
```

### Phase 5: App-Specific Integration (Week 3-4)

#### 4.5.1 Mobile App Integration

```typescript
// apps/mobile/providers/RealtimeProvider.tsx

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuth } from './AuthProvider';
import { RealtimeManager, useConnectionStore, useNotificationsStore } from '@zora/api-client';

interface RealtimeContextValue {
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
    isOnline: boolean;
}

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const connectionStatus = useConnectionStore((s) => s.status);
    const initConnection = useConnectionStore((s) => s.initialize);
    const subscribeToNotifications = useNotificationsStore((s) => s.subscribeToNotifications);

    const appStateRef = useRef(AppState.currentState);
    const subscriptionsRef = useRef<(() => void)[]>([]);

    useEffect(() => {
        // Initialize connection state listener
        const unsubConnection = initConnection();
        subscriptionsRef.current.push(unsubConnection);

        return () => {
            subscriptionsRef.current.forEach((unsub) => unsub());
            RealtimeManager.disconnectAll();
        };
    }, [initConnection]);

    useEffect(() => {
        if (!user?.id) return;

        // Subscribe to user-specific notifications
        const unsubNotifications = subscribeToNotifications(user.id);
        subscriptionsRef.current.push(unsubNotifications);

        return () => {
            unsubNotifications();
        };
    }, [user?.id, subscribeToNotifications]);

    // Handle app state changes (background/foreground)
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (
                appStateRef.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                // App has come to foreground - reconnect
                console.log('App active - reconnecting realtime');
            } else if (
                appStateRef.current === 'active' &&
                nextAppState.match(/inactive|background/)
            ) {
                // App going to background - could pause non-critical subscriptions
                console.log('App backgrounded');
            }
            appStateRef.current = nextAppState;
        });

        return () => subscription.remove();
    }, []);

    const value: RealtimeContextValue = {
        connectionStatus,
        isOnline: connectionStatus === 'connected',
    };

    return (
        <RealtimeContext.Provider value={value}>
            {children}
        </RealtimeContext.Provider>
    );
}

export function useRealtime() {
    const context = useContext(RealtimeContext);
    if (!context) {
        throw new Error('useRealtime must be used within RealtimeProvider');
    }
    return context;
}
```

#### 4.5.2 Vendor Portal Integration

```typescript
// apps/vendor/providers/VendorRealtimeProvider.tsx

'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthProvider';
import {
    RealtimeManager,
    useConnectionStore,
    orderKeys,
} from '@zora/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface VendorRealtimeContextValue {
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
    newOrdersCount: number;
}

const VendorRealtimeContext = createContext<VendorRealtimeContextValue | null>(null);

export function VendorRealtimeProvider({ children }: { children: React.ReactNode }) {
    const { vendor } = useAuth();
    const queryClient = useQueryClient();
    const connectionStatus = useConnectionStore((s) => s.status);
    const [newOrdersCount, setNewOrdersCount] = React.useState(0);

    const subscriptionsRef = useRef<(() => void)[]>([]);

    useEffect(() => {
        if (!vendor?.id) return;

        // Subscribe to new orders for this vendor
        const unsubOrders = RealtimeManager.subscribe({
            table: 'orders',
            filter: `vendor_id=eq.${vendor.id}`,
            onInsert: (order) => {
                // Invalidate orders query
                queryClient.invalidateQueries({ queryKey: orderKeys.vendor(vendor.id) });

                // Show toast notification
                toast.success('New Order Received!', {
                    description: `Order #${order.id.slice(0, 8)} - ${order.total}`,
                    action: {
                        label: 'View',
                        onClick: () => window.location.href = `/orders/${order.id}`,
                    },
                });

                // Play sound (optional)
                new Audio('/sounds/new-order.mp3').play().catch(() => {});

                setNewOrdersCount((c) => c + 1);
            },
            onUpdate: ({ new: updated }) => {
                queryClient.invalidateQueries({ queryKey: orderKeys.vendor(vendor.id) });
            },
        });

        // Subscribe to product updates (in case admin modifies)
        const unsubProducts = RealtimeManager.subscribe({
            table: 'products',
            filter: `vendor_id=eq.${vendor.id}`,
            onUpdate: () => {
                queryClient.invalidateQueries({ queryKey: ['products', 'vendor', vendor.id] });
            },
            onDelete: () => {
                queryClient.invalidateQueries({ queryKey: ['products', 'vendor', vendor.id] });
            },
        });

        subscriptionsRef.current = [unsubOrders, unsubProducts];

        return () => {
            subscriptionsRef.current.forEach((unsub) => unsub());
        };
    }, [vendor?.id, queryClient]);

    const value: VendorRealtimeContextValue = {
        connectionStatus,
        newOrdersCount,
    };

    return (
        <VendorRealtimeContext.Provider value={value}>
            {children}
        </VendorRealtimeContext.Provider>
    );
}

export function useVendorRealtime() {
    const context = useContext(VendorRealtimeContext);
    if (!context) {
        throw new Error('useVendorRealtime must be used within VendorRealtimeProvider');
    }
    return context;
}
```

#### 4.5.3 Admin Dashboard Integration

```typescript
// apps/admin/providers/AdminRealtimeProvider.tsx

'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
    RealtimeManager,
    useConnectionStore,
} from '@zora/api-client';
import { useQueryClient } from '@tanstack/react-query';

interface AdminStats {
    activeUsers: number;
    pendingOrders: number;
    pendingVendorApprovals: number;
}

interface AdminRealtimeContextValue {
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
    stats: AdminStats;
    broadcastAnnouncement: (message: string) => Promise<void>;
}

const AdminRealtimeContext = createContext<AdminRealtimeContextValue | null>(null);

export function AdminRealtimeProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    const connectionStatus = useConnectionStore((s) => s.status);

    const [stats, setStats] = useState<AdminStats>({
        activeUsers: 0,
        pendingOrders: 0,
        pendingVendorApprovals: 0,
    });

    const subscriptionsRef = useRef<(() => void)[]>([]);

    useEffect(() => {
        // Subscribe to all orders (platform-wide)
        const unsubOrders = RealtimeManager.subscribe({
            table: 'orders',
            onInsert: () => {
                queryClient.invalidateQueries({ queryKey: ['orders'] });
                setStats((s) => ({ ...s, pendingOrders: s.pendingOrders + 1 }));
            },
            onUpdate: () => {
                queryClient.invalidateQueries({ queryKey: ['orders'] });
            },
        });

        // Subscribe to vendor applications
        const unsubVendors = RealtimeManager.subscribe({
            table: 'vendors',
            filter: `is_verified=eq.false`,
            onInsert: () => {
                queryClient.invalidateQueries({ queryKey: ['vendors', 'pending'] });
                setStats((s) => ({ ...s, pendingVendorApprovals: s.pendingVendorApprovals + 1 }));
            },
        });

        // Track admin presence
        const unsubPresence = RealtimeManager.trackPresence('admin-dashboard', {
            userId: 'admin-user-id', // Replace with actual admin ID
            role: 'admin',
        });

        subscriptionsRef.current = [unsubOrders, unsubVendors, unsubPresence];

        return () => {
            subscriptionsRef.current.forEach((unsub) => unsub());
        };
    }, [queryClient]);

    const broadcastAnnouncement = async (message: string) => {
        await RealtimeManager.broadcast('platform-announcements', 'announcement', {
            message,
            timestamp: new Date().toISOString(),
        });
    };

    const value: AdminRealtimeContextValue = {
        connectionStatus,
        stats,
        broadcastAnnouncement,
    };

    return (
        <AdminRealtimeContext.Provider value={value}>
            {children}
        </AdminRealtimeContext.Provider>
    );
}

export function useAdminRealtime() {
    const context = useContext(AdminRealtimeContext);
    if (!context) {
        throw new Error('useAdminRealtime must be used within AdminRealtimeProvider');
    }
    return context;
}
```

---

## 5. Database Migrations Required

### 5.1 Enable Realtime Publication

```sql
-- File: supabase/migrations/016_enable_realtime.sql

-- Enable realtime for core tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vendors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cart_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
```

### 5.2 Enhanced Order Trigger for Vendor Notifications

```sql
-- File: supabase/migrations/017_vendor_order_notifications.sql

-- Function to notify vendor of new orders
CREATE OR REPLACE FUNCTION public.handle_new_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Get vendor user_id
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

### 5.3 Add Updated_at Triggers

```sql
-- File: supabase/migrations/018_updated_at_triggers.sql

-- Generic updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all relevant tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.vendors
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.cart_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

## 6. Testing Strategy

### 6.1 Unit Tests

```typescript
// packages/api-client/src/__tests__/realtime-manager.test.ts

import { RealtimeManager } from '../realtime/realtime-manager';

describe('RealtimeManager', () => {
    it('should subscribe to table changes', () => {
        const onInsert = jest.fn();
        const unsubscribe = RealtimeManager.subscribe({
            table: 'orders',
            onInsert,
        });

        expect(typeof unsubscribe).toBe('function');
    });

    it('should handle connection state changes', () => {
        const listener = jest.fn();
        const unsubscribe = RealtimeManager.onConnectionStateChange(listener);

        // Simulate connection
        // ...

        expect(listener).toHaveBeenCalled();
    });
});
```

### 6.2 Integration Tests

```typescript
// Test real-time sync between mobile and vendor portal
describe('Cross-App Realtime Sync', () => {
    it('should sync order status from vendor to mobile', async () => {
        // Create order from mobile
        // Update status from vendor
        // Verify mobile receives update
    });
});
```

### 6.3 E2E Tests

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Order Status Sync | 1. Customer places order<br>2. Vendor updates status<br>3. Customer app shows update | Real-time status change |
| Cart Sync | 1. Add item on mobile<br>2. Verify cart count updates | Instant cart update |
| Notification Delivery | 1. Trigger order status change<br>2. Customer receives notification | Push + in-app notification |

---

## 7. Execution Timeline

| Phase | Duration | Deliverables | Dependencies |
|-------|----------|--------------|--------------|
| **Phase 1**: Foundation | 3-4 days | DB migrations, Types generation | None |
| **Phase 2**: Realtime Infrastructure | 4-5 days | RealtimeManager, Hooks | Phase 1 |
| **Phase 3**: Service Enhancement | 3-4 days | Enhanced services with optimistic updates | Phase 2 |
| **Phase 4**: Zustand Integration | 3-4 days | Connection store, Notifications store | Phase 2, 3 |
| **Phase 5**: App Integration | 5-7 days | Mobile, Vendor, Admin providers | Phase 4 |
| **Phase 6**: Testing | 3-4 days | Unit, Integration, E2E tests | Phase 5 |
| **Phase 7**: Documentation | 2-3 days | API docs, Usage guides | Phase 5 |

**Total Estimated Duration: 3-4 weeks**

---

## 8. Risk Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Supabase Realtime limits | High | Medium | Monitor connections, implement connection pooling |
| Network disconnections | Medium | High | Robust reconnection logic, offline queue |
| Data conflicts | Medium | Low | Last-write-wins with conflict detection |
| Performance degradation | High | Low | Selective subscriptions, pagination |
| Type mismatches | Medium | Medium | Auto-generate types from DB schema |

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

## 10. Files to Create/Modify

### New Files

```
packages/api-client/src/
├── realtime/
│   ├── index.ts
│   ├── realtime-manager.ts
│   ├── types.ts
│   └── hooks/
│       ├── use-realtime-subscription.ts
│       ├── use-presence.ts
│       └── use-connection-status.ts
├── stores/
│   ├── connection-store.ts
│   └── notifications-store.ts
├── services/
│   └── cart.ts (new)

apps/mobile/
├── providers/
│   └── RealtimeProvider.tsx

apps/vendor/
├── providers/
│   └── VendorRealtimeProvider.tsx

apps/admin/
├── providers/
│   └── AdminRealtimeProvider.tsx

supabase/migrations/
├── 016_enable_realtime.sql
├── 017_vendor_order_notifications.sql
└── 018_updated_at_triggers.sql
```

### Modified Files

```
packages/api-client/src/
├── index.ts (add exports)
├── services/
│   ├── orders.ts (add hooks, subscriptions)
│   ├── products.ts (add hooks, subscriptions)
│   └── auth.ts (add session management)

packages/types/src/
├── index.ts (add new types)
└── entities/
    └── notification.ts (enhance)
```

---

## 11. Appendix

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

### C. References

- [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Optimistic Updates Pattern](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)

---

*This document serves as the execution blueprint for integrating real-time capabilities across all Zora applications. Implementation should proceed phase-by-phase with testing at each stage.*
