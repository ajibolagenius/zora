// Zora African Market Design Tokens - Spacing
import { Platform } from 'react-native';

// Spacing Scale
export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 64,
};

// Border Radius
export const BorderRadius = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
};

// Shadows - Cross-platform compatible
// Uses boxShadow for web (suppresses deprecation warning) and native shadow props for iOS/Android
export const Shadows = {
    // Extra small - very subtle shadow
    xs: Platform.select({
        web: {
            boxShadow: '0px 1px 1px rgba(34, 23, 16, 0.03)',
        },
        default: {
            shadowColor: '#221710',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.03,
            shadowRadius: 1,
            elevation: 1,
        },
    }),
    sm: Platform.select({
        web: {
            boxShadow: '0px 1px 2px rgba(34, 23, 16, 0.05)',
        },
        default: {
            shadowColor: '#221710',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
    }),
    md: Platform.select({
        web: {
            boxShadow: '0px 2px 4px rgba(34, 23, 16, 0.08)',
        },
        default: {
            shadowColor: '#221710',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
        },
    }),
    lg: Platform.select({
        web: {
            boxShadow: '0px 4px 8px rgba(34, 23, 16, 0.10)',
        },
        default: {
            shadowColor: '#221710',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.10,
            shadowRadius: 8,
            elevation: 4,
        },
    }),
    xl: Platform.select({
        web: {
            boxShadow: '0px 8px 16px rgba(34, 23, 16, 0.12)',
        },
        default: {
            shadowColor: '#221710',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 8,
        },
    }),
    // Card shadow - alias for md (commonly used for cards)
    card: Platform.select({
        web: {
            boxShadow: '0px 2px 4px rgba(34, 23, 16, 0.08)',
        },
        default: {
            shadowColor: '#221710',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
        },
    }),
    // Bottom sheet / modal shadow
    modal: Platform.select({
        web: {
            boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.15)',
        },
        default: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 10,
        },
    }),
    // Glow effect for primary color (buttons, CTAs)
    glowPrimary: Platform.select({
        web: {
            boxShadow: '0px 4px 12px rgba(204, 0, 0, 0.3)',
        },
        default: {
            shadowColor: '#CC0000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
        },
    }),
    // Glow effect for secondary color (price highlights)
    glowSecondary: Platform.select({
        web: {
            boxShadow: '0px 4px 12px rgba(255, 204, 0, 0.3)',
        },
        default: {
            shadowColor: '#FFCC00',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
        },
    }),
    // None - explicit no shadow
    none: Platform.select({
        web: {
            boxShadow: 'none',
        },
        default: {
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
        },
    }),
};

// Icon Sizes
export const IconSize = {
    xs: 12,
    tiny: 16,
    small: 20,
    medium: 24,
    large: 28,
    xl: 32,
    xxl: 40,
    // Input icon sizes (commonly used)
    input: 22,
    inputSmall: 18,
};

// Touch Targets
export const TouchTarget = {
    min: 44, // iOS minimum
    android: 48, // Android minimum
};

// Component Heights
export const Heights = {
    button: 48,
    buttonLarge: 56,
    buttonSmall: 36,
    input: 48,
    inputSmall: 40,
    inputLarge: 52,
    inputXLarge: 56,
    tabBar: 70,
    header: 56,
    card: 'auto',
    section: 100,
    sectionLarge: 120,
    sectionXLarge: 140,
    sectionXXLarge: 200,
};

// Common Component Dimensions
export const ComponentDimensions = {
    // Avatar sizes (complementing AvatarStyles)
    avatar: {
        tiny: 24,
        small: 40,
        medium: 48,
        large: 80,
        xlarge: 100,
        xxlarge: 200,
    },
    // Icon button sizes
    iconButton: {
        small: 32,
        medium: 44,
        large: 48,
    },
    // Status indicator sizes
    statusIndicator: {
        small: 6,
        medium: 8,
        large: 10,
        xlarge: 12,
    },
    // Badge dimensions
    badge: {
        height: 20,
        minWidth: 24,
        dotSize: 8,
    },
    // Card dimensions
    card: {
        minHeight: 80,
        imageHeight: 200,
        productImage: 260,
        // Product card specific
        productCardHeight: 280,
        productCardImageHeight: 130,
        // Vendor card specific
        vendorCardHeight: 140,
        vendorCardImageHeight: 80,
        // Featured/banner cards
        featuredHeight: 180,
        bannerHeight: 160,
    },
    // Quantity selector
    quantitySelector: {
        buttonSize: 32,
        buttonSizeSmall: 28,
        minWidth: 100,
    },
    // Rating display
    rating: {
        starSize: 14,
        starSizeSmall: 12,
        starSizeLarge: 18,
    },
    // Price display
    price: {
        largeFontSize: 30,
        mediumFontSize: 24,
        smallFontSize: 16,
    },
} as const;

// Border Widths
export const BorderWidths = {
    none: 0,
    hairline: 0.5,
    thin: 1,
    medium: 1.5,
    thick: 2,
    extraThick: 3,
    xl: 4,
} as const;

// Common Gaps (for flexbox gap property)
export const Gaps = {
    none: 0,
    xs: 2,
    sm: 4,
    md: 6,
    base: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    '4xl': 32,
} as const;

export default Spacing;
