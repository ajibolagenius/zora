import Link from "next/link";
import { MapPin } from "@phosphor-icons/react";
import { ZoraLogo } from "./Header";

export function Footer() {
    return (
        <footer className="bg-background-dark text-white py-16" role="contentinfo">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-5 gap-8 mb-12">
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <ZoraLogo className="w-12 h-12" />
                            <span className="text-2xl font-bold font-display">Zora</span>
                        </Link>
                        <p className="text-gray-400 mb-6 max-w-sm">
                            A central hub for Africans in the diaspora to access authentic groceries
                            and community-focused services that reflect African culture.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { name: "Twitter", href: "#" },
                                { name: "Instagram", href: "#" },
                                { name: "Facebook", href: "#" },
                            ].map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                                >
                                    <span className="sr-only">{social.name}</span>
                                    <div className="w-5 h-5 bg-white/50 rounded" />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Company</h4>
                        <ul className="space-y-3">
                            {[
                                { name: "About Us", href: "/about" },
                                { name: "Features", href: "/features" },
                                { name: "For Vendors", href: "/vendors" },
                                { name: "Blog", href: "#" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Support</h4>
                        <ul className="space-y-3">
                            {[
                                { name: "Help Centre", href: "#" },
                                { name: "Contact Us", href: "/contact" },
                                { name: "Shipping Info", href: "#" },
                                { name: "Returns", href: "#" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Legal</h4>
                        <ul className="space-y-3">
                            {[
                                { name: "Privacy Policy", href: "#" },
                                { name: "Terms of Service", href: "#" },
                                { name: "Cookie Policy", href: "#" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} Zora African Market. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                        <span className="flex items-center gap-2">
                            <MapPin size={16} weight="duotone" /> United Kingdom
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
