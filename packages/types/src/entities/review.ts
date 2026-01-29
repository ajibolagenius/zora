// Review Types
export interface Review {
    id: string;
    user_id: string;
    user_name: string;
    user_picture?: string;
    product_id?: string;
    vendor_id?: string;
    rating: number;
    comment: string;
    created_at: string;
    updated_at?: string;
}

export interface CreateReviewInput {
    product_id?: string;
    vendor_id?: string;
    rating: number;
    comment: string;
}
