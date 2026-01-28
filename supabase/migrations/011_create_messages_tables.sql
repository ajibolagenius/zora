-- Create conversations and messages tables for real-time messaging
-- This migration creates tables for customer-vendor messaging

-- ============== CONVERSATIONS TABLE ==============
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_text TEXT,
    unread_count_user INTEGER DEFAULT 0,
    unread_count_vendor INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, vendor_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_vendor_id ON public.conversations(vendor_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.conversations(last_message_at DESC);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Users can view their own conversations
CREATE POLICY "Users can view own conversations" ON public.conversations
    FOR SELECT USING (auth.uid() = user_id);

-- Vendors can view conversations with them
CREATE POLICY "Vendors can view own conversations" ON public.conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.vendors 
            WHERE vendors.id = conversations.vendor_id 
            AND vendors.user_id = auth.uid()
        )
    );

-- Users can create conversations
CREATE POLICY "Users can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own conversations
CREATE POLICY "Users can update own conversations" ON public.conversations
    FOR UPDATE USING (auth.uid() = user_id);

-- Vendors can update conversations with them
CREATE POLICY "Vendors can update own conversations" ON public.conversations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.vendors 
            WHERE vendors.id = conversations.vendor_id 
            AND vendors.user_id = auth.uid()
        )
    );

-- ============== MESSAGES TABLE ==============
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL, -- Can be user_id or vendor_id
    sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'vendor')),
    text TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages in their conversations
CREATE POLICY "Users can view own messages" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = messages.conversation_id 
            AND conversations.user_id = auth.uid()
        )
    );

-- Vendors can view messages in their conversations
CREATE POLICY "Vendors can view own messages" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            JOIN public.vendors ON vendors.id = conversations.vendor_id
            WHERE conversations.id = messages.conversation_id 
            AND vendors.user_id = auth.uid()
        )
    );

-- Users can create messages in their conversations
CREATE POLICY "Users can create messages" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = messages.conversation_id 
            AND conversations.user_id = auth.uid()
        )
        AND messages.sender_type = 'user'
    );

-- Vendors can create messages in their conversations
CREATE POLICY "Vendors can create messages" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.conversations 
            JOIN public.vendors ON vendors.id = conversations.vendor_id
            WHERE conversations.id = messages.conversation_id 
            AND vendors.user_id = auth.uid()
        )
        AND messages.sender_type = 'vendor'
    );

-- Users can update messages they sent
CREATE POLICY "Users can update own messages" ON public.messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = messages.conversation_id 
            AND conversations.user_id = auth.uid()
        )
        AND messages.sender_type = 'user'
    );

-- Vendors can update messages they sent
CREATE POLICY "Vendors can update own messages" ON public.messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            JOIN public.vendors ON vendors.id = conversations.vendor_id
            WHERE conversations.id = messages.conversation_id 
            AND vendors.user_id = auth.uid()
        )
        AND messages.sender_type = 'vendor'
    );

-- Function to update conversation's last message
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations
    SET 
        last_message_at = NEW.created_at,
        last_message_text = NEW.text,
        unread_count_user = CASE 
            WHEN NEW.sender_type = 'vendor' THEN unread_count_user + 1
            ELSE unread_count_user
        END,
        unread_count_vendor = CASE 
            WHEN NEW.sender_type = 'user' THEN unread_count_vendor + 1
            ELSE unread_count_vendor
        END,
        updated_at = NOW()
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation when message is inserted
DROP TRIGGER IF EXISTS on_message_inserted ON public.messages;
CREATE TRIGGER on_message_inserted
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_on_message();

-- Function to reset unread count when messages are read
CREATE OR REPLACE FUNCTION reset_unread_count_on_read()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.read_at IS NOT NULL AND OLD.read_at IS NULL THEN
        UPDATE public.conversations
        SET 
            unread_count_user = CASE 
                WHEN EXISTS (
                    SELECT 1 FROM public.messages 
                    WHERE messages.conversation_id = conversations.id 
                    AND messages.sender_type = 'vendor' 
                    AND messages.read_at IS NULL
                ) THEN (
                    SELECT COUNT(*) FROM public.messages 
                    WHERE messages.conversation_id = conversations.id 
                    AND messages.sender_type = 'vendor' 
                    AND messages.read_at IS NULL
                )
                ELSE 0
            END,
            unread_count_vendor = CASE 
                WHEN EXISTS (
                    SELECT 1 FROM public.messages 
                    WHERE messages.conversation_id = conversations.id 
                    AND messages.sender_type = 'user' 
                    AND messages.read_at IS NULL
                ) THEN (
                    SELECT COUNT(*) FROM public.messages 
                    WHERE messages.conversation_id = conversations.id 
                    AND messages.sender_type = 'user' 
                    AND messages.read_at IS NULL
                )
                ELSE 0
            END
        WHERE id = NEW.conversation_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to reset unread count when message is read
DROP TRIGGER IF EXISTS on_message_read ON public.messages;
CREATE TRIGGER on_message_read
    AFTER UPDATE OF read_at ON public.messages
    FOR EACH ROW
    WHEN (NEW.read_at IS NOT NULL AND OLD.read_at IS NULL)
    EXECUTE FUNCTION reset_unread_count_on_read();
