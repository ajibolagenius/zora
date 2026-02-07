"use client";

import { useState, useEffect } from "react";
import { VendorsService, type VendorStats } from "@/services/vendors";
import { TestimonialsService, type TestimonialStats } from "@/services/testimonials";
import { useVendorUpdates, useTestimonialUpdates } from "@/providers/RealtimeProvider";

interface CombinedStats {
    vendors: VendorStats;
    testimonials: TestimonialStats;
}

export function DynamicStats() {
    const [stats, setStats] = useState<CombinedStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [vendorStats, testimonialStats] = await Promise.all([
                    VendorsService.getStats(),
                    TestimonialsService.getStats()
                ]);
                
                setStats({
                    vendors: vendorStats,
                    testimonials: testimonialStats
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Listen for real-time vendor updates
    useVendorUpdates(() => {
        console.log('Vendor update received, refreshing stats');
        const refreshStats = async () => {
            try {
                const vendorStats = await VendorsService.getStats();
                setStats(prev => prev ? { ...prev, vendors: vendorStats } : null);
            } catch (error) {
                console.error('Failed to refresh vendor stats:', error);
            }
        };
        refreshStats();
    });

    // Listen for real-time testimonial updates
    useTestimonialUpdates(() => {
        console.log('Testimonial update received, refreshing stats');
        const refreshStats = async () => {
            try {
                const testimonialStats = await TestimonialsService.getStats();
                setStats(prev => prev ? { ...prev, testimonials: testimonialStats } : null);
            } catch (error) {
                console.error('Failed to refresh testimonial stats:', error);
            }
        };
        refreshStats();
    });

    const formatNumber = (num: number): string => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K+`;
        }
        return num.toString();
    };

    if (loading) {
        return (
            <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                    <div className="text-3xl font-bold text-primary mb-1">
                        {stats.testimonials.average_rating}
                    </div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                    <div className="flex justify-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <span
                                key={index}
                                className={`text-sm ${
                                    index < Math.round(stats.testimonials.average_rating)
                                        ? 'text-secondary'
                                        : 'text-gray-300'
                                }`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-primary mb-1">
                        {formatNumber(stats.testimonials.total_customers)}
                    </div>
                    <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-primary mb-1">
                        {formatNumber(stats.testimonials.total_products_sold)}
                    </div>
                    <div className="text-sm text-gray-600">Products Sold</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-primary mb-1">
                        {formatNumber(stats.vendors.total_vendors)}
                    </div>
                    <div className="text-sm text-gray-600">Verified Vendors</div>
                </div>
            </div>
            
            {/* Additional vendor stats */}
            <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm">
                    <div>
                        <div className="font-semibold text-text-dark">
                            {stats.vendors.featured_vendors} Featured Vendors
                        </div>
                        <div className="text-gray-600">Premium partners</div>
                    </div>
                    <div>
                        <div className="font-semibold text-text-dark">
                            {stats.vendors.new_vendors_this_month} New This Month
                        </div>
                        <div className="text-gray-600">Growing network</div>
                    </div>
                    <div>
                        <div className="font-semibold text-text-dark">
                            {stats.vendors.regions_covered} Regions Covered
                        </div>
                        <div className="text-gray-600">Across the UK</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
