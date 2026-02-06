import { DeviceMobile, ArrowRight, Download } from "@phosphor-icons/react";

export function MobileAppPromo() {
    return (
        <section id="download" className="py-16 px-4 bg-white">
            <div className="container mx-auto max-w-7xl">
                <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Left Content */}
                        <div className="text-white">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6">
                                <DeviceMobile size={16} weight="duotone" />
                                Experience Zora Mobile App
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                                Take African Shopping Everywhere
                            </h2>

                            <p className="text-lg text-white/90 mb-6 max-w-lg">
                                Get the Zora app and enjoy exclusive features, faster checkout, and notifications
                                when your favorite products are back in stock.
                            </p>

                            {/* App Features */}
                            <div className="space-y-3 mb-8">
                                {[
                                    "Exclusive mobile-only deals and discounts",
                                    "Real-time order tracking and notifications",
                                    "Save favorites for quick reordering",
                                    "Connect with vendors directly"
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-primary rounded-full" />
                                        </div>
                                        <span className="text-white/90">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Download Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="bg-white hover:bg-gray-100 text-primary px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                    <Download size={20} weight="duotone" />
                                    <span className="font-semibold">Download for iOS</span>
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 border border-white/30 transition-colors">
                                    <Download size={20} weight="duotone" />
                                    <span className="font-semibold">Download for Android</span>
                                </button>
                            </div>
                        </div>

                        {/* Right - Phone Mockup */}
                        <div className="flex justify-center lg:justify-end">
                            <div className="relative">
                                {/* Phone Frame */}
                                <div className="relative z-10 bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                                    <div className="rounded-[2rem] overflow-hidden w-[240px] sm:w-[280px] aspect-[9/19] bg-white">
                                        {/* Vendor Storefront Mock */}
                                        <div className="h-full bg-gray-50 flex flex-col">
                                            {/* Status Bar */}
                                            <div className="flex justify-between items-center text-gray-900 text-xs px-4 py-2 bg-white">
                                                <span>9:41</span>
                                                <div className="flex gap-1">
                                                    <div className="w-4 h-3 bg-gray-900 rounded-sm" />
                                                    <div className="w-4 h-3 bg-gray-900 rounded-sm" />
                                                    <div className="w-4 h-3 bg-gray-900 rounded-sm" />
                                                </div>
                                            </div>

                                            {/* Store Header */}
                                            <div className="bg-gradient-to-b from-primary to-primary-dark px-4 py-6 text-white">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                        <span className="text-xs font-bold">ZK</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-sm">Zora Kitchen</h3>
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                                                            <span className="text-xs opacity-90">Verified Vendor</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs">
                                                    <span className="text-secondary">★</span>
                                                    <span>4.8 (234 reviews)</span>
                                                </div>
                                            </div>

                                            {/* Store Content */}
                                            <div className="flex-1 bg-white p-4">
                                                {/* Search Bar */}
                                                <div className="bg-gray-100 rounded-lg px-3 py-2 flex items-center gap-2 mb-4">
                                                    <div className="w-4 h-4 bg-gray-400 rounded" />
                                                    <span className="text-xs text-gray-500">Search products...</span>
                                                </div>

                                                {/* Product Grid */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-gray-50 rounded-lg p-2">
                                                        <div className="aspect-square bg-gray-200 rounded mb-2" />
                                                        <div className="text-xs font-medium text-gray-900 truncate">Jollof Spice</div>
                                                        <div className="text-xs text-primary font-bold">£4.99</div>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg p-2">
                                                        <div className="aspect-square bg-gray-200 rounded mb-2" />
                                                        <div className="text-xs font-medium text-gray-900 truncate">Palm Oil</div>
                                                        <div className="text-xs text-primary font-bold">£6.99</div>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg p-2">
                                                        <div className="aspect-square bg-gray-200 rounded mb-2" />
                                                        <div className="text-xs font-medium text-gray-900 truncate">Suya Mix</div>
                                                        <div className="text-xs text-primary font-bold">£3.49</div>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg p-2">
                                                        <div className="aspect-square bg-gray-200 rounded mb-2" />
                                                        <div className="text-xs font-medium text-gray-900 truncate">Egusi Seeds</div>
                                                        <div className="text-xs text-primary font-bold">£5.99</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom Navigation */}
                                            <div className="bg-white border-t border-gray-200 px-4 py-2">
                                                <div className="flex justify-around">
                                                    <div className="w-6 h-6 bg-gray-300 rounded" />
                                                    <div className="w-6 h-6 bg-primary rounded" />
                                                    <div className="w-6 h-6 bg-gray-300 rounded" />
                                                    <div className="w-6 h-6 bg-gray-300 rounded" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -top-4 -right-8 bg-secondary rounded-2xl p-3 shadow-xl">
                                    <ArrowRight size={20} weight="duotone" className="text-gray-900" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
