/**
 * @zora/shared - Constants
 * Shared constants across web and mobile platforms
 */

// ============================================
// STATUS CONFIGURATIONS
// ============================================

export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    READY: 'ready',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_CONFIG = {
    pending: {
        label: "Pending",
        description: "Order received, awaiting confirmation",
        color: "#F59E0B",
    },
    confirmed: {
        label: "Confirmed",
        description: "Order confirmed by vendor",
        color: "#3B82F6",
    },
    preparing: {
        label: "Preparing",
        description: "Order is being prepared",
        color: "#8B5CF6",
    },
    ready: {
        label: "Ready",
        description: "Order ready for pickup/delivery",
        color: "#10B981",
    },
    out_for_delivery: {
        label: "Out for Delivery",
        description: "Order is on its way",
        color: "#3B82F6",
    },
    delivered: {
        label: "Delivered",
        description: "Order has been delivered",
        color: "#10B981",
    },
    cancelled: {
        label: "Cancelled",
        description: "Order was cancelled",
        color: "#EF4444",
    },
} as const;

export const ORDER_NEXT_STATUS: Record<string, string> = {
    pending: "confirmed",
    confirmed: "preparing",
    preparing: "ready",
    ready: "out_for_delivery",
    out_for_delivery: "delivered",
};

export const PRODUCT_STATUS = {
    ACTIVE: 'active',
    DRAFT: 'draft',
    OUT_OF_STOCK: 'out_of_stock',
    ARCHIVED: 'archived',
} as const;

export const PRODUCT_STATUS_CONFIG = {
    active: { label: "Active", color: "#10B981" },
    draft: { label: "Draft", color: "#6B7280" },
    out_of_stock: { label: "Out of Stock", color: "#EF4444" },
    archived: { label: "Archived", color: "#9CA3AF" },
} as const;

export const VENDOR_STATUS = {
    ACTIVE: 'active',
    PENDING: 'pending',
    UNDER_REVIEW: 'under_review',
    SUSPENDED: 'suspended',
    REJECTED: 'rejected',
} as const;

export const VENDOR_STATUS_CONFIG = {
    active: { label: "Active", color: "#10B981" },
    pending: { label: "Pending Review", color: "#F59E0B" },
    under_review: { label: "Under Review", color: "#3B82F6" },
    suspended: { label: "Suspended", color: "#EF4444" },
    rejected: { label: "Rejected", color: "#EF4444" },
} as const;

export const CUSTOMER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    BLOCKED: 'blocked',
} as const;

export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    PARTIALLY_REFUNDED: 'partially_refunded',
} as const;

export const REFUND_STATUS = {
    REQUESTED: 'requested',
    APPROVED: 'approved',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    REJECTED: 'rejected',
} as const;

export const REVIEW_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    FLAGGED: 'flagged',
} as const;

// ============================================
// AFRICAN REGIONS
// ============================================

export const AFRICAN_REGIONS = [
    { id: 'west', name: 'West Africa', countries: ['Nigeria', 'Ghana', 'Senegal', 'Ivory Coast', 'Mali', 'Cameroon'] },
    { id: 'east', name: 'East Africa', countries: ['Kenya', 'Tanzania', 'Uganda', 'Ethiopia', 'Rwanda', 'Somalia'] },
    { id: 'north', name: 'North Africa', countries: ['Egypt', 'Morocco', 'Algeria', 'Tunisia', 'Libya', 'Sudan'] },
    { id: 'south', name: 'Southern Africa', countries: ['South Africa', 'Zimbabwe', 'Botswana', 'Namibia', 'Zambia', 'Mozambique'] },
    { id: 'central', name: 'Central Africa', countries: ['DRC', 'Congo', 'CAR', 'Chad', 'Gabon', 'Equatorial Guinea'] },
] as const;

// ============================================
// PRODUCT CATEGORIES
// ============================================

