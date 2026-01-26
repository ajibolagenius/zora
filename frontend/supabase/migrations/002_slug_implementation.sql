-- Migration: Slug Implementation for Vendors and Products
-- Adds semantic slugs for vendors and changes products to UUIDv7

-- ============== VENDORS: Add Slug Column ==============

-- Add slug column to vendors table
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_vendors_slug ON public.vendors(slug) 
WHERE slug IS NOT NULL;

-- Generate slugs for existing vendors (if any)
-- This uses a comprehensive slug generation that handles uniqueness
DO $$
DECLARE
    vendor_record RECORD;
    base_slug TEXT;
    unique_slug TEXT;
    counter INTEGER;
    slug_exists BOOLEAN;
BEGIN
    -- Loop through all vendors without slugs
    FOR vendor_record IN 
        SELECT id, shop_name 
        FROM public.vendors 
        WHERE slug IS NULL OR slug = ''
    LOOP
        -- Generate base slug: lowercase, replace spaces with hyphens, remove special chars
        base_slug := LOWER(REGEXP_REPLACE(
            REGEXP_REPLACE(vendor_record.shop_name, '[^a-zA-Z0-9\s-]', '', 'g'),
            '\s+', '-', 'g'
        ));
        
        -- Remove leading/trailing hyphens
        base_slug := TRIM(BOTH '-' FROM base_slug);
        
        -- Limit length to 100 characters
        base_slug := LEFT(base_slug, 100);
        
        -- Ensure slug is not empty
        IF base_slug = '' THEN
            base_slug := 'vendor-' || SUBSTRING(vendor_record.id::TEXT, 1, 8);
        END IF;
        
        -- Check if base slug is unique
        unique_slug := base_slug;
        counter := 0;
        slug_exists := TRUE;
        
        -- Keep trying until we find a unique slug
        WHILE slug_exists LOOP
            -- Check if slug already exists (excluding current vendor)
            SELECT EXISTS(
                SELECT 1 FROM public.vendors 
                WHERE slug = unique_slug 
                AND id != vendor_record.id
            ) INTO slug_exists;
            
            -- If slug exists, append counter
            IF slug_exists THEN
                counter := counter + 1;
                unique_slug := base_slug || '-' || counter::TEXT;
                
                -- Safety check to prevent infinite loop
                IF counter > 1000 THEN
                    -- Fallback to using part of UUID
                    unique_slug := base_slug || '-' || SUBSTRING(vendor_record.id::TEXT, 1, 8);
                    slug_exists := FALSE;
                END IF;
            END IF;
        END LOOP;
        
        -- Update vendor with unique slug
        UPDATE public.vendors
        SET slug = unique_slug
        WHERE id = vendor_record.id;
        
    END LOOP;
END $$;

-- Add constraint to ensure slug uniqueness
ALTER TABLE public.vendors
ADD CONSTRAINT vendors_slug_unique UNIQUE (slug);

-- ============== PRODUCTS: Change to UUIDv7 ==============

-- Note: UUIDv7 requires the pg_uuidv7 extension
-- First, check if extension exists, if not, we'll need to install it
-- For Supabase, you may need to request this extension to be enabled

-- Create extension if available (may require Supabase support)
-- CREATE EXTENSION IF NOT EXISTS "pg_uuidv7";

-- Since UUIDv7 extension might not be available in all Supabase instances,
-- we'll use a workaround: create a function that generates UUIDv7-like IDs
-- Or use the uuid_generate_v7() function if the extension is available

-- For now, we'll create a function that generates time-ordered UUIDs
-- This is a simplified approach - for true UUIDv7, you need the extension

-- Create function to generate UUIDv7-like IDs (time-ordered)
-- This is a workaround until pg_uuidv7 is available
CREATE OR REPLACE FUNCTION generate_uuidv7()
RETURNS UUID AS $$
DECLARE
    timestamp_bytes BYTEA;
    random_bytes BYTEA;
    uuid_bytes BYTEA;
    unix_ts_ms BIGINT;
