"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Envelope, Phone, MapPin, ChatCircle, Clock, PaperPlaneTilt, CheckCircle, ArrowSquareOut } from "@phosphor-icons/react";

export default function ContactPage() {
    const [formState, setFormState] = useState<"idle" | "loading" | "success">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState("loading");
        await new Promise(resolve => setTimeout(resolve, 1500));
        setFormState("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            {/* Bento Grid Content */}
            <section className="pt-24 pb-8 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-12 gap-3 md:gap-4">
                        {/* Hero Card */}
                        <div className="col-span-12 lg:col-span-5 bg-gradient-to-br from-primary via-primary to-primary-dark rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                            <div className="relative z-10">
                                <span className="inline-block bg-white/20 text-xs font-semibold px-3 py-1 rounded-full mb-4">Get in Touch</span>
                                <h1 className="text-2xl md:text-3xl font-bold font-display leading-tight mb-4">
                                    We&apos;d Love to Hear from You
                                </h1>
                                <p className="text-white/80 text-sm">
                                    Have a question, feedback, or need help? Our team is here to assist you.
                                </p>
                            </div>
                        </div>

                        {/* Contact Info Cards */}
                        <div className="col-span-6 lg:col-span-2 bg-white rounded-2xl p-4 border border-gray-100">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                                <Envelope size={20} weight="duotone" className="text-primary" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">Email</h3>
                            <p className="text-xs text-gray-500">support@zoraapp.co.uk</p>
                        </div>

                        <div className="col-span-6 lg:col-span-2 bg-white rounded-2xl p-4 border border-gray-100">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                                <Phone size={20} weight="duotone" className="text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">Phone</h3>
                            <p className="text-xs text-gray-500">+44 (0) 20 1234 5678</p>
                        </div>

                        <div className="col-span-6 lg:col-span-2 bg-white rounded-2xl p-4 border border-gray-100">
                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                                <MapPin size={20} weight="duotone" className="text-orange-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">Location</h3>
                            <p className="text-xs text-gray-500">London, UK</p>
                        </div>

                        <div className="col-span-6 lg:col-span-1 bg-white rounded-2xl p-4 border border-gray-100">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                                <Clock size={20} weight="duotone" className="text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">Hours</h3>
                            <p className="text-xs text-gray-500">Mon-Fri 9-6</p>
                        </div>

                        {/* Contact Form */}
                        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-5 md:p-6 border border-gray-100">
                            {formState === "success" ? (
                                <div className="text-center py-8">
                                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle size={28} weight="duotone" className="text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
                                    <p className="text-sm text-gray-600 mb-4">We&apos;ll get back to you within 24 hours.</p>
                                    <button onClick={() => setFormState("idle")} className="text-primary font-medium text-sm hover:underline">
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="font-bold text-gray-900 mb-4">Send Us a Message</h2>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                                    placeholder="Your name"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                                    placeholder="you@example.com"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                            <select
                                                id="subject"
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                            >
                                                <option value="">Select a topic</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="order">Order Support</option>
                                                <option value="vendor">Vendor Inquiry</option>
                                                <option value="partnership">Partnership</option>
                                                <option value="feedback">Feedback</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                            <textarea
                                                id="message"
                                                required
                                                rows={4}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm resize-none"
                                                placeholder="How can we help you?"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={formState === "loading"}
                                            className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {formState === "loading" ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message <PaperPlaneTilt size={16} weight="duotone" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>

                        {/* FAQ Card */}
                        <div className="col-span-12 lg:col-span-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-5 md:p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <ChatCircle size={20} weight="duotone" className="text-blue-600" />
                                <h3 className="font-semibold text-gray-900">Need Quick Answers?</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Check out our FAQ section for answers to common questions about orders, vendors, and more.
                            </p>
                            <a href="#" className="text-primary font-medium text-sm hover:underline flex items-center gap-1">
                                View FAQ <ArrowSquareOut size={16} weight="duotone" />
                            </a>
                        </div>

                        {/* Vendor Support Card */}
                        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-5 md:p-6">
                            <h3 className="font-semibold text-gray-900 mb-2">Vendor Support</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Existing vendor or interested in selling? We have dedicated support for you.
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Email:</strong> vendors@zoraapp.co.uk
                            </p>
                        </div>

                        {/* Partnership Card */}
                        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-5 md:p-6">
                            <h3 className="font-semibold text-gray-900 mb-2">Partnerships</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Interested in partnering with Zora? Let&apos;s explore opportunities together.
                            </p>
                            <Link href="/vendor-onboarding" className="text-primary font-medium text-sm hover:underline flex items-center gap-1">
                                Become a Partner <ArrowSquareOut size={16} weight="duotone" />
                            </Link>
                        </div>

                        {/* Social Card */}
                        <div className="col-span-12 lg:col-span-4 bg-background-dark rounded-2xl p-5 md:p-6 text-white">
                            <h3 className="font-semibold mb-3">Follow Us</h3>
                            <p className="text-sm text-gray-400 mb-4">Stay connected for updates, tips, and community news.</p>
                            <div className="flex gap-3">
                                {["Twitter", "Instagram", "Facebook"].map((social) => (
                                    <a key={social} href="#" className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                                        {social}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
