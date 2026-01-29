// Common/Shared Types

// Region Types
export interface Region {
    id: string;
    name: string;
    image_url: string;
    description?: string;
}

// Banner Types
export interface Banner {
    id: string;
    title: string;
    subtitle: string;
    image_url: string;
    cta_text: string;
    cta_link: string;
    badge?: string;
}

// Category Types
export interface Category {
    id: string;
    name: string;
    slug: string;
    image_url?: string;
    parent_id?: string;
    description?: string;
}

// Notification Types
export type NotificationType = 'order' | 'promo' | 'review' | 'reward' | 'system';

export interface Notification {
    id: string;
    user_id: string;
    type: NotificationType;
    title: string;
    description: string;
    is_read: boolean;
    action_url?: string;
    created_at: string;
}

// Search Results
export interface SearchResults<T = unknown> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
