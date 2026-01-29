/**
 * Shared constants for the Zora platform
 * Design system tokens, status configurations, and utility functions
 */

// ============================================
// STATUS CONFIGURATIONS
// ============================================

/**
 * Order status configuration
 * Used across vendor and admin dashboards
 */
export const ORDER_STATUS_CONFIG = {
    pending: {
        label: "Pending",
        variant: "warning" as const,
        color: "text-yellow-600 bg-yellow-100"
    },
    confirmed: {
        label: "Confirmed",
        variant: "info" as const,
        color: "text-blue-600 bg-blue-100"
    },
    preparing: {
        label: "Preparing",
        variant: "primary" as const,
        color: "text-purple-600 bg-purple-100"
    },
    ready: {
        label: "Ready",
        variant: "success" as const,
        color: "text-green-600 bg-green-100"
    },
    out_for_delivery: {
        label: "Out for Delivery",
        variant: "info" as const,
        color: "text-blue-600 bg-blue-100"
    },
    delivered: {
        label: "Delivered",
        variant: "success" as const,
        color: "text-green-600 bg-green-100"
    },
    cancelled: {
        label: "Cancelled",
        variant: "error" as const,
        color: "text-red-600 bg-red-100"
    },
} as const;

/**
 * Product status configuration
 */
export const PRODUCT_STATUS_CONFIG = {
    active: { label: "Active", variant: "success" as const },
    low_stock: { label: "Low Stock", variant: "warning" as const },
    out_of_stock: { label: "Out of Stock", variant: "error" as const },
    draft: { label: "Draft", variant: "default" as const },
} as const;

/**
 * Vendor status configuration
 */
export const VENDOR_STATUS_CONFIG = {
    active: { label: "Active", variant: "success" as const },
    suspended: { label: "Suspended", variant: "error" as const },
    pending: { label: "Pending Review", variant: "warning" as const },
    under_review: { label: "Under Review", variant: "info" as const },
} as const;

/**
 * Customer status configuration
 */
export const CUSTOMER_STATUS_CONFIG = {
    active: { label: "Active", variant: "success" as const },
    inactive: { label: "Inactive", variant: "warning" as const },
    blocked: { label: "Blocked", variant: "error" as const },
} as const;

/**
 * Payment status configuration
 */
export const PAYMENT_STATUS_CONFIG = {
    pending: { label: "Pending", variant: "warning" as const },
    paid: { label: "Paid", variant: "success" as const },
    failed: { label: "Failed", variant: "error" as const },
    refunded: { label: "Refunded", variant: "default" as const },
} as const;

// ============================================
// ORDER WORKFLOW
// ============================================

/**
 * Order status flow - maps current status to next status
 */
export const ORDER_NEXT_STATUS: Record<string, string> = {
    pending: "confirmed",
    confirmed: "preparing",
    preparing: "ready",
    ready: "out_for_delivery",
    out_for_delivery: "delivered",
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get initials from a name
 * @example getInitials("John Doe") => "JD"
 */
export function getInitials(name: string, maxChars: number = 2): string {
    return name
        .split(" ")
        .map(n => n[0])
        .join("")
        .slice(0, maxChars)
        .toUpperCase();
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');

    // Format UK number
    if (cleaned.startsWith('44') || cleaned.startsWith('0')) {
        const normalized = cleaned.startsWith('44') ? cleaned.slice(2) : cleaned.slice(1);
        return `+44 ${normalized.slice(0, 4)} ${normalized.slice(4)}`;
    }

    return phone;
}

// ============================================
// DESIGN SYSTEM COLORS (for reference)
// ============================================

export const DESIGN_COLORS = {
    // Primary Palette
    primary: "#CC0000",
    primaryDark: "#A30000",
    secondary: "#FFCC00",
    secondaryDark: "#E6B800",

    // Background Colors
    backgroundDark: "#221710",
    backgroundLight: "#F8F7F5",
    surface: "#342418",

    // Text Colors
    textPrimary: "#FFFFFF",
    textSecondary: "#CBA990",
    textMuted: "#CBA990",
    textDark: "#221710",

    // Status Colors
    success: "#22C55E",
    warning: "#FFCC00",
    error: "#CC0000",
    info: "#3B82F6",
} as const;

// ============================================
// TYPES
// ============================================

export type OrderStatus = keyof typeof ORDER_STATUS_CONFIG;
export type ProductStatus = keyof typeof PRODUCT_STATUS_CONFIG;
export type VendorStatus = keyof typeof VENDOR_STATUS_CONFIG;
export type CustomerStatus = keyof typeof CUSTOMER_STATUS_CONFIG;
export type PaymentStatus = keyof typeof PAYMENT_STATUS_CONFIG;
