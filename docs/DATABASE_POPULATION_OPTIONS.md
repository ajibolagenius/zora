# Database Population Options

## Overview
The database has the following foreign key relationships:
- `profiles.id` → references `auth.users(id)` (required)
- `vendors.user_id` → references `profiles(id)` (required)
- `products.vendor_id` → references `vendors(id)` (required)

**Important:** There is a trigger (`handle_new_user`) that automatically creates a profile entry in `public.profiles` when a user is created in `auth.users`.

---

## Option 1: Create Users via Supabase Auth First (RECOMMENDED)

### Why This Is Best
- ✅ Follows Supabase best practices
- ✅ Maintains data integrity
- ✅ Triggers automatically create profiles
- ✅ Production-ready approach
- ✅ Proper authentication setup

### Detailed Process

#### Step 1: Create Users via Supabase Auth API
Use the Supabase Admin API or Auth API to create users. Each user creation will automatically trigger the `handle_new_user()` function which creates the corresponding profile.

**Method A: Using Supabase Admin API (Recommended for bulk creation)**
```javascript
// Example script to create users
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Admin key
);

async function createUsers(usersData) {
  for (const user of usersData) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password || 'TempPassword123!', // Users should change this
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: user.full_name,
        avatar_url: user.avatar_url
      }
    });
    
    if (error) {
      console.error(`Error creating user ${user.email}:`, error);
    } else {
      console.log(`Created user: ${data.user.id} - ${user.email}`);
    }
  }
}
```

**Method B: Using Supabase MCP (if available)**
- Check if Supabase MCP has user creation tools
- Create users one by one with their email and metadata

#### Step 2: Update Profiles with Additional Data
After users are created, profiles are automatically created. Update them with the additional Zora-specific fields:

```sql
-- Update profiles with additional data from populated_users.json
UPDATE public.profiles SET
    phone = '...',
    membership_tier = '...',
    zora_credits = ...,
    loyalty_points = ...,
    cultural_interests = ARRAY[...],
    updated_at = NOW()
WHERE id = '...';
```

#### Step 3: Insert Vendors
Once profiles exist, insert vendors:

```sql
INSERT INTO public.vendors (
    id, user_id, shop_name, slug, description, ...
) VALUES (...)
ON CONFLICT (slug) DO UPDATE SET ...;
```

#### Step 4: Insert Products
Finally, insert products:

```sql
INSERT INTO public.products (
    id, vendor_id, name, description, price, ...
) VALUES (...)
ON CONFLICT DO NOTHING;
```

### Implementation Steps
1. Extract user data from `populated_users.json`
2. Create a script that uses Supabase Admin API to create users
3. Wait for profiles to be auto-created (or verify they exist)
4. Update profiles with additional Zora-specific fields
5. Execute vendor insertions
6. Execute product insertions

### Time Estimate
- User creation: ~2-5 minutes (100 users)
- Profile updates: ~30 seconds
- Vendor insertion: ~10 seconds
- Product insertion: ~30 seconds
- **Total: ~3-6 minutes**

---

## Option 2: Temporarily Disable Foreign Key Constraint

### Why This Is Risky
- ⚠️ Bypasses database integrity checks
- ⚠️ Can cause data inconsistencies
- ⚠️ Not recommended for production
- ⚠️ May cause issues with RLS policies
- ⚠️ Could break application logic

### Detailed Process

#### Step 1: Disable Foreign Key Constraint
```sql
-- Disable the foreign key constraint temporarily
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Or if the constraint has a different name, find it first:
SELECT conname, conrelid::regclass, confrelid::regclass
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
AND contype = 'f';
```

#### Step 2: Insert Profiles Directly
```sql
-- Now you can insert profiles without auth.users entries
INSERT INTO public.profiles (
    id, email, full_name, avatar_url, phone, ...
) VALUES (...)
ON CONFLICT (id) DO UPDATE SET ...;
```

#### Step 3: Re-enable Foreign Key Constraint
```sql
-- Re-add the foreign key constraint
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_id_fkey
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

**Note:** This will fail if profiles exist without corresponding auth.users entries!

#### Step 4: Insert Vendors
```sql
INSERT INTO public.vendors (...) VALUES (...);
```

#### Step 5: Insert Products
```sql
INSERT INTO public.products (...) VALUES (...);
```

### Implementation Steps
1. Execute SQL to disable foreign key constraint
2. Execute profile insertions from SQL script
3. Execute SQL to re-enable foreign key constraint (may fail!)
4. Execute vendor insertions
5. Execute product insertions

### Time Estimate
- Constraint disable: ~1 second
- Profile insertion: ~10 seconds
- Constraint re-enable: ~1 second (may fail)
- Vendor insertion: ~10 seconds
- Product insertion: ~30 seconds
- **Total: ~1 minute (if successful)**

### Risks
- Re-enabling constraint may fail if profiles don't have matching auth.users
- Application may not work correctly without proper auth.users entries
- Future migrations may fail
- RLS policies may not work correctly

---

## Option 3: Skip Profiles/Vendors, Only Insert Products

### Why This Won't Work
- ❌ Products require `vendor_id` which references `vendors.id`
- ❌ Vendors require `user_id` which references `profiles.id`
- ❌ This defeats the purpose of populating the database
- ❌ You'd have an empty database except for products with invalid vendor references

### Detailed Process

#### Step 1: Extract Only Products Section
```sql
-- Extract products section from 005_populate_data.sql
-- This would include products but with vendor_id references
```

#### Step 2: Create Dummy Vendors First
You'd need to create minimal vendor entries:

```sql
-- Create dummy vendors (but this requires profiles!)
INSERT INTO public.vendors (
    id, user_id, shop_name, slug, address, latitude, longitude
) VALUES (
    'dummy-vendor-id', 
    'dummy-profile-id', -- This requires a profile!
    'Dummy Shop',
    'dummy-shop',
    '123 Street',
    51.5074,
    -0.1278
);
```

#### Step 3: Insert Products
```sql
-- Now insert products referencing dummy vendors
INSERT INTO public.products (...) VALUES (...);
```

### Why This Fails
- **Cannot create vendors without profiles** (foreign key constraint)
- **Cannot create profiles without auth.users** (foreign key constraint)
- Even if you bypass constraints, products would reference non-existent vendors
- The data would be incomplete and unusable

### Conclusion
**This option is not viable** due to the foreign key dependencies.

---

## Recommendation: Option 1

**Option 1 is the best choice** because:
1. It follows Supabase best practices
2. Maintains data integrity
3. Creates proper authentication records
4. Works with existing triggers
5. Is production-ready
6. Ensures RLS policies work correctly

### Next Steps for Option 1

1. **Create a user creation script** that:
   - Reads from `populated_users.json`
   - Uses Supabase Admin API to create users
   - Handles errors gracefully
   - Tracks created user IDs

2. **Create a profile update script** that:
   - Updates profiles with Zora-specific fields
   - Uses the user IDs from step 1

3. **Execute vendor and product insertions** using the existing SQL script (modified to skip profiles)

4. **Verify data integrity** by checking:
   - All users have profiles
   - All vendors have valid user_id references
   - All products have valid vendor_id references

Would you like me to create the scripts for Option 1?
