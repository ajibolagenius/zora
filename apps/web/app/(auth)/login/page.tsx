"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Storefront, Shield, DeviceMobile, ArrowRight, House, ArrowSquareOut } from "@phosphor-icons/react";

export default function LoginGuidePage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for header contrast
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const heroSection = document.getElementById('hero-section');

            if (heroSection) {
                const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
                setScrolled(scrollPosition > heroBottom - 100); // Change before reaching white section
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial position

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            {/* Navigation - Transparent overlay with contrast */}
            <nav className={`fixed top-12 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : ''}`}>
                <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Z</span>
                        </div>
                        <span className={`text-xl font-bold font-display transition-colors duration-300 ${scrolled ? 'text-text-dark' : 'text-white'}`}>Zora</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
                        {["Home", "Features", "Vendors", "Contact"].map((item) => (
                            <Link
                                key={item}
                                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${scrolled ? 'text-gray-600 hover:text-primary hover:bg-white' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href="/login" className={`hidden sm:inline-flex text-sm font-medium px-3 py-1.5 transition-colors duration-300 ${scrolled ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'}`}>
                            Sign In
                        </Link>
                        <Link href="/#download" className="bg-secondary hover:bg-secondary-dark text-gray-900 px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2">
                            Download App <ArrowSquareOut size={16} weight="duotone" />
                        </Link>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
                            <div className="w-6 h-0.5 bg-current" />
                            <div className="w-6 h-0.5 bg-current" />
                            <div className="w-6 h-0.5 bg-current" />
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className={`md:hidden border-t p-4 transition-colors duration-300 ${scrolled ? 'bg-white border-gray-200' : 'bg-background-dark/95 border-white/10'}`}>
                        {["Home", "Features", "Vendors", "Contact", "Sign In"].map((item) => (
                            <Link
                                key={item}
                                href={item === "Home" ? "/" : item === "Sign In" ? "/login" : `/${item.toLowerCase()}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-4 py-2 rounded-lg transition-colors ${scrolled ? 'text-gray-600 hover:text-primary hover:bg-gray-50' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>

            <div className="container mx-auto max-w-5xl">
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold font-display text-primary">ZORA</Link>
                    <h1 className="text-2xl md:text-3xl font-bold mt-6 text-gray-900">Where would you like to go?</h1>
                    <p className="text-gray-500 mt-2">Choose the portal that matches your role</p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-12 gap-3 md:gap-4">
                    {/* Vendor Portal Card */}
                    <a
                        href={`${process.env.NEXT_PUBLIC_VENDOR_URL || "http://localhost:3001"}/login`}
                        className="col-span-12 md:col-span-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 md:p-6 text-white hover:scale-[1.02] transition-transform cursor-pointer group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                <Storefront size={24} weight="duotone" />
                            </div>
                            <ArrowRight size={20} weight="duotone" className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Vendor Portal</h2>
                        <p className="text-white/80 text-sm">
                            Manage your shop, products, orders, and earnings from your vendor dashboard.
                        </p>
                    </a>

                    {/* Admin Portal Card */}
                    <a
                        href={`${process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3002"}/login`}
                        className="col-span-12 md:col-span-6 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl p-5 md:p-6 text-white hover:scale-[1.02] transition-transform cursor-pointer group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                <Shield size={24} weight="duotone" />
                            </div>
                            <ArrowRight size={20} weight="duotone" className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Admin Portal</h2>
                        <p className="text-white/80 text-sm">
                            Access the admin dashboard to manage the platform, vendors, and customers.
                        </p>
                    </a>

                    {/* Mobile App Card */}
                    <div className="col-span-12 bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 md:p-6 text-white">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold mb-2">Shop with Zora</h2>
                                <p className="text-white/80 text-sm">
                                    Download our mobile app to browse products, place orders, and track deliveries.
                                </p>
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
                            Apply to become a vendor <ArrowSquareOut size={16} weight="duotone" />
                        </Link>
                    </div>

                    {/* Back to Home Card */}
                    <div className="col-span-12 md:col-span-6 bg-white border border-gray-200 rounded-2xl p-5 md:p-6 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Explore Zora</h3>
                            <p className="text-sm text-gray-500">Learn more about our platform and features.</p>
                        </div>
                        <Link href="/" className="flex items-center gap-2 text-primary font-medium text-sm hover:underline">
                            <House size={16} weight="duotone" /> Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
