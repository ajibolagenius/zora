import type { VendorOnboardingData } from '@/types/vendor-onboarding';

export interface SubmissionResponse {
    success: boolean;
    message: string;
    applicationId?: string;
    errors?: string[];
}

export class VendorOnboardingService {
    private static readonly API_ENDPOINT = '/api/vendor-onboarding';

    /**
     * Submit vendor application with all form data
     */
    static async submitApplication(data: VendorOnboardingData): Promise<SubmissionResponse> {
        try {
            // Create FormData for file uploads
            const formData = new FormData();

            // Add all text data
            formData.append('businessName', data.businessName);
            formData.append('businessType', data.businessType);
            formData.append('description', data.description);
            formData.append('email', data.email);
            formData.append('phone', data.phone);
            formData.append('addressLine1', data.addressLine1);
            formData.append('addressLine2', data.addressLine2);
            formData.append('city', data.city);
            formData.append('postcode', data.postcode);
            formData.append('country', data.country);

            // Add bank details (encrypt in real implementation)
            formData.append('bankDetails', JSON.stringify(data.bankDetails));

            // Add arrays
            formData.append('coverageAreas', JSON.stringify(data.coverageAreas));
            formData.append('productCategories', JSON.stringify(data.productCategories));

            // Add files if they exist
            if (data.documents.businessRegistration) {
                formData.append('businessRegistration', data.documents.businessRegistration);
            }
            if (data.documents.idDocument) {
                formData.append('idDocument', data.documents.idDocument);
            }
            if (data.documents.proofOfAddress) {
                formData.append('proofOfAddress', data.documents.proofOfAddress);
            }

            // Add CSRF token (implement in real app)
            const csrfToken = this.getCSRFToken();
            if (csrfToken) {
                formData.append('csrfToken', csrfToken);
            }

            const response = await fetch(this.API_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    // Don't set Content-Type with FormData - browser sets it with boundary
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin', // Include cookies for authentication
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            return {
                success: true,
                message: result.message || 'Application submitted successfully!',
                applicationId: result.applicationId,
            };

        } catch (error) {
            console.error('Vendor application submission error:', error);

            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to submit application. Please try again.',
                errors: error instanceof Error ? [error.message] : ['Unknown error occurred'],
            };
        }
    }

    /**
     * Process application on server side (for the API route)
     */
    static async processApplication(data: any): Promise<SubmissionResponse> {
        try {
            // In a real implementation, this would:
            // 1. Validate all data
            // 2. Store files in secure storage (S3, etc.)
            // 3. Save application to database
            // 4. Send confirmation emails
            // 5. Trigger admin notification

            // For now, simulate successful processing
            const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            return {
                success: true,
                message: 'Application submitted successfully! We will review your application within 2-3 business days.',
                applicationId,
            };

        } catch (error) {
            console.error('Error processing vendor application:', error);

            return {
                success: false,
                message: 'Failed to process application. Please try again.',
                errors: error instanceof Error ? [error.message] : ['Unknown error occurred'],
            };
        }
    }

    /**
     * Save draft to localStorage (already handled in hook, but keeping for API consistency)
     */
    static saveDraft(data: Partial<VendorOnboardingData>): void {
        try {
            const draftData = {
                ...data,
                savedAt: new Date().toISOString(),
            };
            localStorage.setItem('vendor-onboarding-draft', JSON.stringify(draftData));
        } catch (error) {
            console.warn('Failed to save draft:', error);
        }
    }

    /**
     * Load draft from localStorage
     */
    static loadDraft(): Partial<VendorOnboardingData> | null {
        try {
            const saved = localStorage.getItem('vendor-onboarding-draft');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Remove file objects as they can't be stored in localStorage
                if (parsed.documents) {
                    Object.keys(parsed.documents).forEach(key => {
                        (parsed.documents as any)[key] = null;
                    });
                }
                return parsed;
            }
        } catch (error) {
            console.warn('Failed to load draft:', error);
        }
        return null;
    }

    /**
     * Clear saved draft
     */
    static clearDraft(): void {
        try {
            localStorage.removeItem('vendor-onboarding-draft');
        } catch (error) {
            console.warn('Failed to clear draft:', error);
        }
    }

    /**
     * Validate email uniqueness (mock implementation)
     */
    static async checkEmailAvailability(email: string): Promise<{ available: boolean; message?: string }> {
        try {
            // In a real implementation, this would call an API endpoint
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

            // Mock check - in real app, this would check against database
            const isAvailable = !email.includes('taken@example.com');

            return {
                available: isAvailable,
                message: isAvailable ? 'Email is available' : 'This email is already registered',
            };
        } catch (error) {
            return {
                available: false,
                message: 'Failed to check email availability',
            };
        }
    }

    /**
     * Get CSRF token (implement based on your framework)
     */
    private static getCSRFToken(): string | null {
        // This would depend on your CSRF implementation
        // For Next.js, you might get it from a cookie or meta tag
        if (typeof document !== 'undefined') {
            const metaTag = document.querySelector('meta[name="csrf-token"]');
            return metaTag?.getAttribute('content') || null;
        }
        return null;
    }

    /**
     * Format bank details for secure transmission
     */
    private static formatBankDetails(bankDetails: VendorOnboardingData['bankDetails']): string {
        // In a real implementation, this would encrypt the data
        // For now, just returning JSON - implement proper encryption in production
        return JSON.stringify(bankDetails);
    }

    /**
     * Validate file before upload
     */
    static validateFile(file: File): { valid: boolean; error?: string } {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            return { valid: false, error: 'Only PDF, JPEG, and PNG files are allowed' };
        }

        if (file.size > maxSize) {
            return { valid: false, error: 'File size must be less than 5MB' };
        }

        return { valid: true };
    }
}
