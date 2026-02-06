export interface VendorOnboardingData {
    // Step 1: Business Info
    businessName: string;
    businessType: string;
    description: string;
    
    // Step 2: Contact Details
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postcode: string;
    country: string;
    
    // Step 3: Documents
    documents: {
        businessRegistration: File | null;
        idDocument: File | null;
        proofOfAddress: File | null;
    };
    
    // Step 4: Bank Details
    bankDetails: {
        accountHolderName: string;
        sortCode: string;
        accountNumber: string;
    };
    
    // Step 5: Coverage Areas
    coverageAreas: string[];
    
    // Step 6: Product Categories
    productCategories: string[];
}

export interface FormValidationError {
    field: string;
    message: string;
}

export interface FormState {
    data: VendorOnboardingData;
    errors: FormValidationError[];
    isSubmitting: boolean;
    submitError: string | null;
    isSaved: boolean;
}

export const BUSINESS_TYPES = [
    { value: 'grocery', label: 'Grocery Store' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'wholesaler', label: 'Wholesaler' },
    { value: 'producer', label: 'Food Producer' },
    { value: 'other', label: 'Other' },
] as const;

export const COVERAGE_CITIES = [
    'London', 'Birmingham', 'Manchester', 'Leeds', 
    'Liverpool', 'Bristol', 'Sheffield', 'Newcastle'
] as const;

export const PRODUCT_CATEGORIES = [
    'Spices & Seasonings',
    'Grains & Cereals', 
    'Vegetables',
    'Meat & Poultry',
    'Seafood',
    'Dairy & Eggs',
    'Beverages',
    'Snacks',
    'Canned Foods',
    'Oils & Condiments',
    'Baked Goods',
    'Textiles & Crafts',
] as const;
