## Cart Flow, Order Tracking & QR Code Overview

### Scope
- **Cart Flow / Order Tracking**: How a cart becomes an order and how that order is tracked.
- **Orders & Tracking: QR Code**: How QR codes are generated, stored, scanned, and tied into tracking.

This document reflects the implementation as of Jan 2026 and is meant as a reference when evolving the checkout and tracking experience.

---

## 1. Cart → Checkout → Payment → Order Creation

### 1.1 Cart (`app/(tabs)/cart.tsx` + `stores/cartStore.ts`)
- **State source**: `useCartStore` exposes `items`, `vendors`, `subtotal`, `deliveryFee`, `serviceFee`, `discount`, `total`, and actions.
- **Product sync**:
  - On mount and when `items.length` changes, the cart screen:
    - If Supabase is configured and there are items, fetches the latest product data via `productService.getById`.
    - Subscribes to `products` table via `realtimeService.subscribeToTable('products', '*', ...)` and re-syncs when any cart product changes.
    - Always calls `calculateTotals()` as a fallback to keep pricing consistent.
- **Vendor grouping**:
  - `calculateTotals()` groups items by `vendor_id` (or `product.vendor_id`) and builds `vendors[]` with:
    - `id`, `name`, `logo_url`, `delivery_time`, `delivery_fee` (currently 0 per vendor), `subtotal`, and `items[]`.
- **Pricing rules**:
  - Subtotal: sum of `item.product.price * quantity`.
  - Delivery fee: derived from `PricingConstants` (free delivery over threshold, otherwise a fixed fee).
  - Total: `subtotal + deliveryFee + serviceFee - discount`.
- **Entry to checkout**:
  - Primary CTA: “Proceed to Checkout” → `router.push('/checkout')`.

### 1.2 Checkout (`app/checkout.tsx`)
- **Inputs used**:
  - `total` from `useCartStore`.
  - `user` from `useAuthStore`.
  - User addresses from `onboardingService.getUserAddresses(user.user_id)` if Supabase is configured, else mock addresses.
- **UI-only selections (not persisted yet)**:
  - Delivery vs Store Pickup (`activeTab`).
  - Selected address (`selectedAddress`).
  - Preferred delivery date (next 7 days, derived locally).
  - Preferred time slot (fixed set of slots, e.g. “12:00 PM - 01:00 PM”).
- **Realtime**:
  - If Supabase is configured, subscribes to address updates via `onboardingService.subscribeToAddresses`.
- **Transition**:
  - “Continue to Payment” → `router.push('/payment')`.
- **Important gap**:
  - None of the above selections (delivery/pickup, address choice, date/time) are currently passed through to the `PaymentScreen` or persisted into the `orders` table.

### 1.3 Payment (`app/payment.tsx` + `services/paymentService.ts`)

#### 1.3.1 Payment service
- **`paymentService`** wraps a Stripe-style flow with a mock-friendly implementation:
  - Determines available methods (`card`, plus `apple_pay` / `google_pay` depending on platform).
  - Uses `stripeService` to:
    - Create a payment intent (`createPaymentIntent`).
    - Confirm payment via:
      - `confirmCardPayment` (mock card details in dev).
      - `confirmApplePay` or `confirmGooglePay` (platform-specific).
  - When `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` is not configured, all API calls run in **mock mode** and return successful results after simulated delays.

#### 1.3.2 Payment screen behaviour
- **Inputs used**:
  - `items`, `subtotal`, `total`, `deliveryFee`, `serviceFee`, `discount`, `clearCart` from `useCartStore`.
  - `user` from `useAuthStore`.
- **Additional UI state**:
  - Selected payment method: `card` (always) and `apple_pay` / `google_pay` if exposed by `paymentService.getAvailablePaymentMethods`.
  - Optional “Zora Credits” application (local constant `zoraCredit` and toggle `useZoraCredit`).
  - Derived `finalTotal = total - zoraCredit` (floored at 0 when credits are used).
