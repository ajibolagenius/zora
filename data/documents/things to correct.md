# ZORA Marketplace - Technical Implementation Requirements

## Executive Summary

The client requirements primarily target the **web application** (`apps/web`) which serves as a central platform for all user types (customers, admins, and vendors). The mobile app will maintain its existing dark theme design system, while web applications will transition to a light theme.

---

## ✅ **COMPLETED UPDATES**

### 0.1 Logo Replacement ✅
- **Task**: Replace current logo assets across all applications ✅
- **Files Updated**:
  - `apps/web/public/` ✅
  - `apps/admin/app/` ✅
  - `apps/vendor/app/` ✅
  - `apps/mobile/assets/` ✅
  - Shared components in `packages/shared/` ✅
- **Deliverable**: New logo assets in multiple formats (SVG, PNG, ICO) for responsive scaling ✅

---

## 1. Web Application (`apps/web`) - Primary Focus

### 1.1 UI/UX Theme Updates ✅
- **Background**: Update to pure white (`#FFFFFF`) for light theme ✅
- **Text Colors**: Implement Zora Yellow (`#FFCC00`) and Zora Red (`#CC0000`) for primary elements ✅
- **Design System Alignment**:
  - Primary: `#CC0000` (Zora Red) - buttons, CTAs, active states ✅
  - Secondary: `#FFCC00` (Zora Yellow) - prices, accents, highlights ✅
  - Background Light: `#F8F7F5` - web applications ✅
  - Text Primary: `#221710` - dark text on light backgrounds ✅
- **Implementation**: Update Tailwind CSS configuration and design tokens in `packages/design-tokens/` ✅

### 1.2 Landing Page Structure (Reference: https://www.oyashop.app/) ✅
- **Approach**: Recreate similar landing page structure without hero and header sections
- **Reference Features to Adapt**:
  - "Shop Local, Save More" value proposition section ✅
  - "Why Customers Love Zora" features grid (Direct Vendor Access, Better Prices, Secure & Private) ✅
  - "How Zora Works" 3-step process (Sign Up → Browse & Shop → Enjoy & Review) ✅
  - "Experience Zora Mobile App" promotion section ✅
  - Customer testimonials and trust indicators ✅
- **Design System Adaptation**:
  - Apply ZORA color scheme (Zora Red `#CC0000`, Zora Yellow `#FFCC00`) ✅
  - Use Montserrat typography for headings, Poppins for body text ✅
  - Maintain light theme with `#F8F7F5` backgrounds ✅
  - Implement card-based layout with 12px border radius ✅
- **Components to Create**:
  - `ValueProposition` - Main value proposition section ✅
  - `FeaturesGrid` - Feature highlights grid ✅
  - `HowItWorks` - 3-step process visualization ✅
  - `MobileAppPromo` - App download promotion ✅
  - `Testimonials` - Customer reviews section ✅

### 1.3 Product Showcase Carousel ✅
- **Feature**: Implement auto-scrolling product carousel on landing page ✅
- **Technical Requirements**:
  - Fetch products from API using `@zora/api-client` ✅
  - Implement smooth infinite scroll animation using Framer Motion (300ms timing, easeOut easing) ✅
  - Display product images, names, and prices in GBP (£) ✅
  - Click-to-navigate to product details ✅
  - Use Zora Design System card styling (12px radius, subtle shadows) ✅
- **Components**: Create `ProductCarousel` component in `apps/web/components/` ✅

### 1.4 Delivery Partners Integration ⚠️ (Partially Implemented - Landing Page Mockup)
- **Task**: Display delivery company logos and information
- **Implementation**:
  - Add delivery partners section to footer and checkout flow ⚠️
  - Store delivery partner data in Supabase database ❌
  - Create `DeliveryPartners` component ❌
- **Database Schema**: Update `delivery_partners` table with logos, names, and service areas ❌
- **Current Implementation**:
  - ✅ **FeaturesGrid Component**: Includes "UK Wide Delivery" feature with Truck icon
  - ✅ **Footer Component**: Basic footer structure (no delivery partners section yet)
  - ✅ **Design System**: Uses ZORA colors and proper styling
  - ⚠️ **Missing**: Dedicated delivery partners section with company logos
  - ⚠️ **Missing**: Database table for delivery partner management
  - ⚠️ **Missing**: Dynamic delivery partner data integration

