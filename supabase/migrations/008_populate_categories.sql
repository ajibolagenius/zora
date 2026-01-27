-- Populate categories table with 10-12 categories for onboarding
-- This expands the category options for product selection

INSERT INTO public.categories (name, slug, description, display_order, is_active) VALUES
    ('Traditional Ingredients', 'traditional-ingredients', 'Authentic African ingredients and staples', 1, true),
    ('Spices & Seasonings', 'spices-seasonings', 'African spices, herbs, and seasonings', 2, true),
    ('Beverages', 'beverages', 'African drinks, teas, and beverages', 3, true),
    ('Beauty & Skincare', 'beauty-skincare', 'Natural African beauty and skincare products', 4, true),
    ('Fashion & Textiles', 'fashion-textiles', 'African fabrics, clothing, and accessories', 5, true),
    ('Art & Crafts', 'art-crafts', 'Handmade African art and crafts', 6, true),
    ('Grains & Cereals', 'grains-cereals', 'Traditional African grains and cereals', 7, true),
    ('Oils & Condiments', 'oils-condiments', 'African cooking oils and condiments', 8, true),
    ('Snacks & Treats', 'snacks-treats', 'African snacks and traditional treats', 9, true),
    ('Home & Living', 'home-living', 'African home decor and living essentials', 10, true),
    ('Health & Wellness', 'health-wellness', 'African health and wellness products', 11, true),
    ('Books & Media', 'books-media', 'African literature, music, and media', 12, true)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();
