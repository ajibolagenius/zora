/**
 * Vendor Application Types
 * Types for the vendor onboarding workflow
 */

export type VendorApplicationStatus = 
    | 'pending'
    | 'under_review'
    | 'documents_required'
    | 'approved'
    | 'rejected';

export type BusinessType = 
    | 'sole_trader'
    | 'limited_company'
    | 'partnership'
    | 'other';

export type CulturalRegion = 
    | 'west_africa'
    | 'east_africa'
    | 'north_africa'
    | 'southern_africa'
    | 'central_africa';

export interface VendorApplicationDocuments {
    business_registration?: string;
    id_document?: string;
    proof_of_address?: string;
    [key: string]: string | undefined;
}

export interface VendorBankDetails {
    account_name?: string;
    account_number?: string;
    sort_code?: string;
    bank_name?: string;
}

export interface CoverageArea {
    postcode_prefix: string;
    delivery_fee: number;
    min_order: number;
}

export interface VendorApplication {
    id: string;
    user_id?: string;
    
    // Business Information
    business_name: string;
    business_type: BusinessType;
    business_registration_number?: string;
    vat_number?: string;
    description?: string;
    
    // Contact Details
    contact_name: string;
    email: string;
    phone: string;
    
    // Address
    address_line_1: string;
    address_line_2?: string;
    city: string;
    postcode: string;
    country: string;
    
    // Documents & Bank
    documents: VendorApplicationDocuments;
    bank_details: VendorBankDetails;
    
    // Coverage & Categories
    coverage_areas: CoverageArea[];
    product_categories: string[];
    cultural_region?: CulturalRegion;
    
    // Status
    status: VendorApplicationStatus;
    reviewed_by?: string;
    reviewed_at?: string;
    rejection_reason?: string;
    internal_notes?: string;
    
    // Timestamps
    created_at: string;
    updated_at: string;
    submitted_at?: string;
}

export interface VendorApplicationStatusHistory {
    id: string;
    application_id: string;
    previous_status?: VendorApplicationStatus;
    new_status: VendorApplicationStatus;
    changed_by?: string;
    change_reason?: string;
    created_at: string;
}

export interface CreateVendorApplicationInput {
    business_name: string;
    business_type: BusinessType;
    business_registration_number?: string;
    vat_number?: string;
    description?: string;
    contact_name: string;
    email: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    postcode: string;
    coverage_areas?: CoverageArea[];
    product_categories?: string[];
    cultural_region?: CulturalRegion;
}

export interface UpdateVendorApplicationInput extends Partial<CreateVendorApplicationInput> {
    status?: VendorApplicationStatus;
    rejection_reason?: string;
    internal_notes?: string;
}
