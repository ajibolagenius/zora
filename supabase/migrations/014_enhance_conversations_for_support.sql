-- Enhance conversations table to support order support conversations
-- This migration adds order_id to conversations to link support chats with orders

-- Add order_id column to conversations table (nullable, for both vendor chats and support)
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS conversation_type TEXT DEFAULT 'vendor' CHECK (conversation_type IN ('vendor', 'support'));

-- Create index for order_id lookups
CREATE INDEX IF NOT EXISTS idx_conversations_order_id ON public.conversations(order_id);
CREATE INDEX IF NOT EXISTS idx_conversations_type ON public.conversations(conversation_type);

-- Update RLS policies to allow viewing support conversations
-- Users can view support conversations for their orders
CREATE POLICY "Users can view support conversations" ON public.conversations
    FOR SELECT USING (
        conversation_type = 'support'
        AND EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = conversations.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Users can create support conversations for their orders
CREATE POLICY "Users can create support conversations" ON public.conversations
    FOR INSERT WITH CHECK (
        conversation_type = 'support'
        AND auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = conversations.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Support agents can view all support conversations
-- Note: This assumes support agents have a role. Adjust based on your implementation
CREATE POLICY "Support agents can view support conversations" ON public.conversations
    FOR SELECT USING (
        conversation_type = 'support'
        AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'support')
        )
    );

-- Support agents can update support conversations
CREATE POLICY "Support agents can update support conversations" ON public.conversations
    FOR UPDATE USING (
        conversation_type = 'support'
        AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'support')
        )
    );

-- Update messages table to support support conversations
-- Add support for support agent messages
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS sender_name TEXT, -- For support agent names
ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT FALSE; -- For system messages

-- Support agents can create messages in support conversations
CREATE POLICY "Support agents can create messages" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = messages.conversation_id 
            AND conversations.conversation_type = 'support'
            AND EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.role IN ('admin', 'support')
            )
        )
        AND (
            messages.sender_type = 'user' 
            OR EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.role IN ('admin', 'support')
            )
        )
    );

-- Support agents can view all messages in support conversations
CREATE POLICY "Support agents can view support messages" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = messages.conversation_id 
            AND conversations.conversation_type = 'support'
            AND (
                EXISTS (
                    SELECT 1 FROM public.conversations 
                    WHERE conversations.id = messages.conversation_id 
                    AND conversations.user_id = auth.uid()
                )
                OR EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE profiles.id = auth.uid() 
                    AND profiles.role IN ('admin', 'support')
                )
            )
        )
    );

-- Function to auto-create support conversation when first message is sent
CREATE OR REPLACE FUNCTION create_support_conversation_if_needed()
RETURNS TRIGGER AS $$
DECLARE
    v_conversation_id UUID;
    v_order_user_id UUID;
BEGIN
    -- Check if this is for a support conversation
    -- If conversation_id is an order_id (UUID format), create a support conversation
    IF NEW.conversation_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
        -- Check if order exists and get user_id
        SELECT user_id INTO v_order_user_id
        FROM public.orders
        WHERE id = NEW.conversation_id::uuid;
        
        IF v_order_user_id IS NOT NULL THEN
            -- Check if conversation already exists
            SELECT id INTO v_conversation_id
            FROM public.conversations
            WHERE order_id = NEW.conversation_id::uuid
            AND conversation_type = 'support'
            LIMIT 1;
            
            -- Create conversation if it doesn't exist
            IF v_conversation_id IS NULL THEN
                INSERT INTO public.conversations (user_id, order_id, conversation_type, last_message_at, last_message_text)
                VALUES (v_order_user_id, NEW.conversation_id::uuid, 'support', NOW(), NEW.text)
                RETURNING id INTO v_conversation_id;
            END IF;
            
            -- Update message to use the conversation_id
            NEW.conversation_id = v_conversation_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: This trigger would need to be added carefully as it modifies the message before insert
-- For now, we'll handle conversation creation in the application layer
-- Uncomment if you want database-level auto-creation:
-- DROP TRIGGER IF EXISTS auto_create_support_conversation ON public.messages;
-- CREATE TRIGGER auto_create_support_conversation
--     BEFORE INSERT ON public.messages
--     FOR EACH ROW
--     EXECUTE FUNCTION create_support_conversation_if_needed();
