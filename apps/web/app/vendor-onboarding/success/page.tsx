"use client";

import Link from "next/link";
import { Check, ArrowRight, Envelope, Phone } from "@phosphor-icons/react";
import { Button } from "@zora/ui-web";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { FreeDeliveryBanner } from "@/components/marketing/FreeDeliveryBanner";

export default function VendorOnboardingSuccessPage() {
    return (
        <main className="min-h-screen bg-background-light">
            {/* Free Delivery Banner - Fixed at top */}
            <FreeDeliveryBanner />

            {/* Navigation */}
            <Navigation />

            {/* Success Section */}
            <section className="relative min-h-[60vh] bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 min-h-[60vh] flex items-center justify-center py-20">
                    <div className="text-center max-w-3xl">
                        {/* Success Icon */}
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Check size={40} weight="bold" className="text-white" />
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white leading-[1.1] mb-6">
                            Application
                            <span className="relative inline-block mt-2">
                                Submitted Successfully!
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                    <path d="M2 8.5C50 2.5 150 2.5 198 8.5" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Thank you for your interest in becoming a Zora vendor! We've received your application and will review it within 2-3 business days.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link href="/about">
                                <Button
                                    variant="secondary"
                                    rightIcon={<ArrowRight size={16} weight="duotone" />}
                                    className="w-full sm:w-auto"
                                >
                                    Learn About Zora
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button
                                    variant="ghost"
                                    className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-primary"
                                >
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* What's Next Section */}
            <section className="py-16 sm:py-20 px-4 bg-white">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 mb-4">
                            What Happens Next?
                        </h2>
                        <p className="text-lg text-gray-600">
                            Here's what to expect during the review process
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "1",
                                title: "Application Review",
                                description: "Our team will review your business information and documents to ensure everything meets our requirements.",
                                timeline: "1-2 business days"
                            },
                            {
                                step: "2",
                                title: "Verification Process",
                                description: "We'll verify your business details and may contact you for additional information if needed.",
                                timeline: "2-3 business days"
                            },
                            {
                                step: "3",
                                title: "Account Setup",
                                description: "Once approved, we'll set up your vendor account and send you login credentials to get started.",
                                timeline: "Within 24 hours of approval"
                            }
                        ].map((item, index) => (
                            <div key={index} className="relative">
                                <div className="bg-gray-50 rounded-2xl p-6 h-full">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                            {item.step}
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">{item.description}</p>
                                    <div className="text-sm text-primary font-medium">{item.timeline}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 sm:py-20 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8 sm:p-12">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 mb-4">
                                Questions About Your Application?
                            </h2>
                            <p className="text-gray-600">
                                Our support team is here to help you throughout the process
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Envelope size={20} weight="duotone" className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Email Support</h3>
                                    <p className="text-gray-600">vendors@zora.co.uk</p>
                                    <p className="text-sm text-gray-500">Response within 24 hours</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Phone size={20} weight="duotone" className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Phone Support</h3>
                                    <p className="text-gray-600">0800 123 4567</p>
                                    <p className="text-sm text-gray-500">Mon-Fri, 9am-5pm</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <Link href="/contact">
                                <Button variant="ghost">
                                    Visit Contact Page
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resources Section */}
            <section className="py-16 sm:py-20 px-4 bg-white">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 mb-4">
                            Prepare for Your Vendor Journey
                        </h2>
                        <p className="text-gray-600">
                            Get a head start with these helpful resources
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Link href="/about" className="block group">
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all">
                                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary">
                                    Vendor Setup Guide
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Learn how to set up your vendor profile, add products, and manage orders.
                                </p>
                            </div>
                        </Link>

                        <Link href="/contact" className="block group">
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all">
                                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary">
                                    Contact Support
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Get help with any questions about your application.
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
