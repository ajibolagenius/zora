import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

export interface VendorAnalytics {
    revenue: {
        total: number;
        thisMonth: number;
        lastMonth: number;
        change: number;
        changePercent: number;
    };
    orders: {
        total: number;
        thisMonth: number;
        lastMonth: number;
        change: number;
        changePercent: number;
        pending: number;
        processing: number;
        completed: number;
        cancelled: number;
    };
    products: {
        total: number;
        active: number;
        outOfStock: number;
        lowStock: number;
        topSelling: Array<{
            id: string;
            name: string;
            sales: number;
            revenue: number;
            rating: number;
        }>;
    };
    customers: {
        total: number;
        new: number;
        returning: number;
        averageOrderValue: number;
        retentionRate: number;
    };
    performance: {
        averageRating: number;
        totalReviews: number;
        responseTime: number;
        fulfillmentRate: number;
        onTimeDelivery: number;
    };
    insights: {
        bestSellingCategory: string;
        peakHours: string[];
        growthOpportunities: string[];
        customerSatisfaction: 'excellent' | 'good' | 'average' | 'poor';
    };
}

export interface AnalyticsFilters {
    startDate?: string;
    endDate?: string;
    category?: string;
    status?: 'pending' | 'processing' | 'completed' | 'cancelled';
}

export class VendorAnalyticsService {
    /**
     * Get comprehensive analytics for a vendor
     */
    static async getVendorAnalytics(vendorId: string, filters?: AnalyticsFilters): Promise<VendorAnalytics> {
        try {
            const startDate = filters?.startDate || this.getDateRange('month').start;
            const endDate = filters?.endDate || this.getDateRange('month').end;

            // Get revenue data
            const revenueData = await this.getRevenueAnalytics(vendorId, startDate, endDate);

            // Get order data
            const orderData = await this.getOrderAnalytics(vendorId, startDate, endDate);

            // Get product data
            const productData = await this.getProductAnalytics(vendorId, startDate, endDate);

            // Get customer data
            const customerData = await this.getCustomerAnalytics(vendorId, startDate, endDate);

            // Get performance data
            const performanceData = await this.getPerformanceAnalytics(vendorId, startDate, endDate);

            // Generate insights
            const insights = await this.generateInsights(vendorId, revenueData, orderData, productData);

            return {
                revenue: revenueData,
                orders: orderData,
                products: productData,
                customers: customerData,
                performance: performanceData,
                insights,
            };
        } catch (error) {
            console.error('Error fetching vendor analytics:', error);
            throw error;
        }
    }

    /**
     * Get revenue analytics
     */
    private static async getRevenueAnalytics(
        vendorId: string,
        startDate: string,
        endDate: string
    ): Promise<VendorAnalytics['revenue']> {
        const { data: orders } = await supabase
            .from('orders')
            .select('total, created_at')
            .eq('vendor_id', vendorId)
            .eq('status', 'completed')
            .gte('created_at', startDate)
            .lte('created_at', endDate)
            .order('created_at', { ascending: true });

        const thisMonthRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

        // Get last month for comparison
        const lastMonthRange = this.getDateRange('lastMonth');
        const { data: lastMonthOrders } = await supabase
            .from('orders')
            .select('total')
            .eq('vendor_id', vendorId)
            .eq('status', 'completed')
            .gte('created_at', lastMonthRange.start)
            .lte('created_at', lastMonthRange.end);

        const lastMonthRevenue = lastMonthOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

        const change = thisMonthRevenue - lastMonthRevenue;
        const changePercent = lastMonthRevenue > 0 ? (change / lastMonthRevenue) * 100 : 0;

        // Get total revenue all time
        const { data: allTimeOrders } = await supabase
            .from('orders')
            .select('total')
            .eq('vendor_id', vendorId)
            .eq('status', 'completed');

        const totalRevenue = allTimeOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

        return {
            total: totalRevenue,
            thisMonth: thisMonthRevenue,
            lastMonth: lastMonthRevenue,
            change,
            changePercent,
        };
    }

    /**
     * Get order analytics
     */
    private static async getOrderAnalytics(
        vendorId: string,
        startDate: string,
        endDate: string
    ): Promise<VendorAnalytics['orders']> {
        // Get orders by status
        const { data: orders } = await supabase
            .from('orders')
            .select('status, total, created_at')
            .eq('vendor_id', vendorId)
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        const statusCounts = orders?.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>) || {};

