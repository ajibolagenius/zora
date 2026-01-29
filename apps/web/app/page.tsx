import Link from "next/link";
import { ArrowRight, MapPin, ShoppingBag, Truck, Star, Shield } from "lucide-react";

export default function Home() {
    return (
        <main className="min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold font-display text-primary">ZORA</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                            How It Works
                        </Link>
                        <Link href="#vendors" className="text-sm font-medium hover:text-primary transition-colors">
                            For Vendors
                        </Link>
                        <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                            Contact
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/vendor-onboarding"
                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                        >
                            Become a Vendor
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gradient-to-b from-background to-surface-light">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
                            Authentic African Products,{" "}
                            <span className="text-primary">Delivered to Your Door</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Connecting the African diaspora with home. Shop from trusted vendors
                            offering authentic groceries, spices, and cultural products.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="#download"
                                className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                            >
                                Download the App
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <Link
                                href="/vendor-onboarding"
                                className="bg-surface border-2 border-primary text-primary px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/5 transition-colors"
                            >
                                Start Selling
                            </Link>
                        </div>
                        <div className="mt-12 flex justify-center gap-8">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-sm text-muted-foreground">UK Wide Delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-sm text-muted-foreground">100+ Vendors</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Star className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-sm text-muted-foreground">4.8 App Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-surface-light">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                            Shop by African Region
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Explore authentic products from across the continent
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {["West Africa", "East Africa", "North Africa", "South Africa", "Central Africa"].map(
                            (region) => (
                                <div
                                    key={region}
                                    className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border border-border"
                                >
                                    <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4" />
                                    <h3 className="font-semibold">{region}</h3>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                            How Zora Works
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Get your favorite African products in just a few steps
                        </p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                icon: ShoppingBag,
                                title: "Browse",
                                description: "Explore products from multiple vendors in one place",
                            },
                            {
                                icon: Star,
                                title: "Select",
                                description: "Add items from different vendors to your cart",
                            },
                            {
                                icon: Shield,
                                title: "Pay Securely",
                                description: "Checkout with Stripe, Klarna, or Clearpay",
                            },
                            {
                                icon: Truck,
                                title: "Receive",
                                description: "Track your order and enjoy authentic products",
                            },
                        ].map((step, index) => (
                            <div key={step.title} className="text-center">
                                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <step.icon className="w-8 h-8" />
                                </div>
                                <div className="text-sm text-primary font-semibold mb-2">
                                    Step {index + 1}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vendor CTA */}
            <section id="vendors" className="py-20 bg-primary text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                            Grow Your Business with Zora
                        </h2>
                        <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                            Join our marketplace and reach thousands of customers looking for
                            authentic African products. Easy setup, powerful tools, and dedicated
                            support.
                        </p>
                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            {[
                                { title: "No Monthly Fees", description: "Only pay when you sell" },
                                { title: "Easy Dashboard", description: "Manage products & orders" },
                                { title: "Fast Payouts", description: "Get paid within days" },
                            ].map((benefit) => (
                                <div key={benefit.title} className="bg-white/10 rounded-xl p-6">
                                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                                    <p className="text-white/70">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                        <Link
                            href="/vendor-onboarding"
                            className="bg-white text-primary px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/90 transition-colors inline-flex items-center gap-2"
                        >
                            Start Selling Today
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Download App Section */}
            <section id="download" className="py-20 bg-surface-light">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                            Download the Zora App
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Get the best shopping experience on your mobile device. Available on
                            iOS and Android.
                        </p>
                        <div className="flex justify-center gap-4">
                            <a
                                href="#"
                                className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-800 transition-colors"
                            >
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-xs">Download on the</div>
                                    <div className="text-lg font-semibold">App Store</div>
                                </div>
                            </a>
                            <a
                                href="#"
                                className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-800 transition-colors"
                            >
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-xs">GET IT ON</div>
                                    <div className="text-lg font-semibold">Google Play</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-background py-12 border-t border-border">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <span className="text-2xl font-bold font-display text-primary">ZORA</span>
                            <p className="text-muted-foreground mt-4">
                                Connecting the African diaspora with authentic products from home.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/about" className="text-muted-foreground hover:text-foreground">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                                        Careers
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/help" className="text-muted-foreground hover:text-foreground">
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shipping" className="text-muted-foreground hover:text-foreground">
                                        Shipping Info
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/returns" className="text-muted-foreground hover:text-foreground">
                                        Returns
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
                        <p>&copy; {new Date().getFullYear()} Zora African Market. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
