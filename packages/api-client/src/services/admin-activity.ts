/**
 * Admin Activity Service
 * Service for logging and retrieving admin activity
 */

import { getSupabaseClient } from '../supabase';
import type {
    AdminActivityLog,
    AdminActionCategory,
    LogAdminActivityInput,
} from '@zora/types';
import type { PaginatedResponse, PaginationParams } from '@zora/types';

export interface AdminActivityQueryParams extends PaginationParams {
    adminId?: string;
    actionCategory?: AdminActionCategory;
    entityType?: string;
    entityId?: string;
    startDate?: string;
    endDate?: string;
}

export const adminActivityService = {
    /**
     * Log an admin activity
     */
    async log(data: LogAdminActivityInput): Promise<AdminActivityLog> {
        const supabase = getSupabaseClient();

        const { data: log, error } = await supabase
            .from('admin_activity_log')
            .insert({
                admin_id: data.admin_id,
                admin_email: data.admin_email,
                action: data.action,
                action_category: data.action_category,
                entity_type: data.entity_type,
                entity_id: data.entity_id,
                entity_identifier: data.entity_identifier,
                details: data.details || {},
                ip_address: data.ip_address,
                user_agent: data.user_agent,
            })
            .select()
            .single();

        if (error) throw error;
        return log;
    },

    /**
     * Log activity with current user context
     */
    async logWithContext(
        action: string,
        actionCategory: AdminActionCategory,
        entityType: string,
        options?: {
            entityId?: string;
            entityIdentifier?: string;
            details?: Record<string, unknown>;
        }
    ): Promise<AdminActivityLog> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        return this.log({
            admin_id: user.id,
            admin_email: user.email || 'unknown',
            action,
            action_category: actionCategory,
            entity_type: entityType,
            entity_id: options?.entityId,
            entity_identifier: options?.entityIdentifier,
            details: options?.details,
        });
    },

    /**
     * Get activity log with filters
     */
    async getActivity(params?: AdminActivityQueryParams): Promise<PaginatedResponse<AdminActivityLog>> {
        const supabase = getSupabaseClient();
        const {
            page = 1,
            limit = 50,
            adminId,
            actionCategory,
            entityType,
            entityId,
            startDate,
            endDate,
        } = params || {};

        let query = supabase
            .from('admin_activity_log')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        if (adminId) query = query.eq('admin_id', adminId);
        if (actionCategory) query = query.eq('action_category', actionCategory);
        if (entityType) query = query.eq('entity_type', entityType);
        if (entityId) query = query.eq('entity_id', entityId);
        if (startDate) query = query.gte('created_at', startDate);
        if (endDate) query = query.lte('created_at', endDate);

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
     * Get activity for a specific entity
     */
    async getByEntity(entityType: string, entityId: string): Promise<AdminActivityLog[]> {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('admin_activity_log')
            .select('*')
            .eq('entity_type', entityType)
            .eq('entity_id', entityId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get recent activity for an admin
     */
    async getByAdmin(adminId: string, limit: number = 20): Promise<AdminActivityLog[]> {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('admin_activity_log')
            .select('*')
            .eq('admin_id', adminId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    /**
     * Get activity counts by category for a time period
     */
    async getCountsByCategory(startDate: string, endDate: string): Promise<Record<AdminActionCategory, number>> {
        const supabase = getSupabaseClient();

        const categories: AdminActionCategory[] = [
            'order', 'vendor', 'customer', 'product', 'review', 'refund', 'settings', 'user', 'other'
        ];

        const counts: Record<string, number> = {};

        for (const category of categories) {
            const { count, error } = await supabase
                .from('admin_activity_log')
                .select('*', { count: 'exact', head: true })
                .eq('action_category', category)
                .gte('created_at', startDate)
                .lte('created_at', endDate);

            if (error) throw error;
            counts[category] = count || 0;
        }

        return counts as Record<AdminActionCategory, number>;
    },

    /**
     * Get daily activity counts for dashboard
     */
    async getDailyActivityCounts(days: number = 7): Promise<{ date: string; count: number }[]> {
        const supabase = getSupabaseClient();
        const results: { date: string; count: number }[] = [];

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0)).toISOString();
            const endOfDay = new Date(date.setHours(23, 59, 59, 999)).toISOString();

            const { count, error } = await supabase
                .from('admin_activity_log')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', startOfDay)
                .lte('created_at', endOfDay);

            if (error) throw error;

            results.push({
                date: startOfDay.split('T')[0],
                count: count || 0,
            });
        }

        return results.reverse();
    },

    // ==================== Helper methods for common actions ====================

    /**
     * Log order status change
     */
    async logOrderStatusChange(
        orderId: string,
        orderNumber: string,
        previousStatus: string,
        newStatus: string
    ): Promise<AdminActivityLog> {
        return this.logWithContext(
            'order.status_changed',
            'order',
            'order',
            {
                entityId: orderId,
                entityIdentifier: orderNumber,
                details: {
                    previous_value: previousStatus,
                    new_value: newStatus,
                },
            }
        );
    },

    /**
     * Log vendor approval
     */
    async logVendorApproval(
        vendorId: string,
        vendorName: string,
        approved: boolean,
        reason?: string
    ): Promise<AdminActivityLog> {
        return this.logWithContext(
            approved ? 'vendor.approved' : 'vendor.rejected',
            'vendor',
            'vendor',
            {
                entityId: vendorId,
                entityIdentifier: vendorName,
                details: {
                    approved,
                    reason,
                },
            }
        );
    },

    /**
     * Log refund processed
     */
    async logRefundProcessed(
        orderId: string,
        orderNumber: string,
        amount: number,
        reason: string
    ): Promise<AdminActivityLog> {
        return this.logWithContext(
            'refund.processed',
            'refund',
            'order',
            {
                entityId: orderId,
                entityIdentifier: orderNumber,
                details: {
                    amount,
                    reason,
                },
            }
        );
    },

    /**
     * Log product moderation
     */
    async logProductModeration(
        productId: string,
        productName: string,
        action: 'approved' | 'rejected' | 'flagged',
        reason?: string
    ): Promise<AdminActivityLog> {
        return this.logWithContext(
            `product.${action}`,
            'product',
            'product',
            {
                entityId: productId,
                entityIdentifier: productName,
                details: {
                    action,
                    reason,
                },
            }
        );
    },
};

export default adminActivityService;
