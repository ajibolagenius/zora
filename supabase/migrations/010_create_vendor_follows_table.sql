-- Create vendor_follows table for users to follow vendors
-- This migration creates a junction table to track which vendors users are following

CREATE TABLE IF NOT EXISTS public.vendor_follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, vendor_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_vendor_follows_user_id ON public.vendor_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_follows_vendor_id ON public.vendor_follows(vendor_id);

-- Enable Row Level Security
ALTER TABLE public.vendor_follows ENABLE ROW LEVEL SECURITY;

-- Users can view their own follows
CREATE POLICY "Users can view own follows" ON public.vendor_follows
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own follows
CREATE POLICY "Users can create own follows" ON public.vendor_follows
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own follows
CREATE POLICY "Users can delete own follows" ON public.vendor_follows
    FOR DELETE USING (auth.uid() = user_id);

-- Anyone can view follows (for public follower counts, etc.)
-- Note: This allows public viewing of follows, but RLS still applies
-- If you want to keep follows private, remove this policy
CREATE POLICY "Follows are viewable by everyone" ON public.vendor_follows
    FOR SELECT USING (true);
