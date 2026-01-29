# Project Requirements Document (PRD)

**Project Name:** Zora African Market
**Version:** 2.1 (Hybrid Architecture - Mobile + Web)
**Type:** Hybrid Platform - Native Mobile Application (Customer) + Web Application (Admin & Vendor)
**Status:** Draft for Approval
**Date:** 19th January 2026

---

## 1. Executive Summary

**Zora African Market** is a central hub for Africans in the diaspora to access authentic groceries, a vibrant marketplace, and community-focused services that reflect African culture and everyday needs—wherever they live.

The platform employs a **hybrid architecture** that optimizes the user experience for each user type:

- **Mobile Application (React Native):** Native mobile app for customers to browse products, make purchases, track orders, and discover vendors. Optimized for mobile performance, smooth scrolling, and high-quality image handling.

- **Web Application:** Comprehensive web-based admin dashboard and vendor portal for business operations. Enables efficient vendor onboarding, product catalog management, order processing, analytics, and administrative tasks.

The platform connects customers with multiple vendors, enabling vendors to create their own mini shop profiles to showcase products separately from the main product display. Features include comprehensive order management, multi-payment processing, vendor mapping with location-based services, and seamless customer communication.

The platform serves primarily the UK market, with the flexibility to expand to other diaspora communities globally. Both mobile and web applications share the same Supabase backend, ensuring data consistency and real-time synchronization.

**Core Value Proposition:**
- **Authentic Access:** Connect Africans in the diaspora with authentic African groceries and products
- **Vibrant Marketplace:** Multiple vendors with individual shop profiles, creating a diverse shopping experience
- **Community-Focused:** Services and features designed to reflect African culture and everyday needs
- **Geographic Flexibility:** Access to authentic products wherever users live in the diaspora

---

## 2. Target Market & Audience

### 2.1. Primary Market
- **Geographic Focus:** United Kingdom (primary market)
- **Target Audience:** Africans living in the diaspora
- **Demographics:** Individuals and families seeking authentic African groceries, ingredients, and cultural products

### 2.2. Market Needs
- Access to hard-to-find African ingredients and products
- Convenient shopping experience without visiting multiple physical stores
- Community connection through culturally relevant services
- Support for local African-owned businesses and vendors
- Reliable delivery and pickup options for authentic products

### 2.3. Expansion Potential
- Other diaspora communities globally (Europe, North America, etc.)
- Growing demand for authentic African products in international markets
- Scalable platform architecture to support multiple regions

---

## 3. User Roles & Permissions

| Role | Interface | Description | Core Actions |
| --- | --- | --- | --- |
| **Customer** | Mobile App | End-user (B2C) - Africans in the diaspora seeking authentic products | Browse products across multiple vendor shops, purchase (credit balance/payment gateways), track orders, use QR codes, discover local vendors |
| **Vendor** | Web Portal | B2B Stakeholder - Local African-owned businesses and stores | Create and manage mini shop profiles, add/edit products via web dashboard, manage inventory, handle orders, view analytics, manage store information |
| **Admin** | Web Dashboard | Platform Owner | Manage orders/customers, view email threads, process refunds, manage reviews, oversee vendor onboarding, access analytics and reporting, platform configuration |

---

## 4. Feature Specifications

### 4.1. Architecture Overview

The platform consists of two main interfaces:

**Mobile Application (Customer-Facing):**
- Native iOS and Android app built with React Native (Expo)
- Optimized for shopping, browsing, and order tracking
- Location-based vendor discovery
- Mobile-optimized payment flows

**Web Application (Business-Facing):**
- Admin Dashboard: Comprehensive platform management
- Vendor Portal: Product catalog management and order fulfillment
- Responsive design for desktop and tablet use
- Rich data entry forms and bulk operations

Both interfaces share the same Supabase backend for real-time data synchronization.

---

### 4.2. Mobile Application Features

