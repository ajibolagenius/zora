# Implementation Plan: Zora African Market

## Phase 1: Foundation (Weeks 1-4)
* **Infrastructure:** Setup Supabase Project, PostgreSQL Schema, and Edge Functions.
* **Design:** Finalize UI/UX based on Pinterest concepts; establish Design Tokens in Tailwind.
* **Auth:** Implement Unified Auth (Google/Email) across Web and Mobile.

## Phase 2: Customer Core (Weeks 5-9)
* **Product Engine:** Build high-performance listing pages using TanStack Query.
* **Cart Logic:** Implement Zustand for complex multi-vendor cart management.
* **Payments:** Integrate Stripe/Klarna SDKs and handle webhooks for "Order Paid" status.

## Phase 3: Business Infrastructure (Weeks 10-14)
* **Vendor Portal:** Build the Next.js interface for product/inventory management.
* **Admin Dashboard:** Build the "Control Center" for platform-wide monitoring.
* **Communication:** Integrate Postmark for automated order notifications and email threading.

## Phase 4: Logistics & Polish (Weeks 15-20)
* **Maps:** Implement Google Maps for vendor discovery and delivery radius checking.
* **Shipping:** Automate label generation and status tracking.
* **Optimization:** Image optimization via Expo Image; App Store (EAS) and Vercel deployment.
