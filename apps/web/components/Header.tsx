"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

// Zora Logo Component
export const ZoraLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 156 179" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeMiterlimit="1.5">
        <g id="zora_logo">
            <g id="bag">
                <path id="hand_2" d="M55.643 29.404c-0.298-1.356-0.613-3.954-0.613-5.398v-2.559c0-10.801 8.769-19.569 19.569-19.569h7.112c10.801 0 19.569 8.769 19.569 19.569v2.559c0 2.421-0.571 5.206-1.376 7.347" fill="none" stroke="#fff" strokeWidth="2.08" />
                <path id="hand_1" d="M63.832 31.655c-0.298-1.356-0.613-3.954-0.613-5.398v-2.559c0-10.801 8.769-19.569 19.569-19.569h7.112c10.801 0 19.569 8.769 19.569 19.569v2.559c0 2.421-0.192 3.493-0.997 5.634" fill="none" stroke="#fff" strokeWidth="2.08" />
                <g id="bag_line">
                    <path id="bag_line_1" d="M17.657 31.446l9.865-0.065 6.93-6.059 27.742 2.627-3.487 10.757-6.086 0.988 0.083 4.076-11.435 15.164v7.407l-2.445 5.046c0 0 15.955 21.579 25.604 15.127l7.746-2.576 4.453 2.558-0.342 8.748 3.387 2.559-43.111-11.716-11.381 0.63-12.184 0.845 4.66-56.116Z" fill="#c00" />
                    <path id="bag_line_2" d="M60.48 33.238l1.782-5.354 68.425 3.342 14.497 94.941-108.021 4.569-13.019-5.139-14.225 0.663 3.086-39.989 0.108-0.12-0.117 1.413 12.184-0.845 11.381-0.63 43.111 11.716-3.387-2.559 0.342-8.748-4.453-2.558-7.746 2.576c-9.649 6.452-25.604-15.127-25.604-15.127l2.445-5.046v-7.407l11.435-15.164-0.037-1.805 2.386-2.666 3.653-0.593 1.773-5.468Z" fill="#fc0" />
                </g>
                <path id="africa_map" d="M59.668 35.743l0.755 0.981c0 0 24.304-5.446 25.137 0.74l-0.174 3.459 7.025 4.507 5.142-3.467 10.973 3.827c0 0 7.273-4.703 7.663-0.141 0 0 1.05 19.872 15.025 24.318l8.276-1.775c0 0 5.206 4.912-0.213 15.694l-11.651 13.53 0.783 15.664-6.584 4.462-0.068 6.263-4.753 2.624-6.892 7.587-12.415 2.403-6.328-4.717-10.266-20.218 2.205-8.643-3.037-4.646-2.558-0.927 1.96 0.533-3.387-2.559 0.342-8.748-4.453-2.558-7.746 2.576c-9.649 6.452-25.604-15.127-25.604-15.127l2.445-5.046v-7.407l11.435-15.164-0.083-4.076 6.086-0.988 0.96-2.962Z" fill="#fff" stroke="#000" strokeWidth="2.08" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <path id="zora_text" d="M29.259 169.338h-11.7c-1.606 0.003-3.554 0.203-5.131 0.408 1.334-1.067 2.812-2.424 3.717-3.797l13.116-19.904c0.6-0.911 0.773-1.711 0.603-2.789l-0.554-3.495h-23.009c-2.651 0-3.395-0.535-3.395-0.535-0.289 2.32-0.939 5.461-0.939 6.426 0 1.055 0.877 2.172 0.877 2.172l9.789-0.02c1.084-0.002 2.753-0.313 4.044-0.595-1.176 0.888-2.823 2.332-4.049 4.204l-11.968 18.279c-0.598 0.912-0.769 1.712-0.598 2.789l0.775 4.897h24.964c2.651 0 3.395 0.537 3.395 0.537 0.289-2.321 0.939-5.463 0.939-6.429 0-1.054-0.877-2.172-0.877-2.172m25.124-30.092c-11.769 0-20.474 8.115-20.474 20.206 0 11.231 7.47 18.486 18.594 18.486 11.823 0 20.421-8.222 20.421-20.223 0-11.107-7.362-18.469-18.54-18.469m-2.15 7.792c5.589 0 9.781 5.051 9.781 13.005 0 6.072-2.472 10.157-7.523 10.049-5.911-0.107-9.673-5.589-9.673-13.005 0-5.589 2.15-10.049 7.416-10.049m49.47 14.17c4.114-0.998 8.594-4.329 8.594-10.892 0-8.099-6.49-11.07-17.726-11.07-4.849 0-9.889 0.613-12.34 1.075v36.435c0 0 1.118 0.914 2.172 0.914 1.287 0 5.88-0.269 8.576-0.269v-30.119c1.087-0.081 2.115-0.136 2.841-0.136 3.65 0 5.721 1.485 5.721 4.729 0 2.616-1.29 4.374-5.088 5.726-1.388 0.494-2.009 1.329-1.229 3.156l4.631 10.84c2.023 4.737 4.595 6.88 8.821 6.88 4.188 0 6.818-2.175 6.818-5.639-4.575-1.176-8.054-7.901-11.79-11.628Zm39.657-20.78c0 0-1.118-0.914-2.172-0.914-0.806 0-6.211 0.269-9.569 0.269 0 0 0.267 2.25-0.434 4.163l-12.037 32.81c0 0 1.118 0.914 2.172 0.914 1.188 0 4.897-0.269 7.912-0.269l3.122-9.007h10.161l2.86 8.362c0 0 1.117 0.914 2.172 0.914 1.362 0 5.917-0.269 9.554-0.269l-13.742-36.972Zm-6.498 7.083c0.194 0.821 0.866 3.582 2.011 7.483l1.882 6.413h-7.198l1.866-6.899c0.619-2.291 1.268-5.995 1.44-6.997Z" fill="#fc0" fillRule="nonzero" />
        </g>
    </svg>
);