#### 4.2.1. Shopping & Discovery
- **Product Browsing:** Browse products across multiple vendor shops with smooth scrolling and high-quality images
- **Vendor Shop Discovery:** Explore individual vendor mini shops, each with their own branded storefront
- **Search & Filters:** Search products by name, category, cultural region, or vendor
- **Interactive Maps:** Google Maps integration showing vendor locations, coverage areas, and location-based discovery (UK-focused)
- **Cultural Product Discovery:** Discover products by cultural category, region, or occasion

#### 4.2.2. Payments & Billing
- **Credit Balance:** Customers maintain account credit for purchases
- **Payment Gateways:** 
  - **Stripe** - Standard credit/debit card processing
  - **Klarna** - Buy now, pay later functionality
  - **Clearpay** - Installment payment options
- **Secure Checkout:** Mobile-optimized checkout flow with saved payment methods

#### 4.2.3. Orders & Tracking
- **Order Placement:** Seamless order placement from multiple vendors in a single cart
- **Order Tracking:** Real-time order status updates and tracking information
- **Order History:** Complete order history with reorder functionality
- **QR Codes:** Store access verification, promotional offers, order verification

#### 4.2.4. Reviews & Trust
- **Product Reviews:** View and submit product reviews and ratings
- **Vendor Reviews:** Rate and review vendor shops
- **Vendor Trust Badges:** View verification and trust indicators for vendors
- **Community Ratings:** See community ratings and feedback

#### 4.2.5. Community Features
- **Recipe Integration:** Potential integration with African recipes linking to available ingredients
- **Cultural Categories:** Browse products organized by cultural regions and categories
- **Local Vendor Discovery:** Find nearby vendors based on location

---

### 4.3. Web Application Features

#### 4.3.1. Admin Dashboard
- **Order Management:** Comprehensive interface for viewing, tracking, and managing all orders across the platform
- **Customer Management:** Customer information, order history, account management, and customer support tools
- **Vendor Onboarding:** Streamlined vendor registration process with document upload, verification, and approval workflow
- **Vendor Management:** Manage vendor accounts, approve/reject vendors, handle vendor disputes, and monitor vendor performance
- **Email Threading:** Centralized email management system organizing customer/order emails into visible threads linked to orders/customers
- **Refund Processing:** Process refunds to original payment method or credit balance with detailed transaction history
- **Reviews Management:** Moderate reviews, manage review visibility, and handle review disputes
- **Analytics & Reporting:** Dashboard with sales analytics, vendor performance metrics, customer insights, and platform usage statistics
- **Platform Configuration:** System settings, payment gateway configuration, shipping settings, and platform-wide feature toggles
- **Shipping Automation:** Automated rate calculation, label generation, order tracking, and courier integration management

#### 4.3.2. Vendor Portal
- **Shop Profile Management:** Create and customize mini shop profiles with branding, store information, and cultural specialties
- **Product Catalog Management:**
  - Add/edit/delete products with rich text descriptions
  - Bulk product import via CSV
  - Multi-image upload and management
  - Product categorization by cultural region, category, and occasion
  - Inventory management and stock tracking
  - Pricing management with bulk pricing updates
- **Order Fulfillment:** View and manage orders, update order status, print shipping labels, and handle order cancellations
- **Coverage Area Management:** Define and manage delivery coverage areas on interactive maps
- **Analytics Dashboard:** View sales reports, popular products, customer insights, and performance metrics
- **Store Information:** Manage store details, contact information, business hours, and store policies
- **QR Code Generation:** Generate QR codes for promotional offers and order verification

#### 4.3.3. Communication & Support (Web)
- **Email Threading:** Centralized system for managing customer communications
- **Multi-language Support:** Support for communication in multiple languages relevant to the African diaspora community
- **Customer Support Tools:** Ticket management, response templates, and communication history

---

### 4.4. Shared Platform Features

#### 4.4.1. Authentication & Security
- **Unified Authentication:** Shared Supabase authentication system across mobile and web
- **Role-Based Access Control:** Secure access control for customers, vendors, and admins
- **Data Security:** Enterprise-grade security for all user data and transactions

