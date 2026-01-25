-- Supabase Migration Script for Zora African Market
-- Run this in your Supabase SQL Editor to set up the database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============== USERS TABLE ==============
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    phone TEXT,
    membership_tier TEXT DEFAULT 'bronze' CHECK (membership_tier IN ('bronze', 'silver', 'gold', 'platinum')),
    zora_credits DECIMAL(10,2) DEFAULT 0.00,
    loyalty_points INTEGER DEFAULT 0,
    cultural_interests TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- ============== VENDORS TABLE ==============
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    shop_name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    address TEXT NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    coverage_radius_km DECIMAL(5,2) DEFAULT 5.00,
    is_verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(2,1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    cultural_specialties TEXT[] DEFAULT '{}',
    categories TEXT[] DEFAULT '{}',
    delivery_time_min INTEGER DEFAULT 30,
    delivery_time_max INTEGER DEFAULT 45,
    delivery_fee DECIMAL(5,2) DEFAULT 2.99,
    minimum_order DECIMAL(6,2) DEFAULT 15.00,
    is_featured BOOLEAN DEFAULT FALSE,
    badge TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Anyone can view vendors
CREATE POLICY "Vendors are viewable by everyone" ON public.vendors
    FOR SELECT USING (true);

-- Vendors can update their own profile
CREATE POLICY "Vendors can update own profile" ON public.vendors
    FOR UPDATE USING (auth.uid() = user_id);

-- ============== PRODUCTS TABLE ==============
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    unit_price_label TEXT,
    stock_quantity INTEGER DEFAULT 0,
    category TEXT NOT NULL,
    cultural_region TEXT,
    image_urls TEXT[] DEFAULT '{}',
    weight TEXT,
    certifications TEXT[] DEFAULT '{}',
    nutrition JSONB,
    heritage_story TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    badge TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can view active products
CREATE POLICY "Products are viewable by everyone" ON public.products
    FOR SELECT USING (is_active = true);

-- Vendors can manage their own products
CREATE POLICY "Vendors can manage own products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.vendors 
            WHERE vendors.id = products.vendor_id 
            AND vendors.user_id = auth.uid()
        )
    );

-- ============== ORDERS TABLE ==============
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    vendor_id UUID REFERENCES public.vendors(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled')),
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(5,2) DEFAULT 0.00,
    service_fee DECIMAL(5,2) DEFAULT 0.50,
    discount DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    delivery_address JSONB NOT NULL,
    delivery_instructions TEXT,
    estimated_delivery TIMESTAMPTZ,
    actual_delivery TIMESTAMPTZ,
    driver_id UUID,
    tracking_url TEXT,
    qr_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create orders
CREATE POLICY "Users can create orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Vendors can view orders for their shop
CREATE POLICY "Vendors can view shop orders" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.vendors 
            WHERE vendors.id = orders.vendor_id 
            AND vendors.user_id = auth.uid()
        )
    );

-- ============== REVIEWS TABLE ==============
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    images TEXT[] DEFAULT '{}',
    helpful_count INTEGER DEFAULT 0,
    verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (true);

-- Users can create reviews
CREATE POLICY "Users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- ============== PROMO CODES TABLE ==============
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_delivery')),
    value DECIMAL(10,2) NOT NULL,
    min_order DECIMAL(10,2) DEFAULT 0.00,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can view active promo codes
CREATE POLICY "Promo codes viewable by authenticated users" ON public.promo_codes
    FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- ============== FUNCTIONS ==============

-- Function to get nearby vendors using PostGIS
CREATE OR REPLACE FUNCTION public.get_nearby_vendors(
    user_lat DECIMAL,
    user_lng DECIMAL,
    radius_km DECIMAL DEFAULT 10
)
RETURNS SETOF public.vendors AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.vendors
    WHERE (
        6371 * acos(
            cos(radians(user_lat)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(user_lng)) +
            sin(radians(user_lat)) * sin(radians(latitude))
        )
    ) <= radius_km
    ORDER BY (
        6371 * acos(
            cos(radians(user_lat)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(user_lng)) +
            sin(radians(user_lat)) * sin(radians(latitude))
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to update vendor rating when review is added
CREATE OR REPLACE FUNCTION public.update_vendor_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.vendor_id IS NOT NULL THEN
        UPDATE public.vendors
        SET 
            rating = (SELECT AVG(rating) FROM public.reviews WHERE vendor_id = NEW.vendor_id),
            review_count = (SELECT COUNT(*) FROM public.reviews WHERE vendor_id = NEW.vendor_id),
            updated_at = NOW()
        WHERE id = NEW.vendor_id;
    END IF;
    
    IF NEW.product_id IS NOT NULL THEN
        UPDATE public.products
        SET 
            rating = (SELECT AVG(rating) FROM public.reviews WHERE product_id = NEW.product_id),
            review_count = (SELECT COUNT(*) FROM public.reviews WHERE product_id = NEW.product_id),
            updated_at = NOW()
        WHERE id = NEW.product_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating ratings
CREATE TRIGGER on_review_created
    AFTER INSERT ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_vendor_rating();

-- ============== INDEXES ==============
CREATE INDEX IF NOT EXISTS idx_vendors_location ON public.vendors(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_vendors_featured ON public.vendors(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_vendor ON public.products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor ON public.orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_vendor ON public.reviews(vendor_id);

-- ============== SAMPLE DATA ==============
-- Insert some sample promo codes
INSERT INTO public.promo_codes (code, type, value, min_order, valid_from, valid_until) VALUES
    ('WELCOME10', 'percentage', 10, 20, NOW(), NOW() + INTERVAL '1 year'),
    ('FREESHIP', 'free_delivery', 0, 30, NOW(), NOW() + INTERVAL '1 year'),
    ('SAVE5', 'fixed', 5, 25, NOW(), NOW() + INTERVAL '6 months')
ON CONFLICT (code) DO NOTHING;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