        // Get this month orders
        const thisMonthOrders = orders?.filter(order =>
            new Date(order.created_at) >= new Date(startDate)
        ).length || 0;

        // Get last month orders for comparison
        const lastMonthRange = this.getDateRange('lastMonth');
        const { data: lastMonthOrders } = await supabase
            .from('orders')
            .select('id')
            .eq('vendor_id', vendorId)
            .gte('created_at', lastMonthRange.start)
            .lte('created_at', lastMonthRange.end);

        const lastMonthCount = lastMonthOrders?.length || 0;
        const change = thisMonthOrders - lastMonthCount;
        const changePercent = lastMonthCount > 0 ? (change / lastMonthCount) * 100 : 0;

        return {
            total: orders?.length || 0,
            thisMonth: thisMonthOrders,
            lastMonth: lastMonthCount,
            change,
            changePercent,
            pending: statusCounts.pending || 0,
            processing: statusCounts.processing || 0,
            completed: statusCounts.completed || 0,
            cancelled: statusCounts.cancelled || 0,
        };
    }

    /**
     * Get product analytics
     */
    private static async getProductAnalytics(
        vendorId: string,
        startDate: string,
        endDate: string
    ): Promise<VendorAnalytics['products']> {
        // Get all products for vendor
        const { data: products } = await supabase
            .from('products')
            .select('*')
            .eq('vendor_id', vendorId);

        const totalProducts = products?.length || 0;
        const activeProducts = products?.filter(p => p.is_active).length || 0;
        const outOfStock = products?.filter(p => !p.in_stock || p.stock_quantity === 0).length || 0;
        const lowStock = products?.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5).length || 0;

        // Get top selling products
        const { data: orderItems } = await supabase
            .from('order_items')
            .select(`
        product_id,
        quantity,
        price,
        products!inner(name, rating, category)
      `)
            .eq('vendor_id', vendorId)
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        const productSales = orderItems?.reduce((acc, item) => {
            const productId = item.product_id;
            if (!acc[productId]) {
                acc[productId] = {
                    id: productId,
                    name: item.products.name,
                    category: item.products.category,
                    sales: 0,
                    revenue: 0,
                    rating: item.products.rating || 0,
                };
            }
            acc[productId].sales += item.quantity;
            acc[productId].revenue += item.price * item.quantity;
            return acc;
        }, {} as Record<string, any>) || {};

        const topSelling = Object.values(productSales)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);

        return {
            total: totalProducts,
            active: activeProducts,
            outOfStock,
            lowStock,
            topSelling,
        };
    }

    /**
     * Get customer analytics
     */
    private static async getCustomerAnalytics(
        vendorId: string,
        startDate: string,
        endDate: string
    ): Promise<VendorAnalytics['customers']> {
        // Get orders within range to identify active customers
        const { data: orders } = await supabase
            .from('orders')
            .select('user_id, total, created_at')
            .eq('vendor_id', vendorId)
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        const uniqueCustomers = [...new Set(orders?.map(o => o.user_id) || [])];
        const totalCustomers = uniqueCustomers.length;

        // Check if these customers are truly new (first order ever within last 30 days)
        // irrespective of the current filter range
        let newCustomers = 0;

        if (uniqueCustomers.length > 0) {
            // For each customer in the current view, find their absolute first order date
            const { data: firstOrders } = await supabase
                .from('orders')
                .select('user_id, created_at')
                .eq('vendor_id', vendorId)
                .in('user_id', uniqueCustomers)
                .order('created_at', { ascending: true });

            // Map customer to their first order date
            const firstOrderMap = new Map<string, string>();
            firstOrders?.forEach(order => {
                if (!firstOrderMap.has(order.user_id)) {
                    firstOrderMap.set(order.user_id, order.created_at);
                }
            });

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            newCustomers = uniqueCustomers.filter(customerId => {
                const firstOrderDate = firstOrderMap.get(customerId);
                return firstOrderDate && new Date(firstOrderDate) >= thirtyDaysAgo;
            }).length;
        }

        const returningCustomers = totalCustomers - newCustomers;

        // Calculate average order value (AOV = total revenue / total orders)
        const totalOrders = orders?.length || 0;
        const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Calculate retention rate (simplified)
        const retentionRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0;

        return {
            total: totalCustomers,
            new: newCustomers,
            returning: returningCustomers,
            averageOrderValue,
            retentionRate,
        };
    }

    /**
     * Get performance analytics
     */
    private static async getPerformanceAnalytics(
        vendorId: string,
        startDate: string,
        endDate: string
    ): Promise<VendorAnalytics['performance']> {
        // Get reviews
        const { data: reviews } = await supabase
            .from('reviews')
            .select('rating, created_at')
            .eq('vendor_id', vendorId);

        const totalReviews = reviews?.length || 0;
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0;

        // Get response time (mock data for now)
        const responseTime = 2.5; // hours

        // Calculate fulfillment rate
        const { data: orders } = await supabase
            .from('orders')
            .select('status')
            .eq('vendor_id', vendorId)
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
        const totalOrders = orders?.length || 0;
        const fulfillmentRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

        // On-time delivery rate (mock data)
        const onTimeDelivery = 92; // percentage

        return {
            averageRating,
            totalReviews,
            responseTime,
            fulfillmentRate,
            onTimeDelivery,
        };
    }

    /**
     * Generate business insights
     */
    private static async generateInsights(
        vendorId: string,
        revenueData: VendorAnalytics['revenue'],
        orderData: VendorAnalytics['orders'],
        productData: VendorAnalytics['products']
    ): Promise<VendorAnalytics['insights']> {
        // Find best selling category
        const bestSellingProduct = productData.topSelling[0];
        // Now using actual category fetched from product
        const bestSellingCategory = (bestSellingProduct as any)?.category || 'General';

        // Determine peak hours (mock data for now)
        const peakHours = ['10:00 AM', '2:00 PM', '7:00 PM'];

        // Growth opportunities based on data
        const growthOpportunities = [];

        if (productData.lowStock > 0) {
            growthOpportunities.push('Restock low inventory items');
        }

        if (orderData.cancelled > orderData.completed * 0.1) {
            growthOpportunities.push('Improve order fulfillment process');
        }

        if (revenueData.changePercent > 20) {
            growthOpportunities.push('Scale up marketing efforts');
        }

        // Customer satisfaction based on performance
        const customerSatisfaction = this.calculateCustomerSatisfaction(orderData);

        return {
            bestSellingCategory,
            peakHours,
            growthOpportunities,
            customerSatisfaction,
        };
    }

    /**
     * Calculate customer satisfaction rating
     */
    private static calculateCustomerSatisfaction(orderData: VendorAnalytics['orders']): VendorAnalytics['insights']['customerSatisfaction'] {
        const completionRate = orderData.total > 0 ? (orderData.completed / orderData.total) * 100 : 0;

        if (completionRate >= 95) return 'excellent';
        if (completionRate >= 85) return 'good';
        if (completionRate >= 70) return 'average';
        return 'poor';
    }

    /**
     * Get date range for analytics
     */
    private static getDateRange(range: 'month' | 'lastMonth'): { start: string; end: string } {
        const now = new Date();
        const end = now.toISOString();

        if (range === 'month') {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            return { start: start.toISOString(), end };
        } else {
            const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            return { start: start.toISOString(), end: endOfLastMonth.toISOString() };
        }
    }

    /**
     * Export analytics data
     */
    static async exportAnalytics(vendorId: string, format: 'csv' | 'json' = 'csv'): Promise<string> {
        const analytics = await this.getVendorAnalytics(vendorId);

        if (format === 'json') {
            return JSON.stringify(analytics, null, 2);
        }

        // CSV format
        const csvRows = [
            ['Metric', 'Value'],
            ['Total Revenue', analytics.revenue.total.toString()],
            ['This Month Revenue', analytics.revenue.thisMonth.toString()],
            ['Total Orders', analytics.orders.total.toString()],
            ['Total Customers', analytics.customers.total.toString()],
            ['Average Rating', analytics.performance.averageRating.toString()],
            ['Fulfillment Rate', analytics.performance.fulfillmentRate.toString()],
        ];

        return csvRows.map(row => row.join(',')).join('\n');
    }
}