export const PRODUCT_CATEGORIES = [
    { id: 'groceries', name: 'Groceries', icon: 'shopping-basket' },
    { id: 'spices', name: 'Spices & Seasonings', icon: 'flame' },
    { id: 'snacks', name: 'Snacks & Sweets', icon: 'cookie' },
    { id: 'beverages', name: 'Beverages', icon: 'coffee' },
    { id: 'grains', name: 'Grains & Rice', icon: 'wheat' },
    { id: 'proteins', name: 'Proteins', icon: 'drumstick' },
    { id: 'vegetables', name: 'Fresh Vegetables', icon: 'carrot' },
    { id: 'fruits', name: 'Fresh Fruits', icon: 'apple' },
    { id: 'dairy', name: 'Dairy & Eggs', icon: 'egg' },
    { id: 'frozen', name: 'Frozen Foods', icon: 'snowflake' },
    { id: 'canned', name: 'Canned & Preserved', icon: 'archive' },
    { id: 'sauces', name: 'Sauces & Condiments', icon: 'droplet' },
    { id: 'beauty', name: 'Beauty & Personal Care', icon: 'sparkles' },
    { id: 'household', name: 'Household Items', icon: 'home' },
] as const;

// ============================================
// PAYMENT METHODS
// ============================================

export const PAYMENT_METHODS = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card' },
    { id: 'apple_pay', name: 'Apple Pay', icon: 'apple' },
    { id: 'google_pay', name: 'Google Pay', icon: 'smartphone' },
    { id: 'klarna', name: 'Klarna', icon: 'clock' },
    { id: 'clearpay', name: 'Clearpay', icon: 'calendar' },
] as const;

// ============================================
// DELIVERY OPTIONS
// ============================================

export const DELIVERY_OPTIONS = [
    { id: 'standard', name: 'Standard Delivery', description: '3-5 business days', price: 3.99 },
    { id: 'express', name: 'Express Delivery', description: '1-2 business days', price: 6.99 },
    { id: 'same_day', name: 'Same Day Delivery', description: 'Order before 12pm', price: 9.99 },
    { id: 'pickup', name: 'Store Pickup', description: 'Collect from vendor', price: 0 },
] as const;

// ============================================
// PLATFORM LIMITS
// ============================================

export const PLATFORM_LIMITS = {
    MAX_CART_ITEMS: 50,
    MAX_PRODUCT_IMAGES: 10,
    MAX_IMAGE_SIZE_MB: 5,
    MAX_REVIEW_LENGTH: 1000,
    MIN_ORDER_AMOUNT: 10,
    MAX_VENDORS_PER_ORDER: 5,
    FREE_DELIVERY_THRESHOLD: 35,
} as const;

// ============================================
// API ENDPOINTS (relative paths)
// ============================================

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        RESET_PASSWORD: '/auth/reset-password',
    },
    PRODUCTS: {
        LIST: '/products',
        DETAIL: (id: string) => `/products/${id}`,
        BY_VENDOR: (vendorId: string) => `/vendors/${vendorId}/products`,
        BY_CATEGORY: (categoryId: string) => `/categories/${categoryId}/products`,
    },
    ORDERS: {
        LIST: '/orders',
        DETAIL: (id: string) => `/orders/${id}`,
        CREATE: '/orders',
        UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    },
    VENDORS: {
        LIST: '/vendors',
        DETAIL: (id: string) => `/vendors/${id}`,
        PRODUCTS: (id: string) => `/vendors/${id}/products`,
    },
    REVIEWS: {
        LIST: '/reviews',
        BY_PRODUCT: (productId: string) => `/products/${productId}/reviews`,
        CREATE: '/reviews',
    },
} as const;

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
    UNAUTHORIZED: 'Please log in to continue.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    SERVER_ERROR: 'Something went wrong. Please try again later.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
} as const;

// ============================================
// SUCCESS MESSAGES
// ============================================

export const SUCCESS_MESSAGES = {
    ORDER_PLACED: 'Your order has been placed successfully!',
    ORDER_CANCELLED: 'Your order has been cancelled.',
    REVIEW_SUBMITTED: 'Thank you for your review!',
    PROFILE_UPDATED: 'Your profile has been updated.',
    PASSWORD_CHANGED: 'Your password has been changed successfully.',
    ADDRESS_SAVED: 'Address saved successfully.',
    PRODUCT_ADDED_TO_CART: 'Product added to cart.',
    PRODUCT_REMOVED_FROM_CART: 'Product removed from cart.',
} as const;

// ============================================
// ICONS
// ============================================

export * from './icons';
