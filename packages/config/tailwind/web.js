/**
 * Shared Tailwind CSS configuration for Zora web apps
 * Includes design system colors, typography, and custom utilities
 */

const { colors } = require('@zora/design-tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Brand colors
                primary: {
                    DEFAULT: colors.primary[500],
                    50: colors.primary[50],
                    100: colors.primary[100],
                    200: colors.primary[200],
                    300: colors.primary[300],
                    400: colors.primary[400],
                    500: colors.primary[500],
                    600: colors.primary[600],
                    700: colors.primary[700],
                    800: colors.primary[800],
                    900: colors.primary[900],
                },
                secondary: {
                    DEFAULT: colors.secondary[500],
                    50: colors.secondary[50],
                    100: colors.secondary[100],
                    200: colors.secondary[200],
                    300: colors.secondary[300],
                    400: colors.secondary[400],
                    500: colors.secondary[500],
                    600: colors.secondary[600],
                    700: colors.secondary[700],
                    800: colors.secondary[800],
                    900: colors.secondary[900],
                },
                // Dark theme backgrounds
                dark: {
                    DEFAULT: colors.dark.background,
                    background: colors.dark.background,
                    card: colors.dark.card,
                    border: colors.dark.border,
                    surface: colors.dark.surface,
                },
                // Status colors
                success: colors.status.success,
                warning: colors.status.warning,
                error: colors.status.error,
                info: colors.status.info,
            },
            fontFamily: {
                heading: ['Montserrat', 'sans-serif'],
                body: ['Open Sans', 'sans-serif'],
            },
            fontSize: {
                'display-1': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
                'display-2': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
                'heading-1': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],
                'heading-2': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
                'heading-3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
                'heading-4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
            },
            borderRadius: {
                'zora': '12px',
                'zora-lg': '16px',
                'zora-xl': '24px',
            },
            boxShadow: {
                'zora': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'zora-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'zora-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [
        require('tailwindcss-animate'),
    ],
};
