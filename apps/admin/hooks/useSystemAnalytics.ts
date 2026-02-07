import { useQuery } from '@tanstack/react-query';
import { createSupabaseClient } from '@zora/api-client';
import { adminQueryKeys } from './useAdminData';

// =============================================================================
// System Analytics Hook
// =============================================================================

export interface SystemAnalytics {
    overview: {
        totalRevenue: number;
        totalOrders: number;
        activeCustomers: number;
        activeVendors: number;
        revenueChange: number;
        ordersChange: number;
        customersChange: number;
        vendorsChange: number;
    };
    recentActivity: Array<{
        type: 'order' | 'vendor' | 'review' | 'milestone';
        message: string;
        time: string;
    }>;
    topProducts: Array<{
        name: string;
        sales: number;
        revenue: number;
    }>;
    topVendors: Array<{
        name: string;
        orders: number;
        revenue: number;
    }>;
    regionStats: Array<{
        region: string;
        percentage: number;
        color: string;
    }>;
}

export function useSystemAnalytics(timeRange: string = '7d') {
    return useQuery({
        queryKey: [...adminQueryKeys.stats(), 'detailed', timeRange],
        queryFn: async (): Promise<SystemAnalytics> => {
            const supabase = createSupabaseClient();

            // 1. Fetch Overview Stats
            const { data: orders } = await supabase
                .from('orders')
                .select('total, created_at, status')
                .eq('status', 'delivered');

            const totalRevenue = orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
            const totalOrders = orders?.length || 0;

            const { count: activeCustomers } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'customer');

            const { count: activeVendors } = await supabase
                .from('vendors')
                .select('*', { count: 'exact', head: true })
                .eq('is_verified', true);

            // 2. Mock Complex Aggregations using Helper Function
            // In a real app, these would be RPC calls or detailed SQL queries
            // For now, we'll return structured data that matches the UI needs
            // derived mostly from real counts where possible

            return {
                overview: {
                    totalRevenue,
                    totalOrders,
                    activeCustomers: activeCustomers || 0,
                    activeVendors: activeVendors || 0,
                    revenueChange: 12.5, // Mocked for now
                    ordersChange: 8.2,
                    customersChange: 15.3,
                    vendorsChange: 5.1
                },
                recentActivity: [
                    { type: "order", message: "New order #ORD-4523 from Sarah J.", time: "2 min ago" },
                    { type: "vendor", message: "Lagos Kitchen joined the platform", time: "15 min ago" },
                    { type: "review", message: "5-star review on Jollof Spice Mix", time: "32 min ago" },
                    { type: "order", message: "Order #ORD-4522 delivered", time: "1 hour ago" },
                ],
                topProducts: [
                    { name: "Jollof Rice Spice Mix", sales: 1234, revenue: 7398.66 },
                    { name: "Suya Pepper Blend", sales: 987, revenue: 6400.63 },
                    { name: "Palm Oil (1L)", sales: 856, revenue: 7695.44 },
                    { name: "Egusi Seeds (500g)", sales: 743, revenue: 3707.57 },
                    { name: "Plantain Chips", sales: 698, revenue: 2436.02 },
                ],
                topVendors: [
                    { name: "African Spice House", orders: 456, revenue: 12345.67 },
                    { name: "Nigerian Delights", orders: 389, revenue: 10234.56 },
                    { name: "West African Foods", orders: 312, revenue: 8765.43 },
                    { name: "Lagos Street Food", orders: 287, revenue: 7654.32 },
                    { name: "Mama Africa Store", orders: 234, revenue: 6543.21 },
                ],
                regionStats: [
                    { region: "West Africa", percentage: 45, color: "bg-orange-500" },
                    { region: "East Africa", percentage: 25, color: "bg-green-500" },
                    { region: "North Africa", percentage: 15, color: "bg-blue-500" },
                    { region: "Southern Africa", percentage: 10, color: "bg-purple-500" },
                    { region: "Central Africa", percentage: 5, color: "bg-pink-500" },
                ]
            };
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
