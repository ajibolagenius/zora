/**
 * Mock Data Service
 * Provides consistent, realistic data from mock_database.json for all screens
 */

import mockDatabase from '../data/mock_database.json';

// Type definitions based on mock database structure
export interface Vendor {
    id: string;
    user_id: string;
    shop_name: string;
    description: string;
    logo_url: string;
    cover_image_url: string;
    address: string;
    location: {
        type: string;
        coordinates: number[];
    };
    coverage_radius_km: number;
    is_verified: boolean;
    rating: number;
    review_count: number;
    cultural_specialties: string[];
    categories: string[];
    delivery_time_min: number;
    delivery_time_max: number;
    delivery_fee: number;
    minimum_order: number;
    is_featured: boolean;
    badge: string | null;
    created_at: string;
}

export interface Product {
    id: string;
    vendor_id: string;
    name: string;
    description: string;
    price: number;
    unit_price_label: string;
    stock_quantity: number;
    category: string;
    cultural_region: string;
    image_urls: string[];
    weight: string;
    certifications: string[];
    nutrition: {
        calories: string;
        protein: string;
        carbs: string;
        fat: string;
    };
    heritage_story: string;
    is_active: boolean;
    is_featured: boolean;
    badge: string | null;
    rating: number;
    review_count: number;
    created_at: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string;
    image_url: string;
    product_count: number;
    description: string;
}

export interface Region {
    id: string;
    name: string;
    slug: string;
    image_url: string;
    countries: string[];
    description: string;
    is_selected: boolean;
    vendor_count: number;
    product_count: number;
}

export interface Banner {
    id: string;
    title: string;
    subtitle: string;
    image_url: string;
    badge: string;
    badge_style: string;
    cta_text: string;
    cta_link: string;
    is_active: boolean;
    order: number;
}

export interface Review {
    id: string;
    product_id: string;
    vendor_id: string;
    user_id: string;
    user_name: string;
    user_avatar: string;
    rating: number;
    title: string;
    content: string;
    images: string[];
    helpful_count: number;
    verified_purchase: boolean;
    created_at: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    sender_type: 'user' | 'vendor';
    sender_name: string;
    sender_avatar?: string;
    text: string;
    created_at: string;
    read_at?: string;
}

// Type the mock database
const db = mockDatabase as {
    vendors: Vendor[];
    products: Product[];
    categories: Category[];
    regions: Region[];
    banners: Banner[];
    reviews: Review[];
    [key: string]: any;
};

// Vendor Service
export const vendorService = {
    getAll: (): Vendor[] => db.vendors,

    getFeatured: (): Vendor[] => db.vendors.filter(v => v.is_featured),

    getById: (id: string): Vendor | undefined => {
        // Support both full ID and slug-style lookups
        return db.vendors.find(v =>
            v.id === id ||
            v.shop_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(id.replace('vendor-', ''))
        );
    },

    getByRegion: (region: string): Vendor[] =>
        db.vendors.filter(v => v.cultural_specialties.some(s => s.toLowerCase().includes(region.toLowerCase()))),
};

// Product Service
export const productService = {
    getAll: (): Product[] => db.products.filter(p => p.is_active),

    getFeatured: (): Product[] => db.products.filter(p => p.is_featured && p.is_active),

    getById: (id: string): Product | undefined => db.products.find(p => p.id === id),

    getByVendor: (vendorId: string): Product[] => db.products.filter(p => p.vendor_id === vendorId && p.is_active),

    getByCategory: (category: string): Product[] =>
        db.products.filter(p => p.category.toLowerCase() === category.toLowerCase() && p.is_active),

    getByRegion: (region: string): Product[] =>
        db.products.filter(p => p.cultural_region.toLowerCase().includes(region.toLowerCase()) && p.is_active),

    search: (query: string): Product[] => {
        const lowerQuery = query.toLowerCase();
        return db.products.filter(p =>
            p.is_active && (
                p.name.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery) ||
                p.category.toLowerCase().includes(lowerQuery)
            )
        );
    },
};

