# Cart Flow, Order Creation & QR Code Overview

> This document details the **Cart and Checkout** experience, as well as the **QR Code** system used for order verification (e.g., In-Store Pickup) and promotions. For the Third-Party Delivery logistics, see [Delivery Process](./DELIVERY_PROCESS.md).

---

## Table of Contents

1. [Scope](#scope)
2. [Cart → Checkout → Payment → Order Creation](#1-cart--checkout--payment--order-creation)
   - [1.1 Cart](#11-cart)
   - [1.2 Checkout](#12-checkout)
   - [1.3 Payment](#13-payment)
3. [Order Confirmation & Status](#2-order-confirmation--status)
   - [2.1 Order Confirmation](#21-order-confirmation)
   - [2.2 Order Detail View](#22-order-detail-view)
4. [QR Code Generation, Storage & Scanning](#3-qr-code-generation-storage--scanning)
   - [3.1 QR Code Service](#31-qr-code-service)
   - [3.2 Order QR Storage](#32-order-qr-storage)
   - [3.3 QR Scanner Screen](#33-qr-scanner-screen)

---

## Scope

| Area                              | Description                                                                 |
| --------------------------------- | --------------------------------------------------------------------------- |
| **Cart Flow / Order Creation**    | How a cart becomes an order in the system.                                  |
| **QR Code System**                | How QR codes are generated, stored, and scanned for verification.           |

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

## 2. Order Confirmation & Status

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

**Primary Actions:**
- "Track Order" → `/order-tracking/{trackingId}`
- "Continue Shopping" → `/(tabs)`

---

### 2.2 Order Detail View

**File:** `app/order/[id].tsx`

#### Route Param

`id`

#### Display

| Element              | Description                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| Header               | `order.order_number`                                                     |
| Status badge         | Derived from `order.status`                                              |
| Items list           | Order items                                                              |
| Order summary        | Items, totals                                                            |
| **"Track Delivery"** | Only visible if order is `out_for_delivery` / `dispatched`. Links to proper external tracking (see Delivery Process). |

---

## 3. QR Code Generation, Storage & Scanning

### 3.1 QR Code Service

**File:** `services/qrCodeService.ts`

#### 3.1.1 Data Model

| Type           | Definition                                    |
| -------------- | --------------------------------------------- |
| `QRCodeType`   | `'order' \| 'promo' \| 'vendor' \| 'product'` |
| `QRCodeData`   | `{ type, id, timestamp, checksum }`           |

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
