import type { VendorOnboardingData, FormValidationError } from '@/types/vendor-onboarding';

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
    // Accept all phone numbers - just check if it's not empty and has some basic format
    const cleanedPhone = phone.replace(/\s/g, '');

    // Basic validation: at least 6 characters and contains at least one digit
    return cleanedPhone.length >= 6 && /\d/.test(cleanedPhone);
};

export const getPhoneFormatHint = (phone: string): string => {
    const cleanedPhone = phone.replace(/\s/g, '');

    if (cleanedPhone.length === 0) {
        return 'Enter any phone number';
    } else if (cleanedPhone.length < 6) {
        return 'Phone number must be at least 6 characters';
    } else if (!/\d/.test(cleanedPhone)) {
        return 'Phone number must contain at least one digit';
    }

    return 'Phone number format accepted';
};

export const validatePostcode = (postcode: string): boolean => {
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return postcodeRegex.test(postcode.replace(/\s/g, ''));
};

export const validateSortCode = (sortCode: string): boolean => {
    const sortCodeRegex = /^\d{2}-\d{2}-\d{2}$/;
    return sortCodeRegex.test(sortCode);
};

export const validateAccountNumber = (accountNumber: string): boolean => {
    const accountNumberRegex = /^\d{8}$/;
    return accountNumberRegex.test(accountNumber.replace(/\s/g, ''));
};

export const validateFile = (file: File | null, maxSizeMB: number = 5): string | null => {
    if (!file) return 'File is required';

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
        return 'Only PDF, JPEG, and PNG files are allowed';
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
};

export const validateStep = (step: number, data: VendorOnboardingData): FormValidationError[] => {
    const errors: FormValidationError[] = [];

    switch (step) {
        case 1:
            if (!data.businessName.trim()) {
                errors.push({ field: 'businessName', message: 'Business name is required' });
            }
            if (!data.businessType) {
                errors.push({ field: 'businessType', message: 'Business type is required' });
            }
            break;

        case 2:
            if (!data.email.trim()) {
                errors.push({ field: 'email', message: 'Email is required' });
            } else if (!validateEmail(data.email)) {
                errors.push({ field: 'email', message: 'Please enter a valid email address' });
            }

            if (!data.phone.trim()) {
                errors.push({ field: 'phone', message: 'Phone number is required' });
            } else if (!validatePhone(data.phone)) {
                errors.push({ field: 'phone', message: 'Please enter a valid phone number (minimum 6 characters with at least one digit)' });
            }

            if (!data.addressLine1.trim()) {
                errors.push({ field: 'addressLine1', message: 'Address line 1 is required' });
            }

            if (!data.city.trim()) {
                errors.push({ field: 'city', message: 'City is required' });
            }

            if (!data.postcode.trim()) {
                errors.push({ field: 'postcode', message: 'Postcode is required' });
            } else if (!validatePostcode(data.postcode)) {
                errors.push({ field: 'postcode', message: 'Please enter a valid UK postcode' });
            }
            break;

        case 3:
            const documentErrors = [
                { field: 'businessRegistration', file: data.documents.businessRegistration, name: 'Business registration' },
                { field: 'idDocument', file: data.documents.idDocument, name: 'ID document' },
                { field: 'proofOfAddress', file: data.documents.proofOfAddress, name: 'Proof of address' },
            ];

            documentErrors.forEach(({ field, file, name }) => {
                const error = validateFile(file);
                if (error) {
                    errors.push({ field, message: `${name}: ${error}` });
                }
            });
            break;

        case 4:
            if (!data.bankDetails.accountHolderName.trim()) {
                errors.push({ field: 'accountHolderName', message: 'Account holder name is required' });
            }

            if (!data.bankDetails.sortCode.trim()) {
                errors.push({ field: 'sortCode', message: 'Sort code is required' });
            } else if (!validateSortCode(data.bankDetails.sortCode)) {
                errors.push({ field: 'sortCode', message: 'Please enter a valid sort code (XX-XX-XX)' });
            }

            if (!data.bankDetails.accountNumber.trim()) {
                errors.push({ field: 'accountNumber', message: 'Account number is required' });
            } else if (!validateAccountNumber(data.bankDetails.accountNumber)) {
                errors.push({ field: 'accountNumber', message: 'Please enter a valid 8-digit account number' });
            }
            break;

        case 5:
            if (data.coverageAreas.length === 0) {
                errors.push({ field: 'coverageAreas', message: 'Please select at least one coverage area' });
            }
            break;

        case 6:
            if (data.productCategories.length === 0) {
                errors.push({ field: 'productCategories', message: 'Please select at least one product category' });
            }
            break;
    }

    return errors;
};

export const validateAllSteps = (data: VendorOnboardingData): FormValidationError[] => {
    let allErrors: FormValidationError[] = [];

    for (let step = 1; step <= 6; step++) {
        allErrors = [...allErrors, ...validateStep(step, data)];
    }

    return allErrors;
};
