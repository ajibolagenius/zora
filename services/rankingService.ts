/**
 * Ranking Service
 * Provides scoring and ranking algorithms for vendors and products
 * Combines multiple criteria to determine featured items
 */

import type { Vendor, Product } from './mockDataService';
import {
    ScoringWeights,
    DeliveryTimeThresholds,
    RecencyThresholds,
    ScoringBonuses,
    QualityThresholds,
    TimeConstants,
} from '../constants';

/**
 * Calculate vendor score based on multiple criteria
 */
export function calculateVendorScore(vendor: Vendor, userRegion?: string): number {
    let score = 0;

    // 1. Manual curation (highest priority)
    if (vendor.is_featured) {
        score += ScoringWeights.vendor.isFeatured;
    }

    // 2. Verified status
    if (vendor.is_verified) {
        score += ScoringWeights.vendor.isVerified;
    }

    // 3. Rating (normalized to 0-20, where 5.0 = 20 points)
    const ratingScore = Math.min((vendor.rating / 5.0) * ScoringWeights.vendor.rating, ScoringWeights.vendor.rating);
    score += ratingScore;

    // 4. Review count (logarithmic scale: more reviews = diminishing returns)
    // 0 reviews = 0, 10 reviews = 5, 50 reviews = 8, 100+ reviews = 10
    const reviewCountScore = Math.min(
        Math.log10(Math.max(vendor.review_count, 1)) * (ScoringWeights.vendor.reviewCount / 2),
        ScoringWeights.vendor.reviewCount
    );
    score += reviewCountScore;

    // 5. Delivery performance (faster delivery = higher score)
    if (vendor.delivery_time_max <= DeliveryTimeThresholds.excellent) {
        score += ScoringWeights.vendor.deliveryPerformance;
    } else if (vendor.delivery_time_max <= DeliveryTimeThresholds.good) {
        score += ScoringWeights.vendor.deliveryPerformance * 0.6;
    } else if (vendor.delivery_time_max <= DeliveryTimeThresholds.fair) {
        score += ScoringWeights.vendor.deliveryPerformance * 0.2;
    }

    // 6. Geographic relevance (bonus if vendor matches user's region)
    if (userRegion && vendor.cultural_specialties.some(s =>
        s.toLowerCase().includes(userRegion.toLowerCase())
    )) {
        score += ScoringBonuses.regionalMatch;
    }

    // 7. Recency bonus (vendors created in last 90 days get small boost)
    const daysSinceCreation = (Date.now() - new Date(vendor.created_at).getTime()) / TimeConstants.milliseconds.perDay;
    if (daysSinceCreation <= RecencyThresholds.recent) {
        score += ScoringBonuses.recencyHalf;
    }

    return Math.round(score * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate product score based on multiple criteria
 */
export function calculateProductScore(product: Product, userRegion?: string): number {
    let score = 0;

    // 1. Manual curation (highest priority)
    if (product.is_featured) {
        score += ScoringWeights.product.isFeatured;
    }

    // 2. Active status
    if (product.is_active) {
        score += ScoringWeights.product.isActive;
    }

    // 3. Stock availability (more stock = higher score, but with diminishing returns)
    if (product.stock_quantity > 0) {
        const stockScore = Math.min(
            Math.log10(Math.max(product.stock_quantity, 1)) * (ScoringWeights.product.stockQuantity / 2),
            ScoringWeights.product.stockQuantity
        );
        score += stockScore;
    }

    // 4. Rating (normalized to 0-20, where 5.0 = 20 points)
    const ratingScore = Math.min((product.rating / 5.0) * ScoringWeights.product.rating, ScoringWeights.product.rating);
    score += ratingScore;

    // 5. Review count (logarithmic scale)
    // 0 reviews = 0, 5 reviews = 5, 20 reviews = 8, 50+ reviews = 10
    const reviewCountScore = Math.min(
        Math.log10(Math.max(product.review_count, 1)) * (ScoringWeights.product.reviewCount / 1.7),
        ScoringWeights.product.reviewCount
    );
    score += reviewCountScore;

    // 6. Recency (products created in last 90 days get bonus)
    const daysSinceCreation = (Date.now() - new Date(product.created_at).getTime()) / TimeConstants.milliseconds.perDay;
    if (daysSinceCreation <= RecencyThresholds.veryNew) {
        score += ScoringWeights.product.recency; // Full bonus for very new
    } else if (daysSinceCreation <= RecencyThresholds.recent) {
        score += ScoringWeights.product.recency * 0.5; // Half bonus for recent
    }

    // 7. Geographic relevance (bonus if product matches user's region)
    if (userRegion && product.cultural_region?.toLowerCase().includes(userRegion.toLowerCase())) {
        score += ScoringBonuses.regionalMatch;
    }

    // 8. Certifications bonus (products with certifications get small boost)
    if (product.certifications && product.certifications.length > 0) {
        score += ScoringBonuses.certification;
    }

    return Math.round(score * 100) / 100; // Round to 2 decimal places
}

/**
 * Rank vendors by score
 */
export function rankVendors(vendors: Vendor[], userRegion?: string, limit?: number): Vendor[] {
    const vendorsWithScores = vendors.map(vendor => ({
        vendor,
        score: calculateVendorScore(vendor, userRegion),
    }));

    // Sort by score (descending), then by rating, then by review_count
    vendorsWithScores.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        if (b.vendor.rating !== a.vendor.rating) {
            return b.vendor.rating - a.vendor.rating;
        }
        return b.vendor.review_count - a.vendor.review_count;
    });

    const ranked = vendorsWithScores.map(item => item.vendor);

    return limit ? ranked.slice(0, limit) : ranked;
}

