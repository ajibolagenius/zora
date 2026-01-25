# Zora African Market - Product Requirements Document

## Overview
Zora African Market is a premium mobile e-commerce marketplace connecting the African diaspora in the UK with authentic African groceries, products, and vendors. Built with React Native/Expo for cross-platform mobile support.

## Tech Stack
- **Frontend**: React Native with Expo (SDK 52+)
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Styling**: StyleSheet with Zora Design System + NativeWind (Tailwind CSS)
- **State Management**: Zustand + TanStack Query (React Query)
- **Navigation**: Expo Router (file-based routing)
- **Authentication**: Supabase Auth (Google OAuth, Email/Password)
- **Payments**: Stripe, Klarna, Clearpay (ready for integration)

## Design System
### Colors
- Primary: #CC0000 (Zora Red) - buttons, CTAs, active states
- Secondary: #FFCC00 (Zora Yellow) - prices, accents, ratings
- Background Dark: #221710 (warm brown)
- Card Dark: #342418
- Text Primary: #FFFFFF
- Text Muted: #CBA990

### Typography
- Headlines: Montserrat Bold
- Body: Open Sans Regular
- Font Sizes: h1=28, h2=24, h3=20, body=16, small=14, caption=12

## Features Implemented (MVP)

### 1. Home Screen
- Location selector (Brixton, London)
- Search bar with filter option
- Hero banner carousel with featured promotions
- Shop by Region (West Africa, East Africa, North Africa, South Africa, Central Africa)
- Featured Vendors carousel with ratings, delivery info
- Popular Products grid with prices in GBP

### 2. Explore Screen
- Category filtering (All, Spices, Grains, Vegetables, Meats, Textiles)
- View mode toggle (Vendors/Products)
- Search functionality
- Vendor cards with ratings and delivery info

### 3. Product Details
- Full product information with images
- Price display in GBP (£)
- Certifications badges (Organic, Top Rated, Eco-Friendly)
- Vendor card with link to vendor profile
- Product description tabs
- Delivery info cards
- Quantity selector
- Add to Basket button

### 4. Vendor Storefront
- Cover image with vendor logo
- Verified vendor badge
- Rating and review count
- Follow, Message, Share actions
- Tabs: Products, Reviews, About
- Product grid from vendor

### 5. Shopping Cart
- Multi-vendor cart support
- Items grouped by vendor
- Quantity controls (+/-)
- Remove item functionality
- Order summary (Subtotal, Delivery, Service Fee, Total)
- Proceed to Checkout button

### 6. Checkout Flow
- Delivery address selection
- Payment method (Stripe, Klarna, Clearpay)
- Order summary
- Place order functionality

### 7. Orders Screen
- Order tabs (All, Active, Completed, Cancelled)
- Order cards with status badges
- Order item thumbnails
- Total amount display

### 8. Order Tracking
- Order status tracking timeline
- Order items list
- Order summary
- QR code for order verification
- Help button

### 9. Profile Screen
- Sign in prompt for guests
- User profile (when authenticated)
- Membership tier badge
- Stats: Points, Credits, Referral code
- Menu: Orders, Addresses, Payments, Notifications, Help, About
- Log out functionality

### 10. Authentication
- Google OAuth via Supabase Auth
- Email/Password authentication
- Browse as Guest option
- Session management with secure token storage

### 11. Onboarding
- Region/heritage selection
- Cultural interest preferences
- Welcome screens

## Supabase Database Schema

### Core Tables
- `profiles` - User profiles (extends Supabase auth.users)
- `vendors` - Vendor information and settings
- `products` - Product catalog
- `categories` - Product categories
- `regions` - African regions for product/vendor classification
- `reviews` - Product and vendor reviews
- `orders` - Customer orders
- `order_items` - Individual items in orders
- `addresses` - Saved delivery addresses
- `carts` - Shopping cart data
- `cart_items` - Individual cart items

See `frontend/supabase/migrations/001_initial_schema.sql` for the complete schema.

## Configuration Required

### Supabase Setup
Update `frontend/.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Stripe (Payment Processing)
Update `frontend/.env`:
```
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_key
```

### Google Maps
Update `frontend/.env`:
```
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Klarna/Clearpay (Optional)
```
EXPO_PUBLIC_KLARNA_CLIENT_ID=your_klarna_client_id
EXPO_PUBLIC_CLEARPAY_MERCHANT_ID=your_clearpay_merchant_id
```

## Running the Application

### Development
```bash
cd frontend
npm install
npx expo start
```

### Testing on Device
- **iOS/Android**: Scan QR code with Expo Go app
- **Web**: Press `w` to open web preview

### Building for Production
```bash
# iOS
npx expo build:ios

# Android
npx expo build:android

# EAS Build (recommended)
eas build --platform all
```

## Project Structure
```
zora/
├── frontend/              # React Native Expo app
│   ├── app/              # Expo Router screens
│   ├── components/       # Reusable UI components
│   ├── constants/        # Design tokens & configuration
│   ├── data/             # Mock data (development)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Supabase client & utilities
│   ├── providers/        # Context providers
│   ├── services/         # API & business logic services
│   ├── stores/           # Zustand state stores
│   ├── supabase/         # Database migrations & seeds
│   └── types/            # TypeScript type definitions
├── docs/                 # Documentation
└── README.md
```

## Next Steps / Enhancements
1. Complete Supabase Auth integration with proper session persistence
2. Implement real-time order tracking with Supabase Realtime
3. Add push notifications via Expo Push Notifications
4. Implement loyalty points system
5. Add favorites/wishlist functionality with Supabase
6. Implement promo codes system
7. Add multi-language support (i18n)
8. Implement vendor analytics dashboard
9. Add in-app messaging between customers and vendors
10. Implement advanced search with Supabase full-text search

## Notes
- Payment integration uses PLACEHOLDER keys - replace for production
- Mock data service provides fallback when Supabase is not configured
- Dark mode UI implemented as per design specifications
- NativeWind is configured for incremental migration from StyleSheet
