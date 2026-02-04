# Zora Process Overview: From Cart to Doorstep

This document provides a simplified validation of how the Zora platform handles orders, meant for stakeholders and clients. It covers the **Shopping Experience** (App) and the **Delivery Operations** (Logistics).

---

## Part 1: The Shopping Experience (Customer)

The goal is a seamless, Amazon-like experience for buying African groceries from multiple local vendors.

### 1. The Cart
*   **Multi-Vendor Support:** Customers can add items from different sellers (e.g., "Mama Africa's Store" and "Brixton Spices") into a single cart.
*   **Transparent Pricing:** The cart automatically calculates subtotals for each vendor and applies a standard delivery fee.

### 2. Checkout & Address
*   **Smart Address Search:** We are introducing a postcode lookup. The customer enters their postcode (e.g., "SW9..."), selects their exact address from a list, and the system fills in the details. This ensures couriers can find them easily.
*   **Payment:** Secure payment processing (Card, Apple Pay, Google Pay).

### 3. Order Confirmation
*   **Immediate Feedback:** Once paid, the customer sees an "Order Placed" screen and receives a confirmation email.
*   **Status Tracking:** The order appears in their "My Orders" list with a status of **"Order Received"**.

---

## Part 2: Fulfillment & Delivery (Operations)

Zora manages the delivery logistics, taking the burden off individual vendors.

### 1. Vendor Preparation
*   **Notification:** The vendor receives the order on their dashboard.
*   **Packing:** The vendor picks and packs the items.
*   **Handoff:** When finished, the vendor clicks **"Ready for Collection"**. This is the signal for Zora to step in.

### 2. Zora Logistics (The "Control Tower")
*   **Booking:** The Zora Admin team sees the "Ready" order. They arrange the courier (e.g., DPD, Royal Mail, or local drivers) to pick up the package.
*   **Dispatching:** Once the courier is booked, the Zora Admin enters the **Tracking Reference** into the system.

### 3. Customer Tracking
*   **Notification:** As soon as Zora adds the tracking info, the customer gets an email: *"Your order is on its way!"*
*   **Real-Time Ops:** The customer can click **"Track Order"** in the Zora app or email to see the live status on the courier’s website (e.g., watching the DPD driver on a map).

### 4. Delivery
*   The courier delivers the package to the customer's doorstep.
*   The order is marked as **"Delivered"** in the app, completing the cycle.

---

## Summary of Roles

| Who | Responsibility |
| :--- | :--- |
| **Customer** | Browses, pays, and tracks the parcel via the App. |
| **Vendor** | Accepts the order and packs the goods. |
| **Zora Admin** | Books the courier and manages the logistics (the "Magic" in the middle). |
| **Courier** | Physically moves the package from Vendor to Customer. |
