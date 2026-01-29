// Zora African Market Design Tokens - Colors
// Platform-agnostic color definitions

export const colors = {
    // Primary Colors
    primary: {
        DEFAULT: '#CC0000',      // Zora Red - buttons, CTAs, active states
        dark: '#A30000',         // Hover/pressed state
        50: '#FEF2F2',
        100: '#FEE2E2',
        200: '#FECACA',
        300: '#FCA5A5',
        400: '#F87171',
        500: '#CC0000',
        600: '#B91C1C',
        700: '#991B1B',
        800: '#7F1D1D',
        900: '#450A0A',
    },

    // Secondary Colors (Zora Yellow)
    secondary: {
        DEFAULT: '#FFCC00',      // Zora Yellow - prices, accents, ratings
        dark: '#E6B800',         // Hover/pressed state
        50: '#FFFBEB',
        100: '#FEF3C7',
        200: '#FDE68A',
        300: '#FCD34D',
        400: '#FBBF24',
        500: '#FFCC00',
        600: '#D97706',
        700: '#B45309',
        800: '#92400E',
        900: '#451A03',
    },

    // Background Colors
    background: {
        dark: '#221710',         // Dark mode background (warm brown)
        light: '#F8F7F5',        // Light mode background
    },

    // Surface/Card Colors
    surface: {
        dark: '#342418',         // Dark mode cards/surfaces
        light: '#FFFFFF',        // Light mode cards
    },

    // Text Colors
    text: {
        primary: '#FFFFFF',      // Dark mode text
        secondary: '#CBA990',    // Secondary/placeholder text
        light: '#505050',        // Light mode text
        muted: '#8B7355',        // Muted text
    },

    // Status Colors
    status: {
        success: '#22C55E',
        warning: '#FFCC00',
        error: '#CC0000',
        info: '#3B82F6',
    },

    // Border Colors
    border: {
        dark: 'rgba(255, 255, 255, 0.05)',
        light: 'rgba(0, 0, 0, 0.05)',
        outline: 'rgba(255, 255, 255, 0.15)',
    },

    // Overlay
    overlay: {
        dark: 'rgba(34, 23, 16, 0.8)',
        light: 'rgba(255, 255, 255, 0.95)',
    },

    // Tab Bar
    tabBar: {
        background: 'rgba(31, 22, 16, 0.95)',
        active: '#CC0000',
        inactive: '#505050',
    },

    // Rating
    rating: '#FFCC00',

    // Badges
    badge: {
        hot: '#CC0000',
        popular: '#CC0000',
        new: '#22C55E',
        topRated: '#FFCC00',
        organic: '#22C55E',
        ecoFriendly: '#14B8A6',
    },

    // Opacity variants
    white: {
        3: 'rgba(255, 255, 255, 0.03)',
        5: 'rgba(255, 255, 255, 0.05)',
        8: 'rgba(255, 255, 255, 0.08)',
        10: 'rgba(255, 255, 255, 0.1)',
        15: 'rgba(255, 255, 255, 0.15)',
        20: 'rgba(255, 255, 255, 0.2)',
    },

    black: {
        30: 'rgba(0, 0, 0, 0.3)',
        35: 'rgba(0, 0, 0, 0.35)',
        40: 'rgba(0, 0, 0, 0.4)',
        50: 'rgba(0, 0, 0, 0.5)',
        60: 'rgba(0, 0, 0, 0.6)',
        80: 'rgba(0, 0, 0, 0.8)',
    },
} as const;

export type Colors = typeof colors;
export default colors;
