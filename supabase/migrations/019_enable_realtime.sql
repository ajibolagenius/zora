-- =============================================================================
-- MIGRATION: Enable Realtime Publications
-- Version: 019
-- Description: Enable Supabase Realtime for core tables to support bidirectional
--              real-time data updates across Mobile, Vendor, and Admin apps
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Enable Realtime for Core Tables
-- These tables will broadcast INSERT, UPDATE, DELETE events to connected clients
-- -----------------------------------------------------------------------------

-- Orders and related tables (critical for order tracking)
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;

-- Products (for inventory updates, price changes)
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- Vendors (for profile updates, verification status)
ALTER PUBLICATION supabase_realtime ADD TABLE public.vendors;

-- Cart items (for cross-device cart sync)
ALTER PUBLICATION supabase_realtime ADD TABLE public.cart_items;

-- Notifications (for real-time alerts)
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Reviews (for new review alerts)
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;

-- User profiles (for profile sync)
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- -----------------------------------------------------------------------------
-- Enable Realtime for Admin/Vendor Management Tables
-- -----------------------------------------------------------------------------

-- Vendor applications (for admin approval workflow)
ALTER PUBLICATION supabase_realtime ADD TABLE public.vendor_applications;

-- Email threads (for customer support)
ALTER PUBLICATION supabase_realtime ADD TABLE public.email_threads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.email_messages;

-- Conversations and messages (for in-app messaging)
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Wishlist (for cross-device sync)
ALTER PUBLICATION supabase_realtime ADD TABLE public.wishlists;

-- Vendor follows (for follower notifications)
ALTER PUBLICATION supabase_realtime ADD TABLE public.vendor_follows;

-- -----------------------------------------------------------------------------
-- Create helper function for custom broadcast events
-- This allows apps to send custom events through Supabase Realtime
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.broadcast_event(
    p_channel_name TEXT,
    p_event_type TEXT,
    p_payload JSONB DEFAULT '{}'
)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    -- Build the event payload
    v_result := jsonb_build_object(
        'channel', p_channel_name,
        'event', p_event_type,
        'payload', p_payload,
        'timestamp', NOW()
    );

    -- Use pg_notify for custom events
    -- Clients can listen to these via Supabase Realtime broadcast
    PERFORM pg_notify(
        p_channel_name,
        v_result::TEXT
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.broadcast_event TO authenticated;

-- -----------------------------------------------------------------------------
-- Comments
-- -----------------------------------------------------------------------------

COMMENT ON FUNCTION public.broadcast_event IS 'Broadcast custom events through Supabase Realtime channels';
