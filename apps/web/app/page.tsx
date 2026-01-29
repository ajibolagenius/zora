"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Star, ShoppingBag, TrendingUp, Users, Truck, Shield, MapPin, Check, Globe, CreditCard, Package, Heart, Search, Map, Menu, X } from "lucide-react";

// Zora Logo Component
const ZoraLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 156 179" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeMiterlimit="1.5">
        <g id="zora_logo">
            {/* Shopping Bag */}
            <g id="bag">
                {/* Hands */}
                <path id="hand_2" d="M55.643 29.404c-0.298-1.356-0.613-3.954-0.613-5.398v-2.559c0-10.801 8.769-19.569 19.569-19.569h7.112c10.801 0 19.569 8.769 19.569 19.569v2.559c0 2.421-0.571 5.206-1.376 7.347" fill="none" stroke="#fff" strokeWidth="2.08" />
                <path id="hand_1" d="M63.832 31.655c-0.298-1.356-0.613-3.954-0.613-5.398v-2.559c0-10.801 8.769-19.569 19.569-19.569h7.112c10.801 0 19.569 8.769 19.569 19.569v2.559c0 2.421-0.192 3.493-0.997 5.634" fill="none" stroke="#fff" strokeWidth="2.08" />
                {/* Bag Shape */}
                <g id="bag_line">
                    <path id="bag_line_1" d="M17.657 31.446l9.865-0.065 6.93-6.059 27.742 2.627-3.487 10.757-6.086 0.988 0.083 4.076-11.435 15.164v7.407l-2.445 5.046c0 0 15.955 21.579 25.604 15.127l7.746-2.576 4.453 2.558-0.342 8.748 3.387 2.559-43.111-11.716-11.381 0.63-12.184 0.845 4.66-56.116Z" fill="#c00" />
                    <path id="bag_line_2" d="M60.48 33.238l1.782-5.354 68.425 3.342 14.497 94.941-108.021 4.569-13.019-5.139-14.225 0.663 3.086-39.989 0.108-0.12-0.117 1.413 12.184-0.845 11.381-0.63 43.111 11.716-3.387-2.559 0.342-8.748-4.453-2.558-7.746 2.576c-9.649 6.452-25.604-15.127-25.604-15.127l2.445-5.046v-7.407l11.435-15.164-0.037-1.805 2.386-2.666 3.653-0.593 1.773-5.468Z" fill="#fc0" />
                </g>
                {/* Africa Map */}
                <path id="africa_map" d="M59.668 35.743l0.755 0.981c0 0 24.304-5.446 25.137 0.74l-0.174 3.459 7.025 4.507 5.142-3.467 10.973 3.827c0 0 7.273-4.703 7.663-0.141 0 0 1.05 19.872 15.025 24.318l8.276-1.775c0 0 5.206 4.912-0.213 15.694l-11.651 13.53 0.783 15.664-6.584 4.462-0.068 6.263-4.753 2.624-6.892 7.587-12.415 2.403-6.328-4.717-10.266-20.218 2.205-8.643-3.037-4.646-2.558-0.927 1.96 0.533-3.387-2.559 0.342-8.748-4.453-2.558-7.746 2.576c-9.649 6.452-25.604-15.127-25.604-15.127l2.445-5.046v-7.407l11.435-15.164-0.083-4.076 6.086-0.988 0.96-2.962Z" fill="#fff" stroke="#000" strokeWidth="2.08" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            {/* ZORA Text */}
            <path id="zora_text" d="M29.259 169.338h-11.7c-1.606 0.003-3.554 0.203-5.131 0.408 1.334-1.067 2.812-2.424 3.717-3.797l13.116-19.904c0.6-0.911 0.773-1.711 0.603-2.789l-0.554-3.495h-23.009c-2.651 0-3.395-0.535-3.395-0.535-0.289 2.32-0.939 5.461-0.939 6.426 0 1.055 0.877 2.172 0.877 2.172l9.789-0.02c1.084-0.002 2.753-0.313 4.044-0.595-1.176 0.888-2.823 2.332-4.049 4.204l-11.968 18.279c-0.598 0.912-0.769 1.712-0.598 2.789l0.775 4.897h24.964c2.651 0 3.395 0.537 3.395 0.537 0.289-2.321 0.939-5.463 0.939-6.429 0-1.054-0.877-2.172-0.877-2.172m25.124-30.092c-11.769 0-20.474 8.115-20.474 20.206 0 11.231 7.47 18.486 18.594 18.486 11.823 0 20.421-8.222 20.421-20.223 0-11.107-7.362-18.469-18.54-18.469m-2.15 7.792c5.589 0 9.781 5.051 9.781 13.005 0 6.072-2.472 10.157-7.523 10.049-5.911-0.107-9.673-5.589-9.673-13.005 0-5.589 2.15-10.049 7.416-10.049m49.47 14.17c4.114-0.998 8.594-4.329 8.594-10.892 0-8.099-6.49-11.07-17.726-11.07-4.849 0-9.889 0.613-12.34 1.075v36.435c0 0 1.118 0.914 2.172 0.914 1.287 0 5.88-0.269 8.576-0.269v-30.119c1.087-0.081 2.115-0.136 2.841-0.136 3.65 0 5.721 1.485 5.721 4.729 0 2.616-1.29 4.374-5.088 5.726-1.388 0.494-2.009 1.329-1.229 3.156l4.631 10.84c2.023 4.737 4.595 6.88 8.821 6.88 4.188 0 6.818-2.175 6.818-5.639-4.575-1.176-8.054-7.901-11.79-11.628Zm39.657-20.78c0 0-1.118-0.914-2.172-0.914-0.806 0-6.211 0.269-9.569 0.269 0 0 0.267 2.25-0.434 4.163l-12.037 32.81c0 0 1.118 0.914 2.172 0.914 1.188 0 4.897-0.269 7.912-0.269l3.122-9.007h10.161l2.86 8.362c0 0 1.117 0.914 2.172 0.914 1.362 0 5.917-0.269 9.554-0.269l-13.742-36.972Zm-6.498 7.083c0.194 0.821 0.866 3.582 2.011 7.483l1.882 6.413h-7.198l1.866-6.899c0.619-2.291 1.268-5.995 1.44-6.997Z" fill="#fc0" fillRule="nonzero" />
        </g>
    </svg>
);

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <main id="main-content" className="min-h-screen bg-background-light">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background-light/80 backdrop-blur-md" role="navigation" aria-label="Main navigation">
                <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <ZoraLogo className="w-9 h-9" />
                        <span className="text-xl font-bold font-display text-gray-900">Zora</span>
                    </Link>

                    {/* Center Navigation - Pill Style (Desktop) */}
                    <div className="hidden lg:flex items-center bg-white rounded-full px-2 py-1.5 border border-gray-200 shadow-sm">
                        <Link
                            href="#features"
                            className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50"
                        >
                            Features
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50"
                        >
                            How It Works
                        </Link>
                        <Link
                            href="#vendors"
                            className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50"
                        >
                            For Vendors
                        </Link>
                        <Link
                            href="#download"
                            className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50"
                        >
                            Download
                        </Link>
                    </div>

                    {/* Right CTA & Mobile Menu */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/vendor-onboarding"
                            className="hidden sm:inline-flex bg-secondary hover:bg-secondary-dark text-gray-900 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm"
                        >
                            Get Started
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700" aria-hidden="true" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div id="mobile-menu" className="lg:hidden bg-white border-t border-gray-200 shadow-lg" role="menu" aria-label="Mobile navigation">
                        <div className="container mx-auto px-4 py-4 flex flex-col space-y-2">
                            <Link
                                href="#features"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Features
                            </Link>
                            <Link
                                href="#how-it-works"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                How It Works
                            </Link>
                            <Link
                                href="#vendors"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                For Vendors
                            </Link>
                            <Link
                                href="#download"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Download
                            </Link>
                            <Link
                                href="/vendor-onboarding"
                                onClick={() => setMobileMenuOpen(false)}
                                className="sm:hidden mt-2 bg-secondary hover:bg-secondary-dark text-gray-900 px-5 py-3 rounded-full text-base font-semibold transition-colors shadow-sm text-center"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-28 pb-16 lg:pt-32 lg:pb-24 overflow-hidden" aria-labelledby="hero-heading">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        {/* Left Content */}
                        <div className="max-w-xl">
                            {/* Tagline */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-0.5 bg-primary"></div>
                                <span className="text-xs font-semibold tracking-widest text-gray-600 uppercase">
                                    #No.1 African Marketplace in the UK
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-display font-bold font-display leading-[1.1] text-gray-900 mb-6">
                                Your home away{" "}
                                <span className="relative inline-block">
                                    from home
                                    <svg
                                        className="absolute -bottom-2 left-0 w-full"
                                        viewBox="0 0 200 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M2 8.5C50 2.5 150 2.5 198 8.5"
                                            stroke="#22C55E"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </span>{" "}
                                delivered!
                            </h1>

                            {/* Subtext */}
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                A central hub for Africans in the diaspora to access authentic groceries,
                                a vibrant marketplace, and community-focused services that reflect African
                                culture—wherever you live.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="#download"
                                    className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-gray-900 px-7 py-4 rounded-full text-base font-semibold transition-all shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30"
                                >
                                    Download App
                                    <ArrowUpRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/vendor-onboarding"
                                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-7 py-4 rounded-full text-base font-semibold transition-colors border border-gray-200"
                                >
                                    Start Selling
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center gap-6 mt-10 pt-10 border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-white"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        <strong className="text-gray-900">2,000+</strong> happy customers
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 fill-secondary text-secondary" />
                                    <span className="text-sm font-semibold text-gray-900">4.8</span>
                                    <span className="text-sm text-gray-600">App Rating</span>
                                </div>
                            </div>
                        </div>

                        {/* Right - Floating Cards & App Preview */}
                        <div className="relative h-[500px] lg:h-[580px]">
                            {/* Main App Screenshot */}
                            <div className="absolute top-8 right-0 lg:right-4 w-[260px] z-10">
                                <div className="bg-background-dark rounded-[2.5rem] p-2 shadow-2xl">
                                    <div className="rounded-[2rem] overflow-hidden">
                                        <Image
                                            src="/images/screenshots/home.png"
                                            alt="Zora App Home Screen"
                                            width={260}
                                            height={520}
                                            className="w-full h-auto"
                                            priority
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Today's Sales Card */}
                            <div className="absolute top-0 right-48 lg:right-56 w-[170px] bg-white rounded-xl shadow-lg p-4 z-20">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">Daily Orders</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">847</div>
                                <div className="flex items-center gap-1 text-xs">
                                    <span className="text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded">+18.4%</span>
                                    <span className="text-gray-500">this week</span>
                                </div>
                            </div>

                            {/* Vendor Stats Card */}
                            <div className="absolute top-44 left-0 lg:left-4 w-[180px] bg-success rounded-xl shadow-lg p-4 z-20">
                                <div className="flex items-center gap-2 mb-4">
                                    <ShoppingBag className="w-5 h-5 text-white/80" />
                                    <span className="text-sm font-medium text-white/80">Active Vendors</span>
                                </div>
                                <div className="text-4xl font-bold text-white mb-2">100+</div>
                                <p className="text-white/70 text-xs">African-owned businesses</p>
                            </div>

                            {/* Region Badge */}
                            <div className="absolute bottom-36 left-8 lg:left-16 bg-white rounded-lg shadow-md px-3 py-2 flex items-center gap-2 z-20">
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                    <Globe className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">5 African Regions</span>
                            </div>

                            {/* UK Delivery Badge */}
                            <div className="absolute bottom-8 right-4 lg:right-12 w-[160px] bg-white rounded-xl shadow-lg p-4 z-20">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                                        <Truck className="w-4 h-4 text-secondary-dark" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">UK Wide</span>
                                </div>
                                <p className="text-xs text-gray-500">Fast delivery across the United Kingdom</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partner Logos Section */}
            <section className="py-12 border-t border-gray-200 bg-white/50">
                <div className="container mx-auto px-6">
                    <p className="text-center text-sm text-gray-500 mb-6">Trusted payment partners</p>
                    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                        {[
                            { name: "Stripe", desc: "Cards" },
                            { name: "Klarna", desc: "Buy Now, Pay Later" },
                            { name: "Clearpay", desc: "Installments" },
                        ].map((partner) => (
                            <div key={partner.name} className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <span className="text-base font-semibold text-gray-700">{partner.name}</span>
                                    <p className="text-xs text-gray-500">{partner.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-8 h-0.5 bg-primary"></div>
                            <span className="text-xs font-semibold tracking-widest text-gray-600 uppercase">
                                Explore
                            </span>
                            <div className="w-8 h-0.5 bg-primary"></div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
                            Shop by African Region
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover authentic products from across the continent, curated from trusted African-owned vendors
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {[
                            { name: "West Africa", color: "from-orange-100 to-amber-100", products: "Jollof, Egusi, Plantains" },
                            { name: "East Africa", color: "from-green-100 to-emerald-100", products: "Injera, Ugali, Spices" },
                            { name: "North Africa", color: "from-blue-100 to-cyan-100", products: "Couscous, Dates, Oils" },
                            { name: "South Africa", color: "from-purple-100 to-pink-100", products: "Biltong, Rooibos, Chakalaka" },
                            { name: "Central Africa", color: "from-red-100 to-orange-100", products: "Cassava, Palm Oil, Ndolé" },
                        ].map((region) => (
                            <div
                                key={region.name}
                                className="group bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all cursor-pointer border border-gray-100 hover:border-primary/20 hover:-translate-y-1"
                            >
                                <div className={`w-20 h-20 bg-gradient-to-br ${region.color} rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform flex items-center justify-center`}>
                                    <Globe className="w-8 h-8 text-gray-600/50" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">{region.name}</h3>
                                <p className="text-xs text-gray-500">{region.products}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* App Features Showcase */}
            <section className="py-20 bg-background-light" aria-labelledby="features-showcase-heading">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Feature List */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-0.5 bg-primary"></div>
                                <span className="text-xs font-semibold tracking-widest text-gray-600 uppercase">
                                    App Features
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-6">
                                Everything you need in one app
                            </h2>
                            <p className="text-gray-600 mb-8">
                                The Zora mobile app brings authentic African products right to your fingertips
                                with powerful features designed for the diaspora community.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { icon: Search, title: "Smart Search", desc: "Find products by name, vendor, or cultural region" },
                                    { icon: Map, title: "Vendor Discovery", desc: "Interactive maps showing nearby African vendors" },
                                    { icon: ShoppingBag, title: "Multi-Vendor Cart", desc: "Shop from multiple vendors in a single order" },
                                    { icon: CreditCard, title: "Flexible Payments", desc: "Stripe, Klarna, and Clearpay supported" },
                                    { icon: Package, title: "Order Tracking", desc: "Real-time updates on your delivery status" },
                                    { icon: Heart, title: "Save Favourites", desc: "Build your personal list of go-to products" },
                                ].map((feature) => (
                                    <div key={feature.title} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <feature.icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                                            <p className="text-sm text-gray-600">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right - App Screenshots */}
                        <div className="relative flex justify-center items-center">
                            <div className="relative">
                                {/* Main Phone */}
                                <div className="relative z-10 bg-background-dark rounded-[2.5rem] p-2 shadow-2xl">
                                    <div className="rounded-[2rem] overflow-hidden w-[240px]">
                                        <Image
                                            src="/images/screenshots/explore.png"
                                            alt="Zora App Explore Screen"
                                            width={240}
                                            height={480}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                </div>
                                {/* Background Phone */}
                                <div className="absolute -right-16 top-8 z-0 bg-background-dark rounded-[2.5rem] p-2 shadow-xl opacity-60 rotate-6">
                                    <div className="rounded-[2rem] overflow-hidden w-[200px]">
                                        <Image
                                            src="/images/screenshots/cart.png"
                                            alt="Zora App Cart Screen"
                                            width={200}
                                            height={400}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-8 h-0.5 bg-primary"></div>
                            <span className="text-xs font-semibold tracking-widest text-gray-600 uppercase">
                                Simple Process
                            </span>
                            <div className="w-8 h-0.5 bg-primary"></div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
                            How Zora Works
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Get your favourite African products delivered in just a few simple steps
                        </p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Search,
                                title: "Browse",
                                description: "Explore products from 100+ vendors across 5 African regions",
                                color: "bg-orange-100 text-orange-600",
                            },
                            {
                                icon: ShoppingBag,
                                title: "Add to Cart",
                                description: "Mix items from different vendors in one convenient cart",
                                color: "bg-yellow-100 text-yellow-600",
                            },
                            {
                                icon: CreditCard,
                                title: "Pay Securely",
                                description: "Choose Stripe, Klarna, or Clearpay at checkout",
                                color: "bg-green-100 text-green-600",
                            },
                            {
                                icon: Truck,
                                title: "Receive",
                                description: "Track your order and enjoy authentic products at home",
                                color: "bg-blue-100 text-blue-600",
                            },
                        ].map((step, index) => (
                            <div key={step.title} className="text-center group">
                                <div className="relative mb-6">
                                    <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vendor CTA */}
            <section id="vendors" className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-0.5 bg-white/50"></div>
                                <span className="text-xs font-semibold tracking-widest text-white/80 uppercase">
                                    For Vendors
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                                Grow Your African Business with Zora
                            </h2>
                            <p className="text-white/80 mb-8 text-lg">
                                Join our marketplace and reach thousands of customers in the UK diaspora looking for
                                authentic African products. Easy setup, powerful tools, and dedicated support.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                {[
                                    { title: "No Monthly Fees", description: "Only pay when you sell", icon: "💰" },
                                    { title: "Easy Dashboard", description: "Manage products & orders", icon: "📊" },
                                    { title: "Fast Payouts", description: "Get paid within days", icon: "⚡" },
                                    { title: "Full Support", description: "We help you succeed", icon: "🤝" },
                                ].map((benefit) => (
                                    <div key={benefit.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                        <div className="text-2xl mb-2">{benefit.icon}</div>
                                        <h3 className="font-semibold mb-1">{benefit.title}</h3>
                                        <p className="text-white/70 text-sm">{benefit.description}</p>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="/vendor-onboarding"
                                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-gray-900 px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                            >
                                Start Selling Today
                                <ArrowUpRight className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Right - Vendor App Preview (cropped to show top portion) */}
                        <div className="relative flex justify-center">
                            <div className="bg-background-dark rounded-t-[2.5rem] rounded-b-[1rem] p-2 pb-4 shadow-2xl">
                                <div className="rounded-t-[2rem] rounded-b-lg overflow-hidden w-[260px] max-h-[580px]">
                                    <Image
                                        src="/images/screenshots/product_page.png"
                                        alt="Vendor Store Profile"
                                        width={260}
                                        height={520}
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Download App Section */}
            <section id="download" className="py-20 bg-background-light" aria-labelledby="download-heading">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-gradient-to-br from-background-dark to-surface rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />

                            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-0.5 bg-primary"></div>
                                        <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                                            Mobile App
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
                                        Download the Zora App
                                    </h2>
                                    <p className="text-gray-400 mb-6">
                                        Get the best shopping experience on your mobile device.
                                        Browse products, discover vendors, track orders, and more.
                                    </p>

                                    {/* App Features */}
                                    <div className="flex flex-wrap gap-3 mb-8">
                                        {["100+ Vendors", "5 Regions", "Fast Delivery", "Secure Payments"].map((feature) => (
                                            <span key={feature} className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <a
                                            href="#"
                                            className="bg-white text-gray-900 px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 transition-colors"
                                        >
                                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                            </svg>
                                            <div className="text-left">
                                                <div className="text-[10px] leading-tight opacity-70">Download on the</div>
                                                <div className="text-base font-semibold leading-tight">App Store</div>
                                            </div>
                                        </a>
                                        <a
                                            href="#"
                                            className="bg-white text-gray-900 px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 transition-colors"
                                        >
                                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                                            </svg>
                                            <div className="text-left">
                                                <div className="text-[10px] leading-tight opacity-70">GET IT ON</div>
                                                <div className="text-base font-semibold leading-tight">Google Play</div>
                                            </div>
                                        </a>
                                    </div>
                                </div>

                                {/* App Preview */}
                                <div className="hidden md:flex justify-center">
                                    <div className="relative">
                                        <div className="bg-surface rounded-[2.5rem] p-2 shadow-2xl border border-white/10">
                                            <div className="rounded-[2rem] overflow-hidden w-[220px]">
                                                <Image
                                                    src="/images/screenshots/home.png"
                                                    alt="Zora App Preview"
                                                    width={220}
                                                    height={440}
                                                    className="w-full h-auto"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: "100+", label: "Trusted Vendors", icon: Users, desc: "African-owned businesses" },
                            { value: "5,000+", label: "Products", icon: ShoppingBag, desc: "Authentic African goods" },
                            { value: "UK Wide", label: "Delivery", icon: Truck, desc: "Fast & reliable" },
                            { value: "4.8★", label: "App Rating", icon: Star, desc: "Loved by customers" },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div className="text-3xl font-bold font-display text-gray-900 mb-1">{stat.value}</div>
                                <div className="font-medium text-gray-900">{stat.label}</div>
                                <div className="text-sm text-gray-500">{stat.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-background-dark text-white py-16" role="contentinfo">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-5 gap-8 mb-12">
                        <div className="md:col-span-2">
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <ZoraLogo className="w-12 h-12" />
                                <span className="text-2xl font-bold font-display">Zora</span>
                            </Link>
                            <p className="text-gray-400 mb-6 max-w-sm">
                                A central hub for Africans in the diaspora to access authentic groceries
                                and community-focused services that reflect African culture.
                            </p>
                            <div className="flex gap-4">
                                {["Twitter", "Instagram", "Facebook"].map((social) => (
                                    <a
                                        key={social}
                                        href="#"
                                        className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                                    >
                                        <span className="sr-only">{social}</span>
                                        <div className="w-5 h-5 bg-white/50 rounded" />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Company</h4>
                            <ul className="space-y-3">
                                {["About Us", "Careers", "Press", "Blog"].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Support</h4>
                            <ul className="space-y-3">
                                {["Help Centre", "Shipping Info", "Returns", "Contact Us"].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Legal</h4>
                            <ul className="space-y-3">
                                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            &copy; {new Date().getFullYear()} Zora African Market. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> United Kingdom
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
