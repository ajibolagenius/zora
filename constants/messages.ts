// Zora African Market Design Tokens - Messages & Text Constants

/**
 * Error Messages
 * User-facing error messages used throughout the app
 */
export const ErrorMessages = {
    // Authentication errors
    auth: {
        signInFailed: 'Sign In Failed',
        signUpFailed: 'Sign Up Failed',
        missingFields: 'Please enter your email and password',
        missingName: 'Please enter your name',
        invalidCredentials: 'Invalid email or password',
        emailAlreadyExists: 'An account with this email already exists',
        weakPassword: 'Password is too weak',
        networkError: 'Network error. Please check your connection and try again.',
        timeout: 'Request timed out. Please check your internet connection and try again.',
        generic: 'An error occurred during authentication',
    },

    // Validation errors
    validation: {
        required: 'This field is required',
        emailInvalid: 'Please enter a valid email address',
        passwordTooShort: 'Password must be at least 8 characters long',
        passwordMismatch: 'Passwords do not match',
        passwordSame: 'New password must be different from current password',
        phoneInvalid: 'Please enter a valid phone number',
        postcodeInvalid: 'Please enter a valid UK postcode',
        nameTooLong: 'Name is too long',
    },

    // Form errors
    form: {
        saveFailed: 'Failed to save. Please try again.',
        updateFailed: 'Failed to update. Please try again.',
        deleteFailed: 'Failed to delete. Please try again.',
        loadFailed: 'Failed to load data. Please try again.',
    },

    // Network errors
    network: {
        offline: 'You are currently offline. Please check your connection.',
        timeout: 'Request timed out. Please try again.',
        serverError: 'Server error. Please try again later.',
        notFound: 'The requested resource was not found.',
        unauthorized: 'You are not authorized to perform this action.',
    },

    // Generic errors
    generic: {
        somethingWentWrong: 'Something went wrong. Please try again.',
        tryAgain: 'An error occurred. Please try again.',
        contactSupport: 'If this problem persists, please contact support.',
    },
} as const;

/**
 * Success Messages
 * User-facing success messages
 */
export const SuccessMessages = {
    // Profile
    profile: {
        updated: 'Your profile has been updated.',
        photoChanged: 'Profile photo updated successfully.',
    },

    // Password
    password: {
        changed: 'Your password has been changed successfully.',
        resetSent: 'Password reset email sent. Please check your inbox.',
    },

    // Orders
    order: {
        placed: 'Order placed successfully!',
        cancelled: 'Order cancelled successfully.',
    },

    // Cart
    cart: {
        itemAdded: 'Item added to cart',
        itemRemoved: 'Item removed from cart',
        cleared: 'Cart cleared',
    },

    // Referrals
    referral: {
        codeCopied: 'Referral code copied to clipboard',
        shared: 'Referral code shared successfully',
    },

    // General
    saved: 'Saved successfully',
    deleted: 'Deleted successfully',
    updated: 'Updated successfully',
    copied: 'Copied to clipboard',
} as const;

/**
 * Placeholder Text
 * Input placeholder text used throughout the app
 */
export const Placeholders = {
    // Authentication
    auth: {
        fullName: 'Full Name',
        email: 'Email Address',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        currentPassword: 'Enter current password',
        newPassword: 'Enter new password',
    },

    // Search
    search: {
        products: 'Search products...',
        vendors: 'Search vendors...',
        orders: 'Search orders...',
        general: 'Search...',
    },

    // Forms
    form: {
        firstName: 'First Name',
        lastName: 'Last Name',
        phone: 'Phone Number',
        postcode: 'Enter postcode (e.g., SW9 8HQ)',
        address: 'Enter address',
        city: 'City',
        country: 'Country',
        description: 'Enter description...',
        message: 'Type a message...',
        reviewName: 'Enter your name',
        reviewTitle: 'Summarize your experience',
        reviewBody: 'Share details of your experience...',
        disputeDescription: 'Please describe the issue in detail so we can help resolve it quickly...',
        helpMessage: 'How can we help?',
    },

    // Price inputs
    price: {
        min: (min: number) => `£${min}`,
        max: (max: number) => `£${max}`,
    },
} as const;

/**
 * Alert Messages
 * Confirmation and alert dialog messages
 */
export const AlertMessages = {
    // Confirmations
    confirm: {
        delete: 'Are you sure you want to delete this?',
        deleteAddress: 'Are you sure you want to delete this address?',
        cancelOrder: 'Are you sure you want to cancel this order?',
        logout: 'Are you sure you want to log out?',
        clearCart: 'Are you sure you want to clear your cart?',
    },

    // Warnings
    warning: {
        unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?',
        lowStock: 'This item is running low in stock',
        outOfStock: 'This item is out of stock',
    },

    // Info
    info: {
        comingSoon: 'This feature is coming soon!',
        photoUploadComingSoon: 'Photo upload feature coming soon!',
        addressEditComingSoon: 'Address editing feature coming soon!',
        addressAddComingSoon: 'Address addition feature coming soon!',
    },

    // Titles
    titles: {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information',
        confirm: 'Confirm',
        delete: 'Delete',
        cancel: 'Cancel',
        ok: 'OK',
    },
} as const;

/**
 * Empty State Messages
 * Messages shown when lists or content are empty
 */
export const EmptyStateMessages = {
    cart: 'Your cart is empty',
    orders: 'No orders yet',
    products: 'No products found',
    vendors: 'No vendors found',
    reviews: 'No reviews yet',
    notifications: 'No notifications',
    searchResults: 'No results found',
    addresses: 'No saved addresses',
    paymentMethods: 'No payment methods',
} as const;

export default {
    errors: ErrorMessages,
    success: SuccessMessages,
    placeholders: Placeholders,
    alerts: AlertMessages,
    emptyStates: EmptyStateMessages,
};
