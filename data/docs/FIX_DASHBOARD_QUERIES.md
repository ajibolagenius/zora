# Fix: "relation public.categories does not exist" Error

## The Problem

You're getting: `ERROR: 42P01: relation "public.categories" does not exist`

But the tables **DO exist** - we've verified this via MCP tools.

## Root Causes

1. **Schema Search Path** - Your connection might not have `public` in the search path
2. **Connection Type** - You might be connected to a read replica or different database
3. **Dashboard Cache** - The dashboard might be showing cached/old connection info

## Solutions

### Solution 1: Try Without Schema Prefix

Instead of:
```sql
SELECT * FROM public.categories;
```

Try:
```sql
SELECT * FROM categories;
```

### Solution 2: Set Search Path Explicitly

At the top of your SQL query, add:
```sql
SET search_path = public;
SELECT * FROM categories;
```

### Solution 3: Verify You're in the Right Database

Run this first:
```sql
SELECT current_database(), current_schema();
```

Should return:
- `current_database`: `postgres`
- `current_schema`: `public`

### Solution 4: Use Fully Qualified Names

Try with quotes (case-sensitive):
```sql
SELECT * FROM "public"."categories";
```

### Solution 5: Refresh Dashboard Connection

1. **Close and reopen** the SQL Editor tab
2. **Hard refresh** the browser (Cmd+Shift+R / Ctrl+Shift+R)
3. **Log out and log back in** to Supabase dashboard
4. **Clear browser cache** for supabase.com

### Solution 6: Check Project Connection

Verify you're connected to the correct project:
- Project ID should be: `dbmjxbixjoxakkztyctj`
- Check the URL in your browser matches your project

## Working Queries (Copy & Paste These)

### Query 1: List All Tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### Query 2: View Categories (No Schema Prefix)
```sql
SELECT * FROM categories ORDER BY display_order;
```

### Query 3: View Categories (With Search Path)
```sql
SET search_path = public;
SELECT * FROM categories ORDER BY display_order;
```

### Query 4: Count Rows in All Tables
```sql
SELECT 
  'categories' as table_name,
  COUNT(*) as row_count
FROM categories
UNION ALL
SELECT 
  'regions' as table_name,
  COUNT(*) as row_count
FROM regions
UNION ALL
SELECT 
  'promo_codes' as table_name,
  COUNT(*) as row_count
FROM promo_codes;
```

## If Nothing Works

### Option A: Use MCP Tools (Verified Working)

The tables are confirmed to exist via MCP. You can:
1. Use the MCP tools to query data
2. Use the Supabase client in your app (which works)
3. Wait for dashboard sync (sometimes takes a few minutes)

### Option B: Re-run Migration (Idempotent)

The migration is idempotent, so you can safely re-run it:

```sql
-- This won't break anything if tables already exist
-- Run the full migration from: frontend/supabase/migrations/003_complete_zora_schema.sql
```

### Option C: Grant Explicit Permissions

If permissions are the issue, run:
```sql
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO postgres;
```

## Verification Checklist

Run these in order:

1. ✅ **Check current schema**:
   ```sql
   SELECT current_schema();
   ```

2. ✅ **List tables**:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' AND table_name = 'categories';
   ```

3. ✅ **Try query without schema**:
   ```sql
   SELECT COUNT(*) FROM categories;
   ```

4. ✅ **Try with search path**:
   ```sql
   SET search_path = public;
   SELECT COUNT(*) FROM categories;
   ```

5. ✅ **Try fully qualified**:
   ```sql
   SELECT COUNT(*) FROM "public"."categories";
   ```

## Expected Results

- **Step 1**: Should return `public`
- **Step 2**: Should return 1 row with `categories`
- **Step 3-5**: Should all return `6` (number of categories)

If all steps fail, there might be a connection issue with the dashboard. The tables definitely exist and are accessible via MCP tools.
