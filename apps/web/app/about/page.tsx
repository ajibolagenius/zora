"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Heart, Globe, Users, Target, ArrowUpRight, Sparkles, ShoppingBag, MapPin, Shield, Zap } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            {/* Bento Grid Content */}
            <section className="pt-24 pb-8 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-12 gap-3 md:gap-4">
                        {/* Hero Card */}
                        <div className="col-span-12 lg:col-span-8 bg-gradient-to-br from-primary via-primary to-primary-dark rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <span className="inline-block bg-white/20 text-xs font-semibold px-3 py-1 rounded-full mb-4">Our Story</span>
                                <h1 className="text-3xl md:text-4xl font-bold font-display leading-tight mb-4">
                                    Connecting the African Diaspora with Home
                                </h1>
                                <p className="text-white/80 max-w-xl">
                                    Zora is more than a marketplace. We&apos;re building a bridge between Africans abroad
                                    and the authentic products, flavours, and experiences that connect them to their roots.
                                </p>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="col-span-6 lg:col-span-2 bg-white rounded-2xl p-4 md:p-5 border border-gray-100 flex flex-col justify-center">
                            <Globe className="w-8 h-8 text-primary mb-2" />
                            <span className="text-2xl font-bold text-gray-900">5</span>
                            <span className="text-sm text-gray-500">African Regions</span>
                        </div>

                        <div className="col-span-6 lg:col-span-2 bg-white rounded-2xl p-4 md:p-5 border border-gray-100 flex flex-col justify-center">
                            <Users className="w-8 h-8 text-secondary-dark mb-2" />
                            <span className="text-2xl font-bold text-gray-900">100+</span>
                            <span className="text-sm text-gray-500">Vendors</span>
                        </div>

                        {/* Mission Card */}
                        <div className="col-span-12 md:col-span-6 bg-white rounded-2xl p-5 md:p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h2>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                For millions of Africans living abroad, finding authentic products from home can be
                                challenging. We&apos;ve experienced this firsthand - the search for familiar spices,
                                ingredients, and products that remind us of home.
                            </p>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Zora was born from this need. We&apos;re creating a central hub where the African diaspora
                                can easily discover and purchase authentic groceries, connect with trusted vendors,
                                and experience a marketplace that truly understands their needs.
                            </p>
                        </div>

                        {/* Values Grid */}
                        <div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-3">
                            {[
                                { icon: Heart, title: "Community First", color: "bg-pink-100 text-pink-600" },
                                { icon: Target, title: "Authenticity", color: "bg-orange-100 text-orange-600" },
                                { icon: Sparkles, title: "Cultural Pride", color: "bg-purple-100 text-purple-600" },
                                { icon: Shield, title: "Trust & Quality", color: "bg-green-100 text-green-600" },
                            ].map((value) => (
                                <div key={value.title} className="bg-white rounded-2xl p-4 border border-gray-100">
                                    <div className={`w-10 h-10 ${value.color} rounded-xl flex items-center justify-center mb-3`}>
                                        <value.icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-sm text-gray-900">{value.title}</span>
                                </div>
                            ))}
                        </div>

                        {/* What We Stand For */}
                        <div className="col-span-12 lg:col-span-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-5 md:p-6">
                            <h3 className="font-bold text-gray-900 mb-3">Empowering Vendors</h3>
                            <p className="text-sm text-gray-600">
                                We provide African entrepreneurs with the tools and platform they need to grow their businesses
                                and reach customers across the UK.
                            </p>
                        </div>

                        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-5 md:p-6">
                            <h3 className="font-bold text-gray-900 mb-3">Quality & Trust</h3>
                            <p className="text-sm text-gray-600">
                                Every vendor is carefully vetted, and every product meets our standards for authenticity and quality.
                            </p>
                        </div>

                        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-5 md:p-6">
                            <h3 className="font-bold text-gray-900 mb-3">Inclusive Community</h3>
                            <p className="text-sm text-gray-600">
                                Zora is for everyone who loves African culture - whether you&apos;re from the diaspora or simply appreciate
                                authentic African products.
                            </p>
                        </div>

                        {/* CTA Card */}
                        <div className="col-span-12 bg-background-dark rounded-2xl p-6 md:p-8 text-white">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold mb-2">Join the Zora Community</h3>
                                    <p className="text-gray-400 text-sm">
                                        Whether you&apos;re looking for authentic African products or want to share your products with the diaspora.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Link href="#download" className="bg-secondary text-gray-900 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-secondary-dark transition-colors flex items-center gap-2">
                                        Download App <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                    <Link href="/vendor-onboarding" className="bg-white/10 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white/20 transition-colors">
                                        Become a Vendor
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
