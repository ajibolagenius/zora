// Vendor Types
export interface OpeningHours {
    day: string;
    open: string;
    close: string;
    is_closed: boolean;
}

export interface Vendor {
    [key: string]: unknown;
    id: string;
    user_id?: string;
    name: string;
    slug?: string;
    description: string;
    cover_image: string;
    logo_url: string;
    category: string;
    regions: string[];
    rating: number;
    review_count: number;
    is_verified: boolean;
    tag?: string;
    distance?: string;
    delivery_time: string;
    delivery_fee: number;
    min_order: number;
    address?: string;
    opening_hours: OpeningHours[];
    is_open: boolean;
    created_at?: string;
    updated_at?: string;
}