#### 4.4.2. Real-Time Synchronization
- **Live Updates:** Real-time data synchronization between mobile app and web dashboard
- **Order Status Updates:** Instant order status updates visible across all interfaces
- **Inventory Sync:** Real-time inventory updates when vendors modify product availability

---

## 5. Technology Stack

### 5.1. Mobile Application (Customer-Facing)

| Layer | Technology | Reason |
| --- | --- | --- |
| **Frontend** | Expo (React Native) | Fastest development cycle; easy App Store submission via EAS (Expo Application Services) |
| **State Management** | Zustand + TanStack Query | Zustand for cart/auth state; TanStack Query to cache product lists from various sources |
| **Styling** | NativeWind (Tailwind) + NativeWindUI | Allows use of Tailwind skills in mobile environment; NativeWindUI provides pre-built components |
| **Image Optimization** | Expo Image | Caching and optimization for high-quality product images |
| **Maps** | Google Maps Platform API | React Native integration for vendor coverage areas and location-based discovery |

**App Store Submission:** Google Play Store & Apple App Store via EAS (Expo Application Services) - 1-2 weeks approval time

### 5.2. Web Application (Admin & Vendor)

| Layer | Technology | Reason |
| --- | --- | --- |
| **Frontend Framework** | Next.js (React) | Server-side rendering for performance, excellent developer experience, easy deployment |
| **Styling** | Tailwind CSS + shadcn/ui | Consistent design system with mobile app, pre-built components for admin dashboards |
| **State Management** | TanStack Query + Zustand | Shared state management patterns with mobile app, efficient data fetching |
| **Form Handling** | React Hook Form + Zod | Robust form validation for complex vendor onboarding and product management |
| **Data Tables** | TanStack Table | Powerful data tables for order management, analytics, and reporting |
| **File Upload** | UploadThing or Supabase Storage | Efficient image and document uploads for products and vendor onboarding |

**Web Hosting:** Vercel or Netlify (recommended) - Free tier available, seamless Next.js deployment

### 5.3. Shared Backend & Services

| Layer | Technology | Reason |
| --- | --- | --- |
| **Backend/API** | Supabase | Unified backend for both mobile and web; PostgreSQL database, authentication, real-time capabilities, and serverless functions |
| **Authentication** | Supabase Auth | Shared authentication system across mobile and web applications |
| **Database** | PostgreSQL (Supabase) | Robust relational database with real-time subscriptions |
| **Payments** | Stripe, Klarna, Clearpay | Stripe for credit/debit cards; Klarna for buy now, pay later; Clearpay for installment payments |
| **Email** | Postmark | Email threading and customer communications |
| **File Storage** | Supabase Storage | Centralized storage for product images, vendor documents, and user uploads |

### 5.4. Development & Deployment

- **Mobile App Build:** EAS Build (Expo Application Services)
- **Web App Deployment:** Vercel or Netlify
- **CI/CD:** GitHub Actions (optional) for automated testing and deployment
- **Monitoring:** Supabase built-in monitoring + optional Sentry for error tracking

**Note:** The hybrid architecture allows for optimal user experience: mobile-first for customers (similar to Amazon or Nike apps) and web-first for business operations. The shared Supabase backend ensures data consistency and real-time synchronization. The platform is designed with the UK market in mind, with payment gateways and shipping integrations optimized for UK-based operations.

---

## 6. Project Pricing & Timeline

**Total Cost:** ₦2,500,000 (includes mobile app + web application for admin and vendor management)

### 6.1. Development Phases

