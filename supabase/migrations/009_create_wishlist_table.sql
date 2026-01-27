-- Create wishlist table for user favorites
-- This allows users to save products they're interested in

CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own wishlist" ON public.wishlist_items;
DROP POLICY IF EXISTS "Users can add to own wishlist" ON public.wishlist_items;
DROP POLICY IF EXISTS "Users can remove from own wishlist" ON public.wishlist_items;

-- Users can view their own wishlist
CREATE POLICY "Users can view own wishlist" ON public.wishlist_items
    FOR SELECT USING (auth.uid() = user_id);

-- Users can add to their own wishlist
CREATE POLICY "Users can add to own wishlist" ON public.wishlist_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can remove from their own wishlist
CREATE POLICY "Users can remove from own wishlist" ON public.wishlist_items
    FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON public.wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product_id ON public.wishlist_items(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_product ON public.wishlist_items(user_id, product_id);
