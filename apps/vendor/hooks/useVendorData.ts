'use client';

/**
 * Vendor Data Hooks
 * TanStack Query hooks for vendor data fetching with real-time updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ordersService,
    productsService,
    createSupabaseClient,
} from '@zora/api-client';
import type { Order, Product, OrderStatus, OrderQueryParams } from '@zora/types';

// =============================================================================
// Query Keys
// =============================================================================

export const vendorQueryKeys = {
    all: ['vendor'] as const,
    orders: (vendorId: string) => [...vendorQueryKeys.all, 'orders', vendorId] as const,
    ordersList: (vendorId: string, params?: OrderQueryParams) =>
        [...vendorQueryKeys.orders(vendorId), 'list', params] as const,
    orderDetail: (orderId: string) => [...vendorQueryKeys.all, 'order', orderId] as const,
    products: (vendorId: string) => [...vendorQueryKeys.all, 'products', vendorId] as const,
    productDetail: (productId: string) => [...vendorQueryKeys.all, 'product', productId] as const,
    stats: (vendorId: string) => [...vendorQueryKeys.all, 'stats', vendorId] as const,
    recentOrders: (vendorId: string) => [...vendorQueryKeys.all, 'recentOrders', vendorId] as const,
};

// =============================================================================
// Stats Interface
// =============================================================================

interface VendorStats {
    todayOrders: number;
    todayRevenue: number;
    totalProducts: number;
    pendingOrders: number;
    weeklyOrders: number;
    weeklyRevenue: number;
    avgFulfillmentTime: string;
}

// =============================================================================
// Vendor Stats Hook
// =============================================================================

export function useVendorStats(vendorId: string | null) {
    return useQuery({
        queryKey: vendorQueryKeys.stats(vendorId || ''),
        queryFn: async (): Promise<VendorStats> => {
            if (!vendorId) throw new Error('No vendor ID');

            const supabase = createSupabaseClient();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayISO = today.toISOString();

            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const weekAgoISO = weekAgo.toISOString();

            // Fetch today's orders
            const { data: todayOrdersData, error: todayError } = await supabase
                .from('orders')
                .select('id, total, status')
                .eq('vendor_id', vendorId)
                .gte('created_at', todayISO);

            if (todayError) console.error('Error fetching today orders:', todayError);

            // Fetch weekly orders
            const { data: weeklyOrdersData, error: weeklyError } = await supabase
                .from('orders')
                .select('id, total, status, created_at, delivered_at')
                .eq('vendor_id', vendorId)
                .gte('created_at', weekAgoISO);

            if (weeklyError) console.error('Error fetching weekly orders:', weeklyError);

            // Fetch total products
            const { count: productCount, error: productError } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('vendor_id', vendorId);

            if (productError) console.error('Error fetching products:', productError);

            // Fetch pending orders count
            const { count: pendingCount, error: pendingError } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('vendor_id', vendorId)
                .in('status', ['pending', 'confirmed', 'preparing']);

            if (pendingError) console.error('Error fetching pending orders:', pendingError);

            // Calculate stats
            const todayOrders = todayOrdersData?.length || 0;
            const todayRevenue = todayOrdersData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
            const weeklyOrders = weeklyOrdersData?.length || 0;
            const weeklyRevenue = weeklyOrdersData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

            // Calculate average fulfillment time
            const deliveredOrders = weeklyOrdersData?.filter(
                (o) => o.status === 'delivered' && o.delivered_at && o.created_at
            ) || [];

            let avgFulfillmentTime = 'N/A';
            if (deliveredOrders.length > 0) {
                const totalMinutes = deliveredOrders.reduce((sum, o) => {
                    const created = new Date(o.created_at).getTime();
                    const delivered = new Date(o.delivered_at).getTime();
                    return sum + (delivered - created) / (1000 * 60);
                }, 0);
                const avgMinutes = totalMinutes / deliveredOrders.length;
                if (avgMinutes < 60) {
                    avgFulfillmentTime = `${Math.round(avgMinutes)}m`;
                } else {
                    avgFulfillmentTime = `${(avgMinutes / 60).toFixed(1)}h`;
                }
            }

            return {
                todayOrders,
                todayRevenue,
                totalProducts: productCount || 0,
                pendingOrders: pendingCount || 0,
                weeklyOrders,
                weeklyRevenue,
                avgFulfillmentTime,
            };
        },
        enabled: !!vendorId,
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 60 * 1000, // Refetch every minute
    });
}

// =============================================================================
// Recent Orders Hook
// =============================================================================

export function useRecentOrders(vendorId: string | null, limit = 5) {
    return useQuery({
        queryKey: vendorQueryKeys.recentOrders(vendorId || ''),
        queryFn: async (): Promise<Order[]> => {
            if (!vendorId) throw new Error('No vendor ID');

            const supabase = createSupabaseClient();
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    customer:profiles(id, full_name, email, avatar_url)
                `)
                .eq('vendor_id', vendorId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];
        },
        enabled: !!vendorId,
        staleTime: 10 * 1000, // 10 seconds
    });
}

// =============================================================================
// Vendor Orders Hook
// =============================================================================

export function useVendorOrders(vendorId: string | null, params?: OrderQueryParams) {
    return useQuery({
        queryKey: vendorQueryKeys.ordersList(vendorId || '', params),
        queryFn: async () => {
            if (!vendorId) throw new Error('No vendor ID');

            const supabase = createSupabaseClient();
            const { page = 1, limit = 20, status } = params || {};

            let query = supabase
                .from('orders')
                .select(`
                    *,
                    customer:profiles(id, full_name, email, avatar_url),
                    items:order_items(*, product:products(id, name, image_url))
                `, { count: 'exact' })
                .eq('vendor_id', vendorId)
                .order('created_at', { ascending: false });

            if (status) {
                query = query.eq('status', status);
            }

            const from = (page - 1) * limit;
            const to = from + limit - 1;
            query = query.range(from, to);

            const { data, error, count } = await query;

            if (error) throw error;

            return {
                data: data || [],
                total: count || 0,
                page,
                limit,
                hasMore: (count || 0) > page * limit,
            };
        },
        enabled: !!vendorId,
        staleTime: 10 * 1000,
    });
}

// =============================================================================
// Update Order Status Mutation
// =============================================================================

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            orderId,
            status,
        }: {
            orderId: string;
            status: OrderStatus;
        }) => {
            return ordersService.updateStatus(orderId, status);
        },
        onSuccess: (updatedOrder) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['vendor', 'orders'] });
            queryClient.invalidateQueries({ queryKey: ['vendor', 'recentOrders'] });
            queryClient.invalidateQueries({ queryKey: ['vendor', 'stats'] });
            queryClient.setQueryData(
                vendorQueryKeys.orderDetail(updatedOrder.id),
                updatedOrder
            );
        },
    });
}

// =============================================================================
// Vendor Products Hook
// =============================================================================

export function useVendorProducts(vendorId: string | null, params?: { page?: number; limit?: number; search?: string }) {
    return useQuery({
        queryKey: vendorQueryKeys.products(vendorId || ''),
        queryFn: async () => {
            if (!vendorId) throw new Error('No vendor ID');

            return productsService.getByVendor(vendorId, params);
        },
        enabled: !!vendorId,
        staleTime: 30 * 1000,
    });
}

// =============================================================================
// Product Mutations
// =============================================================================

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (product: Parameters<typeof productsService.create>[0]) => {
            return productsService.create(product);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor', 'products'] });
            queryClient.invalidateQueries({ queryKey: ['vendor', 'stats'] });
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (product: Parameters<typeof productsService.update>[0]) => {
            return productsService.update(product);
        },
        onSuccess: (updatedProduct) => {
            queryClient.invalidateQueries({ queryKey: ['vendor', 'products'] });
            queryClient.setQueryData(
                vendorQueryKeys.productDetail(updatedProduct.id),
                updatedProduct
            );
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string) => {
            return productsService.delete(productId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor', 'products'] });
            queryClient.invalidateQueries({ queryKey: ['vendor', 'stats'] });
        },
    });
}