BEGIN
    -- Get current timestamp in milliseconds
    unix_ts_ms := EXTRACT(EPOCH FROM NOW()) * 1000;
    
    -- Convert timestamp to bytes (48 bits for timestamp)
    timestamp_bytes := decode(lpad(to_hex(unix_ts_ms), 12, '0'), 'hex');
    
    -- Generate random bytes for the rest (80 bits)
    random_bytes := gen_random_bytes(10);
    
    -- Combine: timestamp (6 bytes) + version (4 bits = 0x7) + variant (2 bits = 0x8) + random (10 bytes)
    -- UUID format: xxxxxxxx-xxxx-7xxx-8xxx-xxxxxxxxxxxx
    uuid_bytes := substring(timestamp_bytes from 1 for 6) || 
                  set_byte(gen_random_bytes(2), 0, (get_byte(gen_random_bytes(1), 0) & 15) | 112) || -- version 7
                  set_byte(gen_random_bytes(2), 0, (get_byte(gen_random_bytes(1), 0) & 63) | 128) || -- variant 10
                  random_bytes;
    
    -- Convert to UUID
    RETURN encode(uuid_bytes, 'hex')::uuid;
END;
$$ LANGUAGE plpgsql;

-- Update products table to use UUIDv7-like generation
-- Note: This only affects NEW products. Existing products keep their UUIDv4 IDs
-- To convert existing products, you would need to:
-- 1. Create new UUIDv7 IDs
-- 2. Update all foreign key references
-- 3. This is a destructive operation, so be careful

-- For new products, change the default
ALTER TABLE public.products
ALTER COLUMN id SET DEFAULT generate_uuidv7();

-- ============== INDEXES ==============

-- Index on vendor slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_vendors_slug_lookup ON public.vendors(slug) 
WHERE slug IS NOT NULL;

-- Product ID index already exists, but ensure it's optimized
CREATE INDEX IF NOT EXISTS idx_products_id_lookup ON public.products(id);

-- ============== HELPER FUNCTIONS ==============

-- Function to check if a vendor slug is unique
CREATE OR REPLACE FUNCTION check_vendor_slug_unique(
    p_slug TEXT,
    p_exclude_vendor_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    exists_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO exists_count
    FROM public.vendors
    WHERE slug = p_slug
    AND (p_exclude_vendor_id IS NULL OR id != p_exclude_vendor_id);
    
    RETURN exists_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate a unique vendor slug
CREATE OR REPLACE FUNCTION generate_unique_vendor_slug(
    p_shop_name TEXT,
    p_exclude_vendor_id UUID DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    unique_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Generate base slug
    base_slug := LOWER(REGEXP_REPLACE(
        REGEXP_REPLACE(p_shop_name, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
    ));
    
    -- Remove leading/trailing hyphens
    base_slug := TRIM(BOTH '-' FROM base_slug);
    
    -- Limit length
    base_slug := LEFT(base_slug, 100);
    
    -- Check if base slug is unique
    unique_slug := base_slug;
    
    WHILE EXISTS (
        SELECT 1 FROM public.vendors
        WHERE slug = unique_slug
        AND (p_exclude_vendor_id IS NULL OR id != p_exclude_vendor_id)
    ) LOOP
        counter := counter + 1;
        unique_slug := base_slug || '-' || counter::TEXT;
        
        -- Safety check to prevent infinite loop
        IF counter > 1000 THEN
            RAISE EXCEPTION 'Unable to generate unique slug after 1000 attempts';
        END IF;
    END LOOP;
    
    RETURN unique_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============== COMMENTS ==============

COMMENT ON COLUMN public.vendors.slug IS 'URL-friendly semantic slug for vendor storefront (e.g., tech-gear-city)';
COMMENT ON FUNCTION generate_uuidv7() IS 'Generates time-ordered UUIDs similar to UUIDv7 for better index performance';
COMMENT ON FUNCTION check_vendor_slug_unique(TEXT, UUID) IS 'Checks if a vendor slug is unique, optionally excluding a vendor ID';
COMMENT ON FUNCTION generate_unique_vendor_slug(TEXT, UUID) IS 'Generates a unique vendor slug from shop name, appending numbers if needed';
