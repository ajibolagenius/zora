-- Fix admin RLS policies for consistent admin/superadmin access
-- Addresses failing RLS checks for superadmins and improves performance
-- by using the security definer function is_admin().

-- Ensure is_admin function exists (idempotent)
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

GRANT EXECUTE ON FUNCTION public.is_admin () TO authenticated;

DO $$
BEGIN
    -- Vendor Applications
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'vendor_applications') THEN
        EXECUTE 'DROP POLICY IF EXISTS "Admins can view all applications" ON public.vendor_applications';
        EXECUTE 'CREATE POLICY "Admins can view all applications" ON public.vendor_applications FOR SELECT TO authenticated USING (public.is_admin())';
        
        EXECUTE 'DROP POLICY IF EXISTS "Admins can update applications" ON public.vendor_applications';
        EXECUTE 'CREATE POLICY "Admins can update applications" ON public.vendor_applications FOR UPDATE TO authenticated USING (public.is_admin())';
    END IF;

    -- Vendor Application Status History
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'vendor_application_status_history') THEN
        EXECUTE 'DROP POLICY IF EXISTS "Admins can view status history" ON public.vendor_application_status_history';
        EXECUTE 'CREATE POLICY "Admins can view status history" ON public.vendor_application_status_history FOR SELECT TO authenticated USING (public.is_admin())';
    END IF;

    -- Email Threads
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'email_threads') THEN
        EXECUTE 'DROP POLICY IF EXISTS "Admins can view all threads" ON public.email_threads';
        EXECUTE 'CREATE POLICY "Admins can view all threads" ON public.email_threads FOR SELECT TO authenticated USING (public.is_admin())';
        
        EXECUTE 'DROP POLICY IF EXISTS "Admins can manage threads" ON public.email_threads';
        EXECUTE 'CREATE POLICY "Admins can manage threads" ON public.email_threads FOR ALL TO authenticated USING (public.is_admin())';
    END IF;

    -- Email Messages
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'email_messages') THEN
        EXECUTE 'DROP POLICY IF EXISTS "Admins can view all messages" ON public.email_messages';
        EXECUTE 'CREATE POLICY "Admins can view all messages" ON public.email_messages FOR SELECT TO authenticated USING (public.is_admin())';
        
        EXECUTE 'DROP POLICY IF EXISTS "Admins can send messages" ON public.email_messages';
        EXECUTE 'CREATE POLICY "Admins can send messages" ON public.email_messages FOR INSERT TO authenticated WITH CHECK (public.is_admin())';
    END IF;

    -- Email Templates
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'email_templates') THEN
        EXECUTE 'DROP POLICY IF EXISTS "Admins can manage templates" ON public.email_templates';
        EXECUTE 'CREATE POLICY "Admins can manage templates" ON public.email_templates FOR ALL TO authenticated USING (public.is_admin())';
    END IF;

    -- Disputes
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'disputes') THEN
        EXECUTE 'DROP POLICY IF EXISTS "Admins can manage all disputes" ON public.disputes';
        EXECUTE 'CREATE POLICY "Admins can manage all disputes" ON public.disputes FOR ALL TO authenticated USING (public.is_admin())';
        
        -- Enable Realtime for Disputes if not already enabled
        IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'disputes') THEN
            EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.disputes';
        END IF;
    END IF;
END
$$;