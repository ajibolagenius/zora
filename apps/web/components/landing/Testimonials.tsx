"use client";

import { useState, useEffect } from "react";
import { Star, Quotes } from "@phosphor-icons/react";
import { TestimonialsService, type Testimonial } from "@/services/testimonials";
import { useTestimonialUpdates } from "@/providers/RealtimeProvider";
import { DynamicStats } from "./DynamicStats";

export function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const testimonialsData = await TestimonialsService.getApproved(4);
                setTestimonials(testimonialsData);
            } catch (error) {
                console.error('Error fetching testimonials:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    // Listen for real-time testimonial updates
    useTestimonialUpdates((payload) => {
        console.log('Testimonial update received:', payload);

        // Refresh testimonials when there are changes
        const refreshTestimonials = async () => {
            try {
                const testimonialsData = await TestimonialsService.getApproved(4);
                setTestimonials(testimonialsData);
            } catch (error) {
                console.error('Failed to refresh testimonials:', error);
            }
        };

        refreshTestimonials();
    });

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <Star
                key={index}
                size={16}
                weight={index < rating ? "fill" : "duotone"}
                className={index < rating ? "text-secondary" : "text-gray-300"}
            />
        ));
    };

    if (loading) {
        return (
            <section className="py-16 px-4 bg-background-light">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-12">
                        <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 px-4 bg-background-light">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-display text-text-dark mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Join thousands of satisfied customers who've discovered the convenience of authentic African shopping
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 relative"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-4 right-4 text-primary/10">
                                <Quotes size={24} weight="duotone" />
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {renderStars(testimonial.rating)}
                            </div>

                            {/* Comment */}
                            <blockquote className="text-gray-700 text-sm leading-relaxed mb-4">
                                "{testimonial.comment}"
                            </blockquote>

                            {/* Customer Info */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold text-text-dark text-sm">
                                        {testimonial.customer_name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {testimonial.customer_location}
                                    </div>
                                </div>
                                <div className="text-xs text-primary font-medium">
                                    {testimonial.product_category}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dynamic Stats Section */}
                <DynamicStats />
            </div>
        </section>
    );
}
