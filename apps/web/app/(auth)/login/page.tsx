"use client";

import Link from "next/link";
import { Store, Shield, Smartphone, ArrowRight, Home, ArrowUpRight } from "lucide-react";

export default function LoginGuidePage() {
    const vendorUrl = process.env.NEXT_PUBLIC_VENDOR_URL || "http://localhost:3001";
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3002";

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="container mx-auto max-w-5xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold font-display text-primary">ZORA</Link>
                    <h1 className="text-2xl md:text-3xl font-bold mt-6 text-gray-900">Where would you like to go?</h1>
                    <p className="text-gray-500 mt-2">Choose the portal that matches your role</p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-12 gap-3 md:gap-4">
                    {/* Vendor Portal Card */}
                    <a
                        href={`${vendorUrl}/login`}
                        className="col-span-12 md:col-span-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 md:p-6 text-white hover:scale-[1.02] transition-transform cursor-pointer group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                <Store className="w-6 h-6" />
                            </div>
                            <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Vendor Portal</h2>
                        <p className="text-white/80 text-sm">
                            Manage your shop, products, orders, and earnings from your vendor dashboard.
                        </p>
                    </a>

                    {/* Admin Portal Card */}
                    <a
                        href={`${adminUrl}/login`}
                        className="col-span-12 md:col-span-6 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl p-5 md:p-6 text-white hover:scale-[1.02] transition-transform cursor-pointer group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6" />
                            </div>
                            <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Admin Portal</h2>
                        <p className="text-white/80 text-sm">
                            Access the admin dashboard to manage the platform, vendors, and customers.
                        </p>
                    </a>

                    {/* Mobile App Card */}
                    <div className="col-span-12 bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 md:p-6 text-white">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold mb-1">Shop with Zora</h2>
                                    <p className="text-white/80 text-sm">
                                        Download our mobile app to browse products, place orders, and track deliveries.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <a href="#" className="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                    </svg>
                                    App Store
                                </a>
                                <a href="#" className="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                                    </svg>
                                    Google Play
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Become a Vendor Card */}
                    <div className="col-span-12 md:col-span-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Want to sell on Zora?</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Join our growing community of African food vendors and reach thousands of customers.
                        </p>
                        <Link href="/vendor-onboarding" className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors">
                            Apply to become a vendor <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Back to Home Card */}
                    <div className="col-span-12 md:col-span-6 bg-white border border-gray-200 rounded-2xl p-5 md:p-6 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Explore Zora</h3>
                            <p className="text-sm text-gray-500">Learn more about our platform and features.</p>
                        </div>
                        <Link href="/" className="flex items-center gap-2 text-primary font-medium text-sm hover:underline">
                            <Home className="w-4 h-4" /> Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
