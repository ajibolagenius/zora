// Zora UI Web Components Library

// All components
export * from "./components";

// Utilities
export { cn, formatCurrency, formatDate, formatRelativeTime, truncate } from "./lib/utils";

// Animations
export {
    duration,
    easing,
    fadeIn,
    fadeInUp,
    fadeInDown,
    fadeInScale,
    slideInLeft,
    slideInRight,
    staggerContainer,
    staggerItem,
    scaleOnHover,
    scaleOnTap,
    pageTransition,
    modalOverlay,
    modalContent,
    skeletonPulse,
    springNumber,
} from "./lib/animations";

// Shared Constants
export {
    ORDER_STATUS_CONFIG,
    PRODUCT_STATUS_CONFIG,
    VENDOR_STATUS_CONFIG,
    CUSTOMER_STATUS_CONFIG,
    PAYMENT_STATUS_CONFIG,
    ORDER_NEXT_STATUS,
    getInitials,
    formatPhoneNumber,
    DESIGN_COLORS,
} from "./lib/constants";

// Types
export type {
    OrderStatus,
    ProductStatus,
    VendorStatus,
    CustomerStatus,
    PaymentStatus,
} from "./lib/constants";
