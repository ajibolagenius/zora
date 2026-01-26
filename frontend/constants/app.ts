// Zora African Market Design Tokens - App-Specific Constants

/**
 * Sort Options
 * Standard sort options for products, vendors, and search results
 */
export const SortOptions = {
    // Product sort options
    products: [
        { id: 'rating', label: 'Top Rated' },
        { id: 'price_asc', label: 'Price: Low to High' },
        { id: 'price_desc', label: 'Price: High to Low' },
        { id: 'name', label: 'Name A-Z' },
        { id: 'newest', label: 'Newest First' },
    ] as const,
    // Vendor sort options
    vendors: [
        { id: 'rating', label: 'Top Rated' },
        { id: 'name', label: 'Name A-Z' },
        { id: 'delivery', label: 'Fastest Delivery' },
    ] as const,
    // Vendor products sort options
    vendorProducts: [
        { id: 'rating', label: 'Top Rated' },
        { id: 'price_asc', label: 'Price: Low to High' },
        { id: 'price_desc', label: 'Price: High to Low' },
        { id: 'name', label: 'Name A-Z' },
    ] as const,
} as const;

/**
 * Rating Options
 * Available rating filter options
 */
export const RatingOptions = [4, 3, 2, 1] as const;

/**
 * Category Options
 * Product category filter options
 */
export const CategoryOptions = [
    { id: 'all', label: 'All Categories' },
    { id: 'traditional-ingredients', label: 'Traditional Ingredients' },
    { id: 'spices-seasonings', label: 'Spices & Seasonings' },
    { id: 'beverages', label: 'Beverages' },
    { id: 'beauty-skincare', label: 'Beauty & Skincare' },
    { id: 'fashion-textiles', label: 'Fashion & Textiles' },
    { id: 'art-crafts', label: 'Art & Crafts' },
] as const;

/**
 * Trending Searches
 * Popular search terms
 */
export const TrendingSearches = [
    'Jollof rice',
    'Plantain',
    'Egusi',
    'Palm oil',
    'Suya spice',
    'Fufu',
] as const;

/**
 * Quick Replies
 * Pre-defined quick reply messages
 */
export const QuickReplies = {
    // Vendor chat quick replies
    vendorChat: [
        "What are your delivery hours?",
        "Do you have this in stock?",
        "Can I customize my order?",
        "What's your return policy?",
    ] as const,
    // Order support quick replies
    orderSupport: [
        "Where's my order?",
        "Wrong item",
        "Request refund",
        "Speak to human",
    ] as const,
} as const;

/**
 * Order Tracking Steps
 * Standard order tracking status steps
 */
export const TrackingSteps = [
    { status: 'confirmed', label: 'Order Confirmed', icon: 'check-circle' },
    { status: 'preparing', label: 'Preparing', icon: 'chef-hat' },
    { status: 'ready', label: 'Ready for Pickup', icon: 'package-variant' },
    { status: 'out_for_delivery', label: 'Out for Delivery', icon: 'truck-delivery' },
    { status: 'delivered', label: 'Delivered', icon: 'home-check' },
] as const;

/**
 * Order Status Types
 * Order status type definitions
 */
export const OrderStatus = {
    preparing: 'preparing',
    outForDelivery: 'out_for_delivery',
    delivered: 'delivered',
    cancelled: 'cancelled',
    confirmed: 'confirmed',
    ready: 'ready',
} as const;

/**
 * Tab Types
 * Tab navigation types
 */
export const TabTypes = {
    active: 'active',
    completed: 'completed',
    cancelled: 'cancelled',
} as const;

/**
 * Dispute Resolution Options
 * Available resolution options for disputes
 */
export const ResolutionOptions = [
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
] as const;

export default {
    sortOptions: SortOptions,
    ratingOptions: RatingOptions,
    categoryOptions: CategoryOptions,
    trendingSearches: TrendingSearches,
    quickReplies: QuickReplies,
    trackingSteps: TrackingSteps,
    orderStatus: OrderStatus,
    tabTypes: TabTypes,
    resolutionOptions: ResolutionOptions,
};
