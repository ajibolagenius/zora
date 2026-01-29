import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Zora Admin Dashboard",
    description: "Manage the Zora African Market platform",
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
