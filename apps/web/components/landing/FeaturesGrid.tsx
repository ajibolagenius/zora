import { Users, TrendUp, Shield, Truck, Star, Heart } from "@phosphor-icons/react";

export function FeaturesGrid() {
    const features = [
        {
            icon: Users,
            title: "Community Focused",
            description: "Join thousands of customers connecting with their heritage through authentic products.",
            color: "bg-blue-100 text-blue-600"
        },
        {
            icon: TrendUp,
            title: "Growing Network",
            description: "Access 100+ vendors and 5,000+ products from across the African continent.",
            color: "bg-green-100 text-green-600"
        },
        {
            icon: Shield,
            title: "Verified Quality",
            description: "All vendors are verified and products quality-checked for your peace of mind.",
            color: "bg-purple-100 text-purple-600"
        },
        {
            icon: Truck,
            title: "UK Wide Delivery",
            description: "Fast and reliable delivery across the United Kingdom with tracking.",
            color: "bg-orange-100 text-orange-600"
        },
        {
            icon: Star,
            title: "Customer Rated",
            description: "4.8-star rating from thousands of satisfied customers nationwide.",
            color: "bg-yellow-100 text-yellow-600"
        },
        {
            icon: Heart,
            title: "Cultural Connection",
            description: "Maintain your connection to home with products that tell your story.",
            color: "bg-pink-100 text-pink-600"
        }
    ];

    return (
        <section className="py-16 px-4 bg-background-light">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-display text-text-dark mb-4">
                        Why Customers Love Zora
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover what makes Zora the preferred marketplace for African products in the UK
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div 
                            key={index}
                            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                        >
                            <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                                <feature.icon size={24} weight="duotone" />
                            </div>
                            <h3 className="text-lg font-semibold font-display text-text-dark mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
