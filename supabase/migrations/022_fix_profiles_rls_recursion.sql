-- Fix infinite recursion in profiles RLS policies
-- The issue: Admin policies on profiles table query profiles table itself,
-- causing infinite recursion when RLS is evaluated.
-- Solution: Use a security definer function to check admin status without triggering RLS.

-- ============== SECURITY DEFINER FUNCTION ==============
-- This function runs with the privileges of the function owner (postgres),
-- bypassing RLS to check if the current user has admin/superadmin role.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'superadmin')
    );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ============== DROP PROBLEMATIC POLICIES ==============
-- Drop the policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;

-- ============== RECREATE PROFILES POLICIES ==============
-- Admins can view all profiles (using security definer function)
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        public.is_admin()
    );

-- Admins can update any profile (using security definer function)
CREATE POLICY "Admins can update profiles" ON public.profiles
    FOR UPDATE USING (
        public.is_admin()
    );

-- ============== FIX OTHER POLICIES THAT REFERENCE PROFILES ==============
-- Update all other policies to use the is_admin() function for consistency
-- This also improves performance by avoiding repeated subqueries

-- Orders policies
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update any order" ON public.orders;
CREATE POLICY "Admins can update any order" ON public.orders
    FOR UPDATE USING (public.is_admin());

-- Order items policies
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
CREATE POLICY "Admins can view all order items" ON public.order_items
    FOR SELECT USING (public.is_admin());

-- Vendors policies
DROP POLICY IF EXISTS "Admins can view all vendors" ON public.vendors;
CREATE POLICY "Admins can view all vendors" ON public.vendors
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update any vendor" ON public.vendors;
CREATE POLICY "Admins can update any vendor" ON public.vendors
    FOR UPDATE USING (public.is_admin());

-- Products policies
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
CREATE POLICY "Admins can view all products" ON public.products
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update any product" ON public.products;
CREATE POLICY "Admins can update any product" ON public.products
    FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete any product" ON public.products;
CREATE POLICY "Admins can delete any product" ON public.products
    FOR DELETE USING (public.is_admin());

-- Reviews policies
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.reviews;
CREATE POLICY "Admins can manage all reviews" ON public.reviews
    FOR ALL USING (public.is_admin());

-- Notifications policies
DROP POLICY IF EXISTS "Admins can view all notifications" ON public.notifications;
CREATE POLICY "Admins can view all notifications" ON public.notifications
    FOR SELECT USING (public.is_admin());

-- ============== ADDITIONAL POLICIES FOR CONVERSATIONS ==============
-- Fix conversations policies that may also reference profiles
DROP POLICY IF EXISTS "Admins can view all conversations" ON public.conversations;
CREATE POLICY "Admins can view all conversations" ON public.conversations
    FOR SELECT USING (public.is_admin());

-- ============== COMMENT ==============
COMMENT ON FUNCTION public.is_admin() IS 
'Security definer function to check if current user is admin/superadmin. 
Bypasses RLS to prevent infinite recursion when checking admin status.';
