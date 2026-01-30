"use client";

import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    MagnifyingGlass, Bag, CreditCard, Truck, MapPin, Heart,
    Bell, Shield, Globe, ArrowSquareOut, DeviceMobile, ChartBar,
    ChatCircle, Lightning, Package, Star, Clock
} from "@phosphor-icons/react";

export default function FeaturesPage() {
    const features = [
        { icon: MagnifyingGlass, title: "Smart Search", desc: "Find by name, vendor, or region", color: "bg-blue-100 text-blue-600" },
        { icon: Globe, title: "Shop by Region", desc: "5 African regions to explore", color: "bg-orange-100 text-orange-600" },
        { icon: Bag, title: "Multi-Vendor Cart", desc: "One checkout for all vendors", color: "bg-purple-100 text-purple-600" },
        { icon: CreditCard, title: "Flexible Payments", desc: "Cards, Klarna, Clearpay", color: "bg-green-100 text-green-600" },
        { icon: Truck, title: "UK-Wide Delivery", desc: "Fast & reliable shipping", color: "bg-yellow-100 text-yellow-600" },
        { icon: MapPin, title: "Vendor Discovery", desc: "Find vendors near you", color: "bg-red-100 text-red-600" },
        { icon: Heart, title: "Wishlist", desc: "Save your favourites", color: "bg-pink-100 text-pink-600" },
        { icon: Bell, title: "Notifications", desc: "Real-time order updates", color: "bg-indigo-100 text-indigo-600" },
        { icon: Shield, title: "Secure & Trusted", desc: "Verified vendors only", color: "bg-teal-100 text-teal-600" },
    ];

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            {/* Bento Grid Content */}
            <section className="pt-24 pb-8 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-12 gap-3 md:gap-4">
                        {/* Hero Card */}
                        <div className="col-span-12 lg:col-span-7 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <span className="inline-block bg-white/20 text-xs font-semibold px-3 py-1 rounded-full mb-4">Platform Features</span>
                                <h1 className="text-3xl md:text-4xl font-bold font-display leading-tight mb-4">
                                    Everything You Need to Shop African
                                </h1>
                                <p className="text-white/80 max-w-lg">
                                    Discover powerful features designed to make finding and purchasing authentic African products easier than ever.
                                </p>
                            </div>
                        </div>

                        {/* App Preview */}
                        <div className="col-span-12 lg:col-span-5 bg-background-dark rounded-2xl p-4 relative overflow-hidden min-h-[200px] md:min-h-[250px]">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-[120px] md:w-[140px] bg-surface rounded-[1.5rem] p-1.5 shadow-xl">
                                    <div className="rounded-[1.2rem] overflow-hidden">
                                        <Image src="/images/screenshots/home.png" alt="Zora App" width={140} height={280} className="w-full h-auto" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                                <p className="text-white/60 text-xs text-center">Native iOS & Android</p>
                            </div>
                        </div>

                        {/* Features Grid */}
                        {features.map((feature) => (
                            <div key={feature.title} className="col-span-6 md:col-span-4 bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group">
                                <div className={`w-10 h-10 ${feature.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                    <feature.icon size={20} weight="duotone" />
                                </div>
                                <h3 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h3>
                                <p className="text-xs text-gray-500">{feature.desc}</p>
                            </div>
                        ))}

                        {/* Mobile App Section */}
                        <div className="col-span-12 md:col-span-6 bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 md:p-6 text-white">
                            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Mobile Experience</span>
                            <h3 className="text-xl font-bold mt-2 mb-3">Shop Anywhere with the Zora App</h3>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {[
                                    { icon: Lightning, text: "Lightning-fast" },
                                    { icon: DeviceMobile, text: "Native apps" },
                                    { icon: Package, text: "Order tracking" },
                                    { icon: Star, text: "Rate products" },
                                ].map((item) => (
                                    <div key={item.text} className="flex items-center gap-2">
                                        <item.icon size={16} weight="duotone" className="text-secondary" />
                                        <span className="text-sm text-white/80">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <a href="#" className="bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors">
                                    App Store
                                </a>
                                <a href="#" className="bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors">
                                    Google Play
                                </a>
                            </div>
                        </div>

                        {/* Vendor Tools Section */}
                        <div className="col-span-12 md:col-span-6 bg-white rounded-2xl p-5 md:p-6 border border-gray-100">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">For Vendors</span>
                            <h3 className="text-xl font-bold text-gray-900 mt-2 mb-4">Powerful Tools to Grow</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: ChartBar, title: "Analytics", color: "bg-blue-100 text-blue-600" },
                                    { icon: Package, title: "Inventory", color: "bg-green-100 text-green-600" },
                                    { icon: ChatCircle, title: "Messaging", color: "bg-purple-100 text-purple-600" },
                                    { icon: Clock, title: "Fast Payouts", color: "bg-orange-100 text-orange-600" },
                                ].map((tool) => (
                                    <div key={tool.title} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                                        <div className={`w-8 h-8 ${tool.color} rounded-lg flex items-center justify-center`}>
                                            <tool.icon size={16} weight="duotone" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{tool.title}</span>
                                    </div>
                                ))}
                            </div>
                            <Link href="/vendors" className="inline-flex items-center gap-2 text-primary font-medium text-sm mt-4 hover:underline">
                                Learn more about selling <ArrowSquareOut size={16} weight="duotone" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