| Phase | Deliverables | Duration | Cost (₦) |
| --- | --- | --- | --- |
| **1. Design & Planning** | Mobile app designs, web dashboard designs, database schema, integration plans, UI foundation setup (NativeWind + NativeWindUI for mobile, Tailwind + shadcn/ui for web) | 2 Weeks | ₦250,000 |
| **2. Backend & Core Infrastructure** | Supabase setup, authentication system, database schema, API endpoints, shared backend services | 2 Weeks | ₦300,000 |
| **3. Mobile App - Core Features** | Customer app: product browsing, shopping cart, payment integration (Stripe, Klarna, Clearpay), credit balance, state management (Zustand + TanStack Query) | 3 Weeks | ₦450,000 |
| **4. Web App - Admin Dashboard** | Admin dashboard: order management, customer management, vendor onboarding workflow, analytics, email threading, refund processing | 3 Weeks | ₦350,000 |
| **5. Web App - Vendor Portal** | Vendor portal: shop profile management, product catalog (add/edit/bulk import), order fulfillment, coverage area management, analytics | 2 Weeks | ₦300,000 |
| **6. Maps & Directory** | Google Maps integration (mobile + web), vendor coverage areas, vendor directory, location-based discovery | 2 Weeks | ₦250,000 |
| **7. Communication & Reviews** | Email threading, QR codes, reviews integration (mobile + web), customer support tools | 2 Weeks | ₦200,000 |
| **8. Shipping Automation** | Automated shipping processes and integration (UK-focused delivery options) | 2 Weeks | ₦200,000 |
| **9. Mobile App Optimization & Launch** | React Native optimization, native Android/iOS builds, app store submission, testing | 2 Weeks | ₦200,000 |
| **TOTAL** | | **20 Weeks** | **₦2,500,000** |

### 6.2. Payment Schedule

| Payment | Percentage | Amount (₦) | Trigger | Timeline |
| --- | --- | --- | --- | --- |
| **1st Payment** | 25% | ₦625,000 | Contract execution | Upon signing |
| **2nd Payment** | 15% | ₦375,000 | Design approval & Phase 1 completion | Week 2 |
| **3rd Payment** | 20% | ₦500,000 | Backend infrastructure & mobile core features (Phases 2-3) | Week 7 |
| **4th Payment** | 25% | ₦625,000 | Web applications complete (Admin + Vendor portals) | Week 12 |
| **5th Payment** | 15% | ₦375,000 | Final launch (mobile app + web app live) | Week 20-21 |

**Total:** 100% = ₦2,500,000

### 6.3. Project Milestones

| Milestone | Week | Deliverable |
| --- | --- | --- |
| Design Approval | Week 2 | Mobile app and web dashboard designs approved |
| Backend Infrastructure | Week 4 | Database schema, authentication, and API endpoints ready |
| Mobile App Core Demo | Week 7 | Customer app with shopping and payment features |
| Admin Dashboard Demo | Week 10 | Admin dashboard with order and customer management |
| Vendor Portal Demo | Week 12 | Vendor portal with product catalog management |
| Integration & Testing | Week 18 | Full system integration, end-to-end testing |
| Beta Testing | Week 19 | Full system ready for user testing |
| App Store Submission | Week 20 | Mobile apps submitted to stores |
| Launch | Week 20-21 | Mobile app + web application live |

**Note:** App store approval (1-2 weeks) extends launch timeline.

---

## 7. Technology Costs & Payment Responsibility

### 7.1. Included in Development Fee (₦2,500,000)
The following costs are **covered by the development fee** and you don't pay separately:

- **Development Tools:** All development software, frameworks, and tools used during the 20-week development period (React Native, Expo, EAS, Next.js, React, Zustand, TanStack Query, NativeWind, NativeWindUI, Tailwind CSS, shadcn/ui, development tools)
- **Development Hosting:** Testing/staging environments during development (Supabase database and backend services, web hosting for staging)
- **API Usage During Development:** Google Maps API, Postmark, and other API costs incurred during development/testing
- **App Store Fees:** One-time Google Play Store ($25) and Apple App Store ($99) registration fees
- **Development Accounts:** Setup and configuration of all development accounts (Expo/EAS, app store accounts, Vercel/Netlify for web hosting)

### 7.2. Client Pays Monthly (After Launch)
The following **ongoing operational costs** are paid by the Client monthly after the platform goes live:

