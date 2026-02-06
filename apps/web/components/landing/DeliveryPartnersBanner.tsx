"use client";

import { useEffect, useState } from "react";

export function DeliveryPartnersBanner() {
    const [isPaused, setIsPaused] = useState(false);

    // UK delivery partners with their SVG logos
    const deliveryPartners = [
        {
            name: "Royal Mail",
            svg: (
                <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="80" fill="#FF0000" />
                    <path d="M20 25H60V55H20V25Z" fill="white" />
                    <path d="M30 35H50V45H30V35Z" fill="#FF0000" />
                    <text x="70" y="45" fill="white" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold">Royal Mail</text>
                </svg>
            ),
            alt: "Royal Mail Logo"
        },
        {
            name: "DPD",
            svg: (
                <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="80" fill="#DC0032" />
                    <text x="20" y="50" fill="white" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold">DPD</text>
                </svg>
            ),
            alt: "DPD Logo"
        },
        {
            name: "Evri",
            svg: (
                <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="80" fill="#8B5CF6" />
                    <circle cx="40" cy="40" r="20" fill="white" />
                    <text x="70" y="50" fill="white" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold">Evri</text>
                </svg>
            ),
            alt: "Evri Logo"
        },
        {
            name: "UPS",
            svg: (
                <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="80" fill="#351C15" />
                    <path d="M20 25L40 25L50 40L40 55L20 55L30 40L20 25Z" fill="#FFB71B" />
                    <text x="70" y="50" fill="#FFB71B" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold">UPS</text>
                </svg>
            ),
            alt: "UPS Logo"
        },
        {
            name: "FedEx",
            svg: (
                <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="80" fill="#4D148C" />
                    <text x="20" y="35" fill="white" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold">Fed</text>
                    <text x="20" y="55" fill="#FF6600" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold">Ex</text>
                </svg>
            ),
            alt: "FedEx Logo"
        },
        {
            name: "DHL",
            svg: (
                <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="80" fill="#FFCC00" />
                    <text x="20" y="50" fill="#D2002E" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold">DHL</text>
                </svg>
            ),
            alt: "DHL Logo"
        }
    ];

    // Duplicate the array for seamless looping
    const duplicatedPartners = [...deliveryPartners, ...deliveryPartners];

    return (
        <section className="py-12 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold font-display text-text-dark mb-2">
                        Trusted Delivery Partners
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">
                        Working with the UK's leading delivery services to bring your orders to you
                    </p>
                </div>

                {/* Animated Banner */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="overflow-hidden">
                        <div
                            className={`flex gap-8 md:gap-12 ${isPaused ? '' : 'animate-scroll'}`}
                            style={{
                                animation: isPaused ? 'none' : 'scroll 30s linear infinite',
                            }}
                        >
                            {duplicatedPartners.map((partner, index) => (
                                <div
                                    key={`${partner.name}-${index}`}
                                    className="flex-shrink-0 flex items-center justify-center w-32 md:w-40 h-16 md:h-20 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <div className="w-full h-full flex items-center justify-center filter grayscale hover:grayscale-0 transition-all duration-300">
                                        {partner.svg}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS for animation */}
            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }

                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
