import { ArrowRight, Storefront, PiggyBank, Shield } from "@phosphor-icons/react";
import Link from "next/link";

export function ValueProposition() {
    return (
        <section className="py-12 sm:py-16 px-4 bg-white">
            <div className="container mx-auto max-w-6xl lg:max-w-7xl">
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-text-dark mb-4 sm:mb-6">
                        Shop Local, Save More
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Connect with authentic African vendors across the UK. Discover traditional products,
                        support local businesses, and enjoy the taste of home delivered to your doorstep.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
                    <div className="text-center p-4 sm:p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <Storefront size={24} weight="duotone" className="text-primary" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold font-display text-text-dark mb-2">
                            Direct Vendor Access
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                            Shop directly from verified African vendors and artisans. No middlemen,
                            just authentic products straight to you.
                        </p>
                    </div>

                    <div className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <PiggyBank size={32} weight="duotone" className="text-secondary-dark" />
                        </div>
                        <h3 className="text-xl font-semibold font-display text-text-dark mb-2">
                            Better Prices
                        </h3>
                        <p className="text-gray-600">
                            Save up to 30% compared to traditional retailers. Direct pricing means
                            better value for you and fair income for vendors.
                        </p>
                    </div>

                    <div className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield size={32} weight="duotone" className="text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold font-display text-text-dark mb-2">
                            Secure & Private
                        </h3>
                        <p className="text-gray-600">
                            Shop with confidence knowing your data is protected and all vendors
                            are verified for quality and authenticity.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