- **On Pay**:
  1. Builds an `OrderPaymentData` object:
     - `orderId`: synthetic client-side ID (`ZAM-<timestamp>`), **not** the DB primary key.
     - Amounts and currency.
     - Customer info (currently hard-coded email/name).
     - Item list mirroring cart items.
     - A fixed shipping address (not connected to checkout screen address selection).
  2. Maps UI payment method (`card` / `apple_pay` / `google_pay`) to the `PaymentMethod` understood by `paymentService`.
  3. Calls `paymentService.processPayment(...)`, passing mock card details for `card` mode.
  4. On `success === true`:
     - Constructs `orderData` and calls `orderService.create(orderData)`:
       - Includes `user_id`, `vendor_id` (from first item), `items[]`, `subtotal`, `delivery_fee`, `service_fee`, `discount`, `total`, `payment_method`, and a basic `delivery_address`.
       - **Does not include** checkout’s chosen address, delivery vs pickup, or time-slot metadata.
     - If Supabase is configured and `user.user_id` is present:
       - Persists the order to `orders` and gets a concrete `createdOrder.id`.
       - Subscribes to `orders` updates for that particular `id` via `realtimeService`.
     - Clears the cart (`clearCart()`).
     - Navigates to `/order-confirmation?orderId=<createdOrder.id>` (or falls back to the synthetic `paymentData.orderId` if creation fails).
  5. On failure:
     - Shows a generic “Payment Failed/Error” alert and leaves state unchanged.

---

## 2. Order Confirmation & Tracking

### 2.1 Order confirmation (`app/order-confirmation.tsx`)
- **Route param**: `orderId` (from the payment navigation).
- **Data loading**:
  - If Supabase is configured, calls `orderService.getById(orderId)` and stores it in local state.
  - Subscribes to `orders` real-time updates (`*` events) filtered by `id=eq.orderId` and refreshes the order on any change.
- **Display**:
  - Success check icon and “Order Placed!” messaging.
  - Order number: `order.order_number` if present, else `order.id.substring(0, 8)`, else the raw `orderId` param (fallback).
  - Simple estimated delivery date range (2–4 days from now), computed purely in the client.
  - A stylized delivery card and a referral card.
  - Primary actions:
    - “Track Order” → `/order-tracking/{trackingId}` where `trackingId = order.id || orderId || orderNumber`.
    - “Continue Shopping” → `/(tabs)`.
- **Notable**:
  - There is **no QR code display** here yet, even though `qrCodeService` exposes helpers for order QR data.

### 2.2 Order detail view (`app/order/[id].tsx`)
- **Route param**: `id`.
- **Guards**:
  - Requires a valid session (`session.access_token` from `useAuthStore`).
  - Validates `id` via `isValidRouteParam(id, 'id')`; invalid values short-circuit to a “Not Found” screen.
- **Data loading**:
  - If `id` and session token are present, calls `orderService.getById(id)`.
  - Subscribes to `orders` `UPDATE` events filtered by `id=eq.id` and refreshes on status changes.
- **Display**:
  - Header with `order.order_number`.
  - Status badge derived from `order.status` (`delivered`, `completed`, `cancelled`, etc.).
  - Vertical tracking timeline computed from a known list of steps:
    - `confirmed` → “Order Confirmed”
    - `preparing` → “Preparing”
    - `ready` → “Ready for Pickup”
    - `out_for_delivery` → “Out for Delivery”
    - `delivered` → “Delivered”
  - Items list and an order summary (subtotal, delivery fee, service fee, total).
  - “Need Help?” button (currently UI only).
- **Note**:
  - All lookups are by **internal order `id`**, not `order_number`.

### 2.3 Map-style tracking (`app/order-tracking/[id].tsx`)
- **Route param**: `id`.
- **Data loading**:
  - Calls `orderService.getById(id)`.
  - Subscribes to `orders` `*` events for `id=eq.id` to keep status in sync.
- **Timeline semantics**:
  - Internal `ORDER_STATUS_MAP` maps `order.status` to a step index (`pending`, `confirmed`, `preparing`, `ready`, `out_for_delivery`, `delivered`, `cancelled`).
  - A 5-step visual timeline (“Order Confirmed”, “Order Prepared”, “Picked Up”, “Out for delivery”, “Delivered”) is built via `useMemo`, marking steps as `completed`, `active`, or `pending`.
- **Display**:
  - Full-screen stylized map background (dots + vertical route line).
  - Pins for vendor, driver (animated), and destination.
  - Floating app bar showing “TRACK ORDER” + `#orderNumber`.
  - Bottom sheet with ETA, driver card, timeline, and support/report-issue buttons.
- **Navigation linkage**:
  - This is the target route for “Track Order” from the confirmation screen (`/order-tracking/{order.id || orderId || orderNumber}`).
- **Note**:
  - No QR code logic here; tracking is driven entirely by `order.status` updates via Supabase or mock data.

---

## 3. QR Code Generation, Storage & Scanning

### 3.1 QR code service (`services/qrCodeService.ts`)

