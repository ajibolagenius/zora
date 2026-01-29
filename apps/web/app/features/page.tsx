"use client";

import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    Search, ShoppingBag, CreditCard, Truck, MapPin, Heart,
    Bell, Shield, Clock, Star, Package, Globe, ArrowUpRight,
    Smartphone, BarChart3, MessageSquare, Zap
} from "lucide-react";

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-background-light">
            <Header />

            {/* Hero Section */}
            <section className="pt-28 pb-16 lg:pt-32 lg:pb-20">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-8 h-0.5 bg-primary"></div>
                            <span className="text-xs font-semibold tracking-widest text-gray-600 uppercase">
                                Platform Features
                            </span>
                            <div className="w-8 h-0.5 bg-primary"></div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold font-display leading-tight text-gray-900 mb-6">
                            Everything You Need to{" "}
                            <span className="text-primary">Shop African</span>
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Discover powerful features designed to make finding and purchasing
                            authentic African products easier than ever.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Features Grid */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Search,
                                title: "Smart Search",
                                description: "Find products by name, vendor, category, or cultural region. Our intelligent search understands what you're looking for.",
                                color: "bg-blue-100 text-blue-600",
                            },
                            {
                                icon: Globe,
                                title: "Shop by Region",
                                description: "Browse products from West, East, North, South, and Central Africa. Find authentic items from your home region.",
                                color: "bg-orange-100 text-orange-600",
                            },
                            {
                                icon: ShoppingBag,
                                title: "Multi-Vendor Cart",
                                description: "Add products from multiple vendors to a single cart. One checkout for all your African grocery needs.",
                                color: "bg-purple-100 text-purple-600",
                            },
                            {
                                icon: CreditCard,
                                title: "Flexible Payments",
                                description: "Pay your way with Stripe, Apple Pay, Google Pay, Klarna, or Clearpay. Secure and convenient options.",
                                color: "bg-green-100 text-green-600",
                            },
                            {
                                icon: Truck,
                                title: "UK-Wide Delivery",
                                description: "Fast and reliable delivery across the United Kingdom. Track your order every step of the way.",
                                color: "bg-yellow-100 text-yellow-600",
                            },
                            {
                                icon: MapPin,
                                title: "Vendor Discovery",
                                description: "Find African vendors near you with our interactive map. Support local African-owned businesses.",
                                color: "bg-red-100 text-red-600",
                            },
                            {
                                icon: Heart,
                                title: "Wishlist & Favourites",
                                description: "Save your favourite products and vendors. Build your personal collection of go-to African items.",
                                color: "bg-pink-100 text-pink-600",
                            },
                            {
                                icon: Bell,
                                title: "Order Notifications",
                                description: "Real-time updates on your order status. Know exactly when your products are on the way.",
                                color: "bg-indigo-100 text-indigo-600",
                            },
                            {
                                icon: Shield,
                                title: "Secure & Trusted",
                                description: "All vendors are verified. Secure payments and buyer protection on every purchase.",
                                color: "bg-teal-100 text-teal-600",
                            },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all group"
                            >
                                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* App Showcase Section */}
            <section className="py-20 bg-background-light">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-0.5 bg-primary"></div>
                                <span className="text-xs font-semibold tracking-widest text-gray-600 uppercase">
                                    Mobile Experience
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-6">
                                Shop Anywhere with the Zora App
                            </h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                The Zora mobile app puts the entire African marketplace in your pocket.
                                Beautifully designed and packed with features to make shopping a joy.
                            </p>
                            <div className="space-y-4 mb-8">
                                {[
                                    { icon: Zap, text: "Lightning-fast performance" },
                                    { icon: Smartphone, text: "Native iOS & Android apps" },
                                    { icon: Package, text: "Real-time order tracking" },
                                    { icon: Star, text: "Rate and review products" },
                                ].map((item) => (
                                    <div key={item.text} className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <item.icon className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-gray-700">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="#" className="bg-gray-900 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-800 transition-colors">
                                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-[10px] leading-tight opacity-70">Download on the</div>
                                        <div className="text-base font-semibold leading-tight">App Store</div>
                                    </div>
                                </a>
                                <a href="#" className="bg-gray-900 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-800 transition-colors">
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
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="bg-background-dark rounded-[2.5rem] p-2 shadow-2xl">
                                    <div className="rounded-[2rem] overflow-hidden w-[260px]">
                                        <Image
                                            src="/images/screenshots/home.png"
                                            alt="Zora App"
                                            width={260}
                                            height={520}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vendor Features */}
            <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                            Powerful Tools for Vendors
                        </h2>
                        <p className="text-white/80 max-w-2xl mx-auto">
                            Everything you need to manage and grow your African business on Zora
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: BarChart3, title: "Sales Analytics", description: "Track your sales, revenue, and customer insights" },
                            { icon: Package, title: "Inventory Management", description: "Manage stock levels and receive low-stock alerts" },
                            { icon: MessageSquare, title: "Customer Messaging", description: "Communicate directly with your customers" },
                            { icon: Clock, title: "Quick Payouts", description: "Get paid fast with our streamlined payout system" },
                        ].map((feature) => (
                            <div key={feature.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
                                <feature.icon className="w-8 h-8 text-secondary mb-4" />
                                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                <p className="text-white/70 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link
                            href="/vendors"
                            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-gray-900 px-8 py-4 rounded-full text-base font-semibold transition-all"
                        >
                            Learn More About Selling
                            <ArrowUpRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
