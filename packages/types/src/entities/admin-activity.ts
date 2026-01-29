/**
 * Admin Activity Log Types
 * Types for tracking admin actions
 */

export type AdminActionCategory = 
    | 'order'
    | 'vendor'
    | 'customer'
    | 'product'
    | 'review'
    | 'refund'
    | 'settings'
    | 'user'
    | 'other';

export interface AdminActivityDetails {
    previous_value?: unknown;
    new_value?: unknown;
    reason?: string;
    [key: string]: unknown;
}

export interface AdminActivityLog {
    id: string;
    
    // Admin info
    admin_id: string;
    admin_email: string;
    
    // Action details
    action: string;
    action_category: AdminActionCategory;
    
    // Entity info
    entity_type: string;
    entity_id?: string;
    entity_identifier?: string;
    
    // Details
    details: AdminActivityDetails;
    
    // Metadata
    ip_address?: string;
    user_agent?: string;
    
    // Timestamp
    created_at: string;
}

export interface LogAdminActivityInput {
    admin_id: string;
    admin_email: string;
    action: string;
    action_category: AdminActionCategory;
    entity_type: string;
    entity_id?: string;
    entity_identifier?: string;
    details?: AdminActivityDetails;
    ip_address?: string;
    user_agent?: string;
}

// Common admin actions for type safety
export const AdminActions = {
    // Orders
    ORDER_STATUS_CHANGED: 'order.status_changed',
    ORDER_REFUND_PROCESSED: 'order.refund_processed',
    ORDER_CANCELLED: 'order.cancelled',
    
    // Vendors
    VENDOR_APPROVED: 'vendor.approved',
    VENDOR_REJECTED: 'vendor.rejected',
    VENDOR_SUSPENDED: 'vendor.suspended',
    VENDOR_REACTIVATED: 'vendor.reactivated',
    
    // Products
    PRODUCT_APPROVED: 'product.approved',
    PRODUCT_REJECTED: 'product.rejected',
    PRODUCT_FLAGGED: 'product.flagged',
    
    // Reviews
    REVIEW_APPROVED: 'review.approved',
    REVIEW_REJECTED: 'review.rejected',
    REVIEW_FLAGGED: 'review.flagged',
    
    // Customers
    CUSTOMER_BLOCKED: 'customer.blocked',
    CUSTOMER_UNBLOCKED: 'customer.unblocked',
    
    // Settings
    SETTINGS_UPDATED: 'settings.updated',
    
    // Refunds
    REFUND_APPROVED: 'refund.approved',
    REFUND_REJECTED: 'refund.rejected',
    REFUND_PROCESSED: 'refund.processed',
} as const;
