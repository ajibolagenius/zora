# Zora Delivery & Fulfillment Process

> This document details the end-to-end delivery workflow for the Zora platform, specifically focusing on the **Third-Party Delivery Model** managed by Zora administrators. It is distinct from the [Cart & QR Flow](./CART_AND_QR_FLOW.md), which covers the pre-purchase and pickup/verification experiences.

---

## 1. Overview & Strategy

Zora operates a **managed marketplace delivery model**. While Vendors list and prepare products, **Zora (the platform)** is responsible for orchestrating the delivery logistics.

- **Primary Method:** Third-party courier (e.g., DPD, Royal Mail, local couriers).
- **Management:** Semi-manual booking by Zora Admins.
- **Trigger:** Vendor marks order as "Ready".
- **Tracking:** Centralized in the Zora app, powered by courier tracking references.

---

## 2. Order Lifecycle Statuses

Understanding the delivery flow requires a clear definition of order statuses in the context of fulfillment.

| Status | Description | Action Required By |
| :--- | :--- | :--- |
| `pending` | Customer has placed order, payment processing. | System (Automatic) |
| `confirmed` | Payment successful. Order is sent to Vendor. | Vendor |
| `preparing` | Vendor is packing the items. | Vendor |
| `ready` | **CRITICAL:** Vendor has packed items and they are ready for pickup. | **Zora Admin** |
| `dispatched` | Zora Admin has booked the courier; tracking reference added. | Carrier / System |
| `delivered` | Courier has confirmed delivery to customer. | System / Admin |
| `cancelled` | Order cancelled at any stage. | Admin / System |

---

## 3. The Delivery Flow (Step-by-Step)

### Step 1: Vendor Preparation & Handoff
1. Vendor receives a "New Order" notification.
2. Vendor prepares the items.
3. In the **Vendor App/Dashboard**, the Vendor marks the order status as **"Ready for Collection"**.
4. This updates the system status to `ready`.

### Step 2: Admin Logistics Management (The "Semi-Manual" Flow)
*This is the core operational step for Zora administrators.*

1. **Monitoring:** Zora Admin monitors the **"Ready for Dispatch"** queue in the Admin Dashboard.
2. **Booking:**
    - Admin reviews the order details (weight, dimensions, pickup location, delivery address).
    - Admin manually (or via external tool) books the specific courier service (e.g., visits DPD portal, calls bike courier).
3. **Dispatching:**
    - Admin returns to the Zora Admin Dashboard.
    - Selects the order and clicks **"Book Delivery" / "Mark Dispatched"**.
    - **Inputs Required:**
        - **Delivery Partner:** (e.g., "DPD UK", "Royal Mail")
        - **Tracking Reference:** (e.g., `1593920210`)
        - **Tracking URL:** (Optional, or auto-generated based on provider)
4. **Completion:** Submitting this form updates the order status to `dispatched` (`out_for_delivery` in DB).

**Booking-Based Reference Workflow:**
> Zora uses a generic **booking-based** flow where the tracking reference is obtained **immediately** when the delivery is booked.
> 1. Vendor marks order ready.
> 2. Zora Admin calls delivery company's booking API (or uses their portal).
> 3. Delivery company returns tracking reference instantly.
> 4. Admin updates order with reference → Status becomes `dispatched`.
> 5. Customer gets "Dispatched" email immediately.

### Step 3: Logistics Handoff
1. The Courier collects the package from the Vendor's location.
    - *Note:* The "Ready" status implies the Vendor is expecting a pickup.

### Step 4: Customer Tracking & Receipt
1. **Notification:** When the Admin marks the order as `dispatched`, an automatic email is triggered to the Customer via **Resend**.
    - *Subject:* "Your Zora Order #[ID] has been dispatched!"
    - *Content:* Includes Carrier Name, Tracking Reference, and a direct link.