/**
 * Rank products by score
 */
export function rankProducts(products: Product[], userRegion?: string, limit?: number): Product[] {
    const productsWithScores = products.map(product => ({
        product,
        score: calculateProductScore(product, userRegion),
    }));

    // Sort by score (descending), then by rating, then by review_count
    productsWithScores.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        if (b.product.rating !== a.product.rating) {
            return b.product.rating - a.product.rating;
        }
        return b.product.review_count - a.product.review_count;
    });

    const ranked = productsWithScores.map(item => item.product);

    return limit ? ranked.slice(0, limit) : ranked;
}

/**
 * Get featured vendors using ranking system
 */
export function getFeaturedVendors(
    vendors: Vendor[],
    userRegion?: string,
    limit: number = 10
): Vendor[] {
    // Filter for minimum quality threshold
    // Manually featured vendors are always eligible, regardless of other metrics
    const eligibleVendors = vendors.filter(v =>
        v.is_featured || v.is_verified || v.rating >= QualityThresholds.minimumRating || v.review_count >= QualityThresholds.minimumReviewCount
    );

    // If no eligible vendors, fall back to all vendors
    const candidates = eligibleVendors.length > 0 ? eligibleVendors : vendors;

    return rankVendors(candidates, userRegion, limit);
}

/**
 * Get featured products using ranking system
 */
export function getFeaturedProducts(
    products: Product[],
    userRegion?: string,
    limit: number = 20
): Product[] {
    // Filter for minimum quality threshold (active, in stock, decent rating)
    // Manually featured products are always eligible (if active), regardless of rating/review thresholds
    const eligibleProducts = products.filter(p =>
        p.is_active &&
        p.stock_quantity > 0 &&
        (p.is_featured || p.rating >= QualityThresholds.minimumRating || p.review_count >= QualityThresholds.minimumProductReviews)
    );

    // If no eligible products, fall back to active products
    const candidates = eligibleProducts.length > 0 ? eligibleProducts : products.filter(p => p.is_active);

    return rankProducts(candidates, userRegion, limit);
}

export default {
    calculateVendorScore,
    calculateProductScore,
    rankVendors,
    rankProducts,
    getFeaturedVendors,
    getFeaturedProducts,
};
