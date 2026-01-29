import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "../../packages/ui-web/src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // ============================================
                // ZORA DESIGN SYSTEM - Color Tokens
                // ============================================

                // Primary - Zora Red (#CC0000)
                primary: {
                    DEFAULT: "#CC0000",
                    dark: "#A30000",
                    light: "#FF3333",
                    50: "#FEF2F2",
                    100: "#FEE2E2",
                    500: "#CC0000",
                    600: "#B91C1C",
                    700: "#991B1B",
                },

                // Secondary - Zora Yellow (#FFCC00)
                secondary: {
                    DEFAULT: "#FFCC00",
                    dark: "#E6B800",
                    light: "#FFD633",
                    50: "#FFFBEB",
                    100: "#FEF3C7",
                    500: "#FFCC00",
                },

                // Background Colors
                background: {
                    dark: "#221710",
                    light: "#F8F7F5",
                },
                surface: {
                    DEFAULT: "#342418",
                    light: "#FFFFFF",
                },

                // Text Colors
                text: {
                    primary: "#FFFFFF",
                    secondary: "#CBA990",
                    muted: "#CBA990",
                    dark: "#221710",
                },

                // Status Colors
                success: {
                    DEFAULT: "#22C55E",
                    50: "#F0FDF4",
                    500: "#22C55E",
                    600: "#16A34A",
                },
                warning: {
                    DEFAULT: "#FFCC00",
                    50: "#FFFBEB",
                    500: "#FFCC00",
                },
                error: {
                    DEFAULT: "#CC0000",
                    50: "#FEF2F2",
                    500: "#CC0000",
                },
                info: {
                    DEFAULT: "#3B82F6",
                    50: "#EFF6FF",
                    500: "#3B82F6",
                },
            },

            // ============================================
            // TYPOGRAPHY - Font Families (Design System)
            // ============================================
            fontFamily: {
                display: ["Montserrat", "sans-serif"],
                body: ["Poppins", "sans-serif"],
                sans: ["Poppins", "sans-serif"],
            },

            // ============================================
            // SPACING - Design System Scale
            // ============================================
            spacing: {
                'xs': '4px',
                'sm': '8px',
                'md': '12px',
                'base': '16px',
                'lg': '20px',
                'xl': '24px',
                '2xl': '32px',
                '3xl': '40px',
            },

            // ============================================
            // BORDER RADIUS - Design System Scale
            // ============================================
            borderRadius: {
                'sm': '4px',
                'md': '8px',
                'lg': '12px',
                'xl': '16px',
                '2xl': '20px',
                'full': '9999px',
            },

            // ============================================
            // SHADOWS - Design System Scale
            // ============================================
            boxShadow: {
                'sm': '0 1px 2px rgba(34, 23, 16, 0.05)',
                'md': '0 2px 4px rgba(34, 23, 16, 0.08)',
                'lg': '0 4px 8px rgba(34, 23, 16, 0.10)',
                'xl': '0 8px 16px rgba(34, 23, 16, 0.12)',
                'card': '0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 24px rgba(0, 0, 0, 0.06)',
                'glow': '0 0 20px rgba(204, 0, 0, 0.3)',
            },

            // ============================================
            // ANIMATIONS
            // ============================================
            animation: {
                "fade-in": "fadeIn 0.3s ease-out",
                "slide-up": "slideUp 0.3s ease-out",
                "shimmer": "shimmer 2s infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                shimmer: {
                    "100%": { transform: "translateX(100%)" },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
