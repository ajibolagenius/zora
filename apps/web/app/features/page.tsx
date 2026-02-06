"use client";

import Link from "next/link";
import { Heart, Globe, Users, Target, ArrowSquareOut, Sparkle, Bag, MapPin, Shield, Lightning, Star, Truck, DeviceMobile, Package, Clock, ChartBar, ChatCircle, MagnifyingGlass, CreditCard, Bell } from "@phosphor-icons/react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { FreeDeliveryBanner } from "@/components/marketing/FreeDeliveryBanner";

export default function FeaturesPage() {

    const features = [
        { icon: MagnifyingGlass, title: "Smart Search", desc: "Find by name, vendor, or region", color: "bg-blue-100 text-blue-600" },
        { icon: Globe, title: "Shop by Region", desc: "5 African regions to explore", color: "bg-orange-100 text-orange-600" },
        { icon: Bag, title: "Multi-Vendor Cart", desc: "One checkout for all vendors", color: "bg-purple-100 text-purple-600" },
        { icon: CreditCard, title: "Flexible Payments", desc: "Secure card payments", color: "bg-green-100 text-green-600" },
        { icon: Truck, title: "UK-Wide Delivery", desc: "Fast & reliable shipping", color: "bg-yellow-100 text-yellow-600" },
        { icon: MapPin, title: "Vendor Discovery", desc: "Find vendors near you", color: "bg-red-100 text-red-600" },
        { icon: Heart, title: "Wishlist", desc: "Save your favourites", color: "bg-pink-100 text-pink-600" },
        { icon: Bell, title: "Notifications", desc: "Real-time order updates", color: "bg-indigo-100 text-indigo-600" },
        { icon: Shield, title: "Secure & Trusted", desc: "Verified vendors only", color: "bg-teal-100 text-teal-600" },
    ];

    return (
        <main className="min-h-screen bg-background-light">
            {/* Free Delivery Banner - Fixed at top */}
            <FreeDeliveryBanner />

            {/* Navigation */}
            <Navigation />

            {/* Hero Section */}
            <section id="hero-section" className="relative min-h-[60vh] sm:min-h-[70vh] bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center">
                    <div className="text-center max-w-4xl">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
                            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                            Platform Features
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white leading-[1.1] mb-4 sm:mb-6">
                            Everything You Need to Shop
                            <span className="relative inline-block mt-2">
                                African Products
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                    <path d="M2 8.5C50 2.5 150 2.5 198 8.5" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
                            Discover powerful features designed to make finding and purchasing authentic African products easier than ever.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Features Section */}
            <section className="py-12 sm:py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-4 sm:mb-6">Core Features</h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Powerful tools designed for seamless African marketplace experience
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {[
                            { icon: MagnifyingGlass, title: "Smart Search", description: "Find by name, vendor, or region", color: "bg-blue-100 text-blue-600" },
                            { icon: Globe, title: "Shop by Region", description: "5 African regions to explore", color: "bg-orange-100 text-orange-600" },
                            { icon: Bag, title: "Multi-Vendor Cart", description: "One checkout for all vendors", color: "bg-purple-100 text-purple-600" },
                            { icon: CreditCard, title: "Flexible Payments", description: "Secure card payments", color: "bg-green-100 text-green-600" },
                            { icon: Truck, title: "UK-Wide Delivery", description: "Fast & reliable shipping", color: "bg-yellow-100 text-yellow-600" },
                            { icon: MapPin, title: "Vendor Discovery", description: "Find vendors near you", color: "bg-red-100 text-red-600" },
                        ].map((feature) => (
                            <div key={feature.title} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                                <div className={`w-12 h-12 sm:w-16 sm:h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                                    <feature.icon size={24} weight="duotone" className="sm:w-6 sm:h-6" />
                                </div>
                                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* User Experience Section */}
            <section className="py-12 sm:py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                        <div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-4 sm:mb-6">Mobile Experience</h2>
                            <div className="space-y-4 sm:space-y-6">
                                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                                    Shop anywhere with our native iOS and Android apps, designed specifically for the African marketplace experience.
                                </p>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    {[
                                        { icon: Lightning, text: "Lightning-fast" },
                                        { icon: DeviceMobile, text: "Native apps" },
                                        { icon: Package, text: "Order tracking" },
                                        { icon: Star, text: "Rate products" },
                                    ].map((item) => (
                                        <div key={item.text} className="flex items-center gap-2">
                                            <item.icon size={16} weight="duotone" className="text-primary" />
                                            <span className="text-sm sm:text-base text-gray-700">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-6 sm:p-8 text-white">
                                <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-2xl" />
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">Enhanced Shopping</h3>
                                <ul className="space-y-2 sm:space-y-3">
                                    <li className="flex items-start gap-2 sm:gap-3">
                                        <Heart size={16} weight="duotone" className="text-secondary mt-1 flex-shrink-0" />
                                        <span className="text-sm sm:text-base text-white">Save your favourites</span>
                                    </li>
                                    <li className="flex items-start gap-2 sm:gap-3">
                                        <Bell size={16} weight="duotone" className="text-secondary mt-1 flex-shrink-0" />
                                        <span className="text-sm sm:text-base text-white">Real-time notifications</span>
                                    </li>
                                    <li className="flex items-start gap-2 sm:gap-3">
                                        <Shield size={16} weight="duotone" className="text-secondary mt-1 flex-shrink-0" />
                                        <span className="text-sm sm:text-base text-white">Secure & trusted platform</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vendor Tools Section */}
            <section className="py-12 sm:py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-4 sm:mb-6">For Vendors</h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Powerful tools to help African entrepreneurs grow their businesses
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[
                            { icon: ChartBar, title: "Analytics", description: "Track sales performance", color: "bg-blue-100 text-blue-600" },
                            { icon: Package, title: "Inventory", description: "Easy product management", color: "bg-green-100 text-green-600" },
                            { icon: ChatCircle, title: "Messaging", description: "Connect with customers", color: "bg-purple-100 text-purple-600" },
                            { icon: Clock, title: "Fast Payouts", description: "Quick access to earnings", color: "bg-orange-100 text-orange-600" },
                        ].map((tool) => (
                            <div key={tool.title} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                                <div className={`w-12 h-12 sm:w-16 sm:h-16 ${tool.color} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                                    <tool.icon size={24} weight="duotone" className="sm:w-6 sm:h-6" />
                                </div>
                                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">{tool.title}</h3>
                                <p className="text-sm sm:text-base text-gray-600">{tool.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-6 sm:mt-8">
                        <Link href="/vendor-onboarding" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold transition-all">
                            Become a Vendor
                            <ArrowSquareOut size={16} weight="duotone" className="sm:w-5 sm:h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-16 px-4 bg-gradient-to-br from-primary to-primary-dark">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-8 md:p-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white mb-3 sm:mb-6">Ready to Get Started?</h2>
                        <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                            Download the Zora app and experience the best African marketplace in the UK.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <Link
                                href="/#download"
                                className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold transition-all shadow-lg shadow-secondary/25"
                            >
                                Download App
                                <ArrowSquareOut size={16} weight="duotone" className="sm:w-5 sm:h-5" />
                            </Link>
                            <Link
                                href="/vendor-onboarding"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold border border-white/30 transition-all"
                            >
                                Become a Vendor
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
