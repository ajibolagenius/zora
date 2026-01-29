/**
 * Vendor Applications Service
 * Service for managing vendor application workflow
 */

import { getSupabaseClient } from '../supabase';
import type {
    VendorApplication,
    VendorApplicationStatus,
    VendorApplicationStatusHistory,
    CreateVendorApplicationInput,
    UpdateVendorApplicationInput,
} from '@zora/types';
import type { PaginatedResponse, PaginationParams } from '@zora/types';

export interface VendorApplicationQueryParams extends PaginationParams {
    status?: VendorApplicationStatus;
    search?: string;
}

export const vendorApplicationsService = {
    /**
     * Submit a new vendor application
     */
    async submit(data: CreateVendorApplicationInput): Promise<VendorApplication> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { data: application, error } = await supabase
            .from('vendor_applications')
            .insert({
                ...data,
                user_id: user?.id,
                status: 'pending',
                country: data.postcode ? 'United Kingdom' : 'United Kingdom',
                documents: {},
                bank_details: {},
                coverage_areas: data.coverage_areas || [],
                product_categories: data.product_categories || [],
                submitted_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw error;
        return application;
    },

    /**
     * Get application by ID
     */
    async getById(id: string): Promise<VendorApplication | null> {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('vendor_applications')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Get application by user ID
     */
    async getByUserId(userId: string): Promise<VendorApplication | null> {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('vendor_applications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Get current user's application
     */
    async getMyApplication(): Promise<VendorApplication | null> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return null;

        return this.getByUserId(user.id);
    },

    /**
     * Get all applications (admin only)
     */
    async getAll(params?: VendorApplicationQueryParams): Promise<PaginatedResponse<VendorApplication>> {
        const supabase = getSupabaseClient();
        const { page = 1, limit = 20, status, search } = params || {};

        let query = supabase
            .from('vendor_applications')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        if (search) {
            query = query.or(`business_name.ilike.%${search}%,email.ilike.%${search}%,contact_name.ilike.%${search}%`);
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
     * Get pending applications count (admin)
     */
    async getPendingCount(): Promise<number> {
        const supabase = getSupabaseClient();

        const { count, error } = await supabase
            .from('vendor_applications')
            .select('*', { count: 'exact', head: true })
            .in('status', ['pending', 'under_review']);

        if (error) throw error;
        return count || 0;
    },

    /**
     * Update application (user can only update pending applications)
     */
    async update(id: string, data: Partial<CreateVendorApplicationInput>): Promise<VendorApplication> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        // Verify ownership and status
        const { data: existing, error: fetchError } = await supabase
            .from('vendor_applications')
            .select('user_id, status')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;
        if (existing.user_id !== user.id) throw new Error('Not authorized');
        if (existing.status !== 'pending' && existing.status !== 'documents_required') {
            throw new Error('Application cannot be modified in current status');
        }

        const { data: application, error } = await supabase
            .from('vendor_applications')
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return application;
    },

    /**
     * Update application status (admin only)
     */
    async updateStatus(
        id: string,
        status: VendorApplicationStatus,
        options?: {
            rejectionReason?: string;
            internalNotes?: string;
        }
    ): Promise<VendorApplication> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        const updateData: Record<string, unknown> = {
            status,
            reviewed_by: user.id,
            reviewed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        if (options?.rejectionReason) {
            updateData.rejection_reason = options.rejectionReason;
        }

        if (options?.internalNotes) {
            updateData.internal_notes = options.internalNotes;
        }

        const { data: application, error } = await supabase
            .from('vendor_applications')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // If approved, create the vendor record
        if (status === 'approved') {
            await this.createVendorFromApplication(application);
        }

        return application;
    },

    /**
     * Get status history for an application
     */
    async getStatusHistory(applicationId: string): Promise<VendorApplicationStatusHistory[]> {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('vendor_application_status_history')
            .select('*')
            .eq('application_id', applicationId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Upload document for application
     */
    async uploadDocument(
        applicationId: string,
        documentType: string,
        file: File
    ): Promise<string> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        const fileExt = file.name.split('.').pop();
        const fileName = `${applicationId}/${documentType}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('vendor-documents')
            .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('vendor-documents')
            .getPublicUrl(fileName);

        // Update application documents
        const { data: application } = await supabase
            .from('vendor_applications')
            .select('documents')
            .eq('id', applicationId)
            .single();

        const documents = {
            ...(application?.documents || {}),
            [documentType]: urlData.publicUrl,
        };

        await supabase
            .from('vendor_applications')
            .update({ documents, updated_at: new Date().toISOString() })
            .eq('id', applicationId);

        return urlData.publicUrl;
    },

    /**
     * Create vendor record from approved application (internal)
     */
    async createVendorFromApplication(application: VendorApplication): Promise<void> {
        const supabase = getSupabaseClient();

        if (!application.user_id) {
            throw new Error('Application must have a user_id to create vendor');
        }

        // Generate slug from business name
        const slug = application.business_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        const { error } = await supabase
            .from('vendors')
            .insert({
                user_id: application.user_id,
                shop_name: application.business_name,
                slug: slug,
                description: application.description,
                address: `${application.address_line_1}${application.address_line_2 ? ', ' + application.address_line_2 : ''}, ${application.city}, ${application.postcode}`,
                latitude: 51.5074, // Default to London, should be geocoded
                longitude: -0.1278,
                categories: application.product_categories,
                cultural_specialties: application.cultural_region ? [application.cultural_region] : [],
                is_verified: true,
            });

        if (error) throw error;

        // Update user profile role
        await supabase
            .from('profiles')
            .update({ role: 'vendor' })
            .eq('id', application.user_id);
    },
};

export default vendorApplicationsService;
