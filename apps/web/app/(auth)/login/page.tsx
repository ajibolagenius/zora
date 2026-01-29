"use client";

import Link from "next/link";
import { Store, Shield, Smartphone, ArrowRight, Home } from "lucide-react";

export default function LoginGuidePage() {
    // URLs for different portals
    const vendorUrl = process.env.NEXT_PUBLIC_VENDOR_URL || "http://localhost:3001";
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3002";

    const portals = [
        {
            id: "vendor",
            title: "Vendor Portal",
            description: "Manage your shop, products, orders, and earnings from your vendor dashboard.",
            icon: Store,
            href: `${vendorUrl}/login`,
            color: "from-amber-500 to-orange-600",
            bgColor: "bg-amber-50",
            iconColor: "text-amber-600",
            external: true,
        },
        {
            id: "admin",
            title: "Admin Portal",
            description: "Access the admin dashboard to manage the platform, vendors, and customers.",
            icon: Shield,
            href: `${adminUrl}/login`,
            color: "from-slate-600 to-slate-800",
            bgColor: "bg-slate-50",
            iconColor: "text-slate-600",
            external: true,
        },
        {
            id: "mobile",
            title: "Shop with Zora",
            description: "Download our mobile app to browse products, place orders, and track deliveries.",
            icon: Smartphone,
            href: "#download-app",
            color: "from-primary to-primary-dark",
            bgColor: "bg-primary/5",
            iconColor: "text-primary",
            external: false,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-surface-light to-white py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link href="/" className="text-4xl font-bold font-display text-primary">
                        ZORA
                    </Link>
                    <h1 className="text-3xl font-bold mt-8 text-gray-900">
                        Where would you like to go?
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg">
                        Choose the portal that matches your role
                    </p>
                </div>

                {/* Portal Cards */}
                <div className="space-y-4">
                    {portals.map((portal) => {
                        const Icon = portal.icon;
                        const isExternal = portal.external;

                        const CardContent = (
                            <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer">
                                <div className="flex items-start gap-5">
                                    <div className={`w-14 h-14 rounded-xl ${portal.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-7 h-7 ${portal.iconColor}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                                {portal.title}
                                            </h2>
                                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <p className="text-muted-foreground mt-1">
                                            {portal.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );

                        if (isExternal) {
                            return (
                                <a
                                    key={portal.id}
                                    href={portal.href}
                                    rel="noopener noreferrer"
                                >
                                    {CardContent}
                                </a>
                            );
                        }

                        return (
                            <div key={portal.id} onClick={() => {
                                // Scroll to download section or show app store links
                                const element = document.getElementById('download-section');
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}>
                                {CardContent}
                            </div>
                        );
                    })}
                </div>

                {/* Download App Section */}
                <div id="download-section" className="mt-12 bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-white text-center">
                    <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-90" />
                    <h3 className="text-2xl font-bold mb-2">Get the Zora App</h3>
                    <p className="text-white/80 mb-6 max-w-md mx-auto">
                        Shop authentic African groceries, track your orders in real-time, and enjoy fast delivery right to your door.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href="#"
                            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                            App Store
                        </a>
                        <a
                            href="#"
                            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                            </svg>
                            Google Play
                        </a>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>

                {/* Become a Vendor CTA */}
                <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                    <h4 className="font-semibold text-gray-900">Want to sell on Zora?</h4>
                    <p className="text-muted-foreground mt-1 mb-4">
                        Join our growing community of African food vendors
                    </p>
                    <Link
                        href="/vendor-onboarding"
                        className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-amber-600 transition-colors"
                    >
                        Apply to become a vendor
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
