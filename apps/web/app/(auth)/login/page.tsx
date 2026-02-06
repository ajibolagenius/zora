"use client";

import Link from "next/link";
import { Storefront, Shield, DeviceMobile, ArrowRight, House, ArrowSquareOut } from "@phosphor-icons/react";
import { Footer } from "@/components/landing/Footer";

export default function LoginGuidePage() {

    return (
        <main className="min-h-screen bg-background-light">
            {/* Hero Section */}
            <section className="py-20 sm:py-24 px-4 bg-gradient-to-br from-primary via-primary-dark to-primary-darker relative overflow-hidden">
                {/* Background Blur Elements */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

                <div className="relative z-10 container mx-auto max-w-4xl">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white mb-8 leading-tight">
                            Choose Your Portal
                        </h1>
                        <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto mb-12">
                            Select the appropriate portal to access your Zora account
                        </p>
                    </div>
                </div>
            </section>

            {/* Portal Options */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Vendor Portal */}
                        <a
                            href={`${process.env.NEXT_PUBLIC_VENDOR_URL || "http://localhost:3001"}/login`}
                            className="group bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-white hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <Storefront size={32} weight="duotone" />
                                </div>
                                <ArrowRight size={24} weight="duotone" className="opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Vendor Portal</h2>
                            <p className="text-white/90 text-base leading-relaxed">
                                Manage your shop, products, and orders
                            </p>
                        </a>

                        {/* Admin Portal */}
                        <a
                            href={`${process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3002"}/login`}
                            className="group bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl p-8 text-white hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <Shield size={32} weight="duotone" />
                                </div>
                                <ArrowRight size={24} weight="duotone" className="opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Admin Portal</h2>
                            <p className="text-white/90 text-base leading-relaxed">
                                Manage platform, vendors, and customers
                            </p>
                        </a>
                    </div>
                </div>
            </section>

            {/* Mobile App Section */}
            <section className="py-12 sm:py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-6 sm:p-8 text-white">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex-1">
                                <h2 className="text-xl sm:text-2xl font-bold mb-3">Shop with Zora</h2>
                                <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-4">
                                    Download our mobile app to browse products, place orders, and track deliveries.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <a href="#" className="inline-flex items-center gap-2 bg-white text-gray-900 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                        </svg>
                                        App Store
                                    </a>
                                    <a href="#" className="inline-flex items-center gap-2 bg-white text-gray-900 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                                        </svg>
                                        Google Play
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Options */}
            <section className="py-12 sm:py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Become a Vendor Card */}
                        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center">
                                    <Storefront size={24} weight="duotone" className="text-white" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Want to sell on Zora?</h3>
                            </div>
                            <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                                Join our growing community of African food vendors and reach thousands of customers.
                            </p>
                            <Link href="/vendor-onboarding" className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:bg-amber-600 transition-colors">
                                Apply to become a vendor <ArrowSquareOut size={16} weight="duotone" />
                            </Link>
                        </div>

                        {/* Back to Home Card */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Explore Zora</h3>
                                <p className="text-gray-600 mb-4 text-sm sm:text-base">Learn more about our platform and features.</p>
                            </div>
                            <Link href="/" className="flex items-center gap-2 text-primary font-semibold hover:underline">
                                <House size={20} weight="duotone" /> Home
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
