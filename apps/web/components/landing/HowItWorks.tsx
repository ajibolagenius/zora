import { User, ShoppingCart, Heart } from "@phosphor-icons/react";

export function HowItWorks() {
    const steps = [
        {
            icon: User,
            title: "Sign Up",
            description: "Create your free account in seconds. No subscription fees or hidden charges."
        },
        {
            icon: ShoppingCart,
            title: "Browse & Shop",
            description: "Explore products from verified vendors across Africa. Add to cart and checkout securely."
        },
        {
            icon: Heart,
            title: "Enjoy & Review",
            description: "Receive your order across the UK and share your experience with the community."
        }
    ];

    return (
        <section className="py-16 px-4 bg-white">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-display text-text-dark mb-4">
                        How Zora Works
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Get started in three simple steps and connect with authentic African products
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            {/* Step Number */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {index + 1}
                            </div>

                            {/* Step Content */}
                            <div className="bg-background-light pt-8 pb-6 px-6 rounded-2xl text-center border border-gray-100">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <step.icon size={32} weight="duotone" className="text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold font-display text-text-dark mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gray-200 -translate-y-1/2" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
