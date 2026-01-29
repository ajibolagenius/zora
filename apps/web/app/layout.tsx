import type { Metadata } from "next";
import "./globals.css";

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
            <body className="antialiased">{children}</body>
        </html>
    );
}
