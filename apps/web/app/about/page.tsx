"use client";

import Link from "next/link";
import { Heart, Globe, Users, Target, ArrowSquareOut, Sparkle, Bag, MapPin, Shield, Lightning, Star } from "@phosphor-icons/react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { ZoraLogo } from "@/components/landing/ZoraLogo";
import { FreeDeliveryBanner } from "@/components/marketing/FreeDeliveryBanner";

export default function AboutPage() {

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
                            Our Story
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white leading-[1.1] mb-4 sm:mb-6">
                            Connecting African Diaspora
                            <span className="relative inline-block mt-3 ml-2"> with Home
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                    <path d="M2 8.5C50 2.5 150 2.5 198 8.5" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
                            Zora is more than a marketplace. We&apos;re building a bridge between Africans abroad
                            and authentic products, flavours, and experiences that connect them to their roots.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 sm:py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Globe size={20} weight="duotone" className="text-primary" />
                            </div>
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900 block mb-1">5</span>
                            <span className="text-xs sm:text-sm text-gray-500">African Regions</span>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Users size={20} weight="duotone" className="text-secondary-dark" />
                            </div>
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900 block mb-1">100+</span>
                            <span className="text-xs sm:text-sm text-gray-500">Vendors</span>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Bag size={20} weight="duotone" className="text-green-600" />
                            </div>
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900 block mb-1">10,000+</span>
                            <span className="text-xs sm:text-sm text-gray-500">Products</span>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <MapPin size={20} weight="duotone" className="text-blue-600" />
                            </div>
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900 block mb-1">UK Wide</span>
                            <span className="text-xs sm:text-sm text-gray-500">Delivery</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-6">Our Mission</h2>
                            <div className="space-y-4">
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    For millions of Africans living abroad, finding authentic products from home can be
                                    challenging. We&apos;ve experienced this firsthand - searching for familiar spices,
                                    ingredients, and products that remind us of home.
                                </p>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Zora was born from this need. We&apos;re creating a central hub where African diaspora
                                    can easily discover and purchase authentic groceries, connect with trusted vendors,
                                    and experience a marketplace that truly understands their needs.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 text-white">
                                <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                                <h3 className="text-2xl font-bold mb-4">Why Zora?</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <Shield size={20} weight="duotone" className="text-secondary mt-1 flex-shrink-0" />
                                        <span>Trusted, vetted vendors</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Lightning size={20} weight="duotone" className="text-secondary mt-1 flex-shrink-0" />
                                        <span>Fast UK-wide delivery</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Heart size={20} weight="duotone" className="text-secondary mt-1 flex-shrink-0" />
                                        <span>Community-focused platform</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-4">Our Values</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            The principles that guide everything we do at Zora
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Heart, title: "Community First", description: "Building connections that matter", color: "bg-pink-100 text-pink-600" },
                            { icon: Target, title: "Authenticity", description: "Real products from home", color: "bg-orange-100 text-orange-600" },
                            { icon: Sparkle, title: "Cultural Pride", description: "Celebrating African heritage", color: "bg-purple-100 text-purple-600" },
                            { icon: Shield, title: "Trust & Quality", description: "Excellence in everything", color: "bg-green-100 text-green-600" },
                        ].map((value) => (
                            <div key={value.title} className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                                <div className={`w-16 h-16 ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                    <value.icon size={32} weight="duotone" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-sm text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-gradient-to-br from-primary to-primary-dark">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12">
                        <h2 className="text-3xl lg:text-4xl font-bold font-display text-white mb-4">Join the Zora Community</h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Whether you&apos;re looking for authentic African products or want to share your products with the diaspora.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/#download"
                                className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-gray-900 px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg shadow-secondary/25"
                            >
                                Download App
                                <ArrowSquareOut size={20} weight="duotone" />
                            </Link>
                            <Link
                                href="/vendor-onboarding"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold border border-white/30 transition-all"
                            >
                                Become a Vendor
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </main>
    );
}