#### 3.1.1 Data model
- `QRCodeType`: `'order' | 'promo' | 'vendor' | 'product'`.
- `QRCodeData`: `{ type, id, timestamp, checksum }`.
- `ScanResult`: `{ success, type?, data?, error? }`.
- `generateChecksum(data: string)`: simple integer hash → base-36 string, used for tamper resistance.

#### 3.1.2 QR generation
- **Order QR** (`qrCodeGenerator.generateOrderQR(orderId)`):
  - Builds `QRCodeData` with:
    - `type: 'order'`.
    - `id: orderId`.
    - `timestamp: Date.now()`.
    - `checksum: generateChecksum("order_<orderId>_<timestamp>")`.
  - Returns a deep link string:
    - `zoramarket://order/{orderId}?t={timestamp}&c={checksum}`.
- **Promo QR** (`generatePromoQR(promoCode)`):
  - Returns `zoramarket://promo/{promoCode}?c={checksum}`.
- **Vendor & product QR**:
  - `zoramarket://vendor/{vendorId}` and `zoramarket://product/{productId}` respectively.

#### 3.1.3 QR parsing
- `qrCodeScanner.parseQRCode(scannedValue)`:
  - If it starts with `zoramarket://`:
    - Parses `type` and `id` from the path, plus query params (e.g. `t`, `c`).
    - Returns a typed `ScanResult` for `order`, `promo`, `vendor`, or `product`.
  - If it is a plain alphanumeric string of 4–20 chars:
    - Treats it as a promo code and returns `type: 'promo'`.
  - If it starts with `http`:
    - Treats it as a product URL and returns `type: 'product'` with a `url` field.
  - Otherwise:
    - Returns `success: false` with an “Unrecognized QR code format” error.

#### 3.1.4 Order QR verification helper
- `qrCodeScanner.verifyOrderQR(scannedValue, expectedOrderId)`:
  - Parses via `parseQRCode`.
  - Ensures:
    - Type is `'order'`.
    - `data.orderId` matches `expectedOrderId`.
    - Checksum matches `generateChecksum("order_<expectedOrderId>_<timestamp>")`.
    - QR code is not older than 24 hours.
  - Returns `{ valid: true }` or `{ valid: false, error }`.
- **Note**:
  - This checksum + expiry validation is currently **not used** in the main QR scanner flow; see below.

#### 3.1.5 Order & promo QR display helpers
- `orderQRService.getOrderQRData(orderId)`:
  - Returns:
    - `value`: `generateOrderQR(orderId)` (deep link).
    - `size`, colors, optional logo (currently `null`).
    - User-facing instructions about showing the QR to the delivery driver.
- `orderQRService.getPickupQRData(orderId, vendorName)`:
  - Similar but with messaging tailored for in-store pickup.
- `promoQRService.getShareablePromoQR(promoCode, description)`:
  - Returns QR config for marketing/referral promos plus a `shareText` string.
- **Current state**:
  - None of these helpers are wired into UI screens; there is no place where customers can see or share an order QR yet.

### 3.2 Order QR storage (`orderService` in `services/supabaseService.ts`)
- On `orderService.create(orderData)`:
  - If Supabase is configured:
    - Inserts into `orders` with an auto-generated `qr_code` value:
      - `qr_code: "QR_<timestamp>_<random>"` (simple identifier, not a deep link).
  - If Supabase is not configured:
    - Returns a mock `Order` with `qr_code: "QR_<timestamp>"`.
- `orderService.verifyQRCode(qrCode: string)`:
  - When Supabase is configured:
    - Looks up `orders` by **exact match** on `qr_code`.
  - In mock mode:
    - Searches `mockDatabase.orders` for a matching `qr_code`.
- **Mismatch with generator/scanner**:
  - `qrCodeGenerator.generateOrderQR()` returns a `zoramarket://...` deep link.
  - `orderService.create()` stores a simple `"QR_<...>"` string.
  - `orderService.verifyQRCode()` expects to receive whatever is stored in `qr_code`.
  - Therefore:
    - If you display QR codes using `generateOrderQR(orderId)`, scanning them and passing the value into `verifyQRCode` will **not** find a record unless you change what is stored in `qr_code`.

### 3.3 QR scanner screen (`app/qr-scanner.tsx`)

#### 3.3.1 Camera & permissions
- Uses `expo-camera`’s `CameraView` and `useCameraPermissions`.
- Maintains `scannerState`:
  - `'checking'`, `'loading'`, `'unavailable'`, `'denied'`, `'ready'`.
