// Zora African Market Design Tokens - Spacing

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

// Shadows
export const Shadows = {
    sm: {
        shadowColor: '#221710',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#221710',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    lg: {
        shadowColor: '#221710',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 4,
    },
    xl: {
        shadowColor: '#221710',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
    },
};

// Icon Sizes
export const IconSize = {
    tiny: 16,
    small: 20,
    medium: 24,
    large: 28,
    xl: 32,
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
export const Dimensions = {
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
    },
    // Card dimensions
    card: {
        minHeight: 80,
        imageHeight: 200,
        productImage: 260,
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

// Export all spacing-related constants
export { Dimensions, BorderWidths, Gaps };

export default Spacing;
