-- =============================================================================
-- MIGRATION: Email Threading System
-- Version: 018
-- Description: Create tables for email threading and customer communication
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table: email_threads
-- Purpose: Store email conversation threads
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS email_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Thread subject
    subject TEXT NOT NULL,

    -- Related entities
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT,

    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,

    -- Thread status and assignment
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'closed', 'spam')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

    -- Assignment
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ,

    -- Thread metadata
    tags TEXT[] DEFAULT '{}',
    is_starred BOOLEAN DEFAULT FALSE,
    is_read BOOLEAN DEFAULT FALSE,

    -- Message counts (denormalized for performance)
    message_count INT NOT NULL DEFAULT 0,
    unread_count INT NOT NULL DEFAULT 0,

    -- Last activity
    last_message_at TIMESTAMPTZ,
    last_message_preview TEXT,
    last_message_sender TEXT CHECK (last_message_sender IN ('customer', 'admin', 'system', 'vendor')),

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX idx_email_threads_status ON email_threads(status);
CREATE INDEX idx_email_threads_customer_id ON email_threads(customer_id);
CREATE INDEX idx_email_threads_customer_email ON email_threads(customer_email);
CREATE INDEX idx_email_threads_order_id ON email_threads(order_id);
CREATE INDEX idx_email_threads_assigned_to ON email_threads(assigned_to);
CREATE INDEX idx_email_threads_last_message ON email_threads(last_message_at DESC);
CREATE INDEX idx_email_threads_unread ON email_threads(status, is_read, last_message_at DESC);

-- -----------------------------------------------------------------------------
-- Table: email_messages
-- Purpose: Store individual messages within threads
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS email_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID NOT NULL REFERENCES email_threads(id) ON DELETE CASCADE,

    -- Sender information
    sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'admin', 'system', 'vendor')),
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    sender_email TEXT NOT NULL,
    sender_name TEXT,

    -- Message content
    content TEXT NOT NULL,
    content_html TEXT, -- Rich HTML content if available

    -- Attachments
    attachments JSONB DEFAULT '[]',
    -- Example structure:
    -- [
    --   { "name": "receipt.pdf", "url": "https://...", "size": 12345, "type": "application/pdf" }
    -- ]

    -- Message metadata
    is_internal BOOLEAN DEFAULT FALSE, -- Internal notes not visible to customer
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,

    -- External email metadata (if received from external email)
    external_message_id TEXT,
    in_reply_to TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_email_messages_thread_id ON email_messages(thread_id);
CREATE INDEX idx_email_messages_sender_type ON email_messages(sender_type);
CREATE INDEX idx_email_messages_created_at ON email_messages(created_at DESC);
CREATE INDEX idx_email_messages_thread_created ON email_messages(thread_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- Table: email_templates
-- Purpose: Store reusable email templates for quick replies
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name TEXT NOT NULL,
    subject TEXT,
    content TEXT NOT NULL,
    content_html TEXT,

    -- Template metadata
    category TEXT NOT NULL DEFAULT 'general' CHECK (category IN (
        'general', 'order', 'shipping', 'refund', 'account', 'vendor', 'other'
    )),

    -- Usage tracking
    use_count INT DEFAULT 0,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Created by
    created_by UUID REFERENCES auth.users(id),

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_templates_category ON email_templates(category);
CREATE INDEX idx_email_templates_active ON email_templates(is_active);

-- -----------------------------------------------------------------------------
-- Triggers and Functions
-- -----------------------------------------------------------------------------

-- Update thread on new message
CREATE OR REPLACE FUNCTION update_thread_on_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE email_threads
    SET
        message_count = message_count + 1,
        unread_count = CASE WHEN NEW.is_read = FALSE THEN unread_count + 1 ELSE unread_count END,
        last_message_at = NEW.created_at,
        last_message_preview = LEFT(NEW.content, 100),
        last_message_sender = NEW.sender_type,
        is_read = CASE WHEN NEW.sender_type = 'customer' THEN FALSE ELSE is_read END,
        updated_at = NOW()
    WHERE id = NEW.thread_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_thread_on_message
    AFTER INSERT ON email_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_thread_on_message();

-- Update thread updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_thread_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_email_threads_updated_at
    BEFORE UPDATE ON email_threads
    FOR EACH ROW
    EXECUTE FUNCTION update_email_thread_updated_at();

-- Update template updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_template_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_email_templates_updated_at
    BEFORE UPDATE ON email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_email_template_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security (RLS)
-- -----------------------------------------------------------------------------

ALTER TABLE email_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Threads policies
CREATE POLICY "Admins can view all threads"
    ON email_threads FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage threads"
    ON email_threads FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Customers can view own threads"
    ON email_threads FOR SELECT
    TO authenticated
    USING (customer_id = auth.uid());

-- Messages policies
CREATE POLICY "Admins can view all messages"
    ON email_messages FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can send messages"
    ON email_messages FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Customers can view own thread messages"
    ON email_messages FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM email_threads
            WHERE email_threads.id = email_messages.thread_id
            AND email_threads.customer_id = auth.uid()
        )
        AND is_internal = FALSE
    );

-- Templates policies
CREATE POLICY "Admins can manage templates"
    ON email_templates FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

COMMENT ON TABLE email_threads IS 'Customer support email threads for communication management';
COMMENT ON TABLE email_messages IS 'Individual messages within email threads';
COMMENT ON TABLE email_templates IS 'Reusable email templates for quick responses';
