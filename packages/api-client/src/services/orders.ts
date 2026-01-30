import { getSupabaseClient } from '../supabase';
import type { Order, CreateOrderInput, OrderQueryParams, PaginatedResponse, OrderStatus } from '@zora/types';

export const ordersService = {
    /**
     * Get orders for the current user
     */
    async getMyOrders(params?: OrderQueryParams): Promise<PaginatedResponse<Order>> {
        const supabase = getSupabaseClient();
        const { page = 1, limit = 20, status, startDate, endDate } = params || {};

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        let query = supabase
            .from('orders')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }
        if (startDate) {
            query = query.gte('created_at', startDate);
        }
        if (endDate) {
            query = query.lte('created_at', endDate);
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

    /**
     * Get a single order by ID
     */
    async getById(id: string): Promise<Order | null> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get order by order number
     */
    async getByOrderNumber(orderNumber: string): Promise<Order | null> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('order_number', orderNumber)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Create a new order
     */
    async create(order: CreateOrderInput): Promise<Order> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('orders')
            .insert({
                ...order,
                user_id: user.id,
                status: 'pending',
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Cancel an order
     */
    async cancel(id: string): Promise<Order> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // ========== Vendor Methods ==========

    /**
     * Get orders for a vendor
     */
    async getVendorOrders(vendorId: string, params?: OrderQueryParams): Promise<PaginatedResponse<Order>> {
        const supabase = getSupabaseClient();
        const { page = 1, limit = 20, status, startDate, endDate } = params || {};

        // Note: This assumes orders contain vendor_id or we need to join with order_items
        let query = supabase
            .from('orders')
            .select('*', { count: 'exact' })
            .contains('items', [{ vendor_id: vendorId }])
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }
        if (startDate) {
            query = query.gte('created_at', startDate);
        }
        if (endDate) {
            query = query.lte('created_at', endDate);
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

    /**
     * Update order status (vendor/admin)
     */
    async updateStatus(id: string, status: OrderStatus): Promise<Order> {
        const supabase = getSupabaseClient();
        const updates: Partial<Order> = { status };

        if (status === 'delivered') {
            updates.actual_delivery = new Date().toISOString();
        }

        const { data, error } = await supabase
            .from('orders')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // ========== Admin Methods ==========

    /**
     * Get all orders (admin only)
     */
    async getAllOrders(params?: OrderQueryParams): Promise<PaginatedResponse<Order>> {
        const supabase = getSupabaseClient();
        const { page = 1, limit = 20, status, startDate, endDate } = params || {};

        let query = supabase
            .from('orders')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }
        if (startDate) {
            query = query.gte('created_at', startDate);
        }
        if (endDate) {
            query = query.lte('created_at', endDate);
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

    /**
     * Process refund (admin only)
     */
    async processRefund(orderId: string, amount?: number): Promise<Order> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('orders')
            .update({ status: 'refunded' })
            .eq('id', orderId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },
};

export default ordersService;
