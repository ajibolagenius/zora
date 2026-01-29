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
                primary: {
                    DEFAULT: "#CC0000",
                    dark: "#A30000",
                    50: "#FEF2F2",
                    100: "#FEE2E2",
                    500: "#CC0000",
                    600: "#B91C1C",
                    700: "#991B1B",
                },
                secondary: {
                    DEFAULT: "#FFCC00",
                    dark: "#E6B800",
                },
                background: {
                    DEFAULT: "#F8F7F5",
                },
                surface: {
                    DEFAULT: "#FFFFFF",
                },
                sidebar: {
                    DEFAULT: "#221710",
                    foreground: "#FFFFFF",
                    muted: "#CBA990",
                },
            },
            fontFamily: {
                display: ["Montserrat", "sans-serif"],
                body: ["Poppins", "sans-serif"],
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
