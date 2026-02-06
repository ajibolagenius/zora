import { useState, useEffect, useCallback } from 'react';
import type { VendorOnboardingData, FormState, FormValidationError } from '@/types/vendor-onboarding';
import { validateStep } from '@/utils/validation';

const STORAGE_KEY = 'vendor-onboarding-draft';

const getInitialData = (): VendorOnboardingData => ({
    businessName: '',
    businessType: '',
    description: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
    documents: {
        businessRegistration: null,
        idDocument: null,
        proofOfAddress: null,
    },
    bankDetails: {
        accountHolderName: '',
        sortCode: '',
        accountNumber: '',
    },
    coverageAreas: [],
    productCategories: [],
});

const loadSavedData = (): VendorOnboardingData | null => {
    if (typeof window === 'undefined') return null;

    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Convert file objects back from their serialized form
            if (parsed.documents) {
                Object.keys(parsed.documents).forEach(key => {
                    // File objects can't be stored in localStorage, so they'll be null
                    parsed.documents[key] = null;
                });
            }
            return parsed;
        }
    } catch (error) {
        console.warn('Failed to load saved form data:', error);
    }
    return null;
};

export const useVendorOnboardingForm = () => {
    const savedData = loadSavedData();
    const [formState, setFormState] = useState<FormState>({
        data: savedData || getInitialData(),
        errors: [],
        isSubmitting: false,
        submitError: null,
        isSaved: !!savedData,
    });

    // Auto-save to localStorage
    useEffect(() => {
        const timer = setTimeout(() => {
            if (typeof window !== 'undefined') {
                try {
                    // Create a copy without file objects for storage
                    const dataToSave = { ...formState.data };
                    dataToSave.documents = {
                        businessRegistration: null,
                        idDocument: null,
                        proofOfAddress: null,
                    };

                    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
                    setFormState(prev => ({ ...prev, isSaved: true }));
                } catch (error) {
                    console.warn('Failed to save form data:', error);
                }
            }
        }, 1000); // Debounce save

        return () => clearTimeout(timer);
    }, [formState.data]);

    const updateField = useCallback((field: string, value: any) => {
        setFormState(prev => {
            const newData = { ...prev.data };

            // Handle nested field updates
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                (newData as any)[parent] = {
                    ...(newData as any)[parent],
                    [child]: value,
                };
            } else if (field.includes('documents.')) {
                const docField = field.replace('documents.', '');
                newData.documents = {
                    ...newData.documents,
                    [docField]: value,
                };
            } else {
                (newData as any)[field] = value;
            }

            // Clear errors for this field (handle both dotted and leaf field names)
            const fieldToClear = field.includes('.') ? field.split('.')[1] : field;
            return {
                ...prev,
                data: newData,
                errors: prev.errors.filter(error => error.field !== fieldToClear),
                submitError: null,
            };
        });
    }, []);

    const updateMultipleFields = useCallback((updates: Partial<VendorOnboardingData>) => {
        setFormState(prev => ({
            ...prev,
            data: { ...prev.data, ...updates },
            errors: [],
            submitError: null,
        }));
    }, []);

    const validateCurrentStep = useCallback((step: number) => {
        const errors = validateStep(step, formState.data);
        setFormState(prev => ({ ...prev, errors }));
        return errors.length === 0;
    }, [formState.data]);

    const clearErrors = useCallback(() => {
        setFormState(prev => ({ ...prev, errors: [], submitError: null }));
    }, []);

    const setSubmitting = useCallback((isSubmitting: boolean) => {
        setFormState(prev => ({ ...prev, isSubmitting }));
    }, []);

    const setSubmitError = useCallback((error: string | null) => {
        setFormState(prev => ({ ...prev, submitError: error }));
    }, []);

    const resetForm = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
        setFormState({
            data: getInitialData(),
            errors: [],
            isSubmitting: false,
            submitError: null,
            isSaved: false,
        });
    }, []);

    const getFieldError = useCallback((field: string): string | null => {
        const error = formState.errors.find(error => error.field === field);
        return error?.message || null;
    }, [formState.errors]);

    const hasFieldError = useCallback((field: string): boolean => {
        return formState.errors.some(error => error.field === field);
    }, [formState.errors]);

    return {
        formState,
        updateField,
        updateMultipleFields,
        validateCurrentStep,
        clearErrors,
        setSubmitting,
        setSubmitError,
        resetForm,
        getFieldError,
        hasFieldError,
    };
};
