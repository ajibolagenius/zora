# Zora Monorepo Execution Plan

**Document Version:** 1.0
**Date:** January 29, 2026
**Status:** Draft for Review

---

## 1. Executive Summary

This document outlines the comprehensive plan to restructure the Zora African Market project into a **monorepo architecture**. This restructuring will consolidate the mobile customer app, vendor portal, admin dashboard, and marketing landing page into a single codebase, enabling shared resources, consistent development practices, and streamlined deployments.

### 1.1 Goals

- **Code Reuse**: Share types, utilities, constants, and business logic across all platforms
- **Consistency**: Unified design system, API interfaces, and development standards
- **Efficiency**: Single repository for easier maintenance, PR reviews, and deployments
- **Scalability**: Clear separation of concerns while maintaining code sharing

### 1.2 Scope

| Application | Technology | Purpose |
|-------------|------------|---------|
| **Mobile App** | React Native (Expo) | Customer-facing iOS/Android app |
| **Vendor Portal** | Next.js 15 | Vendor management web application |
| **Admin Dashboard** | Next.js 15 | Platform administration web application |
| **Landing Page** | Next.js 15 | Marketing website with vendor onboarding |

---

## 2. Proposed Monorepo Structure

```
zora/
├── apps/
│   ├── mobile/                    # React Native (Expo) - Customer App
│   │   ├── app/                   # Expo Router screens
│   │   ├── components/            # Mobile-specific components
│   │   ├── app.json
│   │   ├── package.json
│   │   └── ...
│   │
│   ├── web/                       # Next.js - Landing Page & Marketing
│   │   ├── app/                   # Next.js App Router
│   │   │   ├── (marketing)/       # Landing page routes
│   │   │   │   ├── page.tsx       # Home/Landing
│   │   │   │   ├── about/
│   │   │   │   ├── features/
│   │   │   │   ├── pricing/
│   │   │   │   └── contact/
│   │   │   ├── (auth)/            # Auth routes
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── vendor-onboarding/ # Vendor registration flow
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   ├── package.json
│   │   └── ...
│   │
│   ├── vendor/                    # Next.js - Vendor Portal
│   │   ├── app/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── page.tsx       # Dashboard overview
│   │   │   │   ├── products/      # Product management
│   │   │   │   ├── orders/        # Order fulfillment
│   │   │   │   ├── analytics/     # Sales analytics
│   │   │   │   ├── shop/          # Shop profile
│   │   │   │   ├── coverage/      # Delivery areas
│   │   │   │   └── settings/      # Account settings
│   │   │   ├── (auth)/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   ├── package.json
│   │   └── ...
│   │
│   └── admin/                     # Next.js - Admin Dashboard
│       ├── app/
│       │   ├── (dashboard)/
│       │   │   ├── page.tsx       # Dashboard overview
│       │   │   ├── orders/        # Order management
│       │   │   ├── customers/     # Customer management
│       │   │   ├── vendors/       # Vendor management & onboarding
│       │   │   ├── products/      # Product moderation
│       │   │   ├── reviews/       # Review management
│       │   │   ├── analytics/     # Platform analytics
│       │   │   ├── emails/        # Email threading
│       │   │   ├── refunds/       # Refund processing
│       │   │   └── settings/      # Platform settings
│       │   ├── (auth)/
│       │   └── layout.tsx
│       ├── components/
│       ├── package.json
│       └── ...
│
├── packages/
│   ├── shared/                    # Shared utilities & business logic
│   │   ├── src/
│   │   │   ├── utils/             # Shared utility functions
│   │   │   ├── constants/         # Shared constants
│   │   │   ├── hooks/             # Shared hooks (platform-agnostic)
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── types/                     # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── database.ts        # Supabase/DB types
│   │   │   ├── api.ts             # API request/response types
│   │   │   ├── entities/          # Domain entity types
│   │   │   │   ├── user.ts
│   │   │   │   ├── vendor.ts
│   │   │   │   ├── product.ts
│   │   │   │   ├── order.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── api-client/                # Shared Supabase client & API services
│   │   ├── src/
│   │   │   ├── supabase.ts        # Supabase client configuration
│   │   │   ├── services/          # API service functions
│   │   │   │   ├── auth.ts
│   │   │   │   ├── products.ts
│   │   │   │   ├── orders.ts
│   │   │   │   ├── vendors.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui-web/                    # Shared Web UI components (shadcn/ui)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   ├── Card/
│   │   │   │   ├── Modal/
│   │   │   │   ├── DataTable/
│   │   │   │   └── ...
│   │   │   ├── styles/
│   │   │   │   └── globals.css
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   ├── design-tokens/             # Shared design tokens
│   │   ├── src/
│   │   │   ├── colors.ts          # Brand colors
│   │   │   ├── typography.ts      # Font configurations
│   │   │   ├── spacing.ts         # Spacing scale
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── config/                    # Shared configurations
│       ├── eslint/                # ESLint configurations
│       ├── typescript/            # TypeScript configurations
│       └── tailwind/              # Tailwind configurations
│
├── supabase/                      # Supabase migrations & functions
│   ├── migrations/
│   ├── functions/                 # Edge functions
│   └── config.toml
│
├── data/                          # Shared data & mock files
│   ├── mock_database.json
│   └── email-templates/
│
├── docs/                          # Project documentation
│   ├── PRD.md
│   ├── MONOREPO_EXECUTION_PLAN.md
│   └── ...
│
├── scripts/                       # Shared scripts
│   ├── populate-database.js
│   └── ...
│
├── turbo.json                     # Turborepo configuration
├── package.json                   # Root package.json (workspaces)
├── pnpm-workspace.yaml            # pnpm workspace configuration
├── .env.example                   # Environment variables template
├── .gitignore
└── README.md
```

