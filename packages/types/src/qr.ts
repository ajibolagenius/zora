export type QRCodeType = 'order' | 'promo' | 'vendor' | 'product';

export interface BaseQRData {
    type: QRCodeType;
    checksum?: string;
}

export interface OrderQRData extends BaseQRData {
    type: 'order';
    orderId: string;
    timestamp: number; // Changed to number to match mobile
    customerName?: string;
    total?: number;
    status?: string;
    items?: string[];
}

export interface ProductQRData extends BaseQRData {
    type: 'product';
    productId?: string;
    name?: string;
    price?: number;
    category?: string;
    stock?: number;
    sku?: string;
    url?: string;
}

export interface VendorQRData extends BaseQRData {
    type: 'vendor';
    vendorId?: string;
    vendorName?: string;
    category?: string;
    rating?: number;
    location?: string;
}

export interface PromoQRData extends BaseQRData {
    type: 'promo';
    promoCode: string;
    code?: string;
    discount?: number;
    minimumOrder?: number;
    expiry?: string;
    description?: string;
}

// Unified Union Type
export type QRData = OrderQRData | ProductQRData | VendorQRData | PromoQRData;

export interface ScanResult {
    success: boolean;
    type?: QRCodeType;
    data?: QRData | { url: string } | any; // Allow flexible data for now, but prefer QRData
    error?: string;
}
