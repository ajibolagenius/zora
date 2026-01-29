// Zora African Market Design Tokens - Business Logic Constants

/**
 * Scoring & Ranking Constants
 * Used for calculating vendor and product scores
 */
export const ScoringWeights = {
    // Vendor scoring weights
    vendor: {
        isFeatured: 50,        // Manual curation - highest priority
        isVerified: 15,        // Verified status
        rating: 20,            // Quality indicator
        reviewCount: 10,       // Social proof
        deliveryPerformance: 5, // Delivery speed
    },
    // Product scoring weights
    product: {
        isFeatured: 50,        // Manual curation - highest priority
        isActive: 10,          // Availability
        stockQuantity: 5,       // Stock availability
        rating: 20,            // Quality indicator
        reviewCount: 10,       // Social proof
        recency: 5,            // Newness factor
    },
} as const;

/**
 * Delivery Time Thresholds (in minutes)
 * Used for calculating delivery performance scores
 */
export const DeliveryTimeThresholds = {
    excellent: 30,  // 30 minutes = full bonus
    good: 45,       // 45 minutes = 60% bonus
    fair: 60,       // 60 minutes = 20% bonus
    poor: 90,       // 90+ minutes = no bonus
} as const;

/**
 * Recency Bonus Thresholds (in days)
 * Used for calculating recency scores
 */
export const RecencyThresholds = {
    veryNew: 30,   // Full bonus for products/vendors created in last 30 days
    recent: 90,    // Half bonus for products/vendors created in last 90 days
} as const;

/**
 * Bonus Points
 * Additional scoring bonuses
 */
export const ScoringBonuses = {
    regionalMatch: 5,        // Bonus for matching user's cultural region
    certification: 2,         // Bonus for certified products
    recencyFull: 5,          // Full recency bonus (matches product.recency)
    recencyHalf: 2.5,        // Half recency bonus
} as const;

/**
 * Minimum Quality Thresholds
 * Used for filtering featured items
 */
export const QualityThresholds = {
    minimumRating: 3.5,      // Minimum rating to be featured
    minimumReviewCount: 5,   // Minimum reviews for vendors
    minimumProductReviews: 3, // Minimum reviews for products
} as const;

/**
 * Cart & Pricing Constants
 */
export const PricingConstants = {
    // Delivery fees
    freeDeliveryThreshold: 29.99,  // Orders £29.99 or more get free delivery
    deliveryFee: 2.50,              // Delivery fee for orders under £29.99

    // Service fees (if applicable)
    serviceFeePercentage: 0,     // Service fee as percentage (0 = no service fee)
    serviceFeeFixed: 0,          // Fixed service fee amount

    // Minimum amounts
    minOrderAmount: 5.0,         // Minimum order amount (already in PaymentConfig)
} as const;

/**
 * Payment Method Limits
 * Minimum and maximum amounts for different payment methods
 */
export const PaymentLimits = {
    // Pay Later (Klarna/Clearpay)
    payLater: {
        minAmount: 10,
        maxAmount: 1000,
    },
    // Pay in 3
    payIn3: {
        minAmount: 35,
        maxAmount: 1000,
    },
    // Financing
    financing: {
        minAmount: 99,
        maxAmount: 10000,
    },
    // Standard payment methods (Stripe, etc.)
    standard: {
        minAmount: 0,
        maxAmount: Infinity,
    },
} as const;

/**
 * Dispute & Resolution Constants
 */
export const DisputeConstants = {
    // Resolution options
    resolutionOptions: [
        {
            id: 'refund',
            title: 'Full Refund',
            description: 'Refund to original payment method',
        },
        {
            id: 'partial',
            title: 'Partial Refund',
            description: 'Keep item with a discount',
        },
        {
            id: 'replacement',
            title: 'Replacement',
            description: 'Send new items immediately',
        },
        {
            id: 'credit',
            title: 'Store Credit',
            description: 'Instant credit to your wallet',
        },
    ] as const,

    // Evidence requirements
    maxPhotos: 5,              // Maximum photos for dispute evidence
    maxDescriptionLength: 1000, // Maximum description length
} as const;

/**
 * Referral Constants
 */
export const ReferralConstants = {
    referralBonus: 10.0,       // Referral bonus amount in GBP
    referralCodePrefix: 'ZORA', // Prefix for referral codes
    defaultReferralCode: 'ZORA-REF-2024', // Default fallback code
    shareMessageTemplate: 'Join Zora African Market with my code {code} and get £{amount} off your first order! 🛒🌍',
} as const;

export default {
    scoring: ScoringWeights,
    delivery: DeliveryTimeThresholds,
    recency: RecencyThresholds,
    bonuses: ScoringBonuses,
    quality: QualityThresholds,
    pricing: PricingConstants,
    payment: PaymentLimits,
    dispute: DisputeConstants,
    referral: ReferralConstants,
};
