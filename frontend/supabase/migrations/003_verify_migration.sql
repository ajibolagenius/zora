-- Verification Script: Check if Migration Completed Successfully
-- Run this after running 003_complete_zora_schema.sql

-- Check Tables
SELECT 
    'Tables Check' as check_type,
    COUNT(*) as count,
    string_agg(table_name, ', ' ORDER BY table_name) as details
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'categories', 'regions', 'vendors', 'products', 
    'addresses', 'cart_items', 'orders', 'order_items', 
    'reviews', 'promo_codes'
  );

-- Check Functions
SELECT 
    'Functions Check' as check_type,
    COUNT(*) as count,
    string_agg(routine_name, ', ' ORDER BY routine_name) as details
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN (
    'handle_new_user',
    'update_vendor_rating',
    'generate_unique_vendor_slug',
    'ensure_single_default_address',
    'get_nearby_vendors'
  );

-- Check Triggers
SELECT 
    'Triggers Check' as check_type,
    COUNT(*) as count,
    string_agg(trigger_name, ', ' ORDER BY trigger_name) as details
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name IN (
    'on_auth_user_created',
    'on_review_created',
    'ensure_single_default_address_trigger'
  );

-- Check Sample Data
SELECT 
    'Categories Data' as check_type,
    COUNT(*) as count
FROM categories
UNION ALL
SELECT 
    'Regions Data' as check_type,
    COUNT(*) as count
FROM regions
UNION ALL
SELECT 
    'Promo Codes Data' as check_type,
    COUNT(*) as count
FROM promo_codes;
