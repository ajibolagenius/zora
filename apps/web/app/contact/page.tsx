"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, MessageSquare, Clock, Send, CheckCircle } from "lucide-react";

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
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        setFormState("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

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
                                Get in Touch
                            </span>
                            <div className="w-8 h-0.5 bg-primary"></div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold font-display leading-tight text-gray-900 mb-6">
                            We&apos;d Love to{" "}
                            <span className="text-primary">Hear from You</span>
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Have a question, feedback, or need help? Our team is here to assist you.
                            Reach out and we&apos;ll respond as soon as possible.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <div className="lg:col-span-1">
                            <h2 className="text-2xl font-bold font-display text-gray-900 mb-6">
                                Contact Information
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                        <p className="text-gray-600">support@zoraapp.co.uk</p>
                                        <p className="text-gray-600">vendors@zoraapp.co.uk</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                                        <p className="text-gray-600">+44 (0) 20 1234 5678</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                                        <p className="text-gray-600">
                                            Zora African Market<br />
                                            London, United Kingdom
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                                        <p className="text-gray-600">
                                            Monday - Friday: 9am - 6pm<br />
                                            Saturday: 10am - 4pm
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Link */}
                            <div className="mt-8 p-6 bg-background-light rounded-2xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                    <h3 className="font-semibold text-gray-900">Need Quick Answers?</h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">
                                    Check out our FAQ section for answers to common questions.
                                </p>
                                <a href="#" className="text-primary font-medium hover:underline">
                                    View FAQ →
                                </a>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl border border-gray-200 p-8">
                                <h2 className="text-2xl font-bold font-display text-gray-900 mb-6">
                                    Send Us a Message
                                </h2>

                                {formState === "success" ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Message Sent!
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                                        </p>
                                        <button
                                            onClick={() => setFormState("idle")}
                                            className="text-primary font-medium hover:underline"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                                                    placeholder="Your name"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                                                    placeholder="you@example.com"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                                Subject
                                            </label>
                                            <select
                                                id="subject"
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                                            >
                                                <option value="">Select a topic</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="order">Order Support</option>
                                                <option value="vendor">Vendor Inquiry</option>
                                                <option value="partnership">Partnership</option>
                                                <option value="feedback">Feedback</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                required
                                                rows={5}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors resize-none"
                                                placeholder="How can we help you?"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={formState === "loading"}
                                            className="w-full bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {formState === "loading" ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <Send className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
