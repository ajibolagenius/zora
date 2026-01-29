import type { Product } from './product';
import type { Vendor } from './vendor';

// Cart Types
export interface CartItem {
    product_id: string;
    vendor_id: string;
    quantity: number;
    variant?: string;
    product?: Product;
    vendor?: Vendor;
}

export interface CartVendor {
    id: string;
    name: string;
    logo_url: string;
    location?: string;
    delivery_time: string;
    delivery_fee: number;
    items: CartItem[];
    subtotal: number;
}

export interface Cart {
    items: CartItem[];
    vendors: CartVendor[];
    subtotal: number;
    delivery_fee: number;
    service_fee: number;
    discount: number;
    total: number;
    promo_code?: string;
}