| Service | Cost | Notes |
| --- | --- | --- |
| **Database & Backend** (Supabase) | ~$25-40/mo | Production database and backend hosting |
| **Web Application Hosting** (Vercel/Netlify) | Free tier available | Free tier sufficient for most use cases; paid plans start at ~$20/mo if needed |
| **Email Services** (Postmark) | ~$15/mo | Usage-dependent pricing |
| **Google Maps API** | Pay-as-you-go | Free tier covers first 28k loads/month (UK-focused mapping and location services) |
| **Payment Gateway Fees** | Transaction-based | Standard fees charged by Stripe/Klarna/Clearpay per transaction |
| **File Storage** (Supabase Storage) | Included in Supabase plan | Product images, vendor documents, user uploads |
| **Expo Services** (Optional) | Free tier available | Expo provides free hosting for app updates (OTA updates) |

**Note:** These monthly costs start only after the platform is launched and goes live. During development, all costs are included in the ₦2,500,000 fee. The web application can run on free hosting tiers initially, keeping operational costs low.

---

## 8. Client Requirements

### 8.1. Accounts & Access

| Item | Timeline | Notes |
| --- | --- | --- |
| Payment gateway accounts (Stripe, Klarna, Clearpay) with API keys | Week 2 | We can guide setup |
| Shipping provider account access | Week 6 | We can assist with setup |
| Google Maps API key | Week 4 | We can help configure |
| Postmark account | Week 8 | We can set up |
| Review system API access | Week 8 | We can help integrate |
| App store developer accounts (Google Play, Apple) | Week 8 | Required for mobile app submission |
| Web hosting account (Vercel/Netlify) | Week 2 | We can set up and configure |

### 7.2. Brand & Content Materials

| Item | Timeline | Format |
| --- | --- | --- |
| Logo files (high-resolution) | Week 1 | PNG/SVG |
| Brand colors (hex codes) and fonts | Week 1 | Color codes, style guide |
| Vendor store information | Week 4 | Excel/CSV or manual entry (including cultural specialties, product categories, coverage areas) |
| African product catalog | Week 4 | Product listings with cultural context, regional categories, ingredient information |

### 7.3. Client Responsibilities
- Design approvals: 2-3 days after presentation
- Content review: Within agreed timelines
- Beta testing participation: Week 12-13
- App store listing approval

**Note:** Delays in materials/approvals extend timeline accordingly.

---

## 9. Warranty & Support

### 8.1. Warranty Period
**3 months** post-launch support included:
- Bug fixes and security updates
- Technical support
- Minor adjustments to delivered features
- Response times: Critical (4hrs), Important (24hrs), Normal (48hrs)

### 8.2. Post-Warranty Support (Optional)

| Package | Monthly Cost | Includes |
| --- | --- | --- |
| **Basic** | ₦100,000 | Security updates, bug fixes, email support |
| **Standard** | ₦200,000 | Basic + feature enhancements, performance improvements, priority support |
| **Enterprise** | ₦350,000 | Standard + dedicated support, guaranteed response times |

**Additional Services:** Custom features (quoted), training sessions (₦75,000/session), consulting (₦40,000/hour)

---

## 10. Ownership & Changes

- **Ownership:** Custom code transfers to Client upon final payment
- **Third-Party Licenses:** Client responsible for maintaining service licenses
- **Scope Changes:** Additional features quoted separately, may affect timeline/cost
- **Documentation:** Complete guides and user manuals provided

---

## 11. Training & Handover

- **Admin Training:** 2 sessions × 2 hours (included) - Covers both web dashboard and mobile app
- **Vendor Training:** 1 session × 1.5 hours (included) - Covers vendor portal usage
- **User Manuals:** Written guides or video tutorials for mobile app, admin dashboard, and vendor portal
- **Handover:** Complete system handover with documentation (Week 20-21)

---

**Prepared By:** Ajibola Akelebe (DON_GENIUS)
**Version:** 2.1 (Hybrid Architecture - Mobile + Web)
**Status:** Draft for Approval

---

**Note:** This document is subject to revision based on client feedback. Technical specifications and timelines are estimates and may be adjusted during discovery phase.
