
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../lib/storage';
import { Order } from '../types'; // Using the mapped type from index.ts or should I use supabase type? The app uses the one in index.ts mostly for UI.
import { realtimeService } from '../services/realtimeService';
import { isSupabaseConfigured, getSupabaseClient } from '../lib/supabase';
import { useAuthStore } from './authStore';
import { orderService } from '../services/supabaseService'; // Use existing service for fetching

interface OrderState {
    orders: Order[];
    activeOrdersCount: number;
    isLoading: boolean;

    // Actions
    fetchOrders: () => Promise<void>;
    updateOrderStatus: (orderId: string, status: Order['status']) => void;
    // We can add addOrder if needed, but usually orders are created via checkout and then fetched
    subscribeToRealtime: (userId: string) => void;
    unsubscribeFromRealtime: () => void;
}

// Mock orders for dev (moved from orders.tsx)
// We need to match the Order interface in types/index.ts
// The ones in orders.tsx were 'OrderItem' which had a slightly different structure.
// I will adapt the structure to match the main Order type but keep the visual data if possible
// or ideally, we should standardise.
// The Order type in types/index.ts has `items: OrderItem[]`.
// Let's create proper mock data matching Order interface.

const MOCK_ORDERS: Order[] = [
    {
        id: '1',
        user_id: 'mock_user',
        order_number: '29384',
        status: 'preparing',
        items: [
            {
                product_id: 'prod_001',
                vendor_id: 'vnd_001',
                name: 'Premium Jollof Spice Blend',
                image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=300',
                quantity: 2,
                price: 18.50,
            },
            {
                product_id: 'prod_002',
                vendor_id: 'vnd_001',
                name: 'Nigerian Curry Powder',
                image_url: 'https://images.unsplash.com/photo-1620589125195-a4bba89542a6?q=80&w=300',
                quantity: 1,
                price: 8.50,
            },
        ],
        subtotal: 45.50,
        delivery_fee: 5.00,
        service_fee: 2.00,
        discount: 0,
        total: 52.50,
        currency: 'GBP',
        delivery_option: 'delivery',
        payment_method: 'card',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
        id: '2',
        user_id: 'mock_user',
        order_number: '29312',
        status: 'out_for_delivery',
        items: [
            {
                product_id: 'prod_003',
                vendor_id: 'vnd_002',
                name: 'Fresh Palm Oil',
                image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=300',
                quantity: 1,
                price: 12.00,
            },
        ],
        subtotal: 12.00,
        delivery_fee: 3.00,
        service_fee: 1.00,
        discount: 0,
        total: 16.00,
        currency: 'GBP',
        delivery_option: 'delivery',
        payment_method: 'card',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    }
];

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            orders: [],
            activeOrdersCount: 0,
            isLoading: false,

            fetchOrders: async () => {
                if (!isSupabaseConfigured()) {
                    set({
                        orders: MOCK_ORDERS,
                        activeOrdersCount: MOCK_ORDERS.filter(o =>
                            ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)
                        ).length
                    });
                    return;
                }

                const { user } = useAuthStore.getState();
                if (!user) return;

                set({ isLoading: true });
                try {
                    // Use orderService to fetch, or direct client if needed.
                    // orderService.getByUser returns Supabase Order type, which might need mapping
                    // if it differs significantly from app Order type. 
                    // However, let's use direct client to match the store pattern and map it if needed.

                    const client = await getSupabaseClient();
                    const { data, error } = await client
                        .from('orders')
                        .select('*')
                        .eq('user_id', user.user_id)
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    // TODO: Improve mapping if Supabase types differ from Frontend types
                    // For now assuming 1:1 or close enough for what we need
                    const orders = data as unknown as Order[];

                    set({
                        orders,
                        activeOrdersCount: orders.filter(o =>
                            ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)
                        ).length,
                        isLoading: false
                    });
                } catch (error) {
                    console.error('Error fetching orders:', error);
                    set({ isLoading: false });
                }
            },

            updateOrderStatus: (orderId: string, status: Order['status']) => {
                const { orders } = get();
                const updatedOrders = orders.map(o =>
                    o.id === orderId ? { ...o, status } : o
                );

                set({
                    orders: updatedOrders,
                    activeOrdersCount: updatedOrders.filter(o =>
                        ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)
                    ).length
                });
            },

            subscribeToRealtime: (userId: string) => {
                realtimeService.subscribeToOrderUpdates(userId, (payload) => {
                    if (payload.eventType === 'UPDATE') {
                        // Handle Update
                        const updatedOrder = payload.new;
                        if (updatedOrder && updatedOrder.id) {
                            get().updateOrderStatus(updatedOrder.id, updatedOrder.status);
                        }
                    } else if (payload.eventType === 'INSERT') {
                        // Handle new order insert if we want to show it immediately
                        const newOrder = payload.new as unknown as Order;
                        const { orders } = get();
                        const updatedOrders = [newOrder, ...orders];
                        set({
                            orders: updatedOrders,
                            activeOrdersCount: updatedOrders.filter(o =>
                                ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)
                            ).length
                        });
                    }
                });
            },

            unsubscribeFromRealtime: () => {
                realtimeService.unsubscribeAll();
            },
        }),
        {
            name: 'order-storage',
            storage: createJSONStorage(() => zustandStorage),
            skipHydration: true,
        }
    )
);
