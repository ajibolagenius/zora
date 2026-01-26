/**
 * Ranking Service
 * Provides scoring and ranking algorithms for vendors and products
 * Combines multiple criteria to determine featured items
 */

import type { Vendor, Product } from './mockDataService';

// Scoring weights (can be adjusted based on business priorities)
const SCORING_WEIGHTS = {
  // Vendor weights
  vendor: {
    is_featured: 50,        // Manual curation - highest priority
    is_verified: 15,        // Verified status
    rating: 20,             // Quality indicator
    review_count: 10,       // Social proof
    delivery_performance: 5, // Delivery speed
  },
  // Product weights
  product: {
    is_featured: 50,        // Manual curation - highest priority
    is_active: 10,          // Availability
    stock_quantity: 5,      // Stock availability
    rating: 20,             // Quality indicator
    review_count: 10,       // Social proof
    recency: 5,             // Newness factor
  },
};

/**
 * Calculate vendor score based on multiple criteria
 */
export function calculateVendorScore(vendor: Vendor, userRegion?: string): number {
  let score = 0;

  // 1. Manual curation (highest priority)
  if (vendor.is_featured) {
    score += SCORING_WEIGHTS.vendor.is_featured;
  }

  // 2. Verified status
  if (vendor.is_verified) {
    score += SCORING_WEIGHTS.vendor.is_verified;
  }

  // 3. Rating (normalized to 0-20, where 5.0 = 20 points)
  const ratingScore = Math.min((vendor.rating / 5.0) * SCORING_WEIGHTS.vendor.rating, SCORING_WEIGHTS.vendor.rating);
  score += ratingScore;

  // 4. Review count (logarithmic scale: more reviews = diminishing returns)
  // 0 reviews = 0, 10 reviews = 5, 50 reviews = 8, 100+ reviews = 10
  const reviewCountScore = Math.min(
    Math.log10(Math.max(vendor.review_count, 1)) * (SCORING_WEIGHTS.vendor.review_count / 2),
    SCORING_WEIGHTS.vendor.review_count
  );
  score += reviewCountScore;

  // 5. Delivery performance (faster delivery = higher score)
  // 30min = 5 points, 45min = 3 points, 60min = 1 point, 90min+ = 0
  if (vendor.delivery_time_max <= 30) {
    score += SCORING_WEIGHTS.vendor.delivery_performance;
  } else if (vendor.delivery_time_max <= 45) {
    score += SCORING_WEIGHTS.vendor.delivery_performance * 0.6;
  } else if (vendor.delivery_time_max <= 60) {
    score += SCORING_WEIGHTS.vendor.delivery_performance * 0.2;
  }

  // 6. Geographic relevance (bonus if vendor matches user's region)
  if (userRegion && vendor.cultural_specialties.some(s => 
    s.toLowerCase().includes(userRegion.toLowerCase())
  )) {
    score += 5; // Bonus for regional match
  }

  // 7. Recency bonus (vendors created in last 90 days get small boost)
  const daysSinceCreation = (Date.now() - new Date(vendor.created_at).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreation <= 90) {
    score += 2; // Small recency bonus
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
    score += SCORING_WEIGHTS.product.is_featured;
  }

  // 2. Active status
  if (product.is_active) {
    score += SCORING_WEIGHTS.product.is_active;
  }

  // 3. Stock availability (more stock = higher score, but with diminishing returns)
  if (product.stock_quantity > 0) {
    const stockScore = Math.min(
      Math.log10(Math.max(product.stock_quantity, 1)) * (SCORING_WEIGHTS.product.stock_quantity / 2),
      SCORING_WEIGHTS.product.stock_quantity
    );
    score += stockScore;
  }

  // 4. Rating (normalized to 0-20, where 5.0 = 20 points)
  const ratingScore = Math.min((product.rating / 5.0) * SCORING_WEIGHTS.product.rating, SCORING_WEIGHTS.product.rating);
  score += ratingScore;

  // 5. Review count (logarithmic scale)
  // 0 reviews = 0, 5 reviews = 5, 20 reviews = 8, 50+ reviews = 10
  const reviewCountScore = Math.min(
    Math.log10(Math.max(product.review_count, 1)) * (SCORING_WEIGHTS.product.review_count / 1.7),
    SCORING_WEIGHTS.product.review_count
  );
  score += reviewCountScore;

  // 6. Recency (products created in last 90 days get bonus)
  const daysSinceCreation = (Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreation <= 30) {
    score += SCORING_WEIGHTS.product.recency; // Full bonus for very new
  } else if (daysSinceCreation <= 90) {
    score += SCORING_WEIGHTS.product.recency * 0.5; // Half bonus for recent
  }

  // 7. Geographic relevance (bonus if product matches user's region)
  if (userRegion && product.cultural_region?.toLowerCase().includes(userRegion.toLowerCase())) {
    score += 5; // Bonus for regional match
  }

  // 8. Certifications bonus (products with certifications get small boost)
  if (product.certifications && product.certifications.length > 0) {
    score += 2; // Small bonus for certified products
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
    v.is_featured || v.is_verified || v.rating >= 3.5 || v.review_count >= 5
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
    (p.is_featured || p.rating >= 3.5 || p.review_count >= 3)
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
