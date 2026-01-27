# Option 1 Execution Guide

Complete step-by-step guide for populating the Zora database using Option 1 (Supabase Auth).

## Prerequisites

1. **Supabase Project Setup**
   - Have a Supabase project created
   - Access to Supabase dashboard
   - Service Role Key (Admin key) - **Keep this secret!**

2. **Environment Variables**
   - Create/update `.env` file in project root
   - Add the following:
     ```env
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
     ```

3. **Dependencies**
   ```bash
   # Install dotenv if not already installed
   npm install dotenv
   ```

4. **Data Files**
   - Ensure `data/populated_users.json` exists (100 users)
   - Ensure `data/populated_vendors.json` exists (20 vendors)
   - Ensure `data/populated_products.json` exists (70 products)

## Execution Steps

### Option A: All-in-One (Recommended)

```bash
node scripts/populate-option1.js
```

This will:
1. Create all users via Supabase Auth
2. Update profiles with Zora-specific data
3. Generate SQL for vendors and products
4. Provide instructions for final SQL execution

### Option B: Step-by-Step

#### Step 1: Create Users
```bash
node scripts/create-users-auth.js
```

**What it does:**
- Reads `data/populated_users.json`
- Creates users in `auth.users` via Supabase Admin API
- Triggers automatic profile creation via `handle_new_user()` trigger
- Saves results to `data/user_creation_results.json`

**Expected output:**
```
📝 Starting user creation for 100 users...

✅ Created user 1: emily.johnson@x.dummyjson.com (ID: ...)
✅ Created user 2: michael.williams@x.dummyjson.com (ID: ...)
...

📊 Summary:
   ✅ Created: 100
   ⏭️  Skipped: 0
   ❌ Failed: 0
```

#### Step 2: Update Profiles
```bash
node scripts/update-profiles.js
```

**What it does:**
- Reads `data/user_creation_results.json` from Step 1
- Updates profiles with:
  - `phone`
  - `membership_tier`
  - `zora_credits`
  - `loyalty_points`
  - `cultural_interests`

**Expected output:**
```
📝 Updating 100 profiles...

📦 Processing batch 1...
📦 Processing batch 2...

📊 Summary:
   ✅ Updated: 100
   ❌ Failed: 0
```

#### Step 3: Generate Vendors/Products SQL
```bash
node scripts/create-vendors-products.js
```

**What it does:**
- Maps vendor `user_id` references (e.g., "user-0") to actual UUIDs
- Generates SQL for vendors and products
- Skips profiles (already created)
- Outputs to `supabase/migrations/006_populate_vendors_products.sql`

**Expected output:**
```
📝 Generating vendors and products SQL...

💾 SQL saved to: supabase/migrations/006_populate_vendors_products.sql

✅ SQL generation completed!
```

#### Step 4: Execute SQL

**Method 1: Using Supabase MCP (Recommended)**
```bash
# The SQL file is ready for execution via MCP execute_sql tool
# File: supabase/migrations/006_populate_vendors_products.sql
```

**Method 2: Using Supabase Dashboard**
1. Go to Supabase Dashboard → SQL Editor
2. Open `supabase/migrations/006_populate_vendors_products.sql`
3. Copy and paste the SQL
4. Click "Run"

**Method 3: Using psql**
```bash
psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" \
  -f supabase/migrations/006_populate_vendors_products.sql
```

## Verification

After execution, verify the data:

```sql
-- Check users
SELECT COUNT(*) FROM auth.users;
-- Expected: 100

-- Check profiles
SELECT COUNT(*) FROM public.profiles;
-- Expected: 100

-- Check vendors
SELECT COUNT(*) FROM public.vendors;
-- Expected: 20

-- Check products
SELECT COUNT(*) FROM public.products;
-- Expected: 70

-- Verify foreign key relationships
SELECT 
  COUNT(*) as vendors_with_profiles
FROM public.vendors v
INNER JOIN public.profiles p ON v.user_id = p.id;
-- Expected: 20

SELECT 
  COUNT(*) as products_with_vendors
FROM public.products pr
INNER JOIN public.vendors v ON pr.vendor_id = v.id;
-- Expected: 70
```

## Troubleshooting

### Error: Missing environment variables
**Solution:** Ensure `.env` file exists with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

### Error: User creation fails
**Possible causes:**
- Invalid Supabase URL or Service Role Key
- Rate limiting (wait a few seconds and retry)
- Email already exists (will be skipped automatically)

### Error: Profile update fails
**Possible causes:**
- Users not created yet (run Step 1 first)
- Column doesn't exist (check migration 003_complete_zora_schema.sql)

### Error: Vendor SQL generation fails
**Possible causes:**
- User creation results not found (run Step 1 first)
- Vendor user_id references don't match user indices

### Error: Foreign key constraint violation
**Possible causes:**
- Profiles not created (check trigger exists)
- User IDs don't match between steps

## Resuming After Failure

If a step fails, you can resume:

```bash
# Skip already-completed steps
node scripts/populate-option1.js --skip-users --skip-profiles
```

## Cleanup (If Needed)

To start over:

```sql
-- ⚠️ WARNING: This will delete all data!
DELETE FROM public.products;
DELETE FROM public.vendors;
DELETE FROM public.profiles;
-- Note: auth.users deletion requires Admin API
```

Then delete `data/user_creation_results.json` and start over.

## Time Estimates

- User creation: ~2-5 minutes (100 users, batched)
- Profile updates: ~30 seconds
- SQL generation: ~5 seconds
- SQL execution: ~10-30 seconds

**Total: ~3-6 minutes**

## Security Notes

⚠️ **Important:**
- Never commit `.env` file to git
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- Service Role Key has admin access - keep it secret!
- Users created will have random passwords - they should change on first login
