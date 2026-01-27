# Customer Registration Requirements

Based on the Supabase database schema, this document outlines what data is required for customer registration.

## Registration Form (Initial Signup)

### Required Fields

1. **Email** (`auth.users.email`)
   - Type: `TEXT UNIQUE NOT NULL`
   - Handled by: Supabase Auth
   - Validation: Must be valid email format
   - Pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
   - Length: 3-255 characters

2. **Password** (`auth.users.password`)
   - Type: Handled by Supabase Auth
   - Validation Rules:
     - Minimum length: 8 characters
     - Maximum length: 128 characters
     - Must contain at least one uppercase letter
     - Must contain at least one lowercase letter
     - Must contain at least one number
     - Must contain at least one special character

### Optional but Recommended Fields

3. **Full Name** (`profiles.full_name`)
   - Type: `TEXT` (nullable)
   - Validation: 1-50 characters
   - Pattern: Letters and spaces only
   - Note: If not provided, email will be used as fallback (via `handle_new_user()` trigger)

## Automatic Profile Creation

When a user signs up via Supabase Auth, the `handle_new_user()` trigger automatically creates a profile with:

- `id`: UUID from `auth.users.id` (PRIMARY KEY)
- `email`: From `auth.users.email`
- `full_name`: From `raw_user_meta_data->>'full_name'` or falls back to email
- `avatar_url`: From `raw_user_meta_data->>'avatar_url'` (if provided)
- `referral_code`: Auto-generated as `'ZORA' + first 6 chars of UUID`
- `membership_tier`: Defaults to `'bronze'`
- `zora_credits`: Defaults to `0.00`
- `loyalty_points`: Defaults to `0`
- `cultural_interests`: Defaults to empty array `'{}'`
- `preferred_categories`: Defaults to empty array `'{}'`
- `created_at`: Auto-set to current timestamp
- `updated_at`: Auto-set to current timestamp

## Onboarding Flow (Post-Registration)

After initial registration, customers go through onboarding where additional data is collected:

### 1. Heritage Selection (`profiles.cultural_interests`)
- **Field**: `cultural_interests` (TEXT[])
- **Required**: Yes (at least one selection)
- **Source**: Regions table (`regions.slug`)
- **Options**: West Africa, East Africa, Southern Africa, Central Africa, North Africa
- **Screen**: `/onboarding/heritage`

### 2. Category Preferences (`profiles.preferred_categories`)
- **Field**: `preferred_categories` (TEXT[])
- **Required**: Yes (at least one selection)
- **Source**: Categories table (`categories.slug`)
- **Options**: Various product categories
- **Screen**: `/onboarding/categories`

### 3. Delivery Address (`addresses` table)
- **Required Fields**:
  - `label`: TEXT NOT NULL (e.g., "Home", "Work")
  - `full_name`: TEXT NOT NULL
  - `phone`: TEXT NOT NULL
  - `address_line1`: TEXT NOT NULL
  - `city`: TEXT NOT NULL
  - `postcode`: TEXT NOT NULL
- **Optional Fields**:
  - `address_line2`: TEXT (nullable)
  - `latitude`: DECIMAL(10,8) (nullable)
  - `longitude`: DECIMAL(11,8) (nullable)
- **Defaults**:
  - `country`: Defaults to `'United Kingdom'`
  - `is_default`: Defaults to `FALSE`
- **Screen**: `/onboarding/location`
- **Note**: Can be collected via:
  - Current location (GPS coordinates)
  - Manual postcode entry

## Database Schema Summary

### `profiles` Table (extends `auth.users`)

**Required Columns:**
- `id`: UUID PRIMARY KEY (references `auth.users.id`)

**Optional Columns (with defaults):**
- `email`: TEXT UNIQUE (auto-set from auth.users)
- `full_name`: TEXT (nullable)
- `phone`: TEXT (nullable)
- `avatar_url`: TEXT (nullable)
- `membership_tier`: TEXT DEFAULT 'bronze'
- `zora_credits`: DECIMAL(10,2) DEFAULT 0.00
- `loyalty_points`: INTEGER DEFAULT 0
- `cultural_interests`: TEXT[] DEFAULT '{}'
- `preferred_categories`: TEXT[] DEFAULT '{}'
- `referral_code`: TEXT UNIQUE (auto-generated)
- `created_at`: TIMESTAMPTZ DEFAULT NOW()
- `updated_at`: TIMESTAMPTZ DEFAULT NOW()

### `addresses` Table

**Required Columns:**
- `id`: UUID PRIMARY KEY (auto-generated)
- `user_id`: UUID (references `profiles.id`)
- `label`: TEXT NOT NULL
- `full_name`: TEXT NOT NULL
- `phone`: TEXT NOT NULL
- `address_line1`: TEXT NOT NULL
- `city`: TEXT NOT NULL
- `postcode`: TEXT NOT NULL

**Optional Columns:**
- `address_line2`: TEXT (nullable)
- `country`: TEXT DEFAULT 'United Kingdom'
- `latitude`: DECIMAL(10,8) (nullable)
- `longitude`: DECIMAL(11,8) (nullable)
- `is_default`: BOOLEAN DEFAULT FALSE
- `created_at`: TIMESTAMPTZ DEFAULT NOW()
- `updated_at`: TIMESTAMPTZ DEFAULT NOW()

## Registration Form Recommendations

### Minimum Viable Registration
```typescript
{
  email: string;      // Required
  password: string;   // Required
  full_name?: string; // Optional but recommended
}
```

### Recommended Registration Form Fields
```typescript
{
  email: string;      // Required - validated
  password: string;   // Required - validated per PasswordRules
  full_name: string;  // Optional but recommended - 1-50 chars
}
```

### Onboarding Flow Fields (collected after registration)
```typescript
{
  cultural_interests: string[];      // Required - at least 1 region
  preferred_categories: string[];    // Required - at least 1 category
  delivery_address: {                 // Required for first order
    label: string;
    full_name: string;
    phone: string;
    address_line1: string;
    city: string;
    postcode: string;
    address_line2?: string;
    latitude?: number;
    longitude?: number;
  };
}
```

## Validation Rules

### Email
- Pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Length: 3-255 characters

### Password
- Minimum: 8 characters
- Maximum: 128 characters
- Must contain: uppercase, lowercase, number, special character

### Full Name
- Length: 1-50 characters
- Pattern: Letters and spaces only

### Phone (for address)
- UK Format: `/^(\+44|0)[1-9]\d{8,9}$/`
- International: `/^\+?[1-9]\d{1,14}$/`
- Length: 10-20 characters

### Postcode (UK)
- Pattern: `/^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i`
- Length: 5-8 characters

## Implementation Notes

1. **Profile Creation**: The `handle_new_user()` trigger automatically creates a profile when a user signs up via Supabase Auth. No manual profile creation needed.

2. **Onboarding Flow**: The onboarding screens collect additional preferences that enhance the user experience but are not strictly required for account creation.

3. **Address Collection**: While addresses are required for orders, they can be collected during checkout if not provided during onboarding.

4. **Data Flow**:
   - Registration → Creates `auth.users` → Triggers `handle_new_user()` → Creates `profiles`
   - Onboarding → Updates `profiles.cultural_interests` and `profiles.preferred_categories`
   - Location Screen → Creates `addresses` record

## Related Files

- Database Schema: `supabase/migrations/003_complete_zora_schema.sql`
- Validation Rules: `constants/validation.ts`
- Auth Service: `services/supabaseService.ts` (authService.signUp)
- Auth Store: `stores/authStore.ts` (signUp method)
- Onboarding Service: `services/onboardingService.ts`
