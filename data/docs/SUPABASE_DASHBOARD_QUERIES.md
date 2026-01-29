# Supabase Dashboard - Working Queries

## Issue: "Success. No rows returned"

If you're seeing "Success. No rows returned" in the Supabase dashboard, it's likely due to **Row Level Security (RLS) policies**. The data exists, but RLS might be blocking your queries depending on how you're running them.

---

## Quick Verification Queries

Run these in the **SQL Editor** (not Table Editor) to verify tables and data:

### 1. Check All Tables Exist
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

### 2. View Categories (Public Access)
```sql
SELECT * FROM public.categories ORDER BY display_order;
```
**Expected**: 6 rows (Spices, Grains, Vegetables, Meats, Textiles, Beverages)

### 3. View Regions (Public Access)
```sql
SELECT * FROM public.regions ORDER BY display_order;
```
**Expected**: 5 rows (West, East, North, South, Central Africa)

### 4. View Promo Codes (Requires Authentication)
```sql
-- This requires you to be authenticated or use service_role
SELECT * FROM public.promo_codes WHERE is_active = true;
```
**Expected**: 3 rows (WELCOME10, FREESHIP, SAVE5)

**Note**: If this returns empty, you're running as `anon` role. Use the SQL Editor with service_role or authenticate first.

---

## Understanding RLS Policies

### Public Tables (No Auth Required)
- ✅ **categories** - Anyone can view active categories
- ✅ **regions** - Anyone can view active regions
- ✅ **vendors** - Anyone can view vendors
- ✅ **products** - Anyone can view active products
- ✅ **reviews** - Anyone can view reviews

### Authenticated-Only Tables
- 🔒 **promo_codes** - Requires `authenticated` role
- 🔒 **profiles** - Users can only view their own profile
- 🔒 **addresses** - Users can only view their own addresses
- 🔒 **cart_items** - Users can only view their own cart
- 🔒 **orders** - Users can only view their own orders

---

## Using SQL Editor vs Table Editor

### SQL Editor (Recommended)
- **Location**: Dashboard → SQL Editor
- **Permissions**: Uses your dashboard session (usually service_role or postgres)
- **RLS**: Typically bypasses RLS (depending on role)
- **Best for**: Running queries, verifying data, testing

### Table Editor
- **Location**: Dashboard → Table Editor
- **Permissions**: Uses `anon` key (respects RLS)
- **RLS**: Fully enforced
- **Best for**: Viewing data as end users would see it

---

## Troubleshooting "No Rows Returned"

### If using SQL Editor:

1. **Check you're in the right schema**:
   ```sql
   SELECT current_schema();
   -- Should return: public
   ```

2. **Verify table exists**:
   ```sql
   SELECT EXISTS (
     SELECT 1 FROM information_schema.tables 
     WHERE table_schema = 'public' 
     AND table_name = 'categories'
   );
   ```

3. **Check RLS is enabled**:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename = 'categories';
   ```

4. **Bypass RLS temporarily** (for testing only):
   ```sql
   SET LOCAL row_security = off;
   SELECT * FROM public.categories;
   ```

### If using Table Editor:

1. **Check RLS policies** - Some tables require authentication
2. **Try authenticating** - Sign in to your Supabase project
3. **Use SQL Editor instead** - More reliable for verification

---

## Sample Data Verification

### Categories (6 items)
```sql
SELECT name, slug, display_order 
FROM public.categories 
ORDER BY display_order;
```

### Regions (5 items)
```sql
SELECT name, slug, flag_emoji 
FROM public.regions 
ORDER BY display_order;
```

### Promo Codes (3 items)
```sql
-- Must be authenticated or use service_role
SELECT code, type, value, min_order 
FROM public.promo_codes 
WHERE is_active = true;
```

---

## Quick Test: Verify Everything Works

Run this comprehensive check:

```sql
-- Check all Zora tables exist
SELECT 
  'Tables Check' as check_type,
  COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'categories', 'regions', 'vendors', 'products', 
    'addresses', 'cart_items', 'orders', 'order_items', 
    'reviews', 'promo_codes', 'profiles'
  )

UNION ALL

-- Check categories data
SELECT 
  'Categories Data' as check_type,
  COUNT(*) as count
FROM public.categories

UNION ALL

-- Check regions data
SELECT 
  'Regions Data' as check_type,
  COUNT(*) as count
FROM public.regions

UNION ALL

-- Check promo codes data (if authenticated)
SELECT 
  'Promo Codes Data' as check_type,
  COUNT(*) as count
FROM public.promo_codes;
```

**Expected Results**:
- Tables Check: 11
- Categories Data: 6
- Regions Data: 5
- Promo Codes Data: 3 (if authenticated) or 0 (if not authenticated)

---

## Common Issues

### Issue 1: "No rows returned" for promo_codes
**Cause**: RLS requires authentication  
**Solution**: Use SQL Editor (service_role) or authenticate first

### Issue 2: Table Editor shows empty
**Cause**: Table Editor uses `anon` key which respects RLS  
**Solution**: Use SQL Editor instead, or authenticate in Table Editor

### Issue 3: Can't see tables in Table Editor
**Cause**: Dashboard cache or wrong schema  
**Solution**: 
1. Hard refresh browser (Cmd+Shift+R)
2. Check schema selector is set to `public`
3. Verify project ID matches

---

## Need Help?

If queries still don't work:
1. Check you're in the correct Supabase project
2. Verify the project ID: `dbmjxbixjoxakkztyctj`
3. Try running queries via MCP tools (which we've verified work)
4. Check Supabase logs for any errors
