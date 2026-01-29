# Cart Flow, Order Tracking & QR Code Overview

> This document reflects the implementation as of Jan 2026 and is meant as a reference when evolving the checkout and tracking experience.

---

## Table of Contents

1. [Scope](#scope)
2. [Cart → Checkout → Payment → Order Creation](#1-cart--checkout--payment--order-creation)
   - [1.1 Cart](#11-cart)
   - [1.2 Checkout](#12-checkout)
   - [1.3 Payment](#13-payment)
3. [Order Confirmation & Tracking](#2-order-confirmation--tracking)
   - [2.1 Order Confirmation](#21-order-confirmation)
   - [2.2 Order Detail View](#22-order-detail-view)
   - [2.3 External Tracking (Third-Party Delivery)](#23-external-tracking-third-party-delivery)
4. [QR Code Generation, Storage & Scanning](#3-qr-code-generation-storage--scanning)
   - [3.1 QR Code Service](#31-qr-code-service)
   - [3.2 Order QR Storage](#32-order-qr-storage)
   - [3.3 QR Scanner Screen](#33-qr-scanner-screen)
5. [Automated Email Notifications](#4-automated-email-notifications)
   - [4.1 Email Service (Resend)](#41-email-service-resend)
   - [4.2 Email Triggers](#42-email-triggers)
   - [4.3 Email Templates](#43-email-templates)
6. [Delivery Process (Third-Party Model)](#5-delivery-process-third-party-model)
   - [5.1 Delivery Partner Integration](#51-delivery-partner-integration)
   - [5.2 Booking-Based Reference Flow](#52-booking-based-reference-flow)
   - [5.3 Order Status Pipeline](#53-order-status-pipeline)
   - [5.4 Roles & Responsibilities](#54-roles--responsibilities)
7. [Key Gaps & Design Considerations](#6-key-gaps--design-considerations)

---

## Scope

| Area                              | Description                                                                 |
| --------------------------------- | --------------------------------------------------------------------------- |
| **Cart Flow / Order Tracking**    | How a cart becomes an order and how that order is tracked.                  |
| **Orders & Tracking: QR Code**    | How QR codes are generated, stored, scanned, and tied into tracking.        |
| **Automated Emails**              | How transactional emails are sent to customers via Resend.                  |
| **Third-Party Delivery**          | How delivery is outsourced to a delivery company (e.g., DPD UK).            |

---

## 1. Cart → Checkout → Payment → Order Creation

### 1.1 Cart

**Files:** `app/(tabs)/cart.tsx` + `stores/cartStore.ts`

#### State Source

`useCartStore` exposes:
- `items`, `vendors`, `subtotal`, `deliveryFee`, `serviceFee`, `discount`, `total`
- Associated actions

#### Product Sync

On mount and when `items.length` changes, the cart screen:

1. If Supabase is configured and there are items:
   - Fetches the latest product data via `productService.getById`
2. Subscribes to `products` table via `realtimeService.subscribeToTable('products', '*', ...)`
   - Re-syncs when any cart product changes
3. Always calls `calculateTotals()` as a fallback to keep pricing consistent

#### Vendor Grouping

`calculateTotals()` groups items by `vendor_id` (or `product.vendor_id`) and builds `vendors[]` with:

| Field           | Description                          |
| --------------- | ------------------------------------ |
| `id`            | Vendor identifier                    |
| `name`          | Vendor name                          |
| `logo_url`      | Vendor logo                          |
| `delivery_time` | Estimated delivery time              |
| `delivery_fee`  | Per-vendor fee (currently 0)         |
| `subtotal`      | Vendor subtotal                      |
| `items[]`       | Items from this vendor               |

#### Pricing Rules

| Component      | Calculation                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| **Subtotal**   | Sum of `item.product.price * quantity`                                      |
| **Delivery**   | Derived from `PricingConstants` (free over threshold, otherwise fixed fee)  |
| **Total**      | `subtotal + deliveryFee + serviceFee - discount`                            |

#### Entry to Checkout

- **Primary CTA:** "Proceed to Checkout" → `router.push('/checkout')`

---

### 1.2 Checkout

**File:** `app/checkout.tsx`

#### Inputs Used

| Input             | Source                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| `total`           | `useCartStore`                                                         |
| `user`            | `useAuthStore`                                                         |
| User addresses    | `onboardingService.getUserAddresses(user.user_id)` or mock addresses   |

#### UI-Only Selections (Not Persisted Yet)

- Delivery vs Store Pickup (`activeTab`)
- Selected address (`selectedAddress`)
- Preferred delivery date (next 7 days, derived locally)
- Preferred time slot (fixed set of slots, e.g. "12:00 PM - 01:00 PM")

#### Realtime

If Supabase is configured, subscribes to address updates via `onboardingService.subscribeToAddresses`.

#### Transition

- "Continue to Payment" → `router.push('/payment')`

#### Important Gap

> None of the above selections (delivery/pickup, address choice, date/time) are currently passed through to the `PaymentScreen` or persisted into the `orders` table.

---

### 1.3 Payment

**Files:** `app/payment.tsx` + `services/paymentService.ts`

#### 1.3.1 Payment Service

`paymentService` wraps a Stripe-style flow with a mock-friendly implementation:

**Capabilities:**
- Determines available methods (`card`, plus `apple_pay` / `google_pay` depending on platform)
- Uses `stripeService` to:
  - Create a payment intent (`createPaymentIntent`)
  - Confirm payment via:
    - `confirmCardPayment` (mock card details in dev)
    - `confirmApplePay` or `confirmGooglePay` (platform-specific)

**Mock Mode:**
When `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` is not configured, all API calls run in **mock mode** and return successful results after simulated delays.

#### 1.3.2 Payment Screen Behaviour

**Inputs Used:**

| Input                                              | Source           |
| -------------------------------------------------- | ---------------- |
| `items`, `subtotal`, `total`, `deliveryFee`, etc.  | `useCartStore`   |
| `clearCart`                                        | `useCartStore`   |
| `user`                                             | `useAuthStore`   |

**Additional UI State:**
- Selected payment method: `card` (always) and `apple_pay` / `google_pay` if exposed by `paymentService.getAvailablePaymentMethods`
- Optional "Zora Credits" application (local constant `zoraCredit` and toggle `useZoraCredit`)
- Derived `finalTotal = total - zoraCredit` (floored at 0 when credits are used)

**On Pay Flow:**

1. **Build `OrderPaymentData` object:**
   - `orderId`: synthetic client-side ID (`ZAM-<timestamp>`), **not** the DB primary key
   - Amounts and currency
   - Customer info (currently hard-coded email/name)
   - Item list mirroring cart items
   - A fixed shipping address (not connected to checkout screen address selection)

2. **Map UI payment method** (`card` / `apple_pay` / `google_pay`) to the `PaymentMethod` understood by `paymentService`

3. **Call `paymentService.processPayment(...)`**, passing mock card details for `card` mode

4. **On `success === true`:**
   - Constructs `orderData` and calls `orderService.create(orderData)`:
     - Includes: `user_id`, `vendor_id` (from first item), `items[]`, `subtotal`, `delivery_fee`, `service_fee`, `discount`, `total`, `payment_method`, basic `delivery_address`
     - **Does not include:** checkout's chosen address, delivery vs pickup, or time-slot metadata
   - If Supabase is configured and `user.user_id` is present:
     - Persists the order to `orders` and gets a concrete `createdOrder.id`
     - Subscribes to `orders` updates for that particular `id` via `realtimeService`
   - Clears the cart (`clearCart()`)
   - Navigates to `/order-confirmation?orderId=<createdOrder.id>` (or falls back to the synthetic `paymentData.orderId` if creation fails)

5. **On failure:**
   - Shows a generic "Payment Failed/Error" alert and leaves state unchanged

---

## 2. Order Confirmation & Tracking

### 2.1 Order Confirmation

**File:** `app/order-confirmation.tsx`

#### Route Param

`orderId` (from the payment navigation)

#### Data Loading

- If Supabase is configured, calls `orderService.getById(orderId)` and stores it in local state
- Subscribes to `orders` real-time updates (`*` events) filtered by `id=eq.orderId`
- Refreshes the order on any change

#### Display

| Element                    | Description                                                                    |
| -------------------------- | ------------------------------------------------------------------------------ |
| Success icon               | Check icon and "Order Placed!" messaging                                       |
| Order number               | `order.order_number` → `order.id.substring(0, 8)` → raw `orderId` (fallback)   |
| Estimated delivery         | 2–4 days from now (computed client-side)                                       |
| Stylized delivery card     | Visual confirmation                                                            |
| Referral card              | Referral CTA                                                                   |

**Primary Actions:**
- "Track Order" → `/order-tracking/{trackingId}` where `trackingId = order.id || orderId || orderNumber`
- "Continue Shopping" → `/(tabs)`

#### Notable

> There is **no QR code display** here yet, even though `qrCodeService` exposes helpers for order QR data.

---

### 2.2 Order Detail View

**File:** `app/order/[id].tsx`

#### Route Param

`id`

#### Guards

- Requires a valid session (`session.access_token` from `useAuthStore`)
- Validates `id` via `isValidRouteParam(id, 'id')`
- Invalid values short-circuit to a "Not Found" screen

#### Data Loading

- If `id` and session token are present, calls `orderService.getById(id)`
- Subscribes to `orders` `UPDATE` events filtered by `id=eq.id`
- Refreshes on status changes

#### Display

| Element              | Description                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| Header               | `order.order_number`                                                     |
| Status badge         | Derived from `order.status` (`delivered`, `completed`, `cancelled`, etc.)|
| Tracking timeline    | Simplified vertical timeline (see below)                                 |
| Items list           | Order items                                                              |
| Order summary        | Subtotal, delivery fee, service fee, total                               |
| "Track Delivery"     | External link to delivery company's tracking page                        |
| "Need Help?" button  | Currently UI only                                                        |

**Simplified Timeline Steps (Internal Status):**

| Status             | Display Label        | Description                                    |
| ------------------ | -------------------- | ---------------------------------------------- |
| `pending`          | Order Received       | Order placed, awaiting processing              |
| `confirmed`        | Order Confirmed      | Payment verified, order accepted               |
| `preparing`        | Preparing            | Vendor preparing items                         |
| `dispatched`       | Dispatched           | Handed to delivery company                     |
| `delivered`        | Delivered            | Delivery confirmed                             |

#### Note

> All lookups are by **internal order `id`**, not `order_number`.

---

### 2.3 External Tracking (Third-Party Delivery)

**Target Design:** Simplified in-app status + external tracking link

#### Current Implementation

**File:** `app/order-tracking/[id].tsx`

The current implementation features a full map-style tracking UI with animated driver pins, which will be **simplified** to align with the third-party delivery model.

#### Target Implementation

The tracking screen should be refactored to:

1. **Display simplified order status** (internal Zora statuses)
2. **Show delivery company reference number** (`tracking_reference`)
3. **Provide "Track with [Delivery Company]" button** that opens external tracking URL

**UI Components (Target):**

| Element                     | Description                                                    |
| --------------------------- | -------------------------------------------------------------- |
| Order header                | Order number + current status badge                            |
| Simplified timeline         | 4-5 steps: Confirmed → Preparing → Dispatched → Delivered      |
| Tracking reference card     | Shows delivery company name + reference number                 |
| "Track Delivery" button     | Opens `https://track.dpd.co.uk/parcel/{tracking_reference}`    |
| Order summary               | Items, totals                                                  |
| Support actions             | "Need Help?", "Report Issue"                                   |

**External Tracking URL Patterns:**

| Delivery Company | Tracking URL Format                                      |
| ---------------- | -------------------------------------------------------- |
| DPD UK           | `https://track.dpd.co.uk/parcel/{tracking_reference}`    |
| Royal Mail       | `https://www.royalmail.com/track-your-item/{reference}`  |
| Evri             | `https://www.evri.com/track/{reference}`                 |
| DHL UK           | `https://www.dhl.co.uk/en/express/tracking.html?AWB={reference}` |

#### Database Schema Extension (Required)

The `orders` table needs new columns:

```sql
ALTER TABLE orders ADD COLUMN tracking_reference VARCHAR(100);
ALTER TABLE orders ADD COLUMN delivery_company VARCHAR(50);
ALTER TABLE orders ADD COLUMN delivery_company_tracking_url TEXT;
ALTER TABLE orders ADD COLUMN dispatched_at TIMESTAMPTZ;
```

---

## 3. QR Code Generation, Storage & Scanning

### 3.1 QR Code Service

**File:** `services/qrCodeService.ts`

#### 3.1.1 Data Model

| Type           | Definition                                    |
| -------------- | --------------------------------------------- |
| `QRCodeType`   | `'order' \| 'promo' \| 'vendor' \| 'product'` |
| `QRCodeData`   | `{ type, id, timestamp, checksum }`           |
| `ScanResult`   | `{ success, type?, data?, error? }`           |

**Checksum Generation:**
`generateChecksum(data: string)`: simple integer hash → base-36 string, used for tamper resistance.

#### 3.1.2 QR Generation

| Method                              | Output Format                                            |
| ----------------------------------- | -------------------------------------------------------- |
| `qrCodeGenerator.generateOrderQR`   | `zoramarket://order/{orderId}?t={timestamp}&c={checksum}`|
| `generatePromoQR`                   | `zoramarket://promo/{promoCode}?c={checksum}`            |
| Vendor QR                           | `zoramarket://vendor/{vendorId}`                         |
| Product QR                          | `zoramarket://product/{productId}`                       |

**Order QR Details:**
Builds `QRCodeData` with:
- `type: 'order'`
- `id: orderId`
- `timestamp: Date.now()`
- `checksum: generateChecksum("order_<orderId>_<timestamp>")`

#### 3.1.3 QR Parsing

`qrCodeScanner.parseQRCode(scannedValue)`:

| Input Pattern                        | Result                                          |
| ------------------------------------ | ----------------------------------------------- |
| Starts with `zoramarket://`          | Parses `type` and `id` from path + query params |
| Plain alphanumeric (4–20 chars)      | Treats as promo code → `type: 'promo'`          |
| Starts with `http`                   | Treats as product URL → `type: 'product'`       |
| Otherwise                            | `success: false`, "Unrecognized QR code format" |

#### 3.1.4 Order QR Verification Helper

`qrCodeScanner.verifyOrderQR(scannedValue, expectedOrderId)`:

1. Parses via `parseQRCode`
2. Ensures:
   - Type is `'order'`
   - `data.orderId` matches `expectedOrderId`
   - Checksum matches `generateChecksum("order_<expectedOrderId>_<timestamp>")`
   - QR code is not older than 24 hours
3. Returns `{ valid: true }` or `{ valid: false, error }`

> **Note:** This checksum + expiry validation is currently **not used** in the main QR scanner flow.

#### 3.1.5 Order & Promo QR Display Helpers

| Method                                          | Returns                                                  |
| ----------------------------------------------- | -------------------------------------------------------- |
| `orderQRService.getOrderQRData(orderId)`        | `value`, `size`, colors, logo, instructions for delivery |
| `orderQRService.getPickupQRData(orderId, name)` | Similar, tailored for in-store pickup                    |
| `promoQRService.getShareablePromoQR(...)`       | QR config for marketing/referral + `shareText`           |

> **Current State:** None of these helpers are wired into UI screens; there is no place where customers can see or share an order QR yet.

---

### 3.2 Order QR Storage

**File:** `orderService` in `services/supabaseService.ts`

#### On `orderService.create(orderData)`

| Condition                   | QR Code Value                              |
| --------------------------- | ------------------------------------------ |
| Supabase configured         | `qr_code: "QR_<timestamp>_<random>"`       |
| Supabase not configured     | Mock `Order` with `qr_code: "QR_<timestamp>"` |

#### `orderService.verifyQRCode(qrCode: string)`

| Condition                   | Behavior                                         |
| --------------------------- | ------------------------------------------------ |
| Supabase configured         | Looks up `orders` by **exact match** on `qr_code`|
| Mock mode                   | Searches `mockDatabase.orders` for matching code |

#### Mismatch with Generator/Scanner

| Component                      | Format                                      |
| ------------------------------ | ------------------------------------------- |
| `qrCodeGenerator.generateOrderQR()` | `zoramarket://...` deep link           |
| `orderService.create()`        | Simple `"QR_<...>"` string                  |
| `orderService.verifyQRCode()`  | Expects whatever is stored in `qr_code`     |

> **Therefore:** If you display QR codes using `generateOrderQR(orderId)`, scanning them and passing the value into `verifyQRCode` will **not** find a record unless you change what is stored in `qr_code`.

---

### 3.3 QR Scanner Screen

**File:** `app/qr-scanner.tsx`

#### 3.3.1 Camera & Permissions

**Dependencies:** `expo-camera`'s `CameraView` and `useCameraPermissions`

**Scanner States:**

| State          | Renders                                                    |
| -------------- | ---------------------------------------------------------- |
| `'checking'`   | Loading screen                                             |
| `'loading'`    | Loading screen                                             |
| `'unavailable'`| "Unavailable" message (e.g. web platform)                  |
| `'denied'`     | Permission denied screen                                   |
| `'ready'`      | Camera view + overlay chrome                               |

#### 3.3.2 Scan Handling

`handleBarCodeScanned({ type, data })`:

1. Debounces with `scanned` boolean + short vibration
2. Calls `qrCodeScanner.parseQRCode(data)`
3. Branches by `result.type`:

| Type        | Behavior                                                                    |
| ----------- | --------------------------------------------------------------------------- |
| `'order'`   | If Supabase: `orderService.verifyQRCode(data)` → alert + "View Order" → `/order-tracking/{order.id}`. Else: uses parsed `orderId` directly |
| `'promo'`   | `promoQRService.applyScannedPromo(data)` → success/error alert → navigate to `/(tabs)` or rescan |
| `'vendor'`  | Asks "View this vendor's shop?" → `getVendorRoute(undefined, vendorId)`     |
| `'product'` | Asks "View this product?" → `getProductRoute(productId)`                    |
| Unknown     | Error alert → resets `scanned` for another try                              |

> **Important:** The stricter helper `qrCodeScanner.verifyOrderQR(scannedValue, expectedOrderId)` is **not** used here. Instead, verification is delegated to `orderService.verifyQRCode`, which only checks for a direct `qr_code` match in the DB.

---

## 4. Automated Email Notifications

> Zora uses **Resend** for transactional email delivery. This section documents the email notification system for order lifecycle events.

### 4.1 Email Service (Resend)

#### Why Resend

| Aspect              | Supabase Auth Emails          | Resend                                    |
| ------------------- | ----------------------------- | ----------------------------------------- |
| **Purpose**         | Authentication only           | Any transactional email                   |
| **Templates**       | Limited, auth-focused         | Full HTML templates, dynamic content      |
| **Triggers**        | Only auth events              | Any event (order, shipping, etc.)         |
| **Deliverability**  | Basic                         | Optimized, better inbox placement         |
| **Analytics**       | None                          | Open rates, click rates, bounces          |
| **Free Tier**       | Included                      | 3,000 emails/month                        |

#### Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Email Flow                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Order Event          Supabase               Resend                 │
│  (status change)  →   Database Webhook   →   API Call   →   Email   │
│                       or Edge Function                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Configuration

| Environment Variable         | Description                              |
| ---------------------------- | ---------------------------------------- |
| `RESEND_API_KEY`             | Resend API key                           |
| `RESEND_FROM_EMAIL`          | Sender email (e.g., orders@zoraapp.co.uk)|
| `RESEND_FROM_NAME`           | Sender name (e.g., "Zora African Market")|

#### Service File (To Be Created)

**File:** `services/emailService.ts`

```typescript
// Core email service interface
interface EmailService {
  sendOrderConfirmation(order: Order, customer: Customer): Promise<void>;
  sendOrderProcessing(order: Order, customer: Customer): Promise<void>;
  sendOrderDispatched(order: Order, customer: Customer, trackingInfo: TrackingInfo): Promise<void>;
  sendOrderDelivered(order: Order, customer: Customer): Promise<void>;
}
```

---

### 4.2 Email Triggers

Emails are triggered by order status transitions:

| Status Transition                | Email Type              | Trigger Mechanism                     |
| -------------------------------- | ----------------------- | ------------------------------------- |
| `pending` → `confirmed`          | Order Confirmation      | Supabase Database Webhook / Edge Fn   |
| `confirmed` → `preparing`        | Order Processing        | Supabase Database Webhook / Edge Fn   |
| `preparing` → `dispatched`       | Order Dispatched        | Supabase Database Webhook / Edge Fn   |
| `dispatched` → `delivered`       | Delivery Confirmation   | Supabase Database Webhook / Edge Fn   |
| Any → `cancelled`                | Order Cancelled         | Supabase Database Webhook / Edge Fn   |

#### Trigger Implementation Options

**Option A: Supabase Database Webhooks**
- Configure webhook on `orders` table for `UPDATE` events
- Webhook calls a serverless function that sends email via Resend

**Option B: Supabase Edge Functions**
- Create an Edge Function that listens to `orders` changes
- More control over logic, can batch or debounce

**Recommended:** Option B (Edge Functions) for better error handling and retry logic.

---

### 4.3 Email Templates

#### 4.3.1 Order Confirmation

**Trigger:** Order successfully placed and paid

**Content:**
- Order number
- Order summary (items, quantities, prices)
- Delivery address
- Estimated delivery date
- "View Order" button → deep link to order detail

#### 4.3.2 Order Processing

**Trigger:** Order status changes to `preparing`

**Content:**
- Order number
- "Your order is being prepared" messaging
- Expected dispatch date
- "View Order" button

#### 4.3.3 Order Dispatched

**Trigger:** Order status changes to `dispatched` (delivery booked)

**Content:**
- Order number
- Delivery company name (e.g., "DPD")
- **Tracking reference number**
- **"Track Your Delivery" button** → external tracking URL
- Estimated delivery date/window

**Example:**
```
Subject: Your Zora order is on its way! 📦

Hi [Customer Name],

Great news! Your order #ZAM-12345 has been dispatched.

Delivery Company: DPD
Tracking Reference: 15501234567890

Track your delivery:
[Track with DPD] → https://track.dpd.co.uk/parcel/15501234567890

Estimated delivery: 30 Jan - 1 Feb 2026
```

#### 4.3.4 Delivery Confirmation

**Trigger:** Order status changes to `delivered`

**Content:**
- Order number
- "Your order has been delivered" messaging
- "Leave a Review" CTA
- Support contact for issues

#### Template Storage

Templates can be stored in:
1. **Resend dashboard** (managed templates)
2. **Code** (`/data/email-templates/` directory - already exists)
3. **Database** (for dynamic/editable templates)

**Existing template files:**
- `/data/email-templates/confirm-signup.html`
- `/data/email-templates/magic-link.html`
- `/data/email-templates/password-changed.html`
- `/data/email-templates/reset-password.html`

**New templates needed:**
- `/data/email-templates/order-confirmation.html`
- `/data/email-templates/order-processing.html`
- `/data/email-templates/order-dispatched.html`
- `/data/email-templates/order-delivered.html`
- `/data/email-templates/order-cancelled.html`

---

## 5. Delivery Process (Third-Party Model)

> Zora outsources delivery to a third-party delivery company. This section documents the delivery flow, integration points, and the booking-based reference number model.

### 5.1 Delivery Partner Integration

#### Primary Delivery Partner

**DPD UK** (or alternative UK delivery providers)

| Provider     | API Available | Tracking URL Format                                   |
| ------------ | ------------- | ----------------------------------------------------- |
| DPD UK       | Yes           | `https://track.dpd.co.uk/parcel/{reference}`          |
| Royal Mail   | Yes           | `https://www.royalmail.com/track-your-item/{ref}`     |
| Evri         | Yes           | `https://www.evri.com/track/{reference}`              |
| Yodel        | Limited       | `https://www.yodel.co.uk/track/{reference}`           |

#### Integration Points

| Integration Point        | Description                                              |
| ------------------------ | -------------------------------------------------------- |
| **Booking API**          | Create shipment, get tracking reference immediately      |
| **Tracking URL**         | Redirect customers to delivery company's tracking page   |
| **Webhook (optional)**   | Receive delivery status updates from delivery company    |

#### Service File (To Be Created)

**File:** `services/deliveryService.ts`

```typescript
interface DeliveryService {
  bookDelivery(order: Order, address: Address): Promise<DeliveryBooking>;
  getTrackingUrl(trackingReference: string, provider: string): string;
  cancelDelivery(trackingReference: string): Promise<void>;
}

interface DeliveryBooking {
  success: boolean;
  trackingReference: string;
  deliveryCompany: string;
  trackingUrl: string;
  estimatedDelivery: Date;
}
```

---

### 5.2 Booking-Based Reference Flow

> Zora uses a **booking-based** flow where the tracking reference is obtained **immediately** when the delivery is booked, not when the parcel is physically collected.

#### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Booking-Based Reference Flow                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Order Ready        2. Book Delivery       3. Get Reference              │
│  ───────────────────────────────────────────────────────────────────────    │
│  Vendor marks order    Zora calls delivery    Delivery company returns      │
│  as "ready"            company's booking API  tracking reference instantly  │
│                                                                             │
│  4. Update Order       5. Send Email          6. Customer Tracks            │
│  ───────────────────────────────────────────────────────────────────────    │
│  Store reference in    Send "dispatched"      Customer clicks link to       │
│  orders table          email via Resend       track on delivery company     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Step-by-Step Process

| Step | Action                          | System                | Data Updated                          |
| ---- | ------------------------------- | --------------------- | ------------------------------------- |
| 1    | Vendor marks order ready        | Zora Admin/Vendor App | `orders.status = 'preparing'`         |
| 2    | Zora books delivery pickup      | Delivery Service      | API call to DPD/provider              |
| 3    | Receive tracking reference      | Delivery Service      | Response from delivery company        |
| 4    | Update order with tracking info | Supabase              | `tracking_reference`, `delivery_company`, `status = 'dispatched'` |
| 5    | Trigger dispatched email        | Resend via Edge Fn    | Email sent to customer                |
| 6    | Customer tracks externally      | DPD/Provider website  | Customer views real-time tracking     |

#### Advantages of Booking-Based Flow

| Benefit                      | Description                                                    |
| ---------------------------- | -------------------------------------------------------------- |
| **Immediate reference**      | Customer gets tracking info as soon as delivery is booked      |
| **Better communication**     | Can send "dispatched" email immediately with tracking link     |
| **Reduced delays**           | No waiting for physical collection to get reference            |
| **Programmatic booking**     | Can automate via delivery company's API                        |

---

### 5.3 Order Status Pipeline

#### Internal Status Flow

```
pending → confirmed → preparing → dispatched → delivered
                                      ↓
                                  cancelled (from any state)
```

#### Status Definitions

| Status       | Description                                    | Customer-Facing Label | Email Triggered        |
| ------------ | ---------------------------------------------- | --------------------- | ---------------------- |
| `pending`    | Order placed, payment processing               | Order Received        | -                      |
| `confirmed`  | Payment successful, order accepted             | Order Confirmed       | Order Confirmation     |
| `preparing`  | Vendor preparing/packing items                 | Preparing Your Order  | Order Processing       |
| `dispatched` | Handed to delivery company, tracking available | On Its Way            | Order Dispatched       |
| `delivered`  | Delivery confirmed                             | Delivered             | Delivery Confirmation  |
| `cancelled`  | Order cancelled                                | Cancelled             | Order Cancelled        |

#### Mapping to Delivery Company Statuses

When delivery company provides webhook updates, map their statuses to internal statuses:

| DPD Status                | Zora Internal Status |
| ------------------------- | -------------------- |
| `Shipment created`        | `dispatched`         |
| `In transit`              | `dispatched`         |
| `Out for delivery`        | `dispatched`         |
| `Delivered`               | `delivered`          |
| `Delivery failed`         | `dispatched` (+ flag)|
| `Returned to sender`      | `cancelled`          |

> **Note:** Fine-grained delivery statuses (e.g., "out for delivery") are shown on the **external tracking page**, not in Zora's simplified internal status.

---

### 5.4 Roles & Responsibilities

#### Customer

- Places orders via Zora app
- Receives email notifications at each stage
- Tracks delivery via **external link** to delivery company's website
- Contacts Zora support for order issues

#### Vendor

- Receives order notification
- Prepares and packs items
- Marks order as "ready for collection"
- Hands over to delivery company (or Zora arranges pickup)

#### Zora

- **Order orchestration:** Manages order lifecycle and vendor communication
- **Delivery booking:** Books pickup with delivery company via API
- **Customer communication:** Sends transactional emails via Resend
- **Support:** Handles customer inquiries, liaises with delivery company for issues

#### Delivery Company (DPD / Provider)

- **Collection:** Picks up parcels from vendors or Zora hub
- **Transportation:** Line-haul and last-mile delivery
- **Tracking:** Provides real-time tracking on their platform
- **Delivery:** Completes delivery to customer address
- **Returns:** Handles failed deliveries and returns

---

## 6. Key Gaps & Design Considerations

> This section summarizes gaps identified during analysis. It is intentionally descriptive, not prescriptive; any changes should be explicitly designed and agreed before implementation.

### 6.1 QR Payload Format Mismatch

| Component                     | Current Behavior                                              |
| ----------------------------- | ------------------------------------------------------------- |
| QR generator                  | Uses deep-link format (`zoramarket://order/{id}?t=...&c=...`) |
| `orderService.create`         | Stores a short `"QR_<...>"` token in `orders.qr_code`         |
| `orderService.verifyQRCode`   | Searches for **exact match** of the scanned string            |

**Implication:**
If QR images are generated using `generateOrderQR(orderId)`, scanning them and passing `data` into `verifyQRCode` will **not** resolve to any order until storage and verification are aligned with the deep-link format.

---

### 6.2 QR Not Surfaced in Customer Journey

Although `orderQRService.getOrderQRData` and `getPickupQRData` exist, no screen currently:
- Calls them, or
- Renders a QR image for the customer to show to a driver or store staff

The only active QR consumer is the generic `/qr-scanner` entrypoint.

> **Note:** With third-party delivery, QR codes may be less relevant for delivery verification (delivery company handles proof of delivery). QR may still be useful for in-store pickup scenarios.

---

### 6.3 Incomplete Use of Checksum / Expiry Verification

- The checksum + 24-hour expiry logic in `qrCodeScanner.verifyOrderQR` is implemented but not wired into `qr-scanner.tsx`
- Today, QR validity is effectively reduced to "does `orders.qr_code` match this string?", ignoring checksum and age

---

### 6.4 Checkout Metadata Is Not Persisted to Orders

**Checkout Screen Collects:**
- Delivery vs pickup choice
- A specific address
- Preferred date and time slot

**Payment Screen / `orderService.create` Currently:**
- Uses a hard-coded delivery address
- Has no awareness of delivery vs pickup
- Does not store date/time preferences

**Implication:**
Order records in Supabase (and therefore tracking/ops tools) may not reflect the user's actual choices from checkout. This data is **required** for booking delivery with the third-party provider.

---

### 6.5 New Gaps Introduced by Third-Party Delivery Model

| Gap                                      | Description                                                       | Priority |
| ---------------------------------------- | ----------------------------------------------------------------- | -------- |
| **Delivery service not implemented**     | `services/deliveryService.ts` needs to be created                 | High     |
| **Email service not implemented**        | `services/emailService.ts` with Resend integration needed         | High     |
| **Database schema incomplete**           | `tracking_reference`, `delivery_company` columns missing          | High     |
| **Tracking screen needs refactoring**    | Current map-style UI should be simplified + external link added   | Medium   |
| **Order templates not created**          | Transactional email templates need to be designed and built       | Medium   |
| **Delivery company API integration**     | DPD (or chosen provider) API integration not implemented          | High     |
| **Supabase Edge Function for emails**    | Webhook/trigger to send emails on status change not built         | High     |

---

### 6.6 Implementation Checklist

#### Phase 1: Core Infrastructure

- [ ] Add `tracking_reference`, `delivery_company`, `dispatched_at` columns to `orders` table
- [ ] Create `services/deliveryService.ts` with booking interface
- [ ] Create `services/emailService.ts` with Resend integration
- [ ] Set up Resend account and configure API key

#### Phase 2: Email Notifications

- [ ] Create order email templates in `/data/email-templates/`
- [ ] Create Supabase Edge Function for email triggers
- [ ] Test email flow for each status transition

#### Phase 3: Delivery Integration

- [ ] Integrate with DPD API (or chosen provider)
- [ ] Implement `bookDelivery()` function
- [ ] Update order service to call delivery booking on status change

#### Phase 4: UI Updates

- [ ] Refactor `/order-tracking/[id].tsx` to simplified view
- [ ] Add "Track with [Delivery Company]" button
- [ ] Update order detail view with tracking reference display
- [ ] Wire checkout address selection through to order creation
