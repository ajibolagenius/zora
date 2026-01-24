## 1. Database Schema Overview

The following tables are structured to handle users, diverse vendor storefronts, a unified product catalog, and complex multi-vendor orders.

---

### 2. Core Tables & SQL Definitions

#### 2.1 Profiles & Authentication

Extends Supabase Auth to manage specific user roles.

```sql
CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'admin');

CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role user_role DEFAULT 'customer',
  credit_balance DECIMAL(12,2) DEFAULT 0.00,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

```

#### 2.2 Vendors & Shops

Stores individual vendor shop identities and their coverage areas.

```sql
CREATE TABLE vendors (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  shop_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  address TEXT,
  location GEOGRAPHY(POINT), -- For Map discovery
  coverage_radius_km INTEGER,
  is_verified BOOLEAN DEFAULT FALSE,
  cultural_specialties TEXT[], -- e.g., ['West African', 'Nigerian']
  created_at TIMESTAMPTZ DEFAULT NOW()
);

```

#### 2.3 Products

The unified catalog where items are linked to specific vendors.

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  category TEXT, -- e.g., 'Groceries', 'Spices'
  cultural_region TEXT, --
  image_urls TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

```

#### 2.4 Orders & Order Items

Handles the "Multi-Vendor Cart" by splitting items across vendors within a single transaction.

```sql
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id),
  total_amount DECIMAL(12,2) NOT NULL,
  status order_status DEFAULT 'pending',
  payment_intent_id TEXT, -- For Stripe/Klarna tracking
  shipping_address JSONB,
  qr_code_token TEXT UNIQUE, -- For verification
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  vendor_id UUID REFERENCES vendors(id), -- For vendor-specific fulfillment
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL
);

```

---

### 3. Row Level Security (RLS) Examples

To ensure data privacy across your hybrid platform, these policies restrict access based on user roles.

* **Customers:** Can view all active products but only their own orders.
* **Vendors:** Can only update products and view orders belonging to their specific shop.
* **Admins:** Have full read/write access to all tables.

```sql
-- Example: Only vendors can edit their own products
CREATE POLICY "Vendors can manage own products"
ON products FOR ALL
USING (auth.uid() = vendor_id);

-- Example: Customers can only see their own order history
CREATE POLICY "Customers view own orders"
ON orders FOR SELECT
USING (auth.uid() = customer_id);

```
