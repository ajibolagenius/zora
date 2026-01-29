"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Heart, Globe, Users, Target, ArrowUpRight, Sparkles, ShoppingBag } from "lucide-react";

export default function AboutPage() {
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
                                Our Story
                            </span>
                            <div className="w-8 h-0.5 bg-primary"></div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold font-display leading-tight text-gray-900 mb-6">
                            Connecting the African Diaspora with{" "}
                            <span className="text-primary">Home</span>
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Zora is more than a marketplace. We&apos;re building a bridge between Africans abroad
                            and the authentic products, flavours, and experiences that connect them to their roots.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold font-display text-gray-900 mb-6">
                                Our Mission
                            </h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                For millions of Africans living abroad, finding authentic products from home can be
                                challenging. We&apos;ve experienced this firsthand - the search for familiar spices,
                                ingredients, and products that remind us of home.
                            </p>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Zora was born from this need. We&apos;re creating a central hub where the African diaspora
                                can easily discover and purchase authentic groceries, connect with trusted vendors,
                                and experience a marketplace that truly understands their needs.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                                    <Globe className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium text-gray-900">5 African Regions</span>
                                </div>
                                <div className="flex items-center gap-2 bg-secondary/20 px-4 py-2 rounded-full">
                                    <Users className="w-4 h-4 text-secondary-dark" />
                                    <span className="text-sm font-medium text-gray-900">100+ Vendors</span>
                                </div>
                                <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                                    <ShoppingBag className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium text-gray-900">5,000+ Products</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 lg:p-12">
                            <div className="space-y-6">
                                {[
                                    {
                                        icon: Heart,
                                        title: "Community First",
                                        description: "Supporting African-owned businesses and connecting communities across the UK"
                                    },
                                    {
                                        icon: Target,
                                        title: "Authenticity",
                                        description: "Every product is sourced from verified vendors who share our commitment to quality"
                                    },
                                    {
                                        icon: Sparkles,
                                        title: "Cultural Pride",
                                        description: "Celebrating African heritage through food, products, and shared experiences"
                                    },
                                ].map((value) => (
                                    <div key={value.title} className="flex gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                            <value.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">{value.title}</h3>
                                            <p className="text-sm text-gray-600">{value.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-background-light">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                            What We Stand For
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Our core values guide everything we do at Zora
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Empowering Vendors",
                                description: "We provide African entrepreneurs with the tools and platform they need to grow their businesses and reach customers across the UK.",
                                color: "bg-orange-100",
                                iconColor: "text-orange-600",
                            },
                            {
                                title: "Quality & Trust",
                                description: "Every vendor is carefully vetted, and every product meets our standards for authenticity and quality.",
                                color: "bg-green-100",
                                iconColor: "text-green-600",
                            },
                            {
                                title: "Inclusive Community",
                                description: "Zora is for everyone who loves African culture - whether you're from the diaspora or simply appreciate authentic African products.",
                                color: "bg-blue-100",
                                iconColor: "text-blue-600",
                            },
                        ].map((value) => (
                            <div key={value.title} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className={`w-14 h-14 ${value.color} rounded-xl flex items-center justify-center mb-6`}>
                                    <Heart className={`w-7 h-7 ${value.iconColor}`} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold font-display text-white mb-4">
                        Join the Zora Community
                    </h2>
                    <p className="text-white/80 max-w-2xl mx-auto mb-8">
                        Whether you&apos;re looking for authentic African products or want to share your products
                        with the diaspora, Zora is your home.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="#download"
                            className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-gray-900 px-8 py-4 rounded-full text-base font-semibold transition-all"
                        >
                            Download the App
                            <ArrowUpRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/vendor-onboarding"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full text-base font-semibold transition-colors border border-white/20"
                        >
                            Become a Vendor
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