// Category Service
export const categoryService = {
    getAll: (): Category[] => db.categories,

    getById: (id: string): Category | undefined => db.categories.find(c => c.id === id),

    getBySlug: (slug: string): Category | undefined => db.categories.find(c => c.slug === slug),
};

// Region Service
export const regionService = {
    getAll: (): Region[] => db.regions,

    getById: (id: string): Region | undefined => db.regions.find(r => r.id === id),

    getBySlug: (slug: string): Region | undefined => db.regions.find(r => r.slug === slug),
};

// Banner Service
export const bannerService = {
    getActive: (): Banner[] => db.banners?.filter(b => b.is_active).sort((a, b) => a.order - b.order) || [],
};

// In-memory reviews storage for new reviews (since we can't modify JSON at runtime)
let additionalReviews: Review[] = [];

// In-memory messages storage
let messagesStore: Message[] = [];

// Review Service
export const reviewService = {
    getByProduct: (productId: string): Review[] => {
        const dbReviews = db.reviews?.filter(r => r.product_id === productId) || [];
        const newReviews = additionalReviews.filter(r => r.product_id === productId);
        return [...newReviews, ...dbReviews];
    },

    getByVendor: (vendorId: string): Review[] => {
        const dbReviews = db.reviews?.filter(r => r.vendor_id === vendorId) || [];
        const newReviews = additionalReviews.filter(r => r.vendor_id === vendorId);
        return [...newReviews, ...dbReviews];
    },

    getAll: (): Review[] => [...additionalReviews, ...(db.reviews || [])],

    create: (reviewData: {
        product_id?: string;
        vendor_id?: string;
        rating: number;
        title: string;
        comment: string;
        user_name: string;
        user_avatar?: string;
    }): Review => {
        const newReview: Review = {
            id: `rev_new_${Date.now()}`,
            product_id: reviewData.product_id || '',
            vendor_id: reviewData.vendor_id || '',
            user_id: `user_${Date.now()}`,
            user_name: reviewData.user_name,
            user_avatar: reviewData.user_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
            rating: reviewData.rating,
            title: reviewData.title,
            content: reviewData.comment,
            images: [],
            helpful_count: 0,
            verified_purchase: true,
            created_at: new Date().toISOString(),
        };

        additionalReviews.unshift(newReview);
        return newReview;
    },
};

// Message Service
export const messageService = {
    // Get conversation ID for a vendor (creates one if doesn't exist)
    getConversationId: (vendorId: string, userId: string = 'current_user'): string => {
        return `conv_${userId}_${vendorId}`;
    },

    // Get all messages for a conversation
    getByConversation: (conversationId: string): Message[] => {
        return messagesStore
            .filter(m => m.conversation_id === conversationId)
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    },

    // Get messages for a vendor
    getByVendor: (vendorId: string, userId: string = 'current_user'): Message[] => {
        const conversationId = messageService.getConversationId(vendorId, userId);
        return messageService.getByConversation(conversationId);
    },

    // Send a message
    send: (messageData: {
        conversation_id: string;
        sender_id: string;
        sender_type: 'user' | 'vendor';
        sender_name: string;
        sender_avatar?: string;
        text: string;
    }): Message => {
        const newMessage: Message = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            conversation_id: messageData.conversation_id,
            sender_id: messageData.sender_id,
            sender_type: messageData.sender_type,
            sender_name: messageData.sender_name,
            sender_avatar: messageData.sender_avatar,
            text: messageData.text,
            created_at: new Date().toISOString(),
        };

        messagesStore.push(newMessage);
        return newMessage;
    },

    // Mark messages as read
    markAsRead: (conversationId: string, userId: string): void => {
        messagesStore.forEach(msg => {
            if (msg.conversation_id === conversationId &&
                msg.sender_id !== userId &&
                !msg.read_at) {
                msg.read_at = new Date().toISOString();
            }
        });
    },
};

// Export everything
export default {
    vendors: vendorService,
    products: productService,
    categories: categoryService,
    regions: regionService,
    banners: bannerService,
    reviews: reviewService,
    messages: messageService,
};
