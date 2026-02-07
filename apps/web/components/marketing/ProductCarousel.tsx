"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "@phosphor-icons/react";
import { productsService } from "@zora/api-client";
import { useProductUpdates } from "@/providers/RealtimeProvider";
import type { Product } from "@zora/types";

export function ProductCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Fetch products from database
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productsService.getAll({
                    limit: 12,
                    sortBy: 'created_at',
                    sortOrder: 'desc'
                });
                // Filter for active products only
                const activeProducts = response.data?.filter(product => product.is_active) || [];
                setProducts(activeProducts);
            } catch (error) {
                console.error('Failed to fetch products:', error);
                // Fallback to mock data if API fails
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Listen for real-time product updates
    useProductUpdates((payload) => {
        console.log('Product update received:', payload);

        // Refresh products when there are changes
        const refreshProducts = async () => {
            try {
                const response = await productsService.getAll({
                    limit: 12,
                    sortBy: 'created_at',
                    sortOrder: 'desc'
                });
                const activeProducts = response.data?.filter(product => product.is_active) || [];
                setProducts(activeProducts);
            } catch (error) {
                console.error('Failed to refresh products:', error);
            }
        };

        refreshProducts();
    });

    // Auto-scroll functionality
    useEffect(() => {
        if (!isAutoPlaying || products.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, products.length]);

    const visibleProducts = 4; // Number of products visible at once
    const maxIndex = Math.max(0, products.length - visibleProducts);

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
    };

    const handleProductClick = () => {
        // Direct to app download
        window.open('#download', '_blank');
    };

    const handleAddToCart = () => {
        // Direct to app download
        window.open('#download', '_blank');
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                        <div className="aspect-square bg-gray-200" />
                        <div className="p-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded" />
                            <div className="h-3 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No products available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Navigation Buttons */}
            <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
            >
                <ArrowLeft size={20} weight="duotone" />
            </button>

            <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
            >
                <ArrowRight size={20} weight="duotone" />
            </button>

            {/* Products Container */}
            <div className="overflow-hidden">
                <motion.div
                    className="flex gap-4"
                    animate={{
                        x: `-${currentIndex * (100 / visibleProducts)}%`
                    }}
                    transition={{
                        duration: 0.3,
                        ease: "easeOut"
                    }}
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    {products.map((product, index) => (
                        <motion.div
                            key={`${product.id}-${index}`}
                            className="flex-shrink-0 w-full md:w-1/2 lg:w-1/4"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div
                                className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={handleProductClick}
                            >
                                {/* Product Image */}
                                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Fallback to placeholder if image fails
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                        <span className="text-sm">Product Image</span>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-text-dark mb-1 line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-2">{product.vendor?.name ?? 'Local Vendor'}</p>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-2">
                                        <Star size={12} weight="fill" className="text-secondary" />
                                        <span className="text-xs text-gray-600">
                                            {product.rating?.toFixed(1) || '4.5'} ({product.review_count || 0})
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-primary">
                                            £{product.price}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart();
                                            }}
                                            className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-full text-xs font-medium transition-colors"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: Math.min(products.length, 3) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex % Math.min(products.length, 3)
                            ? 'bg-primary'
                            : 'bg-gray-300'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