2. **In-App Tracking:**
    - Customer goes to **"My Orders"** -> **"Track Order"**.
    - The App displays the status "Dispatched" / "On its way".
    - A button **"Track with [Carrier]"** links directly to the carrier's tracking page (e.g., DPD website) using the reference entered by the Admin.
    - *Note:* We rely on the external carrier page for granular details (e.g., "Driver is 5 stops away") rather than replicating it.

**Supported Delivery Companies & URL Patterns:**
| Delivery Company | Tracking URL Format |
| :--- | :--- |
| **DPD UK** | `https://track.dpd.co.uk/parcel/{tracking_reference}` |
| **Royal Mail** | `https://www.royalmail.com/track-your-item/{reference}` |
| **Evri** | `https://www.evri.com/track/{reference}` |
| **DHL UK** | `https://www.dhl.co.uk/en/express/tracking.html?AWB={reference}` |

### Step 5: Final Delivery
1. Customer receives the package.
2. The Order is marked `delivered`:
    - *Option A (Manual):* Admin updates status after verifying delivery.
    - *Option B (Webhook):* If the courier supports it, a webhook updates the status automatically.

---

## 4. Address & Location Accuracy

To ensure successful delivery, accurate location data is captured during **Customer Onboarding**.

### 4.1 Onboarding Location Flow
1. **Start:** User reaches the "Location" step in onboarding.
2. **Input:** User enters a **Postcode** (e.g., "SW9 7AB").
3. **Lookup:**
    - The system queries an Address Lookup Service (or internal database).
    - A list of matching addresses is displayed.
4. **Selection:**
    - User selects their exact address.
    - System fills: `Line 1`, `City`, `Postcode`, `Coordinates (Lat/Long)`.
5. **Fallback:** If the postcode lookup fails or address is missing, a "Enter Manually" option allows full text entry.

### 4.2 Impact on Delivery
- **Vendor Proximity:** The coordinates are used to calculate the "Distance to Vendor" shown in the app.
- **Courier Accuracy:** The standardized address format ensures the courier can find the drop-off point without issues.

---

## 5. Automated Email Notifications (Delivery Focused)

Zora uses **Resend** for transactional email delivery.

**Core Delivery Events:**
1. **Order Dispatched:**
   - **Trigger:** Status changes to `dispatched`.
   - **Content:** "Your order #123 is on its way with DPD. Track here: [Link]".
2. **Order Delivered:**
   - **Trigger:** Status changes to `delivered`.
   - **Content:** "Your order #123 has been delivered. Enjoy!".

---

## 6. Distinction from Cart & QR Flows

It is important to distinguish this Delivery flow from the **Cart & QR Flow**:

| Feature | **Delivery Flow** (This Document) | **Cart & QR Flow** (See [Ref](./CART_AND_QR_FLOW.md)) |
| :--- | :--- | :--- |
| **Primary Goal** | Getting the product from Vendor to Customer via Courier. | Transacting (Buying) and Verifying/Redeeming. |
| **Key Actor** | **Zora Admin** (Booking Logistics) | **Customer** (Browsing/Checkout) |
| **Tracking** | **External** (Courier Website) | **Internal** (App Status / Order History) |
| **QR Code Usage** | Generally **Not Used** for courier delivery. | Used for **In-Store Pickup** or Event Redemption. |
| **Handover** | Vendor -> Courier -> Customer | Vendor -> Customer (Direct) |

---

## 7. Technical Requirements Summary

### Database Schema Updates
- **Orders Table:** Add `tracking_reference`, `delivery_provider_id` (or name), `delivery_tracking_url`, `dispatched_at`.
- **Delivery Companies Table:** Store provider configurations (Tracking URL templates).

### Admin Dashboard
- **Dispatch Modal:** UI for Admin to input tracking details.
- **Ready Queue:** Filter orders by `status = 'ready'`.

### Notifications
- **Email Triggers:** Ensure `dispatched` status change fires the "Order Dispatched" email template with the tracking link.