- Renders:
  - Loading/permission screens for `'checking'`, `'loading'`, and `'denied'`.
  - An “unavailable” message on platforms where `CameraView` is not present (e.g. web).
  - The actual camera view plus overlay chrome in `'ready'` state.

#### 3.3.2 Scan handling
- `handleBarCodeScanned({ type, data })`:
  - Debounces with `scanned` boolean + short vibration.
  - Calls `qrCodeScanner.parseQRCode(data)`.
  - Branches by `result.type`:
    - **`'order'`**:
      - If Supabase is configured:
        - Calls `orderService.verifyQRCode(data)` where `data` is the **raw scanned string**.
        - If an order is found, shows an alert and offers “View Order” → `/order-tracking/{order.id}`.
      - Else:
        - Uses parsed `result.data.orderId` and goes directly to `/order-tracking/{orderId}`.
    - **`'promo'`**:
      - Calls `promoQRService.applyScannedPromo(data)` and shows success or error.
      - On success, offers navigation back to `/(tabs)` or rescan.
    - **`'vendor'`**:
      - Asks whether to “View this vendor’s shop?”, and if accepted, navigates via `getVendorRoute(undefined, vendorId)`.
    - **`'product'`**:
      - Asks whether to “View this product?” and navigates via `getProductRoute(productId)`.
    - **Unknown / error**:
      - Shows an appropriate error alert and resets `scanned` for another try.
- **Important**:
  - The stricter helper `qrCodeScanner.verifyOrderQR(scannedValue, expectedOrderId)` is **not** used here.
  - Instead, verification is delegated to `orderService.verifyQRCode`, which only checks for a direct `qr_code` match in the DB.

---

## 4. Key Gaps & Design Considerations

This section summarizes gaps identified during analysis. It is intentionally descriptive, not prescriptive; any changes should be explicitly designed and agreed before implementation.

### 4.1 QR payload format mismatch
- **Current behaviour**:
  - QR generator uses a deep-link format (`zoramarket://order/{id}?t=...&c=...`).
  - `orderService.create` stores a short `"QR_<...>"` token in `orders.qr_code`.
  - `orderService.verifyQRCode` searches `orders.qr_code` for an **exact match** of the scanned string.
- **Implication**:
  - If QR images are generated using `generateOrderQR(orderId)`, scanning them and passing `data` into `verifyQRCode` will **not** resolve to any order until storage and verification are aligned with the deep-link format.

### 4.2 QR not surfaced in customer journey
- Although `orderQRService.getOrderQRData` and `getPickupQRData` exist, no screen currently:
  - Calls them, or
  - Renders a QR image for the customer to show to a driver or store staff.
- The only active QR consumer is the generic `/qr-scanner` entrypoint.

### 4.3 Incomplete use of checksum / expiry verification
- The checksum + 24-hour expiry logic in `qrCodeScanner.verifyOrderQR` is implemented but not wired into `qr-scanner.tsx`.
- Today, QR validity is effectively reduced to “does `orders.qr_code` match this string?”, ignoring checksum and age.

### 4.4 ID vs order number for tracking routes
- Tracking routes (`/order/[id]`, `/order-tracking/[id]`) use `orderService.getById(id)` and assume the path param is the DB primary key.
- Elsewhere, `order.order_number` is used as the human-facing identifier.
- `OrderConfirmationScreen.handleTrackOrder` constructs the tracking path using:
  - `order.id || orderId || orderNumber`.
- **Implication**:
  - As long as the payment flow passes `createdOrder.id`, things work.
  - If any future change starts passing `order_number` into tracking routes, `orderService.getById` will fail and tracking screens will not be able to load the order.

### 4.5 Checkout metadata is not persisted to orders
- The checkout screen collects:
  - Delivery vs pickup choice,
  - A specific address,
  - Preferred date and time slot.
- The payment screen and `orderService.create` currently:
  - Use a hard-coded delivery address,
  - Have no awareness of delivery vs pickup,
  - Do not store date/time preferences.
- **Implication**:
  - Order records in Supabase (and therefore tracking/ops tools) may not reflect the user’s actual choices from checkout, which becomes increasingly important when tying QR-based verification or in-store pickup flows to specific addresses and timings.

---

## 5. Delivery Process (Conceptual Model)

> This section documents the intended delivery flow from a business/operations perspective, independent of the current implementation details in the app. It should be used as a reference when extending the data model, status pipeline, or UI.

### 5.1 High-level delivery chain

