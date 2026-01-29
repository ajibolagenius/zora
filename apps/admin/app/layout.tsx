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
            <body className="antialiased">
                {/* Skip to content link for keyboard navigation */}
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    Skip to main content
                </a>
                {children}
            </body>
        </html>
    );
}
