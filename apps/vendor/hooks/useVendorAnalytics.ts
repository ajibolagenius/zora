import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VendorAnalyticsService, type VendorAnalytics, type AnalyticsFilters } from '../services/analyticsService';
import { useAuthStore } from '../stores/authStore';

export function useVendorAnalytics(vendorId?: string, filters?: AnalyticsFilters) {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    const {
        data: analytics,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['vendor-analytics', vendorId, JSON.stringify(filters)],
        queryFn: () => {
            if (!vendorId) throw new Error('Vendor ID is required');
            return VendorAnalyticsService.getVendorAnalytics(vendorId, filters);
        },
        enabled: !!vendorId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Export analytics mutation
    const exportAnalytics = useMutation({
        mutationFn: async (format: 'csv' | 'json' = 'csv') => {
            if (!vendorId) throw new Error('Vendor ID is required');
            return VendorAnalyticsService.exportAnalytics(vendorId, format);
        },
        onSuccess: (data, format) => {
            // For React Native, we'll just return the data
            // The UI component will handle the actual download/share
            console.log(`Analytics exported as ${format}:`, data);
        },
    });

    // Refresh analytics
    const refreshAnalytics = useCallback(() => {
        refetch();
    }, [refetch]);

    // Update filters
    const updateFilters = useCallback((newFilters: AnalyticsFilters) => {
        queryClient.invalidateQueries({
            queryKey: ['vendor-analytics', vendorId, newFilters]
        });
    }, [queryClient, vendorId]);

    return {
        analytics,
        isLoading,
        error,
        refreshAnalytics,
        updateFilters,
        exportAnalytics: exportAnalytics.mutate,
        isExporting: exportAnalytics.isPending,
    };
}

// Hook for analytics filters management
export function useAnalyticsFilters() {
    const [filters, setFilters] = useState<AnalyticsFilters>({});

    const updateFilter = useCallback((key: keyof AnalyticsFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({});
    }, []);

    const setDateRange = useCallback((range: 'today' | 'week' | 'month' | 'quarter' | 'year') => {
        const now = new Date();
        let startDate: string;
        let endDate: string = now.toISOString();

        switch (range) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
                break;
            case 'quarter':
                const quarterStart = Math.floor(now.getMonth() / 3) * 3;
                startDate = new Date(now.getFullYear(), quarterStart, 1).toISOString();
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1).toISOString();
                break;
        }

        setFilters(prev => ({ ...prev, startDate, endDate }));
    }, []);

    return {
        filters,
        updateFilter,
        clearFilters,
        setDateRange,
    };
}

// Hook for real-time analytics updates
export function useRealTimeAnalytics(vendorId?: string) {
    const [realTimeData, setRealTimeData] = useState({
        activeOrders: 0,
        todayRevenue: 0,
        onlineCustomers: 0,
    });

    useEffect(() => {
        if (!vendorId) return;

        // Simulate real-time updates (in production, this would use WebSocket)
        const interval = setInterval(() => {
            setRealTimeData(prev => ({
                activeOrders: Math.max(0, Math.floor(prev.activeOrders + (Math.random() > 0.5 ? 1 : 0))),
                todayRevenue: Math.floor(prev.todayRevenue + (Math.random() * 50)),
                onlineCustomers: Math.max(0, Math.floor(prev.onlineCustomers + (Math.random() > 0.3 ? 1 : 0))),
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, [vendorId]);

    return realTimeData;
}
