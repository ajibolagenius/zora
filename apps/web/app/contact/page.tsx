"use client";

import Link from "next/link";
import { Envelope, Phone, MapPin, ChatCircle, Clock, PaperPlaneTilt, CheckCircle, ArrowSquareOut } from "@phosphor-icons/react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { FreeDeliveryBanner } from "@/components/marketing/FreeDeliveryBanner";

export default function ContactPage() {

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
                            Get in Touch
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white leading-[1.1] mb-4 sm:mb-6">
                            We&apos;d Love to Hear
                            <span className="relative inline-block mt-2">
                                from You
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                    <path d="M2 8.5C50 2.5 150 2.5 198 8.5" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
                            Have a question, feedback, or need help? Our team is here to assist you every step of the way.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Section */}
            <section className="py-12 sm:py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-4 sm:mb-6">Ways to Reach Us</h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Choose the most convenient way to get in touch with our team
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Envelope size={24} weight="duotone" className="text-primary" />
                            </div>
                            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">Email</h3>
                            <p className="text-sm sm:text-base text-gray-600">support@zoraapp.co.uk</p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Phone size={24} weight="duotone" className="text-green-600" />
                            </div>
                            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">Phone</h3>
                            <p className="text-sm sm:text-base text-gray-600">+44 (0) 20 1234 5678</p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <MapPin size={24} weight="duotone" className="text-orange-600" />
                            </div>
                            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">Location</h3>
                            <p className="text-sm sm:text-base text-gray-600">London, UK</p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Clock size={24} weight="duotone" className="text-blue-600" />
                            </div>
                            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">Hours</h3>
                            <p className="text-sm sm:text-base text-gray-600">Mon-Fri 9-6</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-12 sm:py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8">
                        <div className="text-center mb-6 sm:mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 mb-4">Send Us a Message</h2>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                                Our contact form is currently under maintenance. Please reach out to us via email at support@zoraapp.co.uk.
                            </p>
                        </div>
                        <div className="text-center">
                            <Link href="mailto:support@zoraapp.co.uk" className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold transition-all">
                                <Envelope size={20} weight="duotone" className="sm:w-5 sm:h-5" />
                                Email Us Directly
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Options Section */}
            <section className="py-12 sm:py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-4 sm:mb-6">Need More Help?</h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Explore our support options and resources
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 sm:p-6">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <ChatCircle size={20} weight="duotone" className="text-blue-600" />
                                <h3 className="font-bold text-base sm:text-lg text-gray-900">Quick Answers</h3>
                            </div>
                            <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                                Check out our FAQ section for answers to common questions about orders, vendors, and more.
                            </p>
                            <a href="#" className="text-primary font-medium text-sm hover:underline flex items-center gap-1">
                                View FAQ <ArrowSquareOut size={16} weight="duotone" />
                            </a>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 rounded-2xl p-4 sm:p-6">
                            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Vendor Support</h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                                Existing vendor or interested in selling? We have dedicated support for you.
                            </p>
                            <p className="text-sm sm:text-base text-gray-700">
                                <strong>Email:</strong> vendors@zoraapp.co.uk
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 sm:p-6">
                            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Partnerships</h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                                Interested in partnering with Zora? Let&apos;s explore opportunities together.
                            </p>
                            <Link href="/vendor-onboarding" className="text-primary font-medium text-sm hover:underline flex items-center gap-1">
                                Become a Partner <ArrowSquareOut size={16} weight="duotone" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Section */}
            <section className="py-12 sm:py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-6 sm:p-8 md:p-12 text-white">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display mb-4">Stay Connected</h3>
                        <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                            Follow us on social media for updates, tips, and community news.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {["Twitter", "Instagram", "Facebook"].map((social) => (
                                <a key={social} href="#" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all">
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
