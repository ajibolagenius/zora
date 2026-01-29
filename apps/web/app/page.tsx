"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Star, ShoppingBag, TrendingUp, Truck, Globe, CreditCard, Menu, X, MapPin, Users, Shield, Zap, Heart, Package, ChevronDown } from "lucide-react";

// Zora Logo Component
const ZoraLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 156 179" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeMiterlimit="1.5">
        <g id="zora_logo">
            <g id="bag">
                <path id="hand_2" d="M55.643 29.404c-0.298-1.356-0.613-3.954-0.613-5.398v-2.559c0-10.801 8.769-19.569 19.569-19.569h7.112c10.801 0 19.569 8.769 19.569 19.569v2.559c0 2.421-0.571 5.206-1.376 7.347" fill="none" stroke="#fff" strokeWidth="2.08" />
                <path id="hand_1" d="M63.832 31.655c-0.298-1.356-0.613-3.954-0.613-5.398v-2.559c0-10.801 8.769-19.569 19.569-19.569h7.112c10.801 0 19.569 8.769 19.569 19.569v2.559c0 2.421-0.192 3.493-0.997 5.634" fill="none" stroke="#fff" strokeWidth="2.08" />
                <g id="bag_line">
                    <path id="bag_line_1" d="M17.657 31.446l9.865-0.065 6.93-6.059 27.742 2.627-3.487 10.757-6.086 0.988 0.083 4.076-11.435 15.164v7.407l-2.445 5.046c0 0 15.955 21.579 25.604 15.127l7.746-2.576 4.453 2.558-0.342 8.748 3.387 2.559-43.111-11.716-11.381 0.63-12.184 0.845 4.66-56.116Z" fill="#c00" />
                    <path id="bag_line_2" d="M60.48 33.238l1.782-5.354 68.425 3.342 14.497 94.941-108.021 4.569-13.019-5.139-14.225 0.663 3.086-39.989 0.108-0.12-0.117 1.413 12.184-0.845 11.381-0.63 43.111 11.716-3.387-2.559 0.342-8.748-4.453-2.558-7.746 2.576c-9.649 6.452-25.604-15.127-25.604-15.127l2.445-5.046v-7.407l11.435-15.164-0.037-1.805 2.386-2.666 3.653-0.593 1.773-5.468Z" fill="#fc0" />
                </g>
                <path id="africa_map" d="M59.668 35.743l0.755 0.981c0 0 24.304-5.446 25.137 0.74l-0.174 3.459 7.025 4.507 5.142-3.467 10.973 3.827c0 0 7.273-4.703 7.663-0.141 0 0 1.05 19.872 15.025 24.318l8.276-1.775c0 0 5.206 4.912-0.213 15.694l-11.651 13.53 0.783 15.664-6.584 4.462-0.068 6.263-4.753 2.624-6.892 7.587-12.415 2.403-6.328-4.717-10.266-20.218 2.205-8.643-3.037-4.646-2.558-0.927 1.96 0.533-3.387-2.559 0.342-8.748-4.453-2.558-7.746 2.576c-9.649 6.452-25.604-15.127-25.604-15.127l2.445-5.046v-7.407l11.435-15.164-0.083-4.076 6.086-0.988 0.96-2.962Z" fill="#fff" stroke="#000" strokeWidth="2.08" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <path id="zora_text" d="M29.259 169.338h-11.7c-1.606 0.003-3.554 0.203-5.131 0.408 1.334-1.067 2.812-2.424 3.717-3.797l13.116-19.904c0.6-0.911 0.773-1.711 0.603-2.789l-0.554-3.495h-23.009c-2.651 0-3.395-0.535-3.395-0.535-0.289 2.32-0.939 5.461-0.939 6.426 0 1.055 0.877 2.172 0.877 2.172l9.789-0.02c1.084-0.002 2.753-0.313 4.044-0.595-1.176 0.888-2.823 2.332-4.049 4.204l-11.968 18.279c-0.598 0.912-0.769 1.712-0.598 2.789l0.775 4.897h24.964c2.651 0 3.395 0.537 3.395 0.537 0.289-2.321 0.939-5.463 0.939-6.429 0-1.054-0.877-2.172-0.877-2.172m25.124-30.092c-11.769 0-20.474 8.115-20.474 20.206 0 11.231 7.47 18.486 18.594 18.486 11.823 0 20.421-8.222 20.421-20.223 0-11.107-7.362-18.469-18.54-18.469m-2.15 7.792c5.589 0 9.781 5.051 9.781 13.005 0 6.072-2.472 10.157-7.523 10.049-5.911-0.107-9.673-5.589-9.673-13.005 0-5.589 2.15-10.049 7.416-10.049m49.47 14.17c4.114-0.998 8.594-4.329 8.594-10.892 0-8.099-6.49-11.07-17.726-11.07-4.849 0-9.889 0.613-12.34 1.075v36.435c0 0 1.118 0.914 2.172 0.914 1.287 0 5.88-0.269 8.576-0.269v-30.119c1.087-0.081 2.115-0.136 2.841-0.136 3.65 0 5.721 1.485 5.721 4.729 0 2.616-1.29 4.374-5.088 5.726-1.388 0.494-2.009 1.329-1.229 3.156l4.631 10.84c2.023 4.737 4.595 6.88 8.821 6.88 4.188 0 6.818-2.175 6.818-5.639-4.575-1.176-8.054-7.901-11.79-11.628Zm39.657-20.78c0 0-1.118-0.914-2.172-0.914-0.806 0-6.211 0.269-9.569 0.269 0 0 0.267 2.25-0.434 4.163l-12.037 32.81c0 0 1.118 0.914 2.172 0.914 1.188 0 4.897-0.269 7.912-0.269l3.122-9.007h10.161l2.86 8.362c0 0 1.117 0.914 2.172 0.914 1.362 0 5.917-0.269 9.554-0.269l-13.742-36.972Zm-6.498 7.083c0.194 0.821 0.866 3.582 2.011 7.483l1.882 6.413h-7.198l1.866-6.899c0.619-2.291 1.268-5.995 1.44-6.997Z" fill="#fc0" fillRule="nonzero" />
        </g>
    </svg>
);

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const regions = [
        { name: "West Africa", color: "from-orange-400 to-amber-500" },
        { name: "East Africa", color: "from-green-400 to-emerald-500" },
        { name: "North Africa", color: "from-blue-400 to-cyan-500" },
        { name: "South Africa", color: "from-purple-400 to-pink-500" },
        { name: "Central Africa", color: "from-red-400 to-orange-500" },
    ];

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
                <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <ZoraLogo className="w-9 h-9" />
                        <span className="text-xl font-bold font-display text-white">Zora</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
                        {["About", "Features", "Vendors", "Contact"].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase()}`}
                                className="px-4 py-1.5 text-sm font-medium text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-all"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href="/login" className="hidden sm:inline-flex text-sm font-medium text-white/80 hover:text-white px-3 py-1.5">
                            Sign In
                        </Link>
                        <Link href="/vendor-onboarding" className="bg-secondary text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-secondary-dark transition-colors">
                            Get Started
                        </Link>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg">
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden bg-background-dark/95 backdrop-blur-lg border-t border-white/10 p-4">
                        {["About", "Features", "Vendors", "Contact", "Sign In"].map((item) => (
                            <Link
                                key={item}
                                href={item === "Sign In" ? "/login" : `/${item.toLowerCase()}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>

            {/* ==================== HERO SECTION ==================== */}
            <section className="relative min-h-screen bg-gradient-to-br from-primary via-primary-dark to-background-dark overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-32 pb-20 lg:pt-40 lg:pb-28">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        {/* Left Content */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-6">
                                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                                #1 African Marketplace in the UK
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-display text-white leading-[1.1] mb-6">
                                Your home away{" "}
                                <span className="relative inline-block">
                                    from home
                                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                        <path d="M2 8.5C50 2.5 150 2.5 198 8.5" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <br />
                                <span className="text-secondary">delivered!</span>
                            </h1>

                            <p className="text-lg lg:text-xl text-white/70 mb-8 max-w-xl mx-auto lg:mx-0">
                                Access authentic African groceries, a vibrant marketplace, and community-focused services—delivered across the UK.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                                <Link
                                    href="#download"
                                    className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-gray-900 px-8 py-4 rounded-full text-base font-semibold transition-all shadow-lg shadow-secondary/25"
                                >
                                    Download App
                                    <ArrowUpRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/vendor-onboarding"
                                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full text-base font-semibold border border-white/20 transition-all"
                                >
                                    Start Selling
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-white/20" />
                                        ))}
                                    </div>
                                    <span className="text-sm text-white/70">
                                        <strong className="text-white">2,000+</strong> customers
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-5 h-5 fill-secondary text-secondary" />
                                    <span className="text-sm font-semibold text-white">4.8</span>
                                    <span className="text-sm text-white/60">rating</span>
                                </div>
                            </div>
                        </div>

                        {/* Right - App Preview */}
                        <div className="relative flex justify-center lg:justify-end">
                            <div className="relative">
                                {/* Main Phone */}
                                <div className="relative z-10 bg-background-dark rounded-[2.5rem] p-2 shadow-2xl shadow-black/50">
                                    <div className="rounded-[2rem] overflow-hidden w-[240px] sm:w-[280px]">
                                        <Image src="/images/screenshots/home.png" alt="Zora App" width={280} height={560} className="w-full h-auto" priority />
                                    </div>
                                </div>

                                {/* Floating Cards */}
                                <div className="absolute -top-4 -left-16 sm:-left-24 bg-white rounded-2xl shadow-xl p-4 w-[140px] sm:w-[160px]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500">Daily Orders</span>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">847</div>
                                    <span className="text-xs text-green-600 font-medium">+18.4%</span>
                                </div>

                                <div className="absolute top-1/3 -right-12 sm:-right-20 bg-gradient-to-br from-secondary to-yellow-500 rounded-2xl shadow-xl p-4 w-[130px]">
                                    <ShoppingBag className="w-5 h-5 text-gray-900/70 mb-2" />
                                    <div className="text-3xl font-bold text-gray-900">100+</div>
                                    <span className="text-xs text-gray-700">Vendors</span>
                                </div>

                                <div className="absolute -bottom-4 -left-8 sm:-left-16 bg-white rounded-2xl shadow-xl p-4 w-[150px]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Truck className="w-5 h-5 text-blue-600" />
                                        <span className="text-xs font-medium text-gray-500">UK Wide</span>
                                    </div>
                                    <p className="text-xs text-gray-600">Fast delivery across the UK</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
                    <span className="text-xs">Scroll to explore</span>
                    <ChevronDown className="w-5 h-5 animate-bounce" />
                </div>
            </section>

            {/* ==================== BENTO GRID CONTENT ==================== */}

            {/* Partners Bar */}
            <section className="py-6 px-4 bg-white border-b border-gray-100">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Trusted Partners</span>
                        {["Stripe", "Klarna", "Clearpay"].map((partner) => (
                            <div key={partner} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                <span className="text-sm font-semibold text-gray-600">{partner}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Regions Bento */}
            <section className="py-8 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl md:text-2xl font-bold font-display text-gray-900">Shop by Region</h2>
                        <Link href="/features" className="text-sm text-primary font-medium hover:underline">View all →</Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {regions.map((region) => (
                            <div key={region.name} className={`bg-gradient-to-br ${region.color} rounded-2xl p-4 md:p-5 text-white cursor-pointer hover:scale-[1.02] transition-transform`}>
                                <Globe className="w-6 h-6 mb-2 opacity-80" />
                                <span className="font-semibold text-sm md:text-base">{region.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features & Stats Bento */}
            <section className="py-6 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-12 gap-3 md:gap-4">
                        {/* Why Zora Card */}
                        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-2xl p-5 md:p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Why Choose Zora?</h3>
                            <div className="space-y-3">
                                {[
                                    { icon: Shield, text: "Verified Vendors", color: "bg-green-100 text-green-600" },
                                    { icon: Zap, text: "Fast Checkout", color: "bg-yellow-100 text-yellow-600" },
                                    { icon: Heart, text: "Community First", color: "bg-pink-100 text-pink-600" },
                                    { icon: Package, text: "Quality Products", color: "bg-blue-100 text-blue-600" },
                                ].map((item) => (
                                    <div key={item.text} className="flex items-center gap-3">
                                        <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}>
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Vendor CTA Card */}
                        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 md:p-6 text-white">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">For Vendors</span>
                            <h3 className="text-xl font-bold mt-2 mb-2">Grow Your Business</h3>
                            <p className="text-sm text-gray-400 mb-4">Join 100+ vendors reaching thousands of customers. No monthly fees.</p>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-bold text-secondary">10%</span>
                                <span className="text-gray-400 text-sm">commission only</span>
                            </div>
                            <Link href="/vendors" className="inline-flex items-center gap-2 bg-secondary text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-secondary-dark transition-colors">
                                Learn More <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Stats Grid */}
                        <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-3">
                            <div className="bg-primary/10 rounded-2xl p-4 text-center">
                                <span className="text-2xl font-bold text-primary">5K+</span>
                                <p className="text-xs text-gray-600 mt-1">Products</p>
                            </div>
                            <div className="bg-secondary/20 rounded-2xl p-4 text-center">
                                <span className="text-2xl font-bold text-secondary-dark">10K+</span>
                                <p className="text-xs text-gray-600 mt-1">Customers</p>
                            </div>
                            <div className="bg-green-100 rounded-2xl p-4 text-center">
                                <span className="text-2xl font-bold text-green-600">5</span>
                                <p className="text-xs text-gray-600 mt-1">Regions</p>
                            </div>
                            <div className="bg-blue-100 rounded-2xl p-4 text-center">
                                <span className="text-2xl font-bold text-blue-600">UK</span>
                                <p className="text-xs text-gray-600 mt-1">Wide Delivery</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Download App Bento */}
            <section id="download" className="py-6 px-4 pb-10">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-12 gap-3 md:gap-4">
                        {/* Download CTA */}
                        <div className="col-span-12 md:col-span-8 bg-gradient-to-br from-background-dark to-surface rounded-2xl p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
                            <div className="relative z-10">
                                <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-3">Download the Zora App</h2>
                                <p className="text-gray-400 mb-6 max-w-md">
                                    Shop from 100+ vendors, explore 5 African regions, and get fast UK-wide delivery.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <a href="#" className="bg-white text-gray-900 px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-100 transition-colors">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                        </svg>
                                        <span className="text-sm font-semibold">App Store</span>
                                    </a>
                                    <a href="#" className="bg-white text-gray-900 px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-100 transition-colors">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                                        </svg>
                                        <span className="text-sm font-semibold">Google Play</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="col-span-12 md:col-span-4 bg-white rounded-2xl p-5 border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                            <div className="space-y-2">
                                {[
                                    { label: "About Us", href: "/about" },
                                    { label: "Features", href: "/features" },
                                    { label: "For Vendors", href: "/vendors" },
                                    { label: "Contact", href: "/contact" },
                                ].map((link) => (
                                    <Link key={link.label} href={link.href} className="block text-sm text-gray-600 hover:text-primary transition-colors">
                                        {link.label} →
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-background-dark text-white py-8 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <ZoraLogo className="w-8 h-8" />
                            <span className="font-bold font-display">Zora</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                            <Link href="/about" className="hover:text-white">About</Link>
                            <Link href="/features" className="hover:text-white">Features</Link>
                            <Link href="/vendors" className="hover:text-white">Vendors</Link>
                            <Link href="/contact" className="hover:text-white">Contact</Link>
                            <Link href="#" className="hover:text-white">Privacy</Link>
                            <Link href="#" className="hover:text-white">Terms</Link>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span>United Kingdom</span>
                        </div>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-6">
                        © {new Date().getFullYear()} Zora African Market. All rights reserved.
                    </div>
                </div>
            </footer>
        </main>
    );
}
