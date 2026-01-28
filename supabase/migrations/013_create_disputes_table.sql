-- Create disputes table for order dispute management
-- This migration creates a table to track customer disputes about orders

-- ============== DISPUTES TABLE ==============
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    issue_type TEXT NOT NULL CHECK (issue_type IN ('missing', 'wrong', 'damaged', 'quality', 'other')),
    affected_items JSONB NOT NULL, -- Array of item IDs from the order
    description TEXT NOT NULL,
    preferred_resolution TEXT NOT NULL CHECK (preferred_resolution IN ('refund', 'replacement', 'partial_refund', 'store_credit', 'other')),
    evidence_images TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved', 'rejected', 'closed')),
    resolution TEXT, -- Final resolution decision
    resolution_notes TEXT, -- Admin notes about the resolution
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES public.profiles(id), -- Admin who resolved it
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_disputes_order_id ON public.disputes(order_id);
CREATE INDEX IF NOT EXISTS idx_disputes_user_id ON public.disputes(user_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_created_at ON public.disputes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Users can view their own disputes
CREATE POLICY "Users can view own disputes" ON public.disputes
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create disputes for their orders
CREATE POLICY "Users can create disputes" ON public.disputes
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = disputes.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Users can update their own pending disputes
CREATE POLICY "Users can update own pending disputes" ON public.disputes
    FOR UPDATE USING (
        auth.uid() = user_id 
        AND status = 'pending'
    );

-- Vendors can view disputes for their orders
CREATE POLICY "Vendors can view shop disputes" ON public.disputes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            JOIN public.vendors ON vendors.id = orders.vendor_id
            WHERE orders.id = disputes.order_id 
            AND vendors.user_id = auth.uid()
        )
    );

-- Admins can view and update all disputes
-- Note: This assumes you have an admin role system
-- You may need to adjust this based on your admin implementation
CREATE POLICY "Admins can manage all disputes" ON public.disputes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_disputes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on dispute changes
DROP TRIGGER IF EXISTS on_dispute_updated ON public.disputes;
CREATE TRIGGER on_dispute_updated
    BEFORE UPDATE ON public.disputes
    FOR EACH ROW
    EXECUTE FUNCTION update_disputes_updated_at();

-- Function to set resolved_at when status changes to resolved
CREATE OR REPLACE FUNCTION set_dispute_resolved_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status IN ('resolved', 'closed') AND OLD.status NOT IN ('resolved', 'closed') THEN
        NEW.resolved_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set resolved_at timestamp
DROP TRIGGER IF EXISTS on_dispute_resolved ON public.disputes;
CREATE TRIGGER on_dispute_resolved
    BEFORE UPDATE ON public.disputes
    FOR EACH ROW
    WHEN (NEW.status IN ('resolved', 'closed') AND OLD.status NOT IN ('resolved', 'closed'))
    EXECUTE FUNCTION set_dispute_resolved_at();
