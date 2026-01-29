'use client';

/**
 * Admin Data Hooks
 * TanStack Query hooks for admin data fetching with real-time updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ordersService,
    productsService,
    vendorsService,
    createSupabaseClient,
} from '@zora/api-client';
import type { Order, Product, Vendor, VendorApplication, OrderStatus, OrderQueryParams } from '@zora/types';

// =============================================================================
// Query Keys
// =============================================================================

export const adminQueryKeys = {
    all: ['admin'] as const,
    stats: () => [...adminQueryKeys.all, 'stats'] as const,
    orders: () => [...adminQueryKeys.all, 'orders'] as const,
    ordersList: (params?: OrderQueryParams) => [...adminQueryKeys.orders(), 'list', params] as const,
    orderDetail: (orderId: string) => [...adminQueryKeys.all, 'order', orderId] as const,
    products: () => [...adminQueryKeys.all, 'products'] as const,
    vendors: () => [...adminQueryKeys.all, 'vendors'] as const,
    vendorApplications: () => [...adminQueryKeys.all, 'vendorApplications'] as const,
    customers: () => [...adminQueryKeys.all, 'customers'] as const,
    pendingItems: () => [...adminQueryKeys.all, 'pendingItems'] as const,
    recentOrders: () => [...adminQueryKeys.all, 'recentOrders'] as const,
};

// =============================================================================
// Stats Interface
// =============================================================================

interface AdminStats {
    totalOrders: number;
    totalRevenue: number;
    activeVendors: number;
    totalCustomers: number;
    ordersChange: number;
    revenueChange: number;
    vendorsChange: number;
    customersChange: number;
}

interface PendingItems {
    vendorApplications: number;
    pendingReviews: number;
    refundRequests: number;
    openEmails: number;
}

// =============================================================================
// Admin Stats Hook
// =============================================================================

export function useAdminStats() {
    return useQuery({
        queryKey: adminQueryKeys.stats(),
        queryFn: async (): Promise<AdminStats> => {
            const supabase = createSupabaseClient();

            // Fetch total orders
            const { count: totalOrders } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true });

            // Fetch total revenue
            const { data: revenueData } = await supabase
                .from('orders')
                .select('total')
                .eq('status', 'delivered');

            const totalRevenue = revenueData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

            // Fetch active vendors
            const { count: activeVendors } = await supabase
                .from('vendors')
                .select('*', { count: 'exact', head: true })
                .eq('is_verified', true);

            // Fetch total customers
            const { count: totalCustomers } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'customer');

            return {
                totalOrders: totalOrders || 0,
                totalRevenue,
                activeVendors: activeVendors || 0,
                totalCustomers: totalCustomers || 0,
                ordersChange: 12, // Would calculate from historical data
                revenueChange: 8,
                vendorsChange: 5,
                customersChange: 15,
            };
        },
        staleTime: 60 * 1000, // 1 minute
        refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    });
}

// =============================================================================
// Pending Items Hook
// =============================================================================

export function usePendingItems() {
    return useQuery({
        queryKey: adminQueryKeys.pendingItems(),
        queryFn: async (): Promise<PendingItems> => {
            const supabase = createSupabaseClient();

            // Fetch pending vendor applications
            const { count: vendorApplications } = await supabase
                .from('vendor_applications')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');

            // Fetch pending reviews (reviews that need moderation)
            const { count: pendingReviews } = await supabase
                .from('reviews')
                .select('*', { count: 'exact', head: true })
                .eq('is_approved', false);

            // Fetch refund requests (orders with refund status)
            const { count: refundRequests } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('payment_status', 'refund_requested');

            // Fetch open email threads
            const { count: openEmails } = await supabase
                .from('email_threads')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'open');

            return {
                vendorApplications: vendorApplications || 0,
                pendingReviews: pendingReviews || 0,
                refundRequests: refundRequests || 0,
                openEmails: openEmails || 0,
            };
        },
        staleTime: 30 * 1000, // 30 seconds
    });
}

// =============================================================================
// Recent Orders Hook
// =============================================================================

interface OrderWithDetails extends Order {
    customer?: {
        id: string;
        full_name: string;
        email: string;
    };
    vendor?: {
        id: string;
        shop_name: string;
    };
}

export function useRecentOrders(limit = 5) {
    return useQuery({
        queryKey: adminQueryKeys.recentOrders(),
        queryFn: async (): Promise<OrderWithDetails[]> => {
            const supabase = createSupabaseClient();
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    customer:profiles(id, full_name, email),
                    vendor:vendors(id, shop_name)
                `)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];
        },
        staleTime: 10 * 1000, // 10 seconds
    });
}

// =============================================================================
// Vendor Applications Hook
// =============================================================================

export function useVendorApplications(status?: string) {
    return useQuery({
        queryKey: [...adminQueryKeys.vendorApplications(), status],
        queryFn: async () => {
            return vendorsService.getApplications({ status, limit: 50 });
        },
        staleTime: 30 * 1000,
    });
}

// =============================================================================
// All Orders Hook (Admin)
// =============================================================================

export function useAllOrders(params?: OrderQueryParams) {
    return useQuery({
        queryKey: adminQueryKeys.ordersList(params),
        queryFn: async () => {
            const supabase = createSupabaseClient();
            const { page = 1, limit = 20, status } = params || {};

            let query = supabase
                .from('orders')
                .select(`
                    *,
                    customer:profiles(id, full_name, email, avatar_url),
                    vendor:vendors(id, shop_name),
                    items:order_items(*, product:products(id, name, image_url))
                `, { count: 'exact' })
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
        staleTime: 10 * 1000,
    });
}

// =============================================================================
// All Vendors Hook (Admin)
// =============================================================================

export function useAllVendors() {
    return useQuery({
        queryKey: adminQueryKeys.vendors(),
        queryFn: async () => {
            return vendorsService.getAll({ limit: 100 });
        },
        staleTime: 60 * 1000,
    });
}

// =============================================================================
// All Products Hook (Admin)
// =============================================================================

export function useAllProducts(params?: { page?: number; limit?: number }) {
    return useQuery({
        queryKey: adminQueryKeys.products(),
        queryFn: async () => {
            return productsService.getAll(params);
        },
        staleTime: 60 * 1000,
    });
}

// =============================================================================
// Update Order Status Mutation (Admin)
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'recentOrders'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
        },
    });
}

// =============================================================================
// Vendor Application Mutations (Admin)
// =============================================================================

export function useApproveVendorApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            applicationId,
            adminId,
        }: {
            applicationId: string;
            adminId: string;
        }) => {
            return vendorsService.approveApplication(applicationId, adminId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'vendorApplications'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'pendingItems'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'vendors'] });
        },
    });
}

export function useRejectVendorApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            applicationId,
            adminId,
            reason,
        }: {
            applicationId: string;
            adminId: string;
            reason: string;
        }) => {
            return vendorsService.rejectApplication(applicationId, adminId, reason);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'vendorApplications'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'pendingItems'] });
        },
    });
}