---

## 3. Technology Stack

### 3.1 Monorepo Tooling

| Tool | Purpose | Rationale |
|------|---------|-----------|
| **pnpm** | Package manager | Superior monorepo support, disk efficiency, strict dependency resolution |
| **Turborepo** | Build orchestration | Intelligent caching, parallel execution, dependency-aware builds |
| **TypeScript** | Type safety | Shared types across all applications |

### 3.2 Web Applications Stack (Landing, Vendor, Admin)

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Next.js 15 (App Router) | SSR, excellent DX, Vercel deployment |
| **Styling** | Tailwind CSS 3.4+ | Consistent with mobile, utility-first |
| **UI Components** | shadcn/ui | High-quality, customizable components |
| **State Management** | Zustand + TanStack Query | Consistent with mobile app |
| **Forms** | React Hook Form + Zod | Robust validation |
| **Data Tables** | TanStack Table | Powerful tables for admin/vendor |
| **Charts** | Recharts or Tremor | Analytics visualizations |
| **Authentication** | Supabase Auth | Shared auth across all apps |

### 3.3 Mobile Application Stack

| Layer | Technology | Status |
|-------|------------|--------|
| **Framework** | Expo (React Native) | Existing |
| **Styling** | NativeWind (Tailwind) | Existing |
| **State Management** | Zustand + TanStack Query | Existing |
| **Navigation** | Expo Router | Existing |

### 3.4 Shared Backend

| Service | Technology | Usage |
|---------|------------|-------|
| **Database** | PostgreSQL (Supabase) | All applications |
| **Authentication** | Supabase Auth | All applications |
| **File Storage** | Supabase Storage | All applications |
| **Realtime** | Supabase Realtime | Order updates, notifications |
| **Edge Functions** | Supabase Functions | Serverless business logic |

---

## 4. Detailed Feature Specifications

### 4.1 Landing Page (apps/web)

#### Pages & Routes

| Route | Purpose | Key Components |
|-------|---------|----------------|
| `/` | Landing/Home | Hero, Features, Testimonials, CTA |
| `/about` | About Zora | Mission, Team, Story |
| `/features` | Platform features | Feature cards, screenshots |
| `/vendors` | For vendors | Benefits, pricing, CTA |
| `/contact` | Contact form | Form, FAQ, support links |
| `/vendor-onboarding` | Vendor registration | Multi-step form |
| `/login` | User login | OAuth, email/password |
| `/register` | User registration | Registration form |

#### Landing Page Sections

1. **Hero Section**
   - Headline: "Authentic African Products, Delivered to Your Door"
   - Subheadline: "Connecting the African diaspora with home"
   - CTA: "Download App" / "Become a Vendor"
   - App store badges (iOS, Android)

2. **Features Section**
   - Shop by Region (West, East, North, South, Central Africa)
   - Multiple vendors in one cart
   - Real-time order tracking
   - Secure payments (Stripe, Klarna, Clearpay)

3. **How It Works**
   - Browse → Order → Track → Receive

4. **Vendor Section**
   - Benefits of selling on Zora
   - "Start Selling" CTA → `/vendor-onboarding`

5. **Testimonials**
   - Customer reviews
   - Vendor success stories

6. **Footer**
   - Links: About, Features, Support, Privacy, Terms
   - Social media links
   - Newsletter signup

#### Vendor Onboarding Flow

