# Home Screen Connectors

This document lists all navigation links, buttons, and actions on the Home screen (`app/(tabs)/index.tsx`) that lead to other screens or components.

## Header Section

### 1. Location Button (Lines 282-295)
- **Component**: `TouchableOpacity` with MapPin icon
- **Action**: `handleLocationPress()`
- **Destination**: `/settings/addresses`
- **Purpose**: Navigate to address/location settings

### 2. Notifications Button (Lines 296-303)
- **Component**: `TouchableOpacity` with Bell icon
- **Action**: `handleNotificationsPress()`
- **Destination**: `/notifications`
- **Purpose**: Navigate to notifications screen

### 3. Search Bar (Lines 307-321)
- **Component**: `TouchableOpacity` containing search input
- **Action**: `onPress` handler
- **Destination**: `/search`
- **Purpose**: Navigate to search screen
- **Note**: Contains a filter button (Sliders icon) but it's part of the search container

## Featured Collection Slider

### 4. Banner CTA Links (Lines 236-251, 347-354)
- **Component**: `FeaturedSlider` component with `onBannerPress` handler
- **Action**: `handleBannerPress(banner)`
- **Destinations** (based on `banner.cta_link`):
  - `/products` - If link starts with `/products`
  - `/categories` - If link starts with `/categories`
  - `/products` - If link starts with `/collections` (mapped to products)
  - Custom routes - Any other `cta_link` value
- **Purpose**: Navigate based on banner call-to-action links

## Shop by Region Section

### 5. "See All" Link (Line 360)
- **Component**: `TouchableOpacity` with "See All" text
- **Action**: `router.push('/regions')`
- **Destination**: `/regions`
- **Purpose**: Navigate to all regions screen

### 6. Region Cards (Lines 384-400)
- **Component**: `RegionCard` component
- **Action**: `handleRegionPress({ name: region.name })`
- **Destination**: Local state change (filters products by region)
- **Purpose**: Filter products by selected region (not navigation, but state change)
- **Note**: This is a filter action, not navigation

## Featured Vendors Section

### 7. "See All" Link (Line 409)
- **Component**: `TouchableOpacity` with "See All" text
- **Action**: `router.push('/vendors')`
- **Destination**: `/vendors`
- **Purpose**: Navigate to all vendors screen

### 8. Vendor Cards (Lines 418-425)
- **Component**: `VendorCard` component
- **Action**: `handleVendorPress(vendor)` → `router.push(getVendorRoute(vendor, vendor.id))`
- **Destination**:
  - `/store/{slug}` - If vendor has a slug
  - `/store/{generated-slug}` - If vendor has shop_name/name (slug generated)
  - `/vendor/{vendorId}` - Fallback to ID-based route
  - `/vendors` - Ultimate fallback
- **Purpose**: Navigate to vendor/store detail page

## Popular Products Section

### 9. "See All" Link (Lines 435-443)
- **Component**: `TouchableOpacity` with "See All" text
- **Action**: Conditional navigation
- **Destination**:
  - `/products?region={regionSlug}` - If a region is selected
  - `/products` - If no region is selected
- **Purpose**: Navigate to products listing (with optional region filter)

### 10. Product Cards (Lines 455-459)
- **Component**: `ProductCard` component
- **Actions**:
  - **onPress**: `handleProductPress(product)` → `router.push(getProductRoute(product.id))`
    - **Destination**: `/product/{slug}` - For UUID products (Base62-encoded slug)
    - **Destination**: `/product/{productId}` - For non-UUID products (legacy IDs)
    - **Purpose**: Navigate to product detail page
  - **onAddToCart**: `handleAddToCart(product)`
    - **Destination**: Cart store (adds item to cart)
    - **Purpose**: Add product to shopping cart (not navigation, but state action)

## Summary

### Navigation Routes (10 total):
1. `/settings/addresses` - Location settings
2. `/notifications` - Notifications screen
3. `/search` - Search screen
4. `/products` - Products listing (from banners)
5. `/categories` - Categories (from banners)
6. `/regions` - All regions screen
7. `/vendors` - All vendors screen
8. `/store/{slug}` - Vendor/store detail page
9. `/product/{slug}` - Product detail page
10. `/products?region={regionSlug}` - Products filtered by region

### State Actions (2 total):
1. Region filter - Filters products by selected region (local state)
2. Add to cart - Adds product to cart store (global state)

### Components Used:
- `FeaturedSlider` - Banner carousel with navigation
- `RegionCard` - Region selection cards (filter action)
- `VendorCard` - Vendor cards with navigation
- `ProductCard` - Product cards with navigation and cart action
