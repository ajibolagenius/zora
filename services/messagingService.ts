/**
 * Real-time Messaging Service
 * Handles database operations for conversations and messages with Supabase Realtime
 */

import { getSupabaseFrom, getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { Vendor } from '../types/supabase';

export interface Conversation {
  id: string;
  user_id: string;
  vendor_id?: string | null;
  order_id?: string | null;
  conversation_type?: 'vendor' | 'support';
  last_message_at: string;
  last_message_text: string | null;
  unread_count_user: number;
  unread_count_vendor: number;
  created_at: string;
  updated_at: string;
  vendor?: Vendor; // Joined vendor data
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'user' | 'vendor' | 'support';
  text: string;
  read_at: string | null;
  created_at: string;
  sender_name?: string; // For support agents
  is_system?: boolean;
  // Joined data (not in DB)
  sender_avatar?: string;
}

export const messagingService = {
  /**
   * Get or create a support conversation for an order
   */
  getOrCreateSupportConversation: async (userId: string, orderId: string): Promise<Conversation | null> => {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return null;
    }

    try {
      // Try to get existing support conversation for this order
      const { data: existing, error: fetchError } = await fromMethod('conversations')
        .select('*')
        .eq('user_id', userId)
        .eq('order_id', orderId)
        .eq('conversation_type', 'support')
        .maybeSingle();

      if (existing) {
        return existing as Conversation;
      }

      // Create new support conversation if it doesn't exist
      const { data: newConversation, error: createError } = await fromMethod('conversations')
        .insert({
          user_id: userId,
          order_id: orderId,
          conversation_type: 'support',
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating support conversation:', createError);
        return null;
      }

      return newConversation as Conversation;
    } catch (error) {
      console.error('Error getting/creating support conversation:', error);
      return null;
    }
  },

  /**
   * Get or create a conversation between user and vendor
   */
  getOrCreateConversation: async (userId: string, vendorId: string): Promise<Conversation | null> => {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return null;
    }

    try {
      // Try to get existing conversation
      const { data: existing, error: fetchError } = await fromMethod('conversations')
        .select('*')
        .eq('user_id', userId)
        .eq('vendor_id', vendorId)
        .maybeSingle();

      if (existing) {
        return existing as Conversation;
      }

      // Create new conversation if it doesn't exist
      const { data: newConversation, error: createError } = await fromMethod('conversations')
        .insert({
          user_id: userId,
          vendor_id: vendorId,
          conversation_type: 'vendor',
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating conversation:', createError);
        return null;
      }

      return newConversation as Conversation;
    } catch (error) {
      console.error('Error getting/creating conversation:', error);
      return null;
    }
  },

  /**
   * Get all conversations for a user
   */
  getUserConversations: async (userId: string, limit?: number, offset?: number): Promise<Conversation[]> => {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return [];
    }

    try {
      let query = fromMethod('conversations')
        .select('*, vendors(id, shop_name, logo_url, slug)')
        .eq('user_id', userId)
        .or('conversation_type.is.null,conversation_type.eq.vendor')
        .order('last_message_at', { ascending: false });

      if (limit !== undefined && offset !== undefined) {
        query = query.range(offset, offset + limit - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching conversations:', error);
        return [];
      }

      return (data || []).map((conv: any) => ({
        ...conv,
        vendor: conv.vendors,
      })) as Conversation[];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  },

  /**
   * Get messages for a conversation
   */
  getMessages: async (conversationId: string): Promise<Message[]> => {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return [];
    }

    try {
      const { data, error } = await fromMethod('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      // Enrich messages with sender info
      const enrichedMessages = await Promise.all(
        (data || []).map(async (msg: any) => {
          let senderName = 'Unknown';
          let senderAvatar: string | null = null;

          if (msg.sender_type === 'user') {
            // Get user profile
            const { data: profile } = await fromMethod('profiles')
              .select('full_name, avatar_url')
              .eq('id', msg.sender_id)
              .maybeSingle();
            
            senderName = profile?.full_name || 'User';
            senderAvatar = profile?.avatar_url || null;
          } else {
            // Get vendor info
            const { data: vendor } = await fromMethod('vendors')
              .select('shop_name, logo_url')
              .eq('id', msg.sender_id)
              .maybeSingle();
            
            senderName = vendor?.shop_name || 'Vendor';
            senderAvatar = vendor?.logo_url || null;
          }

          return {
            ...msg,
            sender_name: senderName,
            sender_avatar: senderAvatar,
          } as Message;
        })
      );

      return enrichedMessages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  /**
   * Send a message
   */
  sendMessage: async (
    conversationId: string,
    senderId: string,
    senderType: 'user' | 'vendor',
    text: string
  ): Promise<Message | null> => {
    if (!isSupabaseConfigured()) {
      return null;
    }

    // Get the authenticated client to ensure RLS policies work correctly
    const client = await getSupabaseClient();
    const { data: { user: authUser } } = await client.auth.getUser();
    
    if (!authUser) {
      console.error('User not authenticated');
      return null;
    }

    // For user messages, verify the conversation exists and use authenticated user ID
    if (senderType === 'user') {
      // Verify conversation exists and belongs to the authenticated user
      const { data: conv, error: convError } = await client
        .from('conversations')
        .select('user_id')
        .eq('id', conversationId)
        .eq('user_id', authUser.id)
        .maybeSingle();
      
      if (convError || !conv) {
        console.error('Conversation not found or does not belong to user:', convError);
        return null;
      }
      
      // Use the authenticated user's ID to ensure it matches auth.uid()
      const actualSenderId = authUser.id;
      
      try {
        const { data, error } = await client
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: actualSenderId,
            sender_type: senderType,
            text: text.trim(),
          })
          .select()
          .single();

        if (error) {
          console.error('Error sending message:', error);
          return null;
        }

        // Enrich with sender info
        let senderName = 'Unknown';
        let senderAvatar: string | null = null;

        const { data: profile } = await client
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', actualSenderId)
          .maybeSingle();
        
        senderName = profile?.full_name || 'User';
        senderAvatar = profile?.avatar_url || null;

        return {
          ...data,
          sender_name: senderName,
          sender_avatar: senderAvatar,
        } as Message;
      } catch (error) {
        console.error('Error sending message:', error);
        return null;
      }
    } else {
      // Vendor messages - verify vendor belongs to authenticated user
      const { data: vendor, error: vendorError } = await client
        .from('vendors')
        .select('id, user_id, shop_name, logo_url')
        .eq('id', senderId)
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (vendorError || !vendor) {
        console.error('Vendor not found or does not belong to user:', vendorError);
        return null;
      }

      // Verify conversation exists and belongs to this vendor
      const { data: conv, error: convError } = await client
        .from('conversations')
        .select('vendor_id')
        .eq('id', conversationId)
        .eq('vendor_id', senderId)
        .maybeSingle();

      if (convError || !conv) {
        console.error('Conversation not found or does not belong to vendor:', convError);
        return null;
      }

      try {
        const { data, error } = await client
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: senderId,
            sender_type: senderType,
            text: text.trim(),
          })
          .select()
          .single();

        if (error) {
          console.error('Error sending message:', error);
          return null;
        }

        // Enrich with sender info
        return {
          ...data,
          sender_name: vendor.shop_name || 'Vendor',
          sender_avatar: vendor.logo_url || null,
        } as Message;
      } catch (error) {
        console.error('Error sending message:', error);
        return null;
      }
    }
  },

  /**
   * Mark messages as read
   */
  markAsRead: async (conversationId: string, userId: string, senderType: 'user' | 'vendor'): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      return false;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return false;
    }

    try {
      // Mark all unread messages from the other party as read
      const oppositeType = senderType === 'user' ? 'vendor' : 'user';
      
      const { error } = await fromMethod('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('sender_type', oppositeType)
        .is('read_at', null);

      if (error) {
        console.error('Error marking messages as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
  },

  /**
   * Get unread message count for a user
   */
  getUnreadCount: async (userId: string): Promise<number> => {
    if (!isSupabaseConfigured()) {
      return 0;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return 0;
    }

    try {
      const { data, error } = await fromMethod('conversations')
        .select('unread_count_user')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching unread count:', error);
        return 0;
      }

      return (data || []).reduce((sum: number, conv: any) => sum + (conv.unread_count_user || 0), 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },

  /**
   * Delete a conversation
   */
  deleteConversation: async (conversationId: string, userId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      return false;
    }

    const client = await getSupabaseClient();
    const { data: { user: authUser } } = await client.auth.getUser();
    
    if (!authUser || authUser.id !== userId) {
      console.error('User not authenticated or unauthorized');
      return false;
    }

    try {
      // Verify conversation belongs to user
      const { data: conv, error: convError } = await client
        .from('conversations')
        .select('user_id')
        .eq('id', conversationId)
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (convError || !conv) {
        console.error('Conversation not found or does not belong to user:', convError);
        return false;
      }

      // Delete conversation (messages will be cascade deleted)
      const { error } = await client
        .from('conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', authUser.id);

      if (error) {
        console.error('Error deleting conversation:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  },
};