```
/vendor-onboarding
├── /step-1  → Business Information (name, type, description)
├── /step-2  → Contact Details (email, phone, address)
├── /step-3  → Documents Upload (business registration, ID)
├── /step-4  → Bank Details (for payouts)
├── /step-5  → Coverage Area (delivery zones on map)
├── /step-6  → Product Categories (what you sell)
└── /complete → Confirmation & pending review
```

---

### 4.2 Vendor Portal (apps/vendor)

#### Dashboard Overview

| Metric | Description |
|--------|-------------|
| Today's Orders | Orders received today |
| Pending Orders | Orders awaiting fulfillment |
| Total Revenue | This month's revenue |
| Product Views | Product page impressions |

#### Module: Product Management

**Features:**
- Add/Edit/Delete products
- Bulk import via CSV
- Multi-image upload (drag & drop)
- Rich text descriptions
- Inventory management
- Stock alerts
- Pricing management
- Category assignment
- Cultural region tagging

**Product Form Fields:**
```typescript
interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  barcode?: string;
  inventory: number;
  lowStockThreshold: number;
  categoryId: string;
  regionId: string;
  images: File[];
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  nutritionInfo?: string;
  ingredients?: string;
  weight?: number;
  weightUnit: 'g' | 'kg' | 'lb' | 'oz';
}
```

#### Module: Order Fulfillment

**Order States:**
```
pending → confirmed → preparing → ready_for_pickup →
out_for_delivery → delivered
                  → cancelled (at any stage)
```

**Features:**
- Order list with filters (status, date range, customer)
- Order detail view
- Update order status
- Print packing slip
- Print shipping label
- Mark as shipped with tracking number
- Handle cancellations
- Process partial fulfillment

#### Module: Shop Profile

**Fields:**
- Shop name & slug
- Logo & cover image
- Description (rich text)
- Cultural specialties
- Operating hours
- Contact information
- Social media links
- Policies (returns, shipping)

#### Module: Coverage Area

**Features:**
- Interactive map (Google Maps)
- Draw/edit delivery zones
- Set delivery fees by zone
- Set minimum order by zone
- Delivery time estimates

#### Module: Analytics

**Charts & Metrics:**
- Revenue over time (line chart)
- Orders by status (pie chart)
- Top selling products (bar chart)
- Customer demographics
- Order value distribution
- Peak ordering times

---

### 4.3 Admin Dashboard (apps/admin)

#### Dashboard Overview

| Metric | Description |
|--------|-------------|
| Total Orders | Platform-wide orders |
| Total Revenue | Platform GMV |
| Active Vendors | Approved vendors |
| Active Customers | Registered users |
| Pending Reviews | Reviews awaiting moderation |
| Pending Vendors | Vendor applications |

#### Module: Order Management

**Features:**
- View all orders across vendors
- Filter by vendor, status, date, customer
- Order detail view
- Order timeline/history
- Issue refunds
- Cancel orders
- Contact customer
- Export orders (CSV)

#### Module: Customer Management

**Features:**
- Customer list with search
- Customer detail view (profile, orders, activity)
- Customer order history
- Customer support tickets
- Account status management
- Credit balance management

#### Module: Vendor Management

**Features:**
- Vendor list with filters
- Vendor detail view
- Vendor onboarding queue
- Approve/reject vendors
- Vendor verification status
- Vendor performance metrics
- Vendor commission settings
- Suspend/unsuspend vendors

**Vendor Onboarding Queue:**
```
Application Received → Documents Review → Background Check →
Approval Decision → Account Activation
```

#### Module: Product Moderation

**Features:**
- Product approval queue
- Bulk approve/reject
- Flag inappropriate products
- Edit product details
- Category management
- Featured product selection

#### Module: Reviews Management

**Features:**
- Review moderation queue
- Approve/reject reviews
- Flag inappropriate reviews
- Respond to reviews (as admin)
- Review analytics

#### Module: Analytics & Reporting

**Reports:**
- Sales reports (daily, weekly, monthly)
- Vendor performance reports
- Customer acquisition reports
- Product performance reports
- Revenue breakdown by category/region
- Export all reports (CSV, PDF)

#### Module: Email Threading

**Features:**
- Centralized email inbox
- Thread view (grouped by customer/order)
- Quick reply
- Templates
- Link emails to orders/customers

#### Module: Refund Processing

**Features:**
- Refund request queue
- Review refund requests
- Approve/reject refunds
- Process to original payment method
- Process to credit balance
- Refund history & audit trail

#### Module: Platform Settings

**Settings:**
- Payment gateway configuration
- Shipping settings
- Commission rates
- Feature toggles
- Notification settings
- Email templates
- Platform maintenance mode

