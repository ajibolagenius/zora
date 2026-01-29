// Vendor Types
export interface OpeningHours {
    day: string;
    open: string;
    close: string;
    is_closed: boolean;
}

export interface Vendor {
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

export type VendorApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface VendorApplication {
    id: string;
    user_id: string;
    business_name: string;
    business_type: string;
    description?: string;
    email: string;
    phone: string;
    address: {
        line1: string;
        line2?: string;
        city: string;
        postcode: string;
        country: string;
    };
    documents?: {
        business_registration?: string;
        id_document?: string;
        proof_of_address?: string;
    };
    bank_details?: {
        account_name: string;
        account_number: string;
        sort_code: string;
    };
    coverage_areas?: string[];
    product_categories: string[];
    status: VendorApplicationStatus;
    reviewed_by?: string;
    reviewed_at?: string;
    rejection_reason?: string;
    created_at: string;
    updated_at: string;
}
