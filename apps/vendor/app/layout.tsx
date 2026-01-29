import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Zora Vendor Portal",
    description: "Manage your Zora store - products, orders, and analytics",
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
