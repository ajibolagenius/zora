-- Fix RLS policies for messages table
-- This migration updates the existing policies to ensure proper security

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create messages" ON public.messages;
DROP POLICY IF EXISTS "Vendors can create messages" ON public.messages;

-- Users can create messages in their conversations
-- Must verify: conversation belongs to user, sender_type is 'user', and sender_id matches auth.uid()
CREATE POLICY "Users can create messages" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = messages.conversation_id 
            AND conversations.user_id = auth.uid()
        )
        AND messages.sender_type = 'user'
        AND messages.sender_id = auth.uid()
    );

-- Vendors can create messages in their conversations
-- Must verify: conversation belongs to vendor, sender_type is 'vendor', and sender_id matches vendor_id
CREATE POLICY "Vendors can create messages" ON public.messages
    FOR INSERT WITH CHECK (
        messages.sender_type = 'vendor'
        AND EXISTS (
            SELECT 1 FROM public.conversations 
            JOIN public.vendors ON vendors.id = conversations.vendor_id
            WHERE conversations.id = messages.conversation_id 
            AND vendors.user_id = auth.uid()
            AND conversations.vendor_id = messages.sender_id
        )
    );
