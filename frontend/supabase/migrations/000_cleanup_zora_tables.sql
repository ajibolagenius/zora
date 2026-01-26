-- Cleanup Script: Drop All Zora Tables, Functions, Triggers, and Policies
-- Run this BEFORE running 003_complete_zora_schema.sql manually
-- WARNING: This will delete all data in Zora tables!

-- ============== DROP TRIGGERS FIRST ==============
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_review_created ON public.reviews;
DROP TRIGGER IF EXISTS ensure_single_default_address_trigger ON public.addresses;

-- ============== DROP FUNCTIONS ==============
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_vendor_rating() CASCADE;
DROP FUNCTION IF EXISTS public.generate_unique_vendor_slug(TEXT, UUID) CASCADE;
DROP FUNCTION IF EXISTS public.ensure_single_default_address() CASCADE;
DROP FUNCTION IF EXISTS public.get_nearby_vendors(DECIMAL, DECIMAL, DECIMAL) CASCADE;

-- ============== DROP POLICIES ==============
-- Categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;

-- Regions
DROP POLICY IF EXISTS "Regions are viewable by everyone" ON public.regions;

-- Vendors
DROP POLICY IF EXISTS "Vendors are viewable by everyone" ON public.vendors;
DROP POLICY IF EXISTS "Vendors can update own profile" ON public.vendors;
DROP POLICY IF EXISTS "Vendors can insert own profile" ON public.vendors;

-- Products
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Vendors can manage own products" ON public.products;

-- Addresses
DROP POLICY IF EXISTS "Users can view own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can insert own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON public.addresses;

-- Cart Items
DROP POLICY IF EXISTS "Users can view own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete own cart items" ON public.cart_items;

-- Orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Vendors can view shop orders" ON public.orders;

-- Order Items
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Vendors can view shop order items" ON public.order_items;

-- Reviews
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;

-- Promo Codes
DROP POLICY IF EXISTS "Promo codes viewable by authenticated users" ON public.promo_codes;

-- Profiles (only Zora-specific policies, keep existing ones)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- ============== DROP TABLES (in dependency order) ==============
-- Drop tables that reference other tables first
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE; -- Note: reviews table exists from other project, but we'll drop Zora columns
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.vendors CASCADE;
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.promo_codes CASCADE;
DROP TABLE IF EXISTS public.regions CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- ============== REMOVE ZORA COLUMNS FROM REVIEWS (if they exist) ==============
-- The reviews table might exist from another project, so we'll remove Zora-specific columns
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'user_id') THEN
        ALTER TABLE public.reviews DROP COLUMN IF EXISTS user_id CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'product_id') THEN
        ALTER TABLE public.reviews DROP COLUMN IF EXISTS product_id CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'vendor_id') THEN
        ALTER TABLE public.reviews DROP COLUMN IF EXISTS vendor_id CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'order_id') THEN
        ALTER TABLE public.reviews DROP COLUMN IF EXISTS order_id CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'title') THEN
        ALTER TABLE public.reviews DROP COLUMN IF EXISTS title CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'content') THEN
        ALTER TABLE public.reviews DROP COLUMN IF EXISTS content CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'images') THEN
        ALTER TABLE public.reviews DROP COLUMN IF EXISTS images CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'helpful_count') THEN
        ALTER TABLE public.reviews DROP COLUMN IF EXISTS helpful_count CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'verified_purchase') THEN
        ALTER TABLE public.reviews DROP COLUMN IF EXISTS verified_purchase CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'updated_at') THEN
        ALTER TABLE public.reviews DROP COLUMN IF EXISTS updated_at CASCADE;
    END IF;
END $$;

-- ============== REMOVE ZORA COLUMNS FROM PROFILES (if you want a clean start) ==============
-- Uncomment these if you want to remove Zora columns from profiles table
-- DO $$ 
-- BEGIN
--     ALTER TABLE public.profiles DROP COLUMN IF EXISTS email CASCADE;
--     ALTER TABLE public.profiles DROP COLUMN IF EXISTS phone CASCADE;
--     ALTER TABLE public.profiles DROP COLUMN IF EXISTS membership_tier CASCADE;
--     ALTER TABLE public.profiles DROP COLUMN IF EXISTS zora_credits CASCADE;
--     ALTER TABLE public.profiles DROP COLUMN IF EXISTS loyalty_points CASCADE;
--     ALTER TABLE public.profiles DROP COLUMN IF EXISTS referral_code CASCADE;
--     ALTER TABLE public.profiles DROP COLUMN IF EXISTS cultural_interests CASCADE;
-- END $$;

-- ============== DROP INDEXES ==============
DROP INDEX IF EXISTS public.idx_profiles_email;
DROP INDEX IF EXISTS public.idx_profiles_referral_code;
DROP INDEX IF EXISTS public.idx_vendors_user_id;
DROP INDEX IF EXISTS public.idx_vendors_slug;
DROP INDEX IF EXISTS public.idx_vendors_location;
DROP INDEX IF EXISTS public.idx_vendors_featured;
DROP INDEX IF EXISTS public.idx_products_vendor;
DROP INDEX IF EXISTS public.idx_products_category;
DROP INDEX IF EXISTS public.idx_products_featured;
DROP INDEX IF EXISTS public.idx_addresses_user_id;
DROP INDEX IF EXISTS public.idx_addresses_default;
DROP INDEX IF EXISTS public.idx_cart_items_user_id;
DROP INDEX IF EXISTS public.idx_cart_items_product_id;
DROP INDEX IF EXISTS public.idx_cart_items_vendor_id;
DROP INDEX IF EXISTS public.idx_orders_user;
DROP INDEX IF EXISTS public.idx_orders_vendor;
DROP INDEX IF EXISTS public.idx_orders_status;
DROP INDEX IF EXISTS public.idx_orders_qr_code;
DROP INDEX IF EXISTS public.idx_order_items_order_id;
DROP INDEX IF EXISTS public.idx_order_items_product_id;
DROP INDEX IF EXISTS public.idx_reviews_product;
DROP INDEX IF EXISTS public.idx_reviews_vendor;
DROP INDEX IF EXISTS public.idx_reviews_user_id;
DROP INDEX IF EXISTS public.idx_promo_codes_code;
DROP INDEX IF EXISTS public.idx_promo_codes_active;

-- ============== VERIFICATION ==============
-- Run this to verify cleanup (should return 0 for all Zora tables)
-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
--   AND table_name IN (
--     'categories', 'regions', 'vendors', 'products', 
--     'addresses', 'cart_items', 'orders', 'order_items', 
--     'promo_codes'
--   );
