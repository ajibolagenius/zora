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
                // Primary brand colors
                primary: {
                    DEFAULT: "#FF6B35",
                    dark: "#E55A2B",
                    light: "#FF8C5A",
                },
                // Secondary colors
                secondary: {
                    DEFAULT: "#FFC857",
                    dark: "#E6B34E",
                    light: "#FFD685",
                },
                // Accent colors
                accent: {
                    DEFAULT: "#2EC4B6",
                    dark: "#249890",
                    light: "#5DD9CD",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
            },
            borderRadius: {
                "2xl": "1rem",
                "3xl": "1.5rem",
            },
            boxShadow: {
                glow: "0 0 20px rgba(255, 107, 53, 0.3)",
                card: "0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 24px rgba(0, 0, 0, 0.06)",
            },
            animation: {
                "fade-in": "fadeIn 0.3s ease-out",
                "slide-up": "slideUp 0.3s ease-out",
                shimmer: "shimmer 2s infinite",
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
