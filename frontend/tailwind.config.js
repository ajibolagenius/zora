/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Zora Primary Colors
        'zora-red': {
          DEFAULT: '#CC0000',
          dark: '#A30000',
          light: 'rgba(204, 0, 0, 0.1)',
        },
        'zora-yellow': {
          DEFAULT: '#FFCC00',
          dark: '#E6B800',
          light: 'rgba(255, 204, 0, 0.1)',
        },
        // Background Colors
        'bg-dark': '#221710',
        'card-dark': '#342418',
        'bg-light': '#F8F7F5',
        // Text Colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#CBA990',
        'text-muted': '#CBA990',
        'text-light': '#505050',
        // Status Colors
        success: '#22C55E',
        warning: '#FFCC00',
        error: '#CC0000',
        info: '#3B82F6',
        // Tab Bar
        'tab-bar': 'rgba(31, 22, 16, 0.95)',
        'tab-active': '#CC0000',
        'tab-inactive': '#505050',
        // Rating
        rating: '#FFCC00',
      },
      fontFamily: {
        'display': ['Montserrat-Bold', 'sans-serif'],
        'display-medium': ['Montserrat-SemiBold', 'sans-serif'],
        'body': ['OpenSans-Regular', 'sans-serif'],
        'body-medium': ['OpenSans-SemiBold', 'sans-serif'],
      },
      fontSize: {
        'display': ['56px', { lineHeight: '62px', fontWeight: '800' }],
        'h1': ['28px', { lineHeight: '34px', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '31px', fontWeight: '700' }],
        'h3': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'h4': ['18px', { lineHeight: '25px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '29px', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '26px', fontWeight: '400' }],
        'sm': ['14px', { lineHeight: '21px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '17px', fontWeight: '400' }],
        'tiny': ['10px', { lineHeight: '13px', fontWeight: '600' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'base': '16px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '40px',
        '4xl': '48px',
        '5xl': '64px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(34, 23, 16, 0.05)',
        'DEFAULT': '0 2px 4px rgba(34, 23, 16, 0.08)',
        'md': '0 4px 8px rgba(34, 23, 16, 0.10)',
        'lg': '0 8px 16px rgba(34, 23, 16, 0.12)',
        'xl': '0 16px 32px rgba(34, 23, 16, 0.15)',
      },
    },
  },
  plugins: [],
};
