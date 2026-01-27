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

## Important Notes

### Foreign Key Constraints
The `profiles` table has a foreign key constraint to `auth.users`. To insert profiles:
1. Create auth users first via Supabase Auth API, OR
2. Temporarily disable the foreign key constraint for data population

### Vendor ID Mapping
⚠️ **Known Issue**: The generated SQL has vendor ID mismatches. Products reference vendor IDs that don't match the inserted vendors. This needs to be fixed in the script.

**Fix Required**: Update `insert-to-supabase.js` to use consistent vendor IDs between vendors and products.

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