### 1.5 Payment Gateway Updates ❌
- **Removal**: Remove Klarna and ClearPay payment integrations ❌
- **Files to Modify**:
  - Payment provider configurations ❌
  - Checkout form components ❌
  - API integration handlers ❌
- **Impact**: Update payment options UI and backend processing logic ❌

### 1.6 Customer Review System ⚠️ (Partially Implemented - Landing Page Only)
- **Feature**: Implement product and service review functionality ⚠️
- **Technical Implementation**:
  - Database schema: `reviews` table with ratings (1-5 stars), comments, user_id, product_id ❌
  - Components: `ReviewCard`, `ReviewForm`, `ReviewList` following design system ⚠️
  - API endpoints: CRUD operations for reviews ❌
  - Display average ratings and review counts ✅
  - Star rating display using Zora Yellow (`#FFCC00`) for filled stars ✅
- **Design System Compliance**:
  - Star icons: Phosphor Icons (fill weight for filled, duotone for empty) ✅
  - Typography: Poppins for review text, Montserrat for headings ✅
  - Card styling: 12px radius, `#F8F7F5` background ✅
- **Current Implementation**: Mock testimonials component on landing page with static data
- **Missing**: Database integration, user-generated reviews, CRUD operations

### 1.7 Marketing and Promotional Features ✅
- **Free Delivery Promotion**:
  - Display "FREE DELIVERY ALL ACROSS UK" throughout the site ✅
  - Banner background: Zora Yellow (`#FFCC00`) with dark text (`#221710`) ✅
  - Typography: Montserrat Bold for emphasis ✅
  - Border radius: 12px for banner containers ✅
- **App Download Promotion**:
  - Add "Download the App" CTA across header, footer, product pages, checkout confirmation ✅
  - Button styling: Primary buttons with Zora Red (`#CC0000`) background ✅
  - Icon usage: Phosphor Icons (mobile device icons) ✅
  - Typography: Montserrat Medium for CTA text ✅

---

## 2. Mobile Application (`apps/mobile`) - Limited Changes

### 2.1 Logo Replacement Only ✅
- **Task**: Update logo assets in mobile app
- **Files to Update**: `apps/mobile/assets/`
- **Note**: Mobile app retains existing dark theme design system per current specifications
- **No Changes Required**: Color scheme, backgrounds, or UI themes (maintain `#221710` background)

### 2.2 Guest Checkout Flow
- **Feature**: Enable shopping without account registration on mobile app
- **Implementation**:
  - Modify authentication flow to allow guest sessions (aligns with existing "Browse as Guest" feature)
  - Implement user account creation at checkout completion using Supabase Auth
  - Update cart persistence to support guest users
  - Required fields: email, shipping address, billing address
- **User Flow**: Browse → Add to Cart → Checkout → Create Account → Payment
- **Design System Compliance**:
  - Input styling: 8px radius, subtle borders, proper focus states (dark theme)
  - Button styling: 12px radius, 48px height, Zora Red (`#CC0000`) for primary actions
  - Form validation: Use Zora Red for error states
  - Typography: Poppins for form labels and inputs
  - Maintain dark theme with `#221710` backgrounds and `#FFFFFF` text

### 2.3 Cross-Platform Consistency
- Ensure shared components from `packages/shared/` work correctly
- Update API client to support new web features (reviews, guest checkout)
- Maintain compatibility with existing mobile user experience

---

## 3. Vendor Portal (`apps/vendor`) - Secondary Updates

### 3.1 UI/UX Theme Alignment
- **Background**: Update to light theme to match web application
- **Logo**: Replace with new logo assets
- **Design System**: Apply same light theme tokens as web application
- **Files to Update**: `apps/vendor/app/`

### 3.2 Feature Integration
- **Review Management**: Vendors can view and respond to customer reviews
- **Delivery Partners**: Display available delivery options in vendor dashboard
- **Payment Processing**: Updated to reflect removal of Klarna/ClearPay

---

## 4. Admin Dashboard (`apps/admin`) - Secondary Updates

