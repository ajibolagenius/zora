import { getSupabaseClient } from '../supabase';
import type { Vendor, VendorApplication, PaginationParams, PaginatedResponse } from '@zora/types';

export const vendorsService = {
    /**
     * Get all vendors with optional filters
     */
    async getAll(params?: PaginationParams & { category?: string; region?: string }): Promise<PaginatedResponse<Vendor>> {
        const supabase = getSupabaseClient();
        const { page = 1, limit = 20, category, region } = params || {};

        let query = supabase
            .from('vendors')
            .select('*', { count: 'exact' });

        if (category) {
            query = query.eq('category', category);
        }
        if (region) {
            query = query.contains('regions', [region]);
        }

        // Apply pagination
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
     * Get a single vendor by ID
     */
    async getById(id: string): Promise<Vendor | null> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('vendors')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get a single vendor by slug
     */
    async getBySlug(slug: string): Promise<Vendor | null> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('vendors')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get vendor by user ID
     */
    async getByUserId(userId: string): Promise<Vendor | null> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('vendors')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get featured vendors
     */
    async getFeatured(limit = 10): Promise<Vendor[]> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('vendors')
            .select('*')
            .eq('is_verified', true)
            .order('rating', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    /**
     * Update vendor profile (vendor only)
     */
    async update(id: string, updates: Partial<Vendor>): Promise<Vendor> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('vendors')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // ========== Vendor Applications (Admin) ==========

    /**
     * Get all vendor applications (admin only)
     */
    async getApplications(params?: PaginationParams & { status?: string }): Promise<PaginatedResponse<VendorApplication>> {
        const supabase = getSupabaseClient();
        const { page = 1, limit = 20, status } = params || {};

        let query = supabase
            .from('vendor_applications')
            .select('*', { count: 'exact' })
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

    /**
     * Submit vendor application
     */
    async submitApplication(application: Omit<VendorApplication, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<VendorApplication> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('vendor_applications')
            .insert({ ...application, status: 'pending' })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Approve vendor application (admin only)
     */
    async approveApplication(applicationId: string, adminId: string): Promise<void> {
        const supabase = getSupabaseClient();
        const { error } = await supabase
            .from('vendor_applications')
            .update({
                status: 'approved',
                reviewed_by: adminId,
                reviewed_at: new Date().toISOString(),
            })
            .eq('id', applicationId);

        if (error) throw error;
    },

    /**
     * Reject vendor application (admin only)
     */
    async rejectApplication(applicationId: string, adminId: string, reason: string): Promise<void> {
        const supabase = getSupabaseClient();
        const { error } = await supabase
            .from('vendor_applications')
            .update({
                status: 'rejected',
                reviewed_by: adminId,
                reviewed_at: new Date().toISOString(),
                rejection_reason: reason,
            })
            .eq('id', applicationId);

        if (error) throw error;
    },
};

export default vendorsService;
