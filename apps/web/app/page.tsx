"use client";

import { ValueProposition } from "@/components/landing/ValueProposition";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ProductCarousel } from "@/components/marketing/ProductCarousel";
import { MobileAppPromo } from "@/components/landing/MobileAppPromo";
import { Testimonials } from "@/components/landing/Testimonials";
import { FreeDeliveryBanner } from "@/components/marketing/FreeDeliveryBanner";
import { Navigation } from "@/components/landing/Navigation";
import { HeroSection } from "@/components/landing/HeroSection";
import { DeliveryPartnersBanner } from "@/components/landing/DeliveryPartnersBanner";
import { Footer } from "@/components/landing/Footer";


export default function Home() {

    return (
        <main className="min-h-screen bg-background-light">
            {/* Free Delivery Banner - Fixed at top */}
            <FreeDeliveryBanner />

            {/* Navigation */}
            <Navigation />

            {/* Hero Section */}
            <HeroSection />

            {/* Delivery Partners Banner */}
            <DeliveryPartnersBanner />

            {/* Value Proposition Section */}
            <ValueProposition />

            {/* Features Grid */}
            <FeaturesGrid />

            {/* Product Carousel - Now Active */}
            <section className="py-12 px-4 bg-white">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold font-display text-text-dark mb-2">Featured Products</h2>
                        <p className="text-gray-600">Discover authentic African products from our vendors</p>
                    </div>
                    <ProductCarousel />
                </div>
            </section>

            {/* How It Works */}
            <HowItWorks />

            {/* Testimonials */}
            <Testimonials />

            {/* Mobile App Promotion */}
            <MobileAppPromo />

            {/* Footer */}
            <Footer />
        </main>
    );
}
