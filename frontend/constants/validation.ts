// Zora African Market Design Tokens - Validation Constants

/**
 * Password Validation Rules
 */
export const PasswordRules = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false,
} as const;

/**
 * Form Validation Limits
 */
export const ValidationLimits = {
    // Name fields
    name: {
        minLength: 1,
        maxLength: 50,
    },

    // Email
    email: {
        minLength: 3,
        maxLength: 255,
    },

    // Phone
    phone: {
        minLength: 10,
        maxLength: 20,
    },

    // Address
    address: {
        minLength: 5,
        maxLength: 200,
    },

    // Postcode (UK)
    postcode: {
        minLength: 5,
        maxLength: 8,
        pattern: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
    },

    // Description/Text areas
    description: {
        minLength: 0,
        maxLength: 1000,
    },

    // Bio
    bio: {
        minLength: 0,
        maxLength: 100,
    },
} as const;

/**
 * Validation Patterns
 * Regular expressions for validating input formats
 */
export const ValidationPatterns = {
    // Email pattern
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    // UK phone pattern (flexible)
    phoneUK: /^(\+44|0)[1-9]\d{8,9}$/,

    // UK postcode pattern
    postcodeUK: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,

    // International phone (basic)
    phoneInternational: /^\+?[1-9]\d{1,14}$/,

    // URL pattern
    url: /^https?:\/\/.+/,

    // Alphanumeric with spaces
    alphanumeric: /^[a-zA-Z0-9\s]+$/,

    // Letters only
    lettersOnly: /^[a-zA-Z\s]+$/,

    // Numbers only
    numbersOnly: /^\d+$/,

    // Decimal number
    decimal: /^\d+(\.\d{1,2})?$/,
} as const;

/**
 * Validation Error Messages
 * Specific error messages for validation failures
 */
export const ValidationErrors = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    postcode: 'Please enter a valid UK postcode',
    password: {
        tooShort: `Password must be at least ${PasswordRules.minLength} characters long`,
        tooLong: `Password must be no more than ${PasswordRules.maxLength} characters`,
        noUppercase: 'Password must contain at least one uppercase letter',
        noLowercase: 'Password must contain at least one lowercase letter',
        noNumber: 'Password must contain at least one number',
        noSpecialChar: 'Password must contain at least one special character',
    },
    name: {
        tooShort: `Name must be at least ${ValidationLimits.name.minLength} character`,
        tooLong: `Name must be no more than ${ValidationLimits.name.maxLength} characters`,
        invalid: 'Name can only contain letters and spaces',
    },
    description: {
        tooLong: `Description must be no more than ${ValidationLimits.description.maxLength} characters`,
    },
} as const;

export default {
    password: PasswordRules,
    limits: ValidationLimits,
    patterns: ValidationPatterns,
    errors: ValidationErrors,
};
