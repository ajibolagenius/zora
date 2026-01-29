import type { Vendor } from './vendor';

// Product Types
export interface NutritionInfo {
    serving_size?: string;
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
    fiber?: string;
    sodium?: string;
}

export interface Product {
    id: string;
    vendor_id: string;
    name: string;
    slug?: string;
    description: string;
    price: number;
    original_price?: number;
    currency: string;
    image_url: string;
    images: string[];
    category: string;
    subcategory?: string;
    region: string;
    weight?: string;
    unit?: string;
    badge?: string;
    rating: number;
    review_count: number;
    in_stock: boolean;
    stock_quantity: number;
    attributes: Record<string, string>;
    nutrition_info?: NutritionInfo;
    origin?: string;
    certifications: string[];
    vendor?: Vendor;
    created_at?: string;
    updated_at?: string;
}

export interface CreateProductInput {
    vendor_id: string;
    name: string;
    description: string;
    price: number;
    original_price?: number;
    currency?: string;
    images: string[];
    category: string;
    subcategory?: string;
    region: string;
    weight?: string;
    unit?: string;
    stock_quantity: number;
    attributes?: Record<string, string>;
    nutrition_info?: NutritionInfo;
    origin?: string;
    certifications?: string[];
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
    id: string;
}