interface HeaderProps {
    variant?: "light" | "dark";
}

export function Header({ variant = "light" }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const bgClass = variant === "dark"
        ? "bg-background-dark/80"
        : "bg-background-light/80";
    const textClass = variant === "dark" ? "text-white" : "text-gray-900";
    const linkClass = variant === "dark"
        ? "text-gray-300 hover:text-white"
        : "text-gray-700 hover:text-gray-900";

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 ${bgClass} backdrop-blur-md`} role="navigation" aria-label="Main navigation">
            <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <ZoraLogo className="w-9 h-9" />
                    <span className={`text-xl font-bold font-display ${textClass}`}>Zora</span>
                </Link>

                {/* Center Navigation - Desktop */}
                <div className={`hidden lg:flex items-center ${variant === "dark" ? "bg-white/10" : "bg-white"} rounded-full px-2 py-1.5 border ${variant === "dark" ? "border-white/10" : "border-gray-200"} shadow-sm`}>
                    <Link href="/about" className={`px-5 py-2 text-sm font-medium ${linkClass} transition-colors rounded-full hover:bg-gray-50/10`}>
                        About
                    </Link>
                    <Link href="/features" className={`px-5 py-2 text-sm font-medium ${linkClass} transition-colors rounded-full hover:bg-gray-50/10`}>
                        Features
                    </Link>
                    <Link href="/vendors" className={`px-5 py-2 text-sm font-medium ${linkClass} transition-colors rounded-full hover:bg-gray-50/10`}>
                        For Vendors
                    </Link>
                    <Link href="/contact" className={`px-5 py-2 text-sm font-medium ${linkClass} transition-colors rounded-full hover:bg-gray-50/10`}>
                        Contact
                    </Link>
                </div>

                {/* Right CTA & Mobile Menu */}
                <div className="flex items-center gap-3">
                    <Link href="/(auth)/login" className={`hidden sm:inline-flex ${linkClass} px-4 py-2 text-sm font-medium transition-colors`}>
                        Sign In
                    </Link>
                    <Link
                        href="/vendor-onboarding"
                        className="hidden sm:inline-flex bg-secondary hover:bg-secondary-dark text-gray-900 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm"
                    >
                        Get Started
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`lg:hidden p-2 rounded-lg ${variant === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"} transition-colors`}
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? (
                            <X className={`w-6 h-6 ${textClass}`} />
                        ) : (
                            <Menu className={`w-6 h-6 ${textClass}`} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className={`lg:hidden ${variant === "dark" ? "bg-background-dark border-white/10" : "bg-white border-gray-200"} border-t shadow-lg`}>
                    <div className="container mx-auto px-4 py-4 flex flex-col space-y-2">
                        <Link href="/about" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 text-base font-medium ${linkClass} rounded-lg transition-colors`}>
                            About
                        </Link>
                        <Link href="/features" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 text-base font-medium ${linkClass} rounded-lg transition-colors`}>
                            Features
                        </Link>
                        <Link href="/vendors" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 text-base font-medium ${linkClass} rounded-lg transition-colors`}>
                            For Vendors
                        </Link>
                        <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 text-base font-medium ${linkClass} rounded-lg transition-colors`}>
                            Contact
                        </Link>
                        <Link href="/(auth)/login" onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 text-base font-medium ${linkClass} rounded-lg transition-colors`}>
                            Sign In
                        </Link>
                        <Link
                            href="/vendor-onboarding"
                            onClick={() => setMobileMenuOpen(false)}
                            className="sm:hidden mt-2 bg-secondary hover:bg-secondary-dark text-gray-900 px-5 py-3 rounded-full text-base font-semibold transition-colors shadow-sm text-center"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
