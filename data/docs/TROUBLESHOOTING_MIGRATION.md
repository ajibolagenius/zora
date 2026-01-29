# Troubleshooting Migration Issues

## Problem: "Success. No rows returned" but tables not created

If you see "Success. No rows returned" but the tables weren't created, the migration might have:
1. Stopped partway through
2. Hit an error that was silently ignored
3. Only executed part of the script

## Solution: Run Migration in Sections

### Step 1: Verify What Exists

Run this first to see what's already there:

```sql
-- Check existing tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'categories', 'regions', 'vendors', 'products', 
    'addresses', 'cart_items', 'orders', 'order_items', 
    'promo_codes'
  )
ORDER BY table_name;
```

### Step 2: Run Migration in Parts

If tables are missing, try running the migration file **section by section**:

#### Part 1: Extensions and Profiles (Lines 1-116)
Copy lines 1-116 from `003_complete_zora_schema.sql` and run.

#### Part 2: Categories and Regions (Lines 118-156)
Copy lines 118-156 and run.

#### Part 3: Vendors (Lines 158-200)
Copy lines 158-200 and run.

#### Part 4: Products (Lines 202-213)
Copy lines 202-213 and run.

Continue with remaining sections...

### Step 3: Alternative - Run Just the Table Creation

If the full migration fails, try creating tables one at a time:

```sql
-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Regions
CREATE TABLE IF NOT EXISTS public.regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    flag_emoji TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Common Issues

### Issue 1: Migration stops after profiles section
**Cause**: Error in profiles section that stops execution  
**Solution**: Check for errors in the profiles DO block, then continue with rest

### Issue 2: "Relation already exists" errors
**Cause**: Tables partially created  
**Solution**: Use `DROP TABLE IF EXISTS` before creating, or skip existing tables

### Issue 3: Permission errors
**Cause**: Using wrong role (anon instead of service_role)  
**Solution**: Make sure you're in SQL Editor (uses service_role), not Table Editor

### Issue 4: Syntax errors
**Cause**: Copy-paste issues, missing semicolons  
**Solution**: Check the migration file for syntax errors

## Quick Fix: Re-run Full Migration

The migration is idempotent, so you can safely re-run it:

1. Open `003_complete_zora_schema.sql`
2. Copy **entire file**
3. Paste into SQL Editor
4. Click **Run**
5. Check for any error messages (not just "Success")

## Verification After Migration

Run the verification script:

```sql
-- From: 003_verify_migration.sql
-- This will show you what was created
```

Expected results:
- **Tables Check**: 10 tables
- **Functions Check**: 5 functions  
- **Triggers Check**: 3 triggers
- **Categories Data**: 6 rows
- **Regions Data**: 5 rows
- **Promo Codes Data**: 3 rows

## If Nothing Works

1. **Check Supabase logs**: Dashboard → Logs → Postgres Logs
2. **Try smaller chunks**: Run 50-100 lines at a time
3. **Check for errors**: Look for red error messages, not just "Success"
4. **Verify connection**: Make sure you're connected to the right project
