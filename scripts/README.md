# Database Population Scripts

This directory contains scripts for populating the Zora African Market database with real data from various free APIs.

## Scripts

### 1. `populate-database.js`
Fetches data from various APIs and prepares it for database insertion.

**APIs Used:**
- **Users**: `dummyjson.com/users` - Fetches 100 user profiles
- **Meals**: `themealdb.com` - Fetches 30 random meals
- **Books**: `googleapis.com/books` - Fetches 20 books about Africa
- **E-commerce**: `fakestoreapi.com` - Fetches 20 products

**Usage:**
```bash
npm run populate-data
```

**Output:**
- `data/populated_users.json` - 100 user profiles
- `data/populated_vendors.json` - 20 vendor profiles
- `data/populated_products.json` - 70 products (meals, books, e-commerce items)

### 2. `insert-to-supabase.js`
Generates SQL insertion statements from the prepared JSON data files.

**Usage:**
```bash
npm run generate-sql
```

**Output:**
- `supabase/migrations/005_populate_data.sql` - SQL script ready for execution

## Database Schema

The scripts populate the following tables:
- `profiles` - User profiles (100 records)
- `vendors` - Vendor shops (20 records)
- `products` - Products from vendors (70 records)

## Option 1: Complete Database Population (RECOMMENDED)

### Quick Start
```bash
# Install dotenv if not already installed
npm install dotenv

# Set up environment variables in .env file:
# SUPABASE_URL=your_supabase_url
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Run the complete population process
node scripts/populate-option1.js
```

### Step-by-Step Process

#### Step 1: Create Users via Supabase Auth
```bash
node scripts/create-users-auth.js
```
- Creates users in `auth.users` via Supabase Admin API
- Automatically creates profiles via `handle_new_user()` trigger
- Saves results to `data/user_creation_results.json`

#### Step 2: Update Profiles with Zora-Specific Data
```bash
node scripts/update-profiles.js
```
- Updates profiles with phone, membership_tier, zora_credits, loyalty_points, cultural_interests
- Requires Step 1 to be completed first

#### Step 3: Generate Vendors and Products SQL
```bash
node scripts/create-vendors-products.js
```
- Generates SQL for vendors and products (skips profiles)
- Outputs to `supabase/migrations/006_populate_vendors_products.sql`

#### Step 4: Execute SQL
Execute the generated SQL using Supabase MCP `execute_sql` tool or Supabase dashboard.

### All-in-One Script
```bash
node scripts/populate-option1.js
```

This runs all steps sequentially. Use flags to skip steps:
- `--skip-users` - Skip user creation
- `--skip-profiles` - Skip profile updates
- `--skip-vendors` - Skip vendors/products generation

## Important Notes

### Foreign Key Constraints
The `profiles` table has a foreign key constraint to `auth.users`. 

**✅ Option 1 (Recommended)**: Create users via Supabase Auth API first. The `handle_new_user()` trigger automatically creates profiles.

**⚠️ Option 2 (Not Recommended)**: Temporarily disable the foreign key constraint for data population (risky, not production-ready).

### Vendor ID Mapping
✅ **Fixed**: The scripts now properly map vendor IDs between vendors and products using the `user_id` references in the JSON files.

## Execution Steps

1. **Fetch Data:**
   ```bash
   npm run populate-data
   ```

2. **Generate SQL:**
   ```bash
   npm run generate-sql
   ```

3. **Apply Schema Migration** (if not already done):
   ```sql
   -- Run migration 003_complete_zora_schema.sql via Supabase MCP
   ```

4. **Execute Population SQL:**
   ```sql
   -- Run migration 005_populate_data.sql via Supabase MCP execute_sql tool
   ```

## Data Sources

### Users
- Source: `https://dummyjson.com/users`
- Fields: email, name, avatar_url, phone, membership_tier, zora_credits, loyalty_points, cultural_interests

### Vendors
- Generated from user data
- Locations: Brixton, Camden, Hackney, Tottenham, Peckham (London)
- Regions: West Africa, East Africa, North Africa, South Africa, Central Africa

### Products
- **Meals**: From themealdb.com (30 items)
- **Books**: From Google Books API (20 items)
- **E-commerce**: From fakestoreapi.com (20 items)

## Future Enhancements

1. Add support for:
   - Spoonacular API (requires API key)
   - Unsplash API (requires API key)
   - Flickr API (requires API key)
   - Pexels API (requires API key)
   - Open Library API (additional books)

2. Fix vendor ID mapping issue

3. Add image fetching and storage

4. Add more product categories and regions
