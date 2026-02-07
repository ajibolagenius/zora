import { Star, Quotes } from "@phosphor-icons/react";

export function Testimonials() {
    const testimonials = [
        {
            name: "Amara O.",
            location: "London",
            rating: 5,
            comment: "Finally, a platform that brings authentic African products right to my doorstep! The quality is amazing and I love supporting local vendors.",
            product: "Nigerian groceries"
        },
        {
            name: "Kwame A.",
            location: "Manchester",
            rating: 5,
            comment: "Zora has made it so easy to connect with my roots. The delivery is fast and the products remind me of home.",
            product: "Ghanaian foods"
        },
        {
            name: "Fatima K.",
            location: "Birmingham",
            rating: 5,
            comment: "As a busy professional, I appreciate how convenient Zora is. Great prices, authentic products, and excellent customer service!",
            product: "East African spices"
        },
        {
            name: "David M.",
            location: "Leeds",
            rating: 5,
            comment: "The variety of products is impressive! I've discovered so many new items and the quality is consistently excellent.",
            product: "Various African products"
        }
    ];

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
                            key={index}
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
                                        {testimonial.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {testimonial.location}
                                    </div>
                                </div>
                                <div className="text-xs text-primary font-medium">
                                    {testimonial.product}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
                <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-primary mb-1">4.8</div>
                            <div className="text-sm text-gray-600">Average Rating</div>
                            <div className="flex justify-center gap-1 mt-1">
                                {renderStars(5)}
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-primary mb-1">2K+</div>
                            <div className="text-sm text-gray-600">Happy Customers</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-primary mb-1">5K+</div>
                            <div className="text-sm text-gray-600">Products Sold</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-primary mb-1">100+</div>
                            <div className="text-sm text-gray-600">Verified Vendors</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
