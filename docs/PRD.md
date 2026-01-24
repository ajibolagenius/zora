# Product Requirements Document (PRD): Zora African Market

**Version:** 2.1
**Status:** Approved
**Benchmarking:** OyaShop (User Flow & Catalog Structure)

## 1. Project Overview
Zora African Market is a hybrid e-commerce aggregator connecting the African diaspora in the UK with authentic local vendors. It consists of a **React Native Mobile App** (Customers) and a **Next.js Web Portal** (Admins/Vendors).

## 2. User Experience & Route Map

### 2.1 Customer Mobile App (React Native)
* **Auth Flow:** Welcome -> Login/Signup -> Cultural Interest Selection -> Onboarding.
* **Discovery:** Home (Featured/Categories) -> Search -> Map View (Nearby Vendors).
* **Storefront:** Vendor Profile (Mini-shop) -> Product Details -> Reviews.
* **Checkout:** Cart -> Delivery/Pickup Selection -> Payment (Stripe/Klarna) -> Order Success.
* **Account:** Order History -> Credit Balance Tracker -> QR Code ID -> Support.

### 2.2 Vendor Web Portal (Next.js)
* **Dashboard:** Sales Overview -> Active Orders -> Low Stock Alerts.
* **Inventory:** Product Listing -> Bulk CSV Upload -> Image Management.
* **Fulfillment:** Order Management -> Label Printing -> Courier Integration.
* **Settings:** Shop Profile -> Coverage Area (Map) -> Bank Details.

### 2.3 Admin Web Dashboard (Next.js)
* **Global View:** Platform Revenue -> Vendor Performance -> User Growth.
* **Moderation:** Vendor Verification -> Review Moderation -> Dispute Resolution.
* **Finances:** Refund Processing -> Commission Settings -> Payouts.

## 3. Core Features
* **Multi-Vendor Cart:** One checkout process for items from multiple stores.
* **Cultural Categorization:** Browse by region (West Africa, East Africa, etc.) or specific occasions.
* **Hybrid Payment System:** Integrated Stripe, Klarna (BNPL), and Clearpay.
* **Real-time Sync:** Supabase-powered instant updates for order status and inventory.

## 4. Supporting Features
* **QR Verification:** Secure order pickup/delivery verification via mobile scanning.
* **Email Threading:** Postmark-powered communication linked directly to Order IDs.
* **Dynamic Maps:** Interactive vendor discovery and delivery boundary visualization.
