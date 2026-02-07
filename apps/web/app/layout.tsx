import type { Metadata } from "next";
import "./globals.css";
import { RealtimeProvider } from "@/providers/RealtimeProvider";

export const metadata: Metadata = {
    title: "Zora African Market - Authentic African Products Delivered",
    description:
        "Connect with authentic African groceries and products from trusted vendors. Shop spices, grains, vegetables, and more from the comfort of your home.",
    keywords: [
        "African groceries",
        "African food",
        "diaspora",
        "African products",
        "UK delivery",
    ],
    authors: [{ name: "Zora African Market" }],
    openGraph: {
        title: "Zora African Market",
        description: "Authentic African Products, Delivered to Your Door",
        url: "https://zoraapp.co.uk",
        siteName: "Zora African Market",
        locale: "en_GB",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Zora African Market",
        description: "Authentic African Products, Delivered to Your Door",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <RealtimeProvider>
                    {/* Skip to content link for keyboard navigation */}
                    <a
                        href="#main-content"
                        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        Skip to main content
                    </a>
                    {children}
                </RealtimeProvider>
            </body>
        </html>
    );
}
