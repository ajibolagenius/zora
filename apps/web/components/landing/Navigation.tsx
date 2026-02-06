"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { List, X } from "@phosphor-icons/react";
import { ZoraLogo } from "./ZoraLogo";

export function Navigation() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for header contrast
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const heroSection = document.getElementById('hero-section');

            if (heroSection) {
                const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
                setScrolled(scrollPosition > heroBottom - 100); // Change before reaching white section
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial position

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-12 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : ''}`} id="main-nav">
            <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <ZoraLogo className="w-9 h-9" outlineColor={scrolled ? "#000" : "#fff"} />
                    <span className={`text-xl font-bold font-display transition-colors duration-300 ${scrolled ? 'text-text-dark' : 'text-white'}`}>Zora</span>
                </Link>

                <div className={`hidden md:flex items-center gap-1 rounded-full p-1 transition-all duration-300 ${scrolled ? 'bg-gray-100 border border-gray-200' : 'bg-white/10 border border-white/20'}`}>
                    {["About", "Features", "Vendors", "Contact"].map((item) => (
                        <Link
                            key={item}
                            href={`/${item.toLowerCase()}`}
                            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${scrolled ? 'text-gray-600 hover:text-primary hover:bg-white' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/login" className={`hidden sm:inline-flex text-sm font-medium px-3 py-1.5 transition-colors duration-300 ${scrolled ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'}`}>
                        Sign In
                    </Link>
                    <Link href="/vendor-onboarding" className="bg-secondary hover:bg-secondary-dark text-gray-900 px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                        Get Started
                    </Link>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
                        {mobileMenuOpen ? <X size={20} weight="duotone" /> : <List size={20} weight="duotone" />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className={`md:hidden border-t p-4 transition-colors duration-300 ${scrolled ? 'bg-white border-gray-200' : 'bg-background-dark/95 border-white/10'}`}>
                    {["About", "Features", "Vendors", "Contact", "Sign In"].map((item) => (
                        <Link
                            key={item}
                            href={item === "Sign In" ? "/login" : `/${item.toLowerCase()}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block px-4 py-2 rounded-lg transition-colors ${scrolled ? 'text-gray-600 hover:text-primary hover:bg-gray-50' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                        >
                            {item}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
