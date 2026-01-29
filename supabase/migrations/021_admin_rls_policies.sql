-- Admin RLS Policies Migration
-- This migration adds policies allowing admins to view and manage all data

-- ============== ORDERS TABLE - Admin Policies ==============
-- Allow admins to view all orders
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'superadmin')
        )
    );

-- Allow admins to update any order
DROP POLICY IF EXISTS "Admins can update any order" ON public.orders;
CREATE POLICY "Admins can update any order" ON public.orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'superadmin')
        )
    );

-- ============== ORDER ITEMS TABLE - Admin Policies ==============
-- Allow admins to view all order items
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
CREATE POLICY "Admins can view all order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'superadmin')
        )
    );

-- ============== PROFILES TABLE - Admin Policies ==============
-- Allow admins to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles AS admin_profile
            WHERE admin_profile.id = auth.uid()
            AND admin_profile.role IN ('admin', 'superadmin')
        )
    );

-- Allow admins to update profiles (for moderation purposes)
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles AS admin_profile
            WHERE admin_profile.id = auth.uid()
            AND admin_profile.role IN ('admin', 'superadmin')
        )
    );

-- ============== VENDORS TABLE - Admin Policies ==============
-- Allow admins to view all vendors (including unverified)
DROP POLICY IF EXISTS "Admins can view all vendors" ON public.vendors;
CREATE POLICY "Admins can view all vendors" ON public.vendors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'superadmin')
        )
    );

-- Allow admins to update any vendor
DROP POLICY IF EXISTS "Admins can update any vendor" ON public.vendors;
CREATE POLICY "Admins can update any vendor" ON public.vendors
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'superadmin')
        )
    );

-- ============== PRODUCTS TABLE - Admin Policies ==============
-- Allow admins to view all products (including inactive)
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
CREATE POLICY "Admins can view all products" ON public.products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'superadmin')
        )
    );

-- Allow admins to update any product
DROP POLICY IF EXISTS "Admins can update any product" ON public.products;
CREATE POLICY "Admins can update any product" ON public.products
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'superadmin')
        )
    );

-- Allow admins to delete any product
DROP POLICY IF EXISTS "Admins can delete any product" ON public.products;
CREATE POLICY "Admins can delete any product" ON public.products
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'superadmin')
        )
    );

-- ============== REVIEWS TABLE - Admin Policies ==============
-- Allow admins to manage all reviews
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.reviews;
CREATE POLICY "Admins can manage all reviews" ON public.reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'superadmin')
        )
    );

-- Add is_approved column to reviews if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'reviews' 
        AND column_name = 'is_approved'
    ) THEN
        ALTER TABLE public.reviews ADD COLUMN is_approved BOOLEAN DEFAULT false;
    END IF;
END $$;

-- ============== NOTIFICATIONS TABLE - Admin Policies ==============
-- Allow admins to view all notifications
DROP POLICY IF EXISTS "Admins can view all notifications" ON public.notifications;
CREATE POLICY "Admins can view all notifications" ON public.notifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'superadmin')
        )
    );

-- ============== INDEXES for performance ==============
-- Add index on profiles.role for faster admin checks
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Add index on orders.status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_status_v2 ON public.orders(status, created_at DESC);

-- ============== Grant necessary permissions ==============
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
