-- =============================================================================
-- MIGRATION: Vendor Applications System
-- Version: 016
-- Description: Create tables for vendor application and onboarding workflow
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table: vendor_applications
-- Purpose: Track vendor applications through the onboarding process
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vendor_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Business Information
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL CHECK (business_type IN ('sole_trader', 'limited_company', 'partnership', 'other')),
    business_registration_number TEXT,
    vat_number TEXT,
    description TEXT,

    -- Contact Details
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,

    -- Address
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT NOT NULL,
    postcode TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'United Kingdom',

    -- Documents (stored as JSONB with URLs)
    documents JSONB DEFAULT '{}',
    -- Example structure:
    -- {
    --   "business_registration": "https://storage.../doc.pdf",
    --   "id_document": "https://storage.../id.pdf",
    --   "proof_of_address": "https://storage.../address.pdf"
    -- }

    -- Bank Details (encrypted in production)
    bank_details JSONB DEFAULT '{}',
    -- Example structure:
    -- {
    --   "account_name": "Business Name",
    --   "account_number": "****4567",
    --   "sort_code": "**-**-89",
    --   "bank_name": "Barclays"
    -- }

    -- Coverage Areas
    coverage_areas JSONB DEFAULT '[]',
    -- Example structure:
    -- [
    --   { "postcode_prefix": "E1", "delivery_fee": 3.99, "min_order": 15 },
    --   { "postcode_prefix": "EC", "delivery_fee": 4.99, "min_order": 20 }
    -- ]

    -- Product Categories
    product_categories TEXT[] DEFAULT '{}',

    -- Cultural Region
    cultural_region TEXT CHECK (cultural_region IN ('west_africa', 'east_africa', 'north_africa', 'southern_africa', 'central_africa')),

    -- Application Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'documents_required', 'approved', 'rejected')),

    -- Review Information
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    internal_notes TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at TIMESTAMPTZ
);

-- Create index for faster lookups
CREATE INDEX idx_vendor_applications_status ON vendor_applications(status);
CREATE INDEX idx_vendor_applications_user_id ON vendor_applications(user_id);
CREATE INDEX idx_vendor_applications_email ON vendor_applications(email);
CREATE INDEX idx_vendor_applications_created_at ON vendor_applications(created_at DESC);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_vendor_application_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_vendor_applications_updated_at
    BEFORE UPDATE ON vendor_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_vendor_application_updated_at();

-- -----------------------------------------------------------------------------
-- Table: vendor_application_status_history
-- Purpose: Track status changes for audit trail
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vendor_application_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES vendor_applications(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    change_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_application_status_history_application ON vendor_application_status_history(application_id);

-- Trigger to automatically log status changes
CREATE OR REPLACE FUNCTION log_vendor_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO vendor_application_status_history (
            application_id,
            previous_status,
            new_status,
            changed_by
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            NEW.reviewed_by
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_application_status
    AFTER UPDATE ON vendor_applications
    FOR EACH ROW
    EXECUTE FUNCTION log_vendor_application_status_change();

-- -----------------------------------------------------------------------------
-- Row Level Security (RLS)
-- -----------------------------------------------------------------------------

ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_application_status_history ENABLE ROW LEVEL SECURITY;

-- Admins can see all applications
CREATE POLICY "Admins can view all applications"
    ON vendor_applications FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Admins can update applications
CREATE POLICY "Admins can update applications"
    ON vendor_applications FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Users can view their own applications
CREATE POLICY "Users can view own applications"
    ON vendor_applications FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Anyone can insert an application
CREATE POLICY "Anyone can submit application"
    ON vendor_applications FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Status history policies
CREATE POLICY "Admins can view status history"
    ON vendor_application_status_history FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

COMMENT ON TABLE vendor_applications IS 'Stores vendor application submissions for the onboarding workflow';
COMMENT ON TABLE vendor_application_status_history IS 'Audit trail for vendor application status changes';
