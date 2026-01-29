/**
 * Email Threads Service
 * Service for managing customer support email threads
 */

import { getSupabaseClient } from '../supabase';
import type {
    EmailThread,
    EmailMessage,
    EmailTemplate,
    EmailThreadStatus,
    EmailPriority,
    CreateEmailThreadInput,
    CreateEmailMessageInput,
    UpdateEmailThreadInput,
} from '@zora/types';
import type { PaginatedResponse, PaginationParams } from '@zora/types';

export interface EmailThreadQueryParams extends PaginationParams {
    status?: EmailThreadStatus;
    priority?: EmailPriority;
    assignedTo?: string;
    customerId?: string;
    orderId?: string;
    vendorId?: string;
    search?: string;
    isStarred?: boolean;
    isRead?: boolean;
}

export const emailThreadsService = {
    /**
     * Get all threads with filters
     */
    async getThreads(params?: EmailThreadQueryParams): Promise<PaginatedResponse<EmailThread>> {
        const supabase = getSupabaseClient();
        const {
            page = 1,
            limit = 20,
            status,
            priority,
            assignedTo,
            customerId,
            orderId,
            vendorId,
            search,
            isStarred,
            isRead,
        } = params || {};

        let query = supabase
            .from('email_threads')
            .select('*', { count: 'exact' })
            .order('last_message_at', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false });

        if (status) query = query.eq('status', status);
        if (priority) query = query.eq('priority', priority);
        if (assignedTo) query = query.eq('assigned_to', assignedTo);
        if (customerId) query = query.eq('customer_id', customerId);
        if (orderId) query = query.eq('order_id', orderId);
        if (vendorId) query = query.eq('vendor_id', vendorId);
        if (isStarred !== undefined) query = query.eq('is_starred', isStarred);
        if (isRead !== undefined) query = query.eq('is_read', isRead);

        if (search) {
            query = query.or(`subject.ilike.%${search}%,customer_email.ilike.%${search}%,customer_name.ilike.%${search}%`);
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
     * Get thread by ID with messages
     */
    async getThread(id: string): Promise<EmailThread | null> {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('email_threads')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Get thread with messages
     */
    async getThreadWithMessages(id: string): Promise<{ thread: EmailThread; messages: EmailMessage[] } | null> {
        const thread = await this.getThread(id);
        if (!thread) return null;

        const messages = await this.getMessages(id);
        return { thread, messages };
    },

    /**
     * Create a new thread
     */
    async createThread(data: CreateEmailThreadInput): Promise<EmailThread> {
        const supabase = getSupabaseClient();

        const { data: thread, error } = await supabase
            .from('email_threads')
            .insert({
                subject: data.subject,
                customer_id: data.customer_id,
                customer_email: data.customer_email,
                customer_name: data.customer_name,
                order_id: data.order_id,
                vendor_id: data.vendor_id,
                priority: data.priority || 'normal',
                tags: data.tags || [],
                status: 'open',
                is_starred: false,
                is_read: false,
                message_count: 0,
                unread_count: 0,
            })
            .select()
            .single();

        if (error) throw error;
        return thread;
    },

    /**
     * Update thread
     */
    async updateThread(id: string, data: UpdateEmailThreadInput): Promise<EmailThread> {
        const supabase = getSupabaseClient();

        const updateData: Record<string, unknown> = {
            ...data,
            updated_at: new Date().toISOString(),
        };

        if (data.assigned_to) {
            updateData.assigned_at = new Date().toISOString();
        }

        if (data.status === 'closed') {
            updateData.closed_at = new Date().toISOString();
        }

        const { data: thread, error } = await supabase
            .from('email_threads')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return thread;
    },

    /**
     * Get messages for a thread
     */
    async getMessages(threadId: string): Promise<EmailMessage[]> {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('email_messages')
            .select('*')
            .eq('thread_id', threadId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    /**
     * Send a message in a thread
     */
    async sendMessage(data: CreateEmailMessageInput): Promise<EmailMessage> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { data: message, error } = await supabase
            .from('email_messages')
            .insert({
                thread_id: data.thread_id,
                sender_type: data.sender_type,
                sender_id: user?.id,
                sender_email: data.sender_email,
                sender_name: data.sender_name,
                content: data.content,
                content_html: data.content_html,
                attachments: data.attachments || [],
                is_internal: data.is_internal || false,
                is_read: data.sender_type !== 'customer', // Admin/vendor messages are read by default
            })
            .select()
            .single();

        if (error) throw error;
        return message;
    },

    /**
     * Mark thread as read
     */
    async markAsRead(id: string): Promise<void> {
        const supabase = getSupabaseClient();

        await supabase
            .from('email_threads')
            .update({ is_read: true, unread_count: 0, updated_at: new Date().toISOString() })
            .eq('id', id);

        // Mark all messages as read
        await supabase
            .from('email_messages')
            .update({ is_read: true, read_at: new Date().toISOString() })
            .eq('thread_id', id)
            .eq('is_read', false);
    },

    /**
     * Toggle star status
     */
    async toggleStar(id: string): Promise<EmailThread> {
        const supabase = getSupabaseClient();

        const thread = await this.getThread(id);
        if (!thread) throw new Error('Thread not found');

        const { data, error } = await supabase
            .from('email_threads')
            .update({ is_starred: !thread.is_starred, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Assign thread to admin
     */
    async assignTo(threadId: string, adminId: string): Promise<EmailThread> {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('email_threads')
            .update({
                assigned_to: adminId,
                assigned_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', threadId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get unread thread count
     */
    async getUnreadCount(): Promise<number> {
        const supabase = getSupabaseClient();

        const { count, error } = await supabase
            .from('email_threads')
            .select('*', { count: 'exact', head: true })
            .eq('is_read', false)
            .neq('status', 'closed');

        if (error) throw error;
        return count || 0;
    },

    /**
     * Get thread counts by status
     */
    async getCountsByStatus(): Promise<Record<EmailThreadStatus, number>> {
        const supabase = getSupabaseClient();

        const statuses: EmailThreadStatus[] = ['open', 'pending', 'closed', 'spam'];
        const counts: Record<string, number> = {};

        for (const status of statuses) {
            const { count, error } = await supabase
                .from('email_threads')
                .select('*', { count: 'exact', head: true })
                .eq('status', status);

            if (error) throw error;
            counts[status] = count || 0;
        }

        return counts as Record<EmailThreadStatus, number>;
    },

    // ==================== Templates ====================

    /**
     * Get all templates
     */
    async getTemplates(category?: string): Promise<EmailTemplate[]> {
        const supabase = getSupabaseClient();

        let query = supabase
            .from('email_templates')
            .select('*')
            .eq('is_active', true)
            .order('use_count', { ascending: false });

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    },

    /**
     * Get template by ID
     */
    async getTemplate(id: string): Promise<EmailTemplate | null> {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('email_templates')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Create template
     */
    async createTemplate(data: Omit<EmailTemplate, 'id' | 'use_count' | 'created_at' | 'updated_at'>): Promise<EmailTemplate> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { data: template, error } = await supabase
            .from('email_templates')
            .insert({
                ...data,
                created_by: user?.id,
                use_count: 0,
            })
            .select()
            .single();

        if (error) throw error;
        return template;
    },

    /**
     * Use template (increments use count)
     */
    async useTemplate(id: string): Promise<EmailTemplate> {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase.rpc('increment_template_use_count', { template_id: id });

        // Fallback if RPC doesn't exist
        if (error) {
            const template = await this.getTemplate(id);
            if (!template) throw new Error('Template not found');

            const { data: updated, error: updateError } = await supabase
                .from('email_templates')
                .update({ use_count: template.use_count + 1, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (updateError) throw updateError;
            return updated;
        }

        return data;
    },
};

export default emailThreadsService;