---

## 5. Shared Resources Strategy

### 5.1 Types Package (@zora/types)

```typescript
// packages/types/src/entities/user.ts
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'customer' | 'vendor' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// packages/types/src/entities/product.ts
export interface Product {
  id: string;
  vendorId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  regionId: string;
  inventory: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// packages/types/src/entities/order.ts
export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';
```

### 5.2 API Client Package (@zora/api-client)

```typescript
// packages/api-client/src/services/products.ts
import { createClient } from '../supabase';
import type { Product } from '@zora/types';

export const productsService = {
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    const supabase = createClient();
    let query = supabase.from('products').select('*');

    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters?.vendorId) {
      query = query.eq('vendor_id', filters.vendorId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Product | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(product: CreateProductInput): Promise<Product> {
    // ...
  },

  async update(id: string, updates: UpdateProductInput): Promise<Product> {
    // ...
  },

  async delete(id: string): Promise<void> {
    // ...
  }
};
```

### 5.3 Design Tokens Package (@zora/design-tokens)

```typescript
// packages/design-tokens/src/colors.ts
export const colors = {
  // Brand colors
  primary: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#CC0000',  // Zora Red
    600: '#B91C1C',
    700: '#991B1B',
  },
  secondary: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#FFCC00',  // Zora Yellow
    600: '#D97706',
  },

  // Dark theme
  dark: {
    background: '#221710',
    card: '#342418',
    border: '#4A3728',
  },

  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#CBA990',
    muted: '#8B7355',
  },

  // Status colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  }
} as const;

// packages/design-tokens/src/typography.ts
export const typography = {
  fonts: {
    heading: 'Montserrat',
    body: 'Open Sans',
  },
  sizes: {
    h1: 28,
    h2: 24,
    h3: 20,
    body: 16,
    small: 14,
    caption: 12,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
} as const;
```

---

## 6. Migration Plan

### Phase 1: Repository Setup (1-2 days)

1. **Initialize monorepo structure**
   ```bash
   mkdir -p apps/{mobile,web,vendor,admin}
   mkdir -p packages/{shared,types,api-client,ui-web,design-tokens,config}
   ```

2. **Setup pnpm workspaces**
   ```yaml
   # pnpm-workspace.yaml
   packages:
     - 'apps/*'
     - 'packages/*'
   ```

3. **Configure Turborepo**
   ```json
   // turbo.json
   {
     "$schema": "https://turbo.build/schema.json",
     "tasks": {
       "build": {
         "dependsOn": ["^build"],
         "outputs": [".next/**", "dist/**", ".expo/**"]
       },
       "dev": {
         "cache": false,
         "persistent": true
       },
       "lint": {},
       "type-check": {
         "dependsOn": ["^build"]
       }
     }
   }
   ```

4. **Setup shared TypeScript config**

### Phase 2: Mobile App Migration (1-2 days)

1. Move existing code to `apps/mobile/`
2. Update import paths
3. Extract shared types to `packages/types/`
4. Extract shared constants to `packages/design-tokens/`
5. Update `package.json` with workspace dependencies
6. Verify mobile app still works

### Phase 3: Shared Packages Setup (2-3 days)

1. **@zora/types** - Extract and organize types
2. **@zora/api-client** - Shared Supabase client and services
3. **@zora/design-tokens** - Colors, typography, spacing
4. **@zora/shared** - Utility functions
5. **@zora/ui-web** - Setup shadcn/ui components

### Phase 4: Landing Page (apps/web) (1 week)

1. Initialize Next.js 15 app
2. Setup Tailwind CSS + shadcn/ui
3. Implement landing page sections
4. Implement vendor onboarding flow
5. Setup authentication pages
6. Deploy to Vercel (staging)

### Phase 5: Vendor Portal (apps/vendor) (2-3 weeks)

1. Initialize Next.js 15 app
2. Setup authentication (vendor role)
3. Implement dashboard overview
4. Implement product management (CRUD, bulk import)
5. Implement order fulfillment
6. Implement shop profile management
7. Implement coverage area management
8. Implement analytics dashboard
9. Deploy to Vercel (staging)

### Phase 6: Admin Dashboard (apps/admin) (2-3 weeks)

1. Initialize Next.js 15 app
2. Setup authentication (admin role)
3. Implement dashboard overview
4. Implement order management
5. Implement customer management
6. Implement vendor management & onboarding approval
7. Implement product moderation
8. Implement reviews management
9. Implement analytics & reporting
10. Implement email threading
11. Implement refund processing
12. Implement platform settings
13. Deploy to Vercel (staging)

### Phase 7: Integration & Testing (1 week)

