// Zora African Market Design Tokens - Spacing
// Platform-agnostic spacing definitions

export const spacing = {
    0: 0,
    px: 1,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    28: 112,
    32: 128,
    36: 144,
    40: 160,
    44: 176,
    48: 192,
    52: 208,
    56: 224,
    60: 240,
    64: 256,
    72: 288,
    80: 320,
    96: 384,
} as const;

// Named spacing aliases for common use cases
export const namedSpacing = {
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
} as const;

export const borderRadius = {
    none: 0,
    sm: 4,
    DEFAULT: 6,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
} as const;

export const borderWidth = {
    none: 0,
    hairline: 0.5,
    thin: 1,
    medium: 1.5,
    thick: 2,
    extraThick: 3,
    xl: 4,
} as const;

// Component Heights
export const heights = {
    button: 48,
    buttonLarge: 56,
    buttonSmall: 36,
    input: 48,
    inputSmall: 40,
    inputLarge: 52,
    tabBar: 70,
    header: 56,
} as const;

// Icon Sizes
export const iconSize = {
    xs: 12,
    tiny: 16,
    small: 20,
    medium: 24,
    large: 28,
    xl: 32,
    xxl: 40,
} as const;

// Touch Targets
export const touchTarget = {
    min: 44,      // iOS minimum
    android: 48,  // Android minimum
} as const;

// Shadows (CSS box-shadow format for web)
export const shadows = {
    none: 'none',
    xs: '0px 1px 1px rgba(34, 23, 16, 0.03)',
    sm: '0px 1px 2px rgba(34, 23, 16, 0.05)',
    md: '0px 2px 4px rgba(34, 23, 16, 0.08)',
    lg: '0px 4px 8px rgba(34, 23, 16, 0.10)',
    xl: '0px 8px 16px rgba(34, 23, 16, 0.12)',
    card: '0px 2px 4px rgba(34, 23, 16, 0.08)',
    modal: '0px -4px 20px rgba(0, 0, 0, 0.15)',
    glowPrimary: '0px 4px 12px rgba(204, 0, 0, 0.3)',
    glowSecondary: '0px 4px 12px rgba(255, 204, 0, 0.3)',
} as const;

export type Spacing = typeof spacing;
export type NamedSpacing = typeof namedSpacing;
export type BorderRadius = typeof borderRadius;
export type BorderWidth = typeof borderWidth;
export type Heights = typeof heights;
export type IconSize = typeof iconSize;
export type Shadows = typeof shadows;

export default {
    spacing,
    namedSpacing,
    borderRadius,
    borderWidth,
    heights,
    iconSize,
    touchTarget,
    shadows,
};