### 4.1 UI/UX Theme Alignment
- **Background**: Update to light theme to match web application
- **Logo**: Replace with new logo assets
- **Design System**: Apply same light theme tokens as web application
- **Files to Update**: `apps/admin/app/`

### 4.2 Administrative Features
- **Review Management**: Admin can moderate and manage customer reviews
- **Delivery Partner Management**: CRUD operations for delivery partners
- **Payment Gateway Configuration**: Updated admin interface for payment methods
- **Guest Order Management**: View and manage orders from guest users

---

## 5. Cross-Application Components (`packages/`)

### 5.1 Design Tokens Updates (`packages/design-tokens/`)
- **colors.ts**: Add light theme colors for web applications
- **typography.ts**: Ensure Montserrat and Poppins font configurations
- **spacing.ts**: Verify spacing scale (xs: 4px, sm: 8px, md: 12px, base: 16px)
- **shadows.ts**: Add shadow scales for light theme

### 5.2 Shared Components (`packages/shared/`)
```
packages/shared/src/
├── ui/
│   ├── Button.tsx       # Standardized button component
│   ├── Card.tsx         # Card component with design system styling
│   ├── Input.tsx        # Form input component
│   └── Badge.tsx        # Badge/tag components
├── types/
│   ├── review.ts        # Review system types
│   ├── checkout.ts      # Checkout flow types
│   └── delivery.ts      # Delivery partner types
└── utils/
    ├── validation.ts    # Form validation utilities
    └── formatting.ts    # Price/currency formatting

apps/web/components/
├── landing/                  # Landing page components (OyaShop-inspired)
│   ├── ValueProposition.tsx   # Main value proposition section
│   ├── FeaturesGrid.tsx       # Feature highlights grid
│   ├── HowItWorks.tsx         # 3-step process visualization
│   ├── MobileAppPromo.tsx     # App download promotion
│   └── Testimonials.tsx       # Customer reviews section
├── marketing/               # Marketing-specific components
│   ├── ProductCarousel.tsx
│   ├── FreeDeliveryBanner.tsx
│   └── AppDownloadCTA.tsx
├── reviews/                 # Review system components
│   ├── ReviewCard.tsx
│   ├── ReviewForm.tsx
│   └── ReviewList.tsx
└── checkout/                # Checkout flow components
    ├── GuestCheckout.tsx
    └── PaymentMethods.tsx
```

---

## 6. Database Schema Updates (Supabase)

### 6.1 New Tables
```sql
-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  user_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Delivery partners table
CREATE TABLE delivery_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  service_areas TEXT[],
  is_active BOOLEAN DEFAULT true
);
```

### 6.2 Existing Table Modifications
- Update `products` table to include average_rating and review_count
- Modify `orders` table to support guest checkout information
- Update payment_methods table to remove Klarna and ClearPay options
- **Supabase Integration**:
  - Use existing database schema from `supabase/migrations/001_initial_schema.sql`
  - Follow established naming conventions (snake_case for table/column names)
  - Implement proper RLS (Row Level Security) policies
  - Add new migrations in `supabase/migrations/` directory

---

## 7. Implementation Priority & Timeline

### 7.1 Priority Order
1. **High Priority**: Web application theme updates and logo replacement
2. **Medium Priority**: Payment gateway removal and guest checkout implementation
3. **Low Priority**: Review system and promotional features
4. **Secondary**: Vendor and admin portal theme alignment

### 7.2 Development Phases
- **Phase 1**: Web application core features (carousel, checkout, payments)
- **Phase 2**: Review system and delivery partners
- **Phase 3**: Vendor and admin portal updates
- **Phase 4**: Mobile app logo update and cross-platform testing

---

## 8. Testing & Deployment

### 8.1 Testing Requirements
- Unit tests for new components
- Integration tests for payment and checkout flows
- Cross-browser compatibility testing for web applications
- Mobile responsiveness verification
- Cross-application functionality testing

### 8.2 Deployment Strategy
- Deploy web application changes first (primary user platform)
- Update vendor and admin portals subsequently
- Mobile app update as minor version (logo change only)
- Monitor performance and user feedback post-deployment
