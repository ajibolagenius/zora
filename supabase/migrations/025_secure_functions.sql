-- Secure 15 SECURITY DEFINER functions by setting explicit search_path
-- Also ensures postgis extension is in the correct schema

-- 1. Ensure PostGIS is in the extensions schema (Skipped due to compatibility issues)
-- CREATE SCHEMA IF NOT EXISTS extensions;
-- ALTER EXTENSION postgis SET SCHEMA extensions;

-- 2. Secure functions by setting search_path to 'public, extensions, pg_temp'

-- public.handle_new_user()
ALTER FUNCTION public.handle_new_user() 
SET search_path = public, extensions, pg_temp;

-- public.check_low_stock_notification()
ALTER FUNCTION public.check_low_stock_notification() 
SET search_path = public, extensions, pg_temp;

-- public.set_dispute_resolved_at()
ALTER FUNCTION public.set_dispute_resolved_at() 
SET search_path = public, extensions, pg_temp;

-- public.restore_inventory_on_order_cancellation()
ALTER FUNCTION public.restore_inventory_on_order_cancellation() 
SET search_path = public, extensions, pg_temp;

-- public.ensure_single_default_address()
ALTER FUNCTION public.ensure_single_default_address() 
SET search_path = public, extensions, pg_temp;

-- public.restore_inventory_on_order_refund()
ALTER FUNCTION public.restore_inventory_on_order_refund() 
SET search_path = public, extensions, pg_temp;

-- public.generate_unique_vendor_slug(TEXT, UUID)
-- Note: UUID parameter has a default value, but for ALTER FUNCTION we specify types
ALTER FUNCTION public.generate_unique_vendor_slug(TEXT, UUID) 
SET search_path = public, extensions, pg_temp;

-- public.handle_order_status_update()
ALTER FUNCTION public.handle_order_status_update() 
SET search_path = public, extensions, pg_temp;

-- public.get_nearby_vendors(DECIMAL, DECIMAL, DECIMAL)
ALTER FUNCTION public.get_nearby_vendors(DECIMAL, DECIMAL, DECIMAL) 
SET search_path = public, extensions, pg_temp;

-- public.update_conversation_on_message()
ALTER FUNCTION public.update_conversation_on_message() 
SET search_path = public, extensions, pg_temp;

-- public.update_disputes_updated_at()
ALTER FUNCTION public.update_disputes_updated_at() 
SET search_path = public, extensions, pg_temp;

-- public.reset_unread_count_on_read()
ALTER FUNCTION public.reset_unread_count_on_read() 
SET search_path = public, extensions, pg_temp;

-- public.create_support_conversation_if_needed()
ALTER FUNCTION public.create_support_conversation_if_needed() 
SET search_path = public, extensions, pg_temp;

-- public.update_vendor_rating()
ALTER FUNCTION public.update_vendor_rating() 
SET search_path = public, extensions, pg_temp;

-- public.deduct_inventory_on_order_confirmation()
ALTER FUNCTION public.deduct_inventory_on_order_confirmation() 
SET search_path = public, extensions, pg_temp;