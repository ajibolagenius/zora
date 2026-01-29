/**
 * Email Thread Types
 * Types for the customer support email system
 */

export type EmailThreadStatus = 'open' | 'pending' | 'closed' | 'spam';
export type EmailPriority = 'low' | 'normal' | 'high' | 'urgent';
export type MessageSenderType = 'customer' | 'admin' | 'system' | 'vendor';

export interface EmailAttachment {
    name: string;
    url: string;
    size: number;
    type: string;
}

export interface EmailThread {
    id: string;
    subject: string;
    
    // Customer info
    customer_id?: string;
    customer_email: string;
    customer_name?: string;
    
    // Related entities
    order_id?: string;
    vendor_id?: string;
    
    // Status & Assignment
    status: EmailThreadStatus;
    priority: EmailPriority;
    assigned_to?: string;
    assigned_at?: string;
    
    // Metadata
    tags: string[];
    is_starred: boolean;
    is_read: boolean;
    
    // Message counts
    message_count: number;
    unread_count: number;
    
    // Last activity
    last_message_at?: string;
    last_message_preview?: string;
    last_message_sender?: MessageSenderType;
    
    // Timestamps
    created_at: string;
    updated_at: string;
    closed_at?: string;
}

export interface EmailMessage {
    id: string;
    thread_id: string;
    
    // Sender info
    sender_type: MessageSenderType;
    sender_id?: string;
    sender_email: string;
    sender_name?: string;
    
    // Content
    content: string;
    content_html?: string;
    
    // Attachments
    attachments: EmailAttachment[];
    
    // Metadata
    is_internal: boolean;
    is_read: boolean;
    read_at?: string;
    
    // External email metadata
    external_message_id?: string;
    in_reply_to?: string;
    
    // Timestamp
    created_at: string;
}

export interface EmailTemplate {
    id: string;
    name: string;
    subject?: string;
    content: string;
    content_html?: string;
    category: 'general' | 'order' | 'shipping' | 'refund' | 'account' | 'vendor' | 'other';
    use_count: number;
    is_active: boolean;
    created_by?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateEmailThreadInput {
    subject: string;
    customer_email: string;
    customer_name?: string;
    customer_id?: string;
    order_id?: string;
    vendor_id?: string;
    priority?: EmailPriority;
    tags?: string[];
}

export interface CreateEmailMessageInput {
    thread_id: string;
    sender_type: MessageSenderType;
    sender_email: string;
    sender_name?: string;
    content: string;
    content_html?: string;
    attachments?: EmailAttachment[];
    is_internal?: boolean;
}

export interface UpdateEmailThreadInput {
    status?: EmailThreadStatus;
    priority?: EmailPriority;
    assigned_to?: string;
    tags?: string[];
    is_starred?: boolean;
    is_read?: boolean;
}
