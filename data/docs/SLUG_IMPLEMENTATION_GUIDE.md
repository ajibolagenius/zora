# Slug Implementation Guide

## Overview

This document describes the slug implementation for vendors and products in the Zora application. Two distinct slug systems have been implemented:

1. **Vendors**: Semantic slugs (e.g., `/store/tech-gear-city`)
2. **Products**: Base62-encoded UUIDs (e.g., `/product/5jWv9K2`)

## Implementation Details

### 1. Vendor Slugs (Semantic)

Vendors use human-readable semantic slugs derived from their shop names.

- **Route**: `/store/[vendorSlug]`
- **Storage**: Stored in `vendors.slug` column in database
- **Generation**: Automatically generated from `shop_name`
- **Uniqueness**: Enforced at database level with automatic suffixing (e.g., `tech-gear-city-1`)

**Example:**
- Shop Name: "Tech Gear City"
- Slug: `tech-gear-city`
- URL: `/store/tech-gear-city`

### 2. Product Slugs (Base62 Encoded)

Products use Base62-encoded UUIDs for compact, URL-friendly identifiers.

- **Route**: `/product/[productSlug]`
- **Storage**: No slug column - encoded on-the-fly from UUID
- **Encoding**: UUIDv7 → Base62 string
- **Decoding**: Base62 string → UUID (for database queries)

**Example:**
- Product UUID: `018f1234-5678-7890-abcd-ef1234567890`
- Slug: `5jWv9K2` (example)
- URL: `/product/5jWv9K2`

## Files Created/Modified

### New Files

1. **`lib/slugUtils.ts`** - Core slug utilities
   - `encodeProductSlug(uuid)` - Encodes UUID to Base62
   - `decodeProductSlug(slug)` - Decodes Base62 to UUID
   - `generateVendorSlug(shopName)` - Generates semantic slug
   - `generateUniqueVendorSlug(shopName, existingSlugs)` - Generates unique slug
   - Validation functions

2. **`lib/avatarUtils.ts`** - Customer avatar generation
   - Generates avatars from initials with random color backgrounds
   - Deterministic colors based on user ID/name

3. **`lib/navigationHelpers.ts`** - Navigation utilities
   - `getProductRoute(productId)` - Gets product route with slug
   - `getVendorRoute(vendor, vendorId)` - Gets vendor route with slug

4. **`app/store/[vendorSlug].tsx`** - New vendor storefront route
5. **`supabase/migrations/002_slug_implementation.sql`** - Database migration
6. **`lib/__tests__/slugUtils.test.ts`** - Test suite
7. **`lib/testSlugEncoding.ts`** - Manual testing utility

### Modified Files

All navigation calls have been updated to use slug-based routes:
- `app/(tabs)/index.tsx`
- `app/(tabs)/cart.tsx`
- `app/(tabs)/orders.tsx`
- `app/(tabs)/explore.tsx`
- `app/products.tsx`
- `app/vendors.tsx`
- `app/search.tsx`
- `app/qr-scanner.tsx`
- `app/vendor/[id]/index.tsx`
- `app/vendor/[id]/products.tsx`
- `app/product/[productSlug].tsx` (renamed from `[id].tsx`)
- `services/supabaseService.ts` - Added `getBySlug()` methods
- `services/mockDataService.ts` - Added slug support

## Database Migration

### Running the Migration

1. Open your Supabase SQL Editor
2. Run the migration file: `supabase/migrations/002_slug_implementation.sql`

The migration will:
- Add `slug` column to `vendors` table
- Generate unique slugs for all existing vendors
- Create UUIDv7 generation function for products
- Set up indexes and constraints

### Generating Slugs for Existing Vendors

The migration automatically generates slugs for all existing vendors. If you need to regenerate slugs:

```sql
-- Regenerate slugs for all vendors
SELECT generate_unique_vendor_slug(shop_name, id)
FROM vendors
WHERE slug IS NULL;
```

## Usage Examples

### Navigation

