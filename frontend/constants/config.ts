// Zora African Market Design Tokens - App Configuration

/**
 * Validation Limits
 * Character limits, file sizes, and other validation constraints
 */
export const ValidationLimits = {
  // Text input limits
  maxBioLength: 100,
  maxDescriptionLength: 1000,
  maxNameLength: 50,
  maxEmailLength: 255,
  maxPhoneLength: 20,
  // File limits
  maxPhotos: 5,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  // Quantity limits
  maxQuantity: 99,
  minQuantity: 1,
  // Search limits
  maxSearchResults: 100,
  minSearchLength: 2,
} as const;

/**
 * App Configuration
 * General app settings and constants
 */
export const AppConfig = {
  // Splash screen duration (milliseconds)
  splashScreenDuration: 5000,
  // Auto-play interval for sliders (milliseconds)
  autoPlayInterval: 5000,
  // Debounce delay for search (milliseconds)
  searchDebounceDelay: 300,
  // Pagination
  defaultPageSize: 20,
  maxPageSize: 100,
  // Product display
  defaultProductLimit: 20,
  featuredProductLimit: 8,
  // Vendor display
  defaultVendorLimit: 10,
  featuredVendorLimit: 6,
} as const;

/**
 * Order Configuration
 * Order-related constants
 */
export const OrderConfig = {
  // Delivery estimates (days)
  minDeliveryDays: 2,
  maxDeliveryDays: 4,
  // Order status
  defaultOrderStatus: 'preparing',
  // Order number prefix
  orderNumberPrefix: 'ZORA-',
} as const;

/**
 * Payment Configuration
 * Payment-related constants
 */
export const PaymentConfig = {
  // Currency
  currency: 'GBP',
  currencySymbol: '£',
  // Minimum order amount
  minOrderAmount: 5.0,
  // Welcome bonus
  welcomeBonus: 5.0,
  // Referral bonus
  referralBonus: 10.0,
} as const;

/**
 * Membership Configuration
 * Membership tier and loyalty points constants
 */
export const MembershipConfig = {
  // Membership tiers
  tiers: {
    bronze: 'bronze',
    silver: 'silver',
    gold: 'gold',
  },
  // Welcome loyalty points
  welcomePoints: 100,
  // Referral code prefix
  referralCodePrefix: 'ZORA',
} as const;

/**
 * UI Configuration
 * UI-related constants
 */
export const UiConfig = {
  // Product grid gap
  productGap: 8,
  // Card margins
  cardMargin: 8,
  // Screen padding
  screenPadding: 16,
  // Section spacing
  sectionSpacing: 24,
} as const;

export default {
  validation: ValidationLimits,
  app: AppConfig,
  order: OrderConfig,
  payment: PaymentConfig,
  membership: MembershipConfig,
  ui: UiConfig,
};
