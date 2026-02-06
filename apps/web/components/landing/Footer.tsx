import Link from "next/link";
import { MapPin } from "@phosphor-icons/react";
import { ZoraLogo } from "./ZoraLogo";

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12 px-4">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <ZoraLogo className="w-8 h-8" />
                            <span className="font-bold font-display text-lg">Zora</span>
                        </div>
                        <p className="text-gray-400 text-sm">Your home away from home, delivered. Connecting African communities across the UK.</p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <div className="space-y-2">
                            <Link href="/about" className="block text-sm text-gray-400 hover:text-white">About Us</Link>
                            <Link href="/features" className="block text-sm text-gray-400 hover:text-white">Features</Link>
                            <Link href="/vendors" className="block text-sm text-gray-400 hover:text-white">For Vendors</Link>
                            <Link href="/contact" className="block text-sm text-gray-400 hover:text-white">Contact</Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <div className="space-y-2">
                            <Link href="/help" className="block text-sm text-gray-400 hover:text-white">Help Center</Link>
                            <Link href="/shipping" className="block text-sm text-gray-400 hover:text-white">Shipping Info</Link>
                            <Link href="/faq" className="block text-sm text-gray-400 hover:text-white">FAQ</Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <MapPin size={16} weight="duotone" />
                            <span>United Kingdom</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                        </div>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-6">
                        &copy; {new Date().getFullYear()} Zora African Market. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
