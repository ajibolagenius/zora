"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    ArrowUpRight, Check, ShoppingBag, BarChart3, Truck,
    CreditCard, Users, Shield, Clock, Headphones, Globe, Store, TrendingUp, Zap
} from "lucide-react";

export default function VendorsPage() {
    const benefits = [
        { icon: Users, title: "Diaspora Customers", desc: "Reach thousands actively searching" },
        { icon: Store, title: "Your Own Store", desc: "Beautiful, customizable page" },
        { icon: BarChart3, title: "Analytics", desc: "Track sales & insights" },
        { icon: Truck, title: "Delivery Support", desc: "Flexible delivery options" },
        { icon: CreditCard, title: "Secure Payments", desc: "All major payment methods" },
        { icon: Headphones, title: "Dedicated Support", desc: "We help you grow" },
    ];

    const steps = [
        { num: "1", title: "Apply", desc: "Fill out our simple form", icon: Globe },
        { num: "2", title: "Get Verified", desc: "Review within 48 hours", icon: Shield },
        { num: "3", title: "Set Up Shop", desc: "Add products & customize", icon: Store },
        { num: "4", title: "Start Selling", desc: "Go live instantly", icon: TrendingUp },
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
        <main className="min-h-screen bg-gray-50">
            <Header />

            {/* Bento Grid Content */}
            <section className="pt-24 pb-8 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-12 gap-3 md:gap-4">
                        {/* Hero Card */}
                        <div className="col-span-12 lg:col-span-8 bg-gradient-to-br from-primary via-primary to-primary-dark rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                            <div className="relative z-10">
                                <span className="inline-block bg-white/20 text-xs font-semibold px-3 py-1 rounded-full mb-4">For Vendors</span>
                                <h1 className="text-3xl md:text-4xl font-bold font-display leading-tight mb-4">
                                    Grow Your African Business with Zora
                                </h1>
                                <p className="text-white/80 max-w-lg mb-6">
                                    Join hundreds of African-owned businesses reaching thousands of customers across the UK.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link href="/vendor-onboarding" className="bg-secondary text-gray-900 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-secondary-dark transition-colors flex items-center gap-2">
                                        Start Selling Today <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                    <Link href="/contact" className="bg-white/20 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white/30 transition-colors">
                                        Contact Sales
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Stats Column */}
                        <div className="col-span-12 lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3">
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
                                <span className="text-2xl md:text-3xl font-bold text-primary">100+</span>
                                <p className="text-sm text-gray-500">Active Vendors</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
                                <span className="text-2xl md:text-3xl font-bold text-primary">5,000+</span>
                                <p className="text-sm text-gray-500">Products Listed</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
                                <span className="text-2xl md:text-3xl font-bold text-primary">10K+</span>
                                <p className="text-sm text-gray-500">Monthly Customers</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
                                <span className="text-2xl md:text-3xl font-bold text-primary">UK Wide</span>
                                <p className="text-sm text-gray-500">Delivery Coverage</p>
                            </div>
                        </div>

                        {/* Benefits Grid */}
                        {benefits.map((benefit) => (
                            <div key={benefit.title} className="col-span-6 md:col-span-4 bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-all">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                                    <benefit.icon className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-semibold text-gray-900 text-sm mb-1">{benefit.title}</h3>
                                <p className="text-xs text-gray-500">{benefit.desc}</p>
                            </div>
                        ))}

                        {/* Pricing Card */}
                        <div className="col-span-12 md:col-span-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 md:p-6 text-white">
                            <div className="flex items-center gap-2 mb-4">
                                <Zap className="w-5 h-5 text-secondary" />
                                <span className="text-sm font-medium text-gray-400">Simple Pricing</span>
                            </div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl md:text-5xl font-bold text-secondary">10%</span>
                                <span className="text-gray-400">per sale</span>
                            </div>
                            <p className="text-sm text-gray-400 mb-4">No monthly fees. Only pay when you make a sale.</p>
                            <div className="space-y-2">
                                {included.slice(0, 4).map((item) => (
                                    <div key={item} className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                                            <Check className="w-2.5 h-2.5 text-gray-900" />
                                        </div>
                                        <span className="text-sm text-gray-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* What's Included Card */}
                        <div className="col-span-12 md:col-span-6 bg-white rounded-2xl p-5 md:p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">Everything Included</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {included.map((item) => (
                                    <div key={item} className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-sm text-gray-600">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* How It Works */}
                        <div className="col-span-12 bg-white rounded-2xl p-5 md:p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 text-center">How to Get Started</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {steps.map((step) => (
                                    <div key={step.num} className="text-center">
                                        <div className="relative inline-block mb-3">
                                            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                                                <step.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                {step.num}
                                            </div>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 text-sm">{step.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="col-span-12 bg-gradient-to-br from-secondary to-yellow-500 rounded-2xl p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Ready to Grow Your Business?</h3>
                                    <p className="text-gray-700 text-sm">
                                        Join the Zora marketplace today and start reaching African diaspora customers.
                                    </p>
                                </div>
                                <Link href="/vendor-onboarding" className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2 whitespace-nowrap">
                                    Start Your Application <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
