import type { VendorOnboardingData, FormValidationError } from '@/types/vendor-onboarding';

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
    const cleanedPhone = phone.replace(/\s/g, '');

    // Support multiple formats:
    // 1. UK mobile: +447XXXXXXXXX or 07XXXXXXXXX
    // 2. UK landline: +4420XXXXXXXXX or 020XXXXXXXXX
    // 3. International formats (for vendors with foreign numbers)
    const ukMobileRegex = /^(\+44|0)7\d{9}$/;
    const ukLandlineRegex = /^(\+44|0)(1|2)\d{9,10}$/;
    const internationalRegex = /^\+\d{10,15}$/;

    return ukMobileRegex.test(cleanedPhone) ||
        ukLandlineRegex.test(cleanedPhone) ||
        internationalRegex.test(cleanedPhone);
};

export const getPhoneFormatHint = (phone: string): string => {
    const cleanedPhone = phone.replace(/\s/g, '');

    if (/^(\+44|0)7\d{9}$/.test(cleanedPhone)) {
        return 'UK mobile number format: +44 7XXX XXXXXX or 07XXX XXXXXX';
    } else if (/^(\+44|0)(1|2)\d{9,10}$/.test(cleanedPhone)) {
        return 'UK landline format: +44 20XXX XXXX or 020XXX XXXX';
    } else if (/^\+\d{10,15}$/.test(cleanedPhone)) {
        return 'International format: +[country code] [number]';
    }

    return 'Enter a valid phone number';
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
                errors.push({ field: 'phone', message: 'Please enter a valid phone number (UK mobile/landline or international)' });
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
