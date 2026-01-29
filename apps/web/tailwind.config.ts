import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // ============================================
                // ZORA DESIGN SYSTEM - Color Tokens
                // ============================================

                // Primary Palette
                primary: {
                    DEFAULT: "#CC0000",  // Buttons, CTAs, active states, links
                    dark: "#A30000",     // Hover/pressed states
                    50: "#FEF2F2",
                    100: "#FEE2E2",
                    200: "#FECACA",
                    300: "#FCA5A5",
                    400: "#F87171",
                    500: "#CC0000",
                    600: "#B91C1C",
                    700: "#991B1B",
                    800: "#7F1D1D",
                    900: "#450A0A",
                },
                secondary: {
                    DEFAULT: "#FFCC00",  // Prices, ratings, accents, highlights
                    dark: "#E6B800",     // Hover/pressed states
                    50: "#FFFBEB",
                    100: "#FEF3C7",
                    200: "#FDE68A",
                    300: "#FCD34D",
                    400: "#FBBF24",
                    500: "#FFCC00",
                    600: "#D97706",
                    700: "#B45309",
                    800: "#92400E",
                    900: "#451A03",
                },

                // Background Colors
                background: {
                    DEFAULT: "hsl(var(--background))",
                    dark: "#221710",     // Main app background (dark mode)
                    light: "#F8F7F5",    // Light mode background
                },
                surface: {
                    DEFAULT: "#342418",  // Cards, elevated surfaces (dark)
                    light: "#FFFFFF",    // Cards (light mode)
                },
                card: {
                    DEFAULT: "#342418",  // Card background (dark)
                    light: "#FFFFFF",    // Card background (light)
                },

                // Text Colors
                text: {
                    primary: "#FFFFFF",      // Primary text, headings (dark mode)
                    secondary: "#CBA990",    // Labels, placeholders
                    muted: "#CBA990",        // Captions, hints, disabled
                    dark: "#221710",         // Primary text (light mode)
                },

                // Status Colors
                success: {
                    DEFAULT: "#22C55E",  // Success states, organic badges
                    50: "#F0FDF4",
                    100: "#DCFCE7",
                    500: "#22C55E",
                    600: "#16A34A",
                },
                warning: {
                    DEFAULT: "#FFCC00",  // Warning states (same as secondary)
                },
                error: {
                    DEFAULT: "#CC0000",  // Error states, destructive actions
                },
                info: {
                    DEFAULT: "#3B82F6",  // Informational states
                    50: "#EFF6FF",
                    500: "#3B82F6",
                },

                // Special Colors
                organic: "#22C55E",      // Organic badge
                topRated: "#FFCC00",     // Top rated badge
                ecoFriendly: "#14B8A6",  // Eco-friendly badge
                verified: "#3B82F6",     // Verified badge

                // Muted colors (for compatibility)
                muted: {
                    DEFAULT: "#CBA990",
                    foreground: "#8B7355",
                },

                // HSL CSS Variables (for shadcn/ui compatibility)
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                foreground: "hsl(var(--foreground))",
                destructive: {
                    DEFAULT: "#CC0000",
                    foreground: "#FFFFFF",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
            },

            // ============================================
            // TYPOGRAPHY - Font Families
            // ============================================
            fontFamily: {
                display: ["Montserrat", "sans-serif"],  // Headlines & Display
                body: ["Poppins", "sans-serif"],        // Body & UI
                sans: ["Poppins", "sans-serif"],        // Default sans
            },

            // ============================================
            // TYPOGRAPHY - Font Sizes (Design System Scale)
            // ============================================
            fontSize: {
                'display': ['56px', { lineHeight: '1.1', letterSpacing: '-0.5px' }],  // Splash, hero
                'h1': ['28px', { lineHeight: '1.2', letterSpacing: '0px' }],          // Screen titles
                'h2': ['24px', { lineHeight: '1.3', letterSpacing: '0px' }],          // Section headings
                'h3': ['20px', { lineHeight: '1.4', letterSpacing: '0px' }],          // Card titles
                'h4': ['18px', { lineHeight: '1.4', letterSpacing: '0px' }],          // Subsection labels
                'body-lg': ['18px', { lineHeight: '1.6', letterSpacing: '0px' }],     // Lead paragraphs
                'body': ['16px', { lineHeight: '1.6', letterSpacing: '0px' }],        // Standard content
                'small': ['14px', { lineHeight: '1.5', letterSpacing: '0px' }],       // Secondary text
                'caption': ['12px', { lineHeight: '1.4', letterSpacing: '0px' }],     // Captions, metadata
                'tiny': ['10px', { lineHeight: '1.4', letterSpacing: '1.5px' }],      // Badges, overlines
            },

            // ============================================
            // SPACING - Design System Scale
            // ============================================
            spacing: {
                'xs': '4px',   // Tight gaps, badge padding
                'sm': '8px',   // Icon gaps, inline spacing
                'md': '12px',  // Card padding, section gaps
                'base': '16px', // Standard padding, margins
                'lg': '20px',  // Section spacing
                'xl': '24px',  // Large gaps, screen padding
                '2xl': '32px', // Major section separators
                '3xl': '40px', // Hero spacing
            },

            // ============================================
            // BORDER RADIUS - Design System Scale
            // ============================================
            borderRadius: {
                'none': '0',
                'sm': '4px',
                'md': '8px',
                'lg': '12px',      // Cards, buttons
                'xl': '16px',      // Large cards
                '2xl': '20px',     // Pills, full rounded
                'full': '9999px',  // Circular
            },

            // ============================================
            // SHADOWS - Design System Scale
            // ============================================
            boxShadow: {
                'sm': '0 1px 2px rgba(34, 23, 16, 0.05)',      // Subtle cards
                'md': '0 2px 4px rgba(34, 23, 16, 0.08)',      // Standard cards
                'lg': '0 4px 8px rgba(34, 23, 16, 0.10)',      // Floating elements
                'xl': '0 8px 16px rgba(34, 23, 16, 0.12)',     // Modals, bottom sheets
                '2xl': '0 16px 32px rgba(34, 23, 16, 0.15)',   // Large floating
            },

            // ============================================
            // TRANSITIONS - Design System Timing
            // ============================================
            transitionDuration: {
                'micro': '150ms',    // Button press, icon state
                'standard': '300ms', // Modal open, element appear
                'complex': '450ms',  // Screen transitions
                'emphasis': '600ms', // Splash animations
            },

            // ============================================
            // ANIMATIONS
            // ============================================
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    from: { opacity: "0", transform: "translateY(10px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "fade-out": {
                    from: { opacity: "1" },
                    to: { opacity: "0" },
                },
                "scale-in": {
                    from: { transform: "scale(0.95)", opacity: "0" },
                    to: { transform: "scale(1)", opacity: "1" },
                },
                "shimmer": {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-out",
                "fade-out": "fade-out 0.2s ease-in",
                "scale-in": "scale-in 0.3s ease-out",
                "shimmer": "shimmer 1.5s infinite linear",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
