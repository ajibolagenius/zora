-- =============================================================================
-- MIGRATION: Admin Activity Log
-- Version: 017
-- Description: Create table for tracking admin actions for audit purposes
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table: admin_activity_log
-- Purpose: Track all admin actions for audit and compliance
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Admin who performed the action
    admin_id UUID NOT NULL REFERENCES auth.users(id),
    admin_email TEXT NOT NULL,

    -- Action details
    action TEXT NOT NULL,
    -- Examples: 'order.status_changed', 'vendor.approved', 'product.flagged', 'refund.processed'

    action_category TEXT NOT NULL CHECK (action_category IN (
        'order', 'vendor', 'customer', 'product', 'review', 'refund', 'settings', 'user', 'other'
    )),

    -- Entity information
    entity_type TEXT NOT NULL,
    -- Examples: 'order', 'vendor', 'customer', 'product', 'review'

    entity_id UUID,
    entity_identifier TEXT, -- Human-readable identifier (e.g., order number)

    -- Action details as JSON
    details JSONB DEFAULT '{}',
    -- Example structure:
    -- {
    --   "previous_value": "pending",
    --   "new_value": "approved",
    --   "reason": "All documents verified"
    -- }

    -- Additional metadata
    ip_address INET,
    user_agent TEXT,

    -- Timestamp
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_admin_activity_admin_id ON admin_activity_log(admin_id);
CREATE INDEX idx_admin_activity_action ON admin_activity_log(action);
CREATE INDEX idx_admin_activity_category ON admin_activity_log(action_category);
CREATE INDEX idx_admin_activity_entity ON admin_activity_log(entity_type, entity_id);
CREATE INDEX idx_admin_activity_created_at ON admin_activity_log(created_at DESC);

-- Composite index for common queries
CREATE INDEX idx_admin_activity_category_date ON admin_activity_log(action_category, created_at DESC);

-- -----------------------------------------------------------------------------
-- Function: log_admin_activity
-- Purpose: Helper function to easily log admin actions
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION log_admin_activity(
    p_admin_id UUID,
    p_admin_email TEXT,
    p_action TEXT,
    p_action_category TEXT,
    p_entity_type TEXT,
    p_entity_id UUID DEFAULT NULL,
    p_entity_identifier TEXT DEFAULT NULL,
    p_details JSONB DEFAULT '{}',
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO admin_activity_log (
        admin_id,
        admin_email,
        action,
        action_category,
        entity_type,
        entity_id,
        entity_identifier,
        details,
        ip_address,
        user_agent
    ) VALUES (
        p_admin_id,
        p_admin_email,
        p_action,
        p_action_category,
        p_entity_type,
        p_entity_id,
        p_entity_identifier,
        p_details,
        p_ip_address,
        p_user_agent
    )
    RETURNING id INTO v_log_id;

    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- Row Level Security (RLS)
-- -----------------------------------------------------------------------------

ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view the activity log
CREATE POLICY "Admins can view activity log"
    ON admin_activity_log FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Only the system can insert (via functions)
CREATE POLICY "System can insert activity log"
    ON admin_activity_log FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- No updates or deletes allowed (audit trail must be immutable)
-- (No UPDATE or DELETE policies)

COMMENT ON TABLE admin_activity_log IS 'Immutable audit log of all admin actions on the platform';
COMMENT ON FUNCTION log_admin_activity IS 'Helper function to log admin activity with all necessary metadata';
