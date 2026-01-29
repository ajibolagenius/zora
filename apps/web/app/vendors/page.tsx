"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    ArrowUpRight, Check, ShoppingBag, BarChart3, Truck,
    CreditCard, Users, Shield, Clock, Headphones, Globe,
    Store, TrendingUp, Zap
} from "lucide-react";

export default function VendorsPage() {
    return (
        <main className="min-h-screen bg-background-light">
            <Header />

            {/* Hero Section */}
            <section className="pt-28 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden relative">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
                </div>
                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-8 h-0.5 bg-white/50"></div>
                            <span className="text-xs font-semibold tracking-widest text-white/80 uppercase">
                                For Vendors
                            </span>
                            <div className="w-8 h-0.5 bg-white/50"></div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-tight mb-6">
                            Grow Your African Business with Zora
                        </h1>
                        <p className="text-lg text-white/80 leading-relaxed mb-8">
                            Join hundreds of African-owned businesses reaching thousands of customers
                            across the UK. Easy setup, powerful tools, and dedicated support.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/vendor-onboarding"
                                className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-gray-900 px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg"
                            >
                                Start Selling Today
                                <ArrowUpRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors border border-white/20"
                            >
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: "100+", label: "Active Vendors" },
                            { value: "5,000+", label: "Products Listed" },
                            { value: "10K+", label: "Monthly Customers" },
                            { value: "UK Wide", label: "Delivery Coverage" },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl font-bold font-display text-primary mb-1">{stat.value}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Sell on Zora */}
            <section className="py-20 bg-background-light">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
                            Why Sell on Zora?
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We&apos;ve built everything you need to succeed in the African diaspora market
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: "Access to Diaspora Customers",
                                description: "Reach thousands of Africans in the UK actively searching for authentic products from home.",
                            },
                            {
                                icon: Store,
                                title: "Your Own Store Page",
                                description: "Get a beautiful, customizable store page to showcase your products and brand story.",
                            },
                            {
                                icon: BarChart3,
                                title: "Powerful Analytics",
                                description: "Track sales, understand your customers, and make data-driven decisions to grow.",
                            },
                            {
                                icon: Truck,
                                title: "Delivery Support",
                                description: "Flexible delivery options including UK-wide shipping and local pickup.",
                            },
                            {
                                icon: CreditCard,
                                title: "Secure Payments",
                                description: "Accept all major payment methods. We handle payments and send you quick payouts.",
                            },
                            {
                                icon: Headphones,
                                title: "Dedicated Support",
                                description: "Our vendor success team is here to help you grow and resolve any issues.",
                            },
                        ].map((feature) => (
                            <div key={feature.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            No monthly fees. Only pay when you make a sale.
                        </p>
                    </div>
                    <div className="max-w-lg mx-auto">
                        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 text-white text-center">
                            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
                                <Zap className="w-4 h-4" />
                                <span className="text-sm font-medium">Most Popular</span>
                            </div>
                            <div className="mb-6">
                                <span className="text-5xl font-bold">10%</span>
                                <span className="text-white/80 ml-2">per sale</span>
                            </div>
                            <p className="text-white/80 mb-8">
                                Commission on each successful order. No hidden fees, no monthly charges.
                            </p>
                            <ul className="text-left space-y-4 mb-8">
                                {[
                                    "Unlimited product listings",
                                    "Customizable store page",
                                    "Analytics dashboard",
                                    "Order management tools",
                                    "Customer messaging",
                                    "Fast payouts (within 7 days)",
                                    "Dedicated vendor support",
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-gray-900" />
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/vendor-onboarding"
                                className="block w-full bg-secondary hover:bg-secondary-dark text-gray-900 px-8 py-4 rounded-full text-lg font-semibold transition-all text-center"
                            >
                                Get Started Free
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-background-light">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
                            How to Get Started
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Start selling on Zora in just a few simple steps
                        </p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                step: "1",
                                title: "Apply",
                                description: "Fill out our simple application form with your business details",
                                icon: Globe,
                            },
                            {
                                step: "2",
                                title: "Get Verified",
                                description: "Our team reviews your application (usually within 48 hours)",
                                icon: Shield,
                            },
                            {
                                step: "3",
                                title: "Set Up Shop",
                                description: "Add your products, customize your store, and set delivery options",
                                icon: Store,
                            },
                            {
                                step: "4",
                                title: "Start Selling",
                                description: "Go live and reach customers across the UK instantly",
                                icon: TrendingUp,
                            },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="relative mb-6">
                                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                        <item.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        {item.step}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-background-dark">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
                        Ready to Grow Your Business?
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                        Join the Zora marketplace today and start reaching African diaspora
                        customers across the United Kingdom.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/vendor-onboarding"
                            className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-gray-900 px-8 py-4 rounded-full text-lg font-semibold transition-all"
                        >
                            Start Your Application
                            <ArrowUpRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors border border-white/20"
                        >
                            Talk to Our Team
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
