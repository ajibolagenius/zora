import type { Address } from './address';

// Order Types
export interface OrderItem {
    product_id: string;
    vendor_id: string;
    name: string;
    image_url: string;
    price: number;
    quantity: number;
    variant?: string;
}

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'ready_for_pickup'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

export type DeliveryOption = 'delivery' | 'pickup';

export interface Order {
    id: string;
    user_id: string;
    order_number: string;
    status: OrderStatus;
    items: OrderItem[];
    subtotal: number;
    delivery_fee: number;
    service_fee: number;
    discount: number;
    total: number;
    currency: string;
    delivery_address?: Address;
    delivery_option: DeliveryOption;
    payment_method: string;
    payment_intent_id?: string;
    created_at: string;
    updated_at?: string;
    estimated_delivery?: string;
    actual_delivery?: string;
}

export interface CreateOrderInput {
    items: OrderItem[];
    delivery_address_id?: string;
    delivery_option: DeliveryOption;
    payment_method: string;
    promo_code?: string;
}