1. End-to-end testing across all apps
2. Cross-app authentication verification
3. Real-time sync testing
4. Performance optimization
5. Security audit

### Phase 8: Production Deployment (1 week)

1. Production environment setup
2. Domain configuration
3. SSL certificates
4. Monitoring setup
5. Launch

---

## 7. Development Workflow

### 7.1 Scripts

```json
// Root package.json
{
  "scripts": {
    "dev": "turbo dev",
    "dev:mobile": "turbo dev --filter=mobile",
    "dev:web": "turbo dev --filter=web",
    "dev:vendor": "turbo dev --filter=vendor",
    "dev:admin": "turbo dev --filter=admin",
    "build": "turbo build",
    "lint": "turbo lint",
    "type-check": "turbo type-check",
    "clean": "turbo clean && rm -rf node_modules"
  }
}
```

### 7.2 Environment Variables

```bash
# .env.example (root level)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Mobile (Expo)
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=

# App URLs
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_VENDOR_URL=
NEXT_PUBLIC_ADMIN_URL=
```

### 7.3 Deployment Configuration

| App | Platform | Domain |
|-----|----------|--------|
| Landing (web) | Vercel | zoraapp.co.uk |
| Vendor Portal | Vercel | vendor.zoraapp.co.uk |
| Admin Dashboard | Vercel | admin.zoraapp.co.uk |
| Mobile App | EAS / App Stores | iOS & Android apps |

---

## 8. Database Schema Additions

### 8.1 Vendor Applications Table

```sql
CREATE TABLE vendor_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  description TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address JSONB NOT NULL,
  documents JSONB, -- {business_registration, id_document, etc.}
  bank_details JSONB,
  coverage_areas JSONB,
  product_categories TEXT[],
  status TEXT DEFAULT 'pending', -- pending, under_review, approved, rejected
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 8.2 Admin Activity Log

```sql
CREATE TABLE admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- order, vendor, customer, product, etc.
  entity_id UUID,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 8.3 Email Threads

```sql
CREATE TABLE email_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES auth.users(id),
  order_id UUID REFERENCES orders(id),
  vendor_id UUID REFERENCES vendors(id),
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'open', -- open, closed, pending
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID REFERENCES email_threads(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL, -- customer, vendor, admin, system
  sender_id UUID,
  content TEXT NOT NULL,
  attachments JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 9. Authentication & Authorization

### 9.1 Role-Based Access

```typescript
// packages/types/src/auth.ts
export type UserRole = 'customer' | 'vendor' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  vendorId?: string; // If role is 'vendor'
}
```

### 9.2 Middleware (Next.js)

```typescript
// apps/vendor/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Check if user is a vendor
  const { data: vendor } = await supabase
    .from('vendors')
    .select('id')
    .eq('user_id', session.user.id)
    .single();

  if (!vendor) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*']
};
```

---

## 10. Success Metrics

### 10.1 Technical Metrics

- [ ] All apps share >60% of business logic code
- [ ] Type safety across all applications
- [ ] Build time < 5 minutes (with caching)
- [ ] Lighthouse score > 90 for web apps
- [ ] Test coverage > 70%

### 10.2 Business Metrics

- Vendor onboarding completion rate
- Admin task completion time
- Customer conversion rate from landing page
- App download rate from landing page CTAs

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Migration complexity | High | Phase-by-phase approach, keep mobile working first |
| Build time increase | Medium | Turborepo caching, selective builds |
| Dependency conflicts | Medium | Strict version pinning, pnpm's strict mode |
| Team onboarding | Low | Clear documentation, established patterns |

---

## 12. Appendix

### A. Useful Commands

```bash
# Install all dependencies
pnpm install

# Run all apps in development
pnpm dev

# Run specific app
pnpm dev --filter=mobile
pnpm dev --filter=web
pnpm dev --filter=vendor
pnpm dev --filter=admin

# Build all packages
pnpm build

# Type check
pnpm type-check

# Lint all
pnpm lint

# Add dependency to specific app
pnpm add <package> --filter=mobile

# Add shared dependency
pnpm add <package> --filter=@zora/shared
```

### B. Recommended VS Code Extensions

- Tailwind CSS IntelliSense
- ESLint
- Prettier
- TypeScript Importer
- Turbo
- Prisma (if using)

### C. References

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Expo Documentation](https://docs.expo.dev)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Supabase Documentation](https://supabase.com/docs)

---

**Document Prepared By:** AI Assistant
**Reviewed By:** [Pending]
**Approved By:** [Pending]

---

*This document is subject to revision based on team feedback and evolving requirements.*
