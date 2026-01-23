# Zora African Market - Product Requirements Document

## Overview
Zora African Market is a premium mobile e-commerce marketplace connecting the African diaspora in the UK with authentic African groceries, products, and vendors. Built with React Native/Expo for cross-platform mobile support.

## Tech Stack
- **Frontend**: React Native with Expo (SDK 52+)
- **Backend**: FastAPI with MongoDB
- **Styling**: StyleSheet with Zora Design System
- **State Management**: Zustand
- **Navigation**: Expo Router (file-based routing)
- **Authentication**: Emergent Google OAuth (ready for integration)
- **Payments**: Stripe (placeholder keys - ready for live integration)

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
- Payment method (Stripe integration ready)
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
- Help button

### 9. Profile Screen
- Sign in prompt for guests
- User profile (when authenticated)
- Membership tier badge
- Stats: Points, Credits, Referral code
- Menu: Orders, Addresses, Payments, Notifications, Help, About
- Log out functionality

### 10. Authentication
- Google OAuth via Emergent Auth (ready for integration)
- Browse as Guest option
- Session management

### 11. Onboarding
- Region/heritage selection
- Cultural interest preferences
- Welcome screens

## Backend API Endpoints

### Authentication
- POST /api/auth/session - Exchange OAuth session
- GET /api/auth/me - Get current user
- POST /api/auth/logout - Log out
- PUT /api/auth/profile - Update profile

### Home & Discovery
- GET /api/home - Home page data (banners, regions, vendors, products)
- GET /api/regions - All regions

### Vendors
- GET /api/vendors - List vendors (with filters)
- GET /api/vendors/{id} - Vendor details
- GET /api/vendors/{id}/products - Vendor products
- GET /api/vendors/{id}/reviews - Vendor reviews

### Products
- GET /api/products - List products (with filters)
- GET /api/products/{id} - Product details
- GET /api/products/{id}/reviews - Product reviews
- GET /api/products/region/{region} - Products by region
- GET /api/products/popular - Popular products

### Cart
- GET /api/cart - Get cart
- POST /api/cart/add - Add item
- PUT /api/cart/update - Update cart
- DELETE /api/cart/item/{id} - Remove item
- DELETE /api/cart/clear - Clear cart

### Orders
- POST /api/orders - Create order
- GET /api/orders - List orders
- GET /api/orders/{id} - Order details
- POST /api/orders/{id}/cancel - Cancel order

### Payments
- POST /api/payments/create-intent - Create Stripe PaymentIntent
- POST /api/payments/confirm - Confirm payment
- GET /api/payments/config - Get Stripe publishable key

### Search
- GET /api/search?q={query} - Search products and vendors

## Configuration Required

### Stripe (Payment Processing)
Update `/app/backend/.env`:
```
STRIPE_SECRET_KEY=sk_live_your_actual_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_key
```

### Google Maps (Future)
When available, add to `/app/frontend/.env`:
```
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
```

## Running the Application

### Backend
```bash
cd /app/backend
sudo supervisorctl restart backend
```
API available at: http://localhost:8001/api/

### Frontend
```bash
cd /app/frontend
sudo supervisorctl restart expo
```
Web preview: http://localhost:3000
Mobile: Scan QR code with Expo Go

## Next Steps / Enhancements
1. Implement actual Stripe payment flow with live keys
2. Add Google Maps for vendor discovery
3. Implement real-time order tracking
4. Add push notifications
5. Implement loyalty points system
6. Add product reviews and ratings
7. Implement saved addresses management
8. Add favorites/wishlist functionality
9. Implement promo codes system
10. Add multi-language support

## Notes
- Payment integration uses PLACEHOLDER keys - replace for production
- Emergent Google OAuth is configured and ready for authentication
- All API endpoints are functional with MongoDB persistence
- Dark mode UI implemented as per design specifications
