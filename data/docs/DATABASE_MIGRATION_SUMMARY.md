# Database Migration Summary - Zora African Market

## Migration Applied: 003_complete_zora_schema.sql

**Date**: 2026-01-26  
**Status**: ✅ Completed

---

## Tables Created/Updated

### ✅ Core Tables

1. **profiles** (Extended)
   - Added Zora-specific columns: `email`, `phone`, `membership_tier`, `zora_credits`, `loyalty_points`, `referral_code`, `cultural_interests`
   - Uses Supabase best practice: extends `auth.users` via foreign key
   - Auto-created via `handle_new_user()` trigger on user signup

2. **categories**
   - Product categories (Spices, Grains, Vegetables, Meats, Textiles, Beverages)
   - Includes slug, description, display order

3. **regions**
   - African regions (West, East, North, South, Central Africa)
   - Includes slug, flag emoji, display order

4. **vendors**
   - Vendor/shop information
   - Includes slug for SEO-friendly URLs
   - Location data (latitude/longitude) for geospatial queries
   - References `profiles(id)` for vendor user accounts

5. **products**
   - Product catalog
   - References `vendors(id)`
   - Supports cultural regions, certifications, nutrition data

6. **addresses**
   - User delivery addresses
   - Supports default address (only one per user via trigger)
   - Includes geolocation data

7. **cart_items**
   - Shopping cart items
   - Unique constraint: one item per product per user
   - References `profiles(id)`, `products(id)`, `vendors(id)`

8. **orders**
   - Customer orders
   - Status tracking: pending → confirmed → preparing → ready → out_for_delivery → delivered → cancelled
   - Payment status tracking
   - QR code for order verification

9. **order_items**
   - Individual items in orders (snapshot of product data at time of order)
   - Prevents issues if product prices/names change

10. **reviews** (Extended)
    - Added Zora-specific columns: `user_id`, `product_id`, `vendor_id`, `order_id`, `title`, `content`, `images`, `helpful_count`, `verified_purchase`
    - Supports both Zora marketplace reviews and existing project reviews

11. **promo_codes**
    - Promotional codes
    - Types: percentage, fixed, free_delivery
    - Usage tracking and expiration

---

## Functions & Triggers

### ✅ Functions Created

1. **handle_new_user()**
   - Automatically creates profile when user signs up
   - Extracts data from `auth.users` metadata
   - Generates referral code: `ZORA{first6chars}`
   - Handles OAuth users (Google, etc.)

2. **update_vendor_rating()**
   - Updates vendor and product ratings when reviews are added
   - Calculates average rating and review count
   - Triggered automatically on review insert

3. **generate_unique_vendor_slug()**
   - Generates SEO-friendly slugs for vendors
   - Ensures uniqueness with counter suffix if needed

4. **ensure_single_default_address()**
   - Ensures only one default address per user
   - Automatically unsets other defaults when new one is set

5. **get_nearby_vendors()**
   - Geospatial query for finding vendors within radius
   - Uses Haversine formula for distance calculation

### ✅ Triggers Created

1. **on_auth_user_created**
   - Fires when new user is created in `auth.users`
   - Creates corresponding profile in `profiles` table

2. **on_review_created**
   - Fires when review is inserted
   - Updates vendor/product ratings automatically

3. **ensure_single_default_address_trigger**
   - Fires when address is inserted/updated with `is_default = true`
   - Ensures only one default address per user

---

## Row Level Security (RLS) Policies

All tables have RLS enabled with appropriate policies:

- **profiles**: Users can view/update their own profile
- **vendors**: Public read, owners can update
- **products**: Public read (active only), vendors can manage own
- **addresses**: Users can manage own addresses
- **cart_items**: Users can manage own cart
- **orders**: Users can view/create own orders, vendors can view shop orders
- **order_items**: Inherits permissions from orders
- **reviews**: Public read, users can create/update own
- **promo_codes**: Authenticated users can view active codes
- **categories**: Public read (active only)
- **regions**: Public read (active only)

---

## Indexes Created

Performance indexes on:
- Email lookups (`profiles.email`)
- Referral codes (`profiles.referral_code`)
- Vendor slugs (`vendors.slug`)
- Location queries (`vendors.latitude`, `vendors.longitude`)
- Featured items (`vendors.is_featured`, `products.is_featured`)
- Order status (`orders.status`)
- QR codes (`orders.qr_code`)
- And more...

---

## Sample Data Inserted

- **6 Categories**: Spices, Grains, Vegetables, Meats, Textiles, Beverages
- **5 Regions**: West, East, North, South, Central Africa
- **3 Promo Codes**: WELCOME10, FREESHIP, SAVE5

---

## Code Updates

### ✅ authStore.ts
- Already using `profiles` table (no changes needed)
- Enhanced Google OAuth to handle native deep links
- Improved profile creation/update on signup and OAuth
- Better error handling for profile operations

### ✅ supabaseService.ts
- Updated to use `profiles` instead of `users` table
- Profile creation now handles trigger conflicts gracefully

### ✅ New Files Created
- `app/auth/callback.tsx` - OAuth callback handler
- `app/_layout.tsx` - Added deep link handling for OAuth

---

## OAuth Configuration

### Redirect URLs
- **Native**: `zoramarket://auth/callback`
- **Web**: `${origin}/auth/callback`

### Deep Link Handling
- Native deep links handled in `_layout.tsx`
- OAuth callback route created at `app/auth/callback.tsx`
- Auth state listener automatically handles session restoration

---

## Next Steps

1. **Configure Supabase Dashboard**:
   - Add `zoramarket://auth/callback` to allowed redirect URLs in Auth settings
   - Enable Google OAuth provider
   - Add web callback URL if deploying web version

2. **Test Authentication Flows**:
   - Email/password signup
   - Email/password login
   - Google OAuth sign-in
   - Email verification
   - Password reset

3. **Verify Profile Creation**:
   - Test that profiles are auto-created on signup
   - Test that OAuth users get profiles created
   - Verify referral codes are generated

4. **Test Database Operations**:
   - Create vendors
   - Add products
   - Create orders
   - Add reviews
   - Test cart functionality

---

## Migration File Location

`frontend/supabase/migrations/003_complete_zora_schema.sql`

This migration is idempotent and can be run multiple times safely.
