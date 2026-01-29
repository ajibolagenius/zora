# Migration Instructions - Manual Setup

## Overview

You have **3 migration files**, but you only need to run **ONE**:

- ❌ **001_initial_schema.sql** - Don't run (uses `users` table, outdated)
- ❌ **002_slug_implementation.sql** - Don't run (included in 003)
- ✅ **003_complete_zora_schema.sql** - **RUN THIS ONE** (complete, idempotent)

## Step-by-Step Instructions

### Step 1: Clean Up Existing Tables (Optional but Recommended)

If you want a fresh start, run the cleanup script first:

1. Open Supabase Dashboard → **SQL Editor**
2. Copy and paste the contents of: `frontend/supabase/migrations/000_cleanup_zora_tables.sql`
3. Click **Run**
4. Verify cleanup: Run this query to confirm tables are gone:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
     AND table_name IN (
       'categories', 'regions', 'vendors', 'products', 
       'addresses', 'cart_items', 'orders', 'order_items', 
       'promo_codes'
     );
   ```
   Should return **0 rows**.

### Step 2: Run the Complete Schema Migration

1. Open Supabase Dashboard → **SQL Editor**
2. Copy the **entire contents** of: `frontend/supabase/migrations/003_complete_zora_schema.sql`
3. Paste into SQL Editor
4. Click **Run**
5. Wait for completion (should take a few seconds)

### Step 3: Verify Migration Success

Run these verification queries:

#### Check Tables Exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'categories', 'regions', 'vendors', 'products', 
    'addresses', 'cart_items', 'orders', 'order_items', 
    'reviews', 'promo_codes', 'profiles'
  )
ORDER BY table_name;
```
**Expected**: 11 rows

#### Check Sample Data
```sql
-- Categories (should have 6)
SELECT COUNT(*) as category_count FROM categories;

-- Regions (should have 5)
SELECT COUNT(*) as region_count FROM regions;

-- Promo Codes (should have 3)
SELECT COUNT(*) as promo_count FROM promo_codes;
```

#### Check Functions
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN (
    'handle_new_user',
    'update_vendor_rating',
    'generate_unique_vendor_slug',
    'ensure_single_default_address',
    'get_nearby_vendors'
  )
ORDER BY routine_name;
```
**Expected**: 5 rows

#### Check Triggers
```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name IN (
    'on_auth_user_created',
    'on_review_created',
    'ensure_single_default_address_trigger'
  )
ORDER BY trigger_name;
```
**Expected**: 3 rows

## Why Only Run 003?

The `003_complete_zora_schema.sql` file is:
- ✅ **Complete** - Includes everything from 001 and 002
- ✅ **Idempotent** - Can run multiple times safely
- ✅ **Correct** - Uses `profiles` table (not `users`)
- ✅ **Comprehensive** - All tables, functions, triggers, policies, indexes, sample data

## What Each Migration Does

### 001_initial_schema.sql (DON'T RUN)
- Creates `users` table (wrong - we use `profiles`)
- Creates vendors, products, orders, reviews
- **Outdated** - superseded by 003

### 002_slug_implementation.sql (DON'T RUN)
- Adds slug column to vendors
- UUIDv7 implementation
- **Included in 003** - no need to run separately

### 003_complete_zora_schema.sql (RUN THIS)
- Extends `profiles` table with Zora columns
- Creates all tables: categories, regions, vendors, products, addresses, cart_items, orders, order_items, reviews, promo_codes
- Creates all functions and triggers
- Sets up RLS policies
- Creates indexes
- Inserts sample data
- **This is the one to use!**

## Troubleshooting

### Error: "relation already exists"
- The migration is idempotent, but if you get this error, run the cleanup script first (Step 1)

### Error: "permission denied"
- Make sure you're using the SQL Editor (not Table Editor)
- SQL Editor uses service_role which has full permissions

### Tables not showing in Table Editor
- This is normal - Table Editor uses `anon` key and respects RLS
- Use SQL Editor to verify tables exist
- Tables will be accessible via your app code

### "No rows returned" in queries
- Check RLS policies - some tables require authentication
- Use SQL Editor instead of Table Editor
- See `SUPABASE_DASHBOARD_QUERIES.md` for details

## After Migration

Once migration is complete:

1. ✅ Tables created
2. ✅ Functions and triggers active
3. ✅ RLS policies enabled
4. ✅ Sample data inserted
5. ✅ Ready for app to use

Your app code is already configured to use these tables via the `profiles` table and all the Zora-specific tables.
