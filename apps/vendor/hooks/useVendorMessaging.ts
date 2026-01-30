'use client';

/**
 * Vendor Messaging Hooks
 * TanStack Query hooks for vendor messaging with real-time updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createSupabaseClient } from '@zora/api-client';

// =============================================================================
// Types
// =============================================================================

export interface VendorConversation {
    id: string;
    user_id: string;
    vendor_id: string;
    order_id?: string | null;
    conversation_type: 'vendor' | 'support';
    last_message_at: string;
    last_message_text: string | null;
    unread_count_user: number;
    unread_count_vendor: number;
    created_at: string;
    updated_at: string;
    // Joined data
    customer?: {
        id: string;
        full_name: string;
        email: string;
        avatar_url?: string;
    };
    order?: {
        id: string;
        status: string;
    };
}

export interface VendorMessage {
    id: string;
    conversation_id: string;
    sender_id: string;
    sender_type: 'user' | 'vendor' | 'support';
    text: string;
    read_at: string | null;
    created_at: string;
    sender_name?: string;
    sender_avatar?: string;
    is_system?: boolean;
}

// =============================================================================
// Query Keys
// =============================================================================

export const vendorMessagingQueryKeys = {
    all: ['vendorMessaging'] as const,
    conversations: (vendorId: string) => [...vendorMessagingQueryKeys.all, 'conversations', vendorId] as const,
    conversation: (conversationId: string) => [...vendorMessagingQueryKeys.all, 'conversation', conversationId] as const,
    messages: (conversationId: string) => [...vendorMessagingQueryKeys.all, 'messages', conversationId] as const,
    unreadCount: (vendorId: string) => [...vendorMessagingQueryKeys.all, 'unreadCount', vendorId] as const,
};

// =============================================================================
// Vendor Conversations Hook
// =============================================================================

export function useVendorConversations(vendorId: string | null) {
    return useQuery({
        queryKey: vendorMessagingQueryKeys.conversations(vendorId || ''),
        queryFn: async (): Promise<VendorConversation[]> => {
            if (!vendorId) throw new Error('No vendor ID');

            const supabase = createSupabaseClient();

            const { data, error } = await supabase
                .from('conversations')
                .select(`
                    *,
                    customer:profiles!user_id(id, full_name, email, avatar_url),
                    order:orders!order_id(id, status)
                `)
                .eq('vendor_id', vendorId)
                .order('last_message_at', { ascending: false });

            if (error) {
                console.error('Error fetching vendor conversations:', error);
                throw error;
            }

            return (data || []).map((conv: any) => ({
                ...conv,
                customer: conv.customer || null,
                order: conv.order || null,
            }));
        },
        enabled: !!vendorId,
        staleTime: 10 * 1000, // 10 seconds
        refetchInterval: 30 * 1000, // Refetch every 30 seconds
    });
}

// =============================================================================
// Vendor Messages Hook
// =============================================================================

export function useVendorMessages(conversationId: string | null) {
    return useQuery({
        queryKey: vendorMessagingQueryKeys.messages(conversationId || ''),
        queryFn: async (): Promise<VendorMessage[]> => {
            if (!conversationId) throw new Error('No conversation ID');

            const supabase = createSupabaseClient();

            // First get the messages
            const { data: messages, error: msgError } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (msgError) {
                console.error('Error fetching messages:', msgError);
                throw msgError;
            }

            // Enrich messages with sender info
            const enrichedMessages = await Promise.all(
                (messages || []).map(async (msg: any) => {
                    let senderName = 'Unknown';
                    let senderAvatar: string | null = null;

                    if (msg.sender_type === 'user') {
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('full_name, avatar_url')
                            .eq('id', msg.sender_id)
                            .maybeSingle();

                        senderName = profile?.full_name || 'Customer';
                        senderAvatar = profile?.avatar_url || null;
                    } else if (msg.sender_type === 'vendor') {
                        const { data: vendor } = await supabase
                            .from('vendors')
                            .select('shop_name, logo_url')
                            .eq('id', msg.sender_id)
                            .maybeSingle();

                        senderName = vendor?.shop_name || 'Vendor';
                        senderAvatar = vendor?.logo_url || null;
                    } else {
                        senderName = msg.sender_name || 'Support';
                    }

                    return {
                        ...msg,
                        sender_name: senderName,
                        sender_avatar: senderAvatar,
                    };
                })
            );

            return enrichedMessages;
        },
        enabled: !!conversationId,
        staleTime: 5 * 1000, // 5 seconds
        refetchInterval: 10 * 1000, // Refetch every 10 seconds for real-time feel
    });
}

// =============================================================================
// Send Message Mutation
// =============================================================================

export function useSendVendorMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            conversationId,
            vendorId,
            text,
        }: {
            conversationId: string;
            vendorId: string;
            text: string;
        }): Promise<VendorMessage | null> => {
            const supabase = createSupabaseClient();

            // Get the current user to verify vendor ownership
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                throw new Error('Not authenticated');
            }

            // Verify vendor belongs to authenticated user
            const { data: vendor, error: vendorError } = await supabase
                .from('vendors')
                .select('id, shop_name, logo_url')
                .eq('id', vendorId)
                .eq('user_id', authUser.id)
                .maybeSingle();

            if (vendorError || !vendor) {
                throw new Error('Vendor not found or access denied');
            }

            // Verify conversation belongs to this vendor
            const { data: conv, error: convError } = await supabase
                .from('conversations')
                .select('vendor_id')
                .eq('id', conversationId)
                .eq('vendor_id', vendorId)
                .maybeSingle();

            if (convError || !conv) {
                throw new Error('Conversation not found or access denied');
            }

            // Send the message
            const { data, error } = await supabase
                .from('messages')
                .insert({
                    conversation_id: conversationId,
                    sender_id: vendorId,
                    sender_type: 'vendor',
                    text: text.trim(),
                })
                .select()
                .single();

            if (error) {
                console.error('Error sending message:', error);
                throw error;
            }

            return {
                ...data,
                sender_name: vendor.shop_name || 'Vendor',
                sender_avatar: vendor.logo_url || null,
            };
        },
        onSuccess: (data, variables) => {
            // Invalidate messages for this conversation
            queryClient.invalidateQueries({
                queryKey: vendorMessagingQueryKeys.messages(variables.conversationId),
            });
            // Invalidate conversations list to update last message
            queryClient.invalidateQueries({
                queryKey: vendorMessagingQueryKeys.conversations(variables.vendorId),
            });
        },
    });
}

// =============================================================================
// Mark Messages Read Mutation
// =============================================================================

export function useMarkMessagesRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            conversationId,
            vendorId,
        }: {
            conversationId: string;
            vendorId: string;
        }): Promise<boolean> => {
            const supabase = createSupabaseClient();

            // Mark all unread messages from users as read
            const { error } = await supabase
                .from('messages')
                .update({ read_at: new Date().toISOString() })
                .eq('conversation_id', conversationId)
                .eq('sender_type', 'user')
                .is('read_at', null);

            if (error) {
                console.error('Error marking messages as read:', error);
                throw error;
            }

            // Reset unread count for vendor
            await supabase
                .from('conversations')
                .update({ unread_count_vendor: 0 })
                .eq('id', conversationId);

            return true;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: vendorMessagingQueryKeys.conversations(variables.vendorId),
            });
            queryClient.invalidateQueries({
                queryKey: vendorMessagingQueryKeys.unreadCount(variables.vendorId),
            });
        },
    });
}

// =============================================================================
// Unread Count Hook
// =============================================================================

export function useVendorUnreadCount(vendorId: string | null) {
    return useQuery({
        queryKey: vendorMessagingQueryKeys.unreadCount(vendorId || ''),
        queryFn: async (): Promise<number> => {
            if (!vendorId) return 0;

            const supabase = createSupabaseClient();

            const { data, error } = await supabase
                .from('conversations')
                .select('unread_count_vendor')
                .eq('vendor_id', vendorId);

            if (error) {
                console.error('Error fetching unread count:', error);
                return 0;
            }

            return (data || []).reduce((sum, conv) => sum + (conv.unread_count_vendor || 0), 0);
        },
        enabled: !!vendorId,
        staleTime: 10 * 1000,
        refetchInterval: 30 * 1000,
    });
}