1. **Customer → Zora (order placement)**
   - Customer browses vendors and products, builds a multi-vendor cart, and places an order via the checkout/payment flow.
   - From the customer’s perspective, they are buying **from Zora**, even when items originate from independent vendors.
   - The app creates a single `order` record (per checkout) with:
     - Line items referencing specific vendors and products.
     - Delivery preference (delivery vs pickup) and address (once wired through from checkout).

2. **Zora ↔ Vendor (order approval & preparation)**
   - Zora surfaces the relevant portion of the order to each vendor that owns at least one item in the cart.
   - Each vendor:
     - Reviews and approves the order lines assigned to them (stock check, pricing, preparation feasibility).
     - Prepares the goods for handover (packing, labelling, internal QA).
   - The vendor’s decision should be reflected back into the central `orders` domain, e.g. through per-vendor fulfillment states or item-level status:
     - Pending vendor confirmation → Confirmed → Prepared / Ready for pickup by Zora/logistics.

3. **Vendor → Zora (handover / first-mile logistics)**
   - Once a vendor has prepared the goods, there are multiple handover patterns:
     - **Vendor ships to a Zora hub** (e.g. using their preferred courier, addressed to Zora).
     - **Zora arranges pickup from vendor** (Zora rider/driver, or a contracted first-mile partner).
     - **Logistics company collects from vendor on Zora’s behalf** (3PL first-mile).
   - Regardless of pattern, Zora should treat this as a **first-mile leg** with its own tracking events, distinct from the final customer delivery leg.

4. **Zora → Customer (line-haul + last-mile delivery)**
   - After receiving goods from each vendor, Zora:
     - Consolidates items per customer order where applicable.
     - Books or performs the last-mile delivery (Zora’s own fleet, 3PL courier, or partner riders).
   - Zora is responsible for:
     - Shipping label generation and address routing.
     - Scheduling and customer ETA communication.
     - Failed delivery handling, reattempts, and returns routing.

5. **Post-delivery**
   - Customer confirms receipt (implicitly via successful delivery, or explicitly via QR scan / confirmation action).
   - Zora:
     - Updates the order to a terminal state (`delivered`, possibly with sub-states like `delivered_to_neighbor`).
     - Triggers loyalty/credits adjustments, review invitations, and potential dispute flows.

### 5.2 Roles & responsibilities

- **Customer**
  - Places orders, selects delivery vs pickup where relevant.
  - Receives tracking updates and interacts with support for issues.
  - Optionally presents an order QR at delivery or pickup as proof-of-order.

- **Vendor**
  - Owns product quality, availability, and preparation.
  - Approves or rejects incoming order lines quickly.
  - Packs goods for handover to Zora or logistics partners following Zora’s packaging guidelines.

- **Zora**
  - Owns the overall customer experience and acts as the **single accountable party** for delivery.
  - Manages:
    - Vendor orchestration (order distribution, SLAs, escalation when vendors are slow/unresponsive).
    - Logistics orchestration (hub operations, first-mile, consolidation, last-mile).
    - Customer communication (status updates, ETAs, delays, issue resolution).

- **Logistics partners (optional)**
  - Provide first-mile pickup or last-mile delivery services under Zora’s direction.
  - May expose tracking IDs that Zora can surface in the app.

### 5.3 How this maps (and does not yet map) to the current app

- **Mapped today**
  - The customer-facing journey (cart → checkout → payment → order tracking) already exists at a basic level.
  - Order records support:
    - A single `vendor_id` and list of `items` with vendor/product references.
    - A unified `status` that drives the customer-facing tracking timeline (e.g. `pending`, `preparing`, `out_for_delivery`, `delivered`).
  - QR infrastructure exists conceptually for order verification, though it is not fully wired into storage or UI.

- **Not yet fully mapped**
  - There is no explicit **multi-leg logistics model** in the schema (e.g. vendor → Zora hub → customer).
  - Vendor approval is not modelled as a first-class state machine; orders are created directly in `pending`/`paid` state from the customer flow.
  - Per-vendor fulfillment states for multi-vendor orders (e.g. some vendors ready, others delayed) are not yet exposed at the domain level.
  - The app UI does not yet differentiate between:
    - Vendor-handled shipping to Zora vs Zora pickup vs 3PL handling.
    - Hub consolidation phases vs last-mile out-for-delivery states.

When evolving the delivery implementation, this conceptual model should be used to:
- Decide which logistics legs and responsibilities must be visible to customers.
- Decide which intermediate states are internal-only (ops dashboards) vs customer-facing (app tracking).
- Align QR code generation and verification with the specific handover points where proof-of-order is required (e.g. vendor → Zora, Zora → customer).