```typescript
import { getProductRoute, getVendorRoute } from '../lib/navigationHelpers';

// Navigate to product
router.push(getProductRoute(product.id));

// Navigate to vendor
router.push(getVendorRoute(vendor, vendor.id));
```

### Encoding/Decoding Product Slugs

```typescript
import { encodeProductSlug, decodeProductSlug } from '../lib/slugUtils';

// Encode UUID to slug
const slug = encodeProductSlug('018f1234-5678-7890-abcd-ef1234567890');
// Returns: "5jWv9K2" (example)

// Decode slug to UUID
const uuid = decodeProductSlug('5jWv9K2');
// Returns: "018f1234-5678-7890-abcd-ef1234567890"
```

### Generating Vendor Slugs

```typescript
import { generateVendorSlug, generateUniqueVendorSlug } from '../lib/slugUtils';

// Generate base slug
const slug = generateVendorSlug('Tech Gear City');
// Returns: "tech-gear-city"

// Generate unique slug (checking against existing)
const uniqueSlug = generateUniqueVendorSlug('Tech Gear', ['tech-gear']);
// Returns: "tech-gear-1"
```

### Fetching by Slug

```typescript
import { vendorService, productService } from '../services/supabaseService';

// Fetch vendor by slug
const vendor = await vendorService.getBySlug('tech-gear-city');

// Fetch product by slug
const product = await productService.getBySlug('5jWv9K2');
```

## Testing

### Automated Tests

Run the test suite:
```bash
# If using Jest
npm test -- slugUtils.test.ts
```

### Manual Testing

Import and run the test utility:
```typescript
import testSlugEncoding from '../lib/testSlugEncoding';

// Run basic tests
testSlugEncoding();

// Test with real product IDs from database
const productIds = await productService.getAll().then(products => 
  products.map(p => p.id)
);
await testWithRealProductIds(productIds);
```

## Backward Compatibility

The old routes still work for backward compatibility:
- `/vendor/[id]` - Still functional, but new code should use `/store/[vendorSlug]`
- `/product/[id]` - Automatically handles both UUID and slug formats

## UUIDv7 Support

The implementation includes a UUIDv7 generation function in the SQL migration. For true UUIDv7 support, you'll need the `pg_uuidv7` PostgreSQL extension, which may require Supabase support team to enable.

The current implementation uses a workaround function `generate_uuidv7()` that creates time-ordered UUIDs similar to UUIDv7.

## Customer Avatars

The avatar utility generates avatars from user initials:

```typescript
import { generateAvatar, generateAvatarDataUrl } from '../lib/avatarUtils';

// Get avatar data
const { initials, backgroundColor } = generateAvatar('John Doe', userId);

// Get SVG data URL for Image component
const avatarUrl = generateAvatarDataUrl('John Doe', userId, 100);
// Use in: <Image source={{ uri: avatarUrl }} />
```

## Troubleshooting

### Slug Encoding Errors

If you encounter errors encoding product slugs:
1. Verify the UUID format is correct
2. Check that BigInt is supported in your environment
3. Ensure the UUID is a valid 128-bit UUID format

### Slug Uniqueness Issues

If vendor slug generation fails:
1. Check database constraints
2. Verify the `generate_unique_vendor_slug()` function exists
3. Manually set slugs if needed: `UPDATE vendors SET slug = 'custom-slug' WHERE id = '...'`

### Navigation Not Working

If navigation to slug-based routes fails:
1. Verify the route files exist: `app/store/[vendorSlug].tsx` and `app/product/[productSlug].tsx`
2. Check that navigation helpers are imported correctly
3. Ensure slugs are generated for vendors in the database

## Next Steps

1. ✅ Run the SQL migration in Supabase
2. ✅ Test slug encoding/decoding with real product IDs
3. ✅ Verify vendor slugs are generated correctly
4. ✅ Update any remaining hardcoded routes
5. ✅ Monitor for any navigation issues
6. ✅ Consider adding slug regeneration for vendors that change shop names

## Support

For issues or questions:
- Check the test files for usage examples
- Review the utility function implementations
- Test with the provided test utilities
