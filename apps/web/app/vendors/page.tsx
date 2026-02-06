"use client";

import Link from "next/link";
import { ArrowSquareOut, Check, Bag, ChartBar, Truck, CreditCard, Users, Shield, Clock, Headphones, Globe, Storefront, TrendUp, Lightning } from "@phosphor-icons/react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { FreeDeliveryBanner } from "@/components/marketing/FreeDeliveryBanner";

export default function VendorsPage() {

    const benefits = [
        { icon: Users, title: "Diaspora Customers", desc: "Reach thousands actively searching" },
        { icon: Storefront, title: "Your Own Store", desc: "Beautiful, customizable page" },
        { icon: ChartBar, title: "Analytics", desc: "Track sales & insights" },
        { icon: Truck, title: "Delivery Support", desc: "Flexible delivery options" },
        { icon: CreditCard, title: "Secure Payments", desc: "All major payment methods" },
        { icon: Headphones, title: "Dedicated Support", desc: "We help you grow" },
    ];

    const steps = [
        { num: "1", title: "Apply", desc: "Fill out our simple form", icon: Globe },
        { num: "2", title: "Get Verified", desc: "Review within 48 hours", icon: Shield },
        { num: "3", title: "Set Up Shop", desc: "Add products & customize", icon: Storefront },
        { num: "4", title: "Start Selling", desc: "Go live instantly", icon: TrendUp },
    ];

    const included = [
        "Unlimited product listings",
        "Customizable store page",
        "Analytics dashboard",
        "Order management tools",
        "Customer messaging",
        "Fast payouts (within 7 days)",
        "Dedicated vendor support",
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

                <div className="relative z-10 container mx-auto px-4 sm:px-6 min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center pt-24 sm:pt-32 lg:pt-40">
                    <div className="text-center max-w-4xl">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
                            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                            For Vendors
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white leading-[1.1] mb-4 sm:mb-6">
                            Grow Your African Business
                            <span className="relative inline-block mt-2 ml-2">
                                with Zora
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                    <path d="M2 8.5C50 2.5 150 2.5 198 8.5" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
                            Join hundreds of African-owned businesses reaching thousands of customers across the UK.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <Link href="/vendor-onboarding" className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold transition-all shadow-lg shadow-secondary/25">
                                Start Selling Today
                                <ArrowSquareOut size={16} weight="duotone" className="sm:w-5 sm:h-5" />
                            </Link>
                            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold border border-white/30 transition-all">
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 sm:py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Storefront size={20} weight="duotone" className="text-primary" />
                            </div>
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900 block mb-1">100+</span>
                            <span className="text-xs sm:text-sm text-gray-500">Active Vendors</span>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Bag size={20} weight="duotone" className="text-secondary-dark" />
                            </div>
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900 block mb-1">5,000+</span>
                            <span className="text-xs sm:text-sm text-gray-500">Products Listed</span>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Users size={20} weight="duotone" className="text-green-600" />
                            </div>
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900 block mb-1">10K+</span>
                            <span className="text-xs sm:text-sm text-gray-500">Monthly Customers</span>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Truck size={20} weight="duotone" className="text-blue-600" />
                            </div>
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900 block mb-1">UK Wide</span>
                            <span className="text-xs sm:text-sm text-gray-500">Delivery Coverage</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-12 sm:py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-4 sm:mb-6">Why Sell on Zora?</h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Everything you need to grow your African business in the UK market
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {benefits.map((benefit) => (
                            <div key={benefit.title} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                                    <benefit.icon size={24} weight="duotone" className="sm:w-6 sm:h-6" />
                                </div>
                                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">{benefit.title}</h3>
                                <p className="text-sm sm:text-base text-gray-600">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-12 sm:py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Lightning size={20} weight="duotone" className="text-secondary" />
                                <span className="text-sm font-medium text-gray-500">Simple Pricing</span>
                            </div>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-4xl sm:text-5xl font-bold text-secondary">10%</span>
                                <span className="text-gray-600 text-lg">per sale</span>
                            </div>
                            <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                                No monthly fees. Only pay when you make a sale. Transparent pricing that helps you grow.
                            </p>
                            <div className="space-y-3">
                                {included.slice(0, 4).map((item) => (
                                    <div key={item} className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                                            <Check size={12} weight="duotone" className="text-gray-900" />
                                        </div>
                                        <span className="text-sm sm:text-base text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-3xl p-6 sm:p-8">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Everything Included</h3>
                            <div className="space-y-3">
                                {included.map((item) => (
                                    <div key={item} className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Check size={12} weight="duotone" className="text-green-600" />
                                        </div>
                                        <span className="text-sm sm:text-base text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-12 sm:py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-4 sm:mb-6">How to Get Started</h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            From application to your first sale in four simple steps
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {steps.map((step) => (
                            <div key={step.num} className="text-center">
                                <div className="relative inline-block mb-3 sm:mb-4">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                                        <step.icon size={20} weight="duotone" className="text-primary sm:w-6 sm:h-6" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        {step.num}
                                    </div>
                                </div>
                                <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-1">{step.title}</h4>
                                <p className="text-xs sm:text-sm text-gray-600">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-16 px-4 bg-gradient-to-br from-secondary to-yellow-500">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-8 md:p-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-3 sm:mb-6">Ready to Grow Your Business?</h2>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-800 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                            Join the Zora marketplace today and start reaching African diaspora customers across the UK.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <Link
                                href="/vendor-onboarding"
                                className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold transition-all"
                            >
                                Start Your Application
                                <ArrowSquareOut size={16} weight="duotone" className="sm:w-5 sm:h-5" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold border border-white/30 transition-all"
                            >
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
