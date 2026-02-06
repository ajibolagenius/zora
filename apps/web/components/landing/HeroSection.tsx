"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowSquareOut, Star, Users, Bag, TrendUp, Truck, CaretDown } from "@phosphor-icons/react";

export function HeroSection() {
    const [currentScreenshot, setCurrentScreenshot] = useState(0);

    // Screenshot data
    const screenshots = [
        { src: "/images/screenshots/home.png", alt: "Home Screen" },
        { src: "/images/screenshots/about_zora.png", alt: "About Zora" },
        { src: "/images/screenshots/explore.png", alt: "Explore Products" },
        { src: "/images/screenshots/cart.png", alt: "Shopping Cart" },
        { src: "/images/screenshots/product_page.png", alt: "Product Details" },
        { src: "/images/screenshots/profile.png", alt: "User Profile" }
    ];

    // Auto-rotate screenshots
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentScreenshot((prev) => (prev + 1) % screenshots.length);
        }, 4000); // Change every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <section id="hero-section" className="relative min-h-[85vh] bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 flex items-center justify-center pt-32 sm:pt-40 lg:pt-48 pb-16 lg:pb-20">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl">
                    {/* Left Content */}
                    <div className="text-center lg:text-left order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-6 lg:mb-8">
                            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                            #1 African Marketplace in the UK
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-display text-white leading-[1.1] mb-6 lg:mb-8">
                            Your home away{" "}
                            <span className="relative inline-block">
                                from home
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                    <path d="M2 8.5C50 2.5 150 2.5 198 8.5" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 lg:mb-8 max-w-2xl mx-auto leading-relaxed">
                            Access authentic African groceries, a vibrant marketplace, and community-focused services—delivered across the UK.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 lg:mb-10">
                            <Link
                                href="#download"
                                className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold transition-all shadow-lg shadow-secondary/25"
                            >
                                Download App
                                <ArrowSquareOut size={16} weight="duotone" className="sm:w-5 sm:h-5" />
                            </Link>
                            <Link
                                href="/vendor-onboarding"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold border border-white/30 transition-all"
                            >
                                Start Selling
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex items-center justify-center lg:justify-start gap-6 lg:gap-8">
                            <div className="flex items-center gap-1.5">
                                <Star size={20} weight="duotone" className="fill-secondary text-secondary" />
                                <span className="text-sm font-bold text-white">4.8</span>
                                <span className="text-sm text-white/80">rating</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users size={16} weight="duotone" className="text-white/80" />
                                <span className="text-sm font-bold text-white">2,000+</span>
                                <span className="text-sm text-white/80">Happy Customers</span>
                            </div>
                        </div>
                    </div>

                    {/* Right - App Preview */}
                    <div className="relative flex justify-center lg:justify-end order-2 lg:order-2">
                        <div className="relative">
                            {/* Main Phone */}
                            <div className="relative z-10 bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl shadow-black/50">
                                <div className="rounded-[2rem] overflow-hidden w-[200px] sm:w-[240px] lg:w-[280px] h-[460px] sm:h-[520px] lg:h-[560px] relative">
                                    {/* Image Slider */}
                                    <div className="relative w-full h-full">
                                        {screenshots.map((screenshot, index) => (
                                            <div
                                                key={index}
                                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center ${index === currentScreenshot ? 'opacity-100' : 'opacity-0'
                                                    }`}
                                            >
                                                <Image
                                                    src={screenshot.src}
                                                    alt={screenshot.alt}
                                                    fill
                                                    sizes="(max-width: 280px) 100vw, (max-height: 560px) 100vh"
                                                    className="object-cover"
                                                    priority={index === 0}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Floating Cards */}
                            <div className="absolute -top-4 -left-12 sm:-left-16 lg:-left-20 bg-white rounded-2xl shadow-xl p-3 sm:p-4 w-[120px] sm:w-[140px] lg:w-[160px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                                        <TrendUp size={12} weight="duotone" className="text-green-600" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-500">Daily Orders</span>
                                </div>
                                <div className="text-xl font-bold text-gray-900">847</div>
                                <span className="text-xs text-green-600 font-medium">+18.4%</span>
                            </div>

                            <div className="absolute top-1/3 -right-8 sm:-right-12 lg:-right-16 bg-gradient-to-br from-secondary to-yellow-500 rounded-2xl shadow-xl p-3 sm:p-4 w-[110px] sm:w-[120px] lg:w-[130px]">
                                <Bag size={16} weight="duotone" className="text-gray-900/70 mb-2" />
                                <div className="text-2xl sm:text-3xl font-bold text-gray-900">100+</div>
                                <span className="text-xs text-gray-700">Vendors</span>
                            </div>

                            <div className="absolute -bottom-4 -left-6 sm:-left-10 lg:-left-14 bg-white rounded-2xl shadow-xl p-3 sm:p-4 w-[130px] sm:w-[140px] lg:w-[150px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Truck size={16} weight="duotone" className="text-blue-600" />
                                    <span className="text-xs font-medium text-gray-500">UK Wide</span>
                                </div>
                                <p className="text-xs text-gray-600">Fast delivery across the UK</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70">
                <span className="text-xs">Scroll to explore</span>
                <CaretDown size={20} weight="duotone" className="animate-bounce" />
            </div>
        </section>
    );
}
