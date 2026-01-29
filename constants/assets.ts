// Zora African Market Design Tokens - Asset Constants

import { ApiEndpoints } from './api';

/**
 * Blurhash Placeholders
 * Compact placeholder strings that render as blurred backgrounds
 * These are rendered natively by expo-image without fetching external images
 *
 * Generate custom blurhashes at: https://blurha.sh/
 */
export const PlaceholderBlurhash = {
    // Neutral dark (matches app's dark theme - cardDark #342418)
    dark: 'L03+}KWB00of00of00of00WB00WB',

    // Warm brown (matches app's backgroundDark #221710)
    warmBrown: 'L02rs}t700t700t700t700t700',

    // Neutral gray
    gray: 'L6PZfSi_.AyE_3t7t7R**0teleP',

    // Food-themed warm placeholder
    food: 'LBF~xq9F00Rj~qM{IUt79Fxu-;M{',

    // Avatar placeholder (circular friendly)
    avatar: 'L9AS*J~q00%M00M{~q%M00%M00%M',

    // Default - warm dark matching app theme
    default: 'L03+}KWB00of00of00of00WB00WB',
} as const;

/**
 * Placeholder Image URLs
 * Fallback images used when actual images fail to load (not for preload)
 * These are only shown on error, not during loading
 */
export const PlaceholderImages = {
    // Product images (fallback only)
    product: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    productThumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200',
    productLarge: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',

    // Vendor images
    vendorLogo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Vendor&size=40',
    vendorCover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    vendorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vendor',

    // User images
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
    userAvatarDefault: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200',

    // Generic placeholders (fallback only - blurhash used for preload)
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200',
    image100: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100',
    image200: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200',
    image400: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
} as const;

/**
 * Image Size Presets
 * Standard image sizes used throughout the app
 */
export const ImageSizes = {
    // Thumbnail sizes
    thumbnail: {
        small: 100,
        medium: 200,
        large: 400,
        xlarge: 600,
        xxlarge: 800,
    },
    // Avatar sizes
    avatar: {
        tiny: 24,
        small: 40,
        medium: 48,
        large: 80,
        xlarge: 100,
        xxlarge: 200,
    },
    // Cover image sizes
    cover: {
        small: 400,
        medium: 600,
        large: 800,
    },
    // Product image sizes
    product: {
        thumbnail: 100,
        small: 200,
        medium: 400,
        large: 600,
        xlarge: 800,
    },
} as const;

/**
 * Image Service URL Builders
 * Helper functions to generate image URLs from services
 */
export const ImageUrlBuilders = {
    /**
     * Generate Dicebear avatar URL
     * @param seed - Seed for avatar generation (user name, ID, etc.)
     * @param size - Optional size parameter
     */
    dicebearAvatar: (seed: string, size?: number): string => {
        const sizeParam = size ? `&size=${size}` : '';
        return `${ApiEndpoints.dicebear}?seed=${encodeURIComponent(seed)}${sizeParam}`;
    },

    /**
     * Generate QR code URL
     * @param data - Data to encode in QR code
     * @param size - Size of QR code (default: 160x160)
     */
    qrCode: (data: string, size: number = 160): string => {
        return `${ApiEndpoints.qrCode}?size=${size}x${size}&data=${encodeURIComponent(data)}&bgcolor=FFFFFF&color=000000`;
    },

    /**
     * Generate Unsplash image URL with size
     * @param photoId - Unsplash photo ID or seed
     * @param width - Image width
     */
    unsplash: (photoId: string, width: number = 400): string => {
        return `https://images.unsplash.com/photo-${photoId}?w=${width}`;
    },

    /**
     * Generate vendor cover image URL using Unsplash
     * @param vendorId - Vendor ID for deterministic image
     * @param vendorName - Vendor name (optional)
     * @param width - Image width (default: 800)
     * @param theme - Image theme (default: 'foodMarket')
     */
    vendorCover: (
        vendorId: string,
        vendorName?: string,
        width: number = 800,
        theme: 'foodMarket' | 'storefront' | 'africanMarket' = 'foodMarket'
    ): string => {
        // Lazy import to avoid circular dependencies
        const { generateVendorCoverImage } = require('../lib/vendorImageUtils');
        return generateVendorCoverImage(vendorId, vendorName, width, theme);
    },

    /**
     * Generate vendor logo URL using DiceBear
     * @param vendorId - Vendor ID for deterministic logo
     * @param vendorName - Vendor name (optional)
     * @param style - DiceBear style (default: 'identicon')
     * @param size - Logo size (default: 200)
     */
    vendorLogo: (
        vendorId: string,
        vendorName?: string,
        style: 'identicon' | 'avataaars' | 'bottts' | 'initials' = 'identicon',
        size: number = 200
    ): string => {
        // Lazy import to avoid circular dependencies
        const { generateVendorLogo } = require('../lib/vendorImageUtils');
        return generateVendorLogo(vendorId, vendorName, style, size);
    },
} as const;

/**
 * Common Image URLs
 * Frequently used image URLs that can be reused
 */
export const CommonImages = {
    // African regions
    westAfrica: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=600',
    eastAfrica: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=600',
    northAfrica: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=600',
    southernAfrica: 'https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=600',
    centralAfrica: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600',

    // Common product images
    jollofRice: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200',
    palmOil: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
    garri: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200',
    sheaButter: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200',
    suyaSpice: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=200',

    // User avatars
    defaultUser: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200',
    driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
} as const;

export default {
    placeholders: PlaceholderImages,
    sizes: ImageSizes,
    builders: ImageUrlBuilders,
    common: CommonImages,
};
