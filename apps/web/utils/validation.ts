import type { VendorOnboardingData, FormValidationError } from '@/types/vendor-onboarding';

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
    const cleanedPhone = phone.replace(/\s/g, '');

    // UK Mobile numbers: 07xxx xxxxxx or +447xxx xxxxxx
    const ukMobileRegex = /^(07[1-9]\d{8}|(\+44|0)7[1-9]\d{8})$/;

    // UK Landline numbers: 01xxx xxxxxx, 02xxx xxxxxx, or +441xxx xxxxxx, +442xxx xxxxxx
    const ukLandlineRegex = /^(01[0-9]{8,9}|02[0-9]{9}|(\+44|0)1[0-9]{8,9}|(\+44|0)2[0-9]{9})$/;

    // International numbers: +[country code][number], minimum 10 digits total
    const internationalRegex = /^\+\d{9,14}$/;

    // UK special numbers (0800, 0844, etc.)
    const ukSpecialRegex = /^(0800\d{6}|084[0-9]\d{6}|087[0-9]\d{6}|090[0-9]\d{6}|03[0-9]\d{8}|(\+44|0)800\d{6}|(\+44|0)84[0-9]\d{6}|(\+44|0)87[0-9]\d{6}|(\+44|0)90[0-9]\d{6}|(\+44|0)3[0-9]\d{8})$/;

    return ukMobileRegex.test(cleanedPhone) ||
        ukLandlineRegex.test(cleanedPhone) ||
        internationalRegex.test(cleanedPhone) ||
        ukSpecialRegex.test(cleanedPhone);
};

export const getPhoneFormatHint = (phone: string): string => {
    const cleanedPhone = phone.replace(/\s/g, '');

    if (cleanedPhone.length === 0) {
        return 'Enter a UK mobile, landline, or international number';
    }

    // Check if it starts with proper UK format
    if (cleanedPhone.startsWith('07') && cleanedPhone.length === 11) {
        return 'UK mobile format accepted';
    } else if (cleanedPhone.startsWith('+447') && cleanedPhone.length === 13) {
        return 'UK mobile format accepted';
    } else if (cleanedPhone.startsWith('01') && cleanedPhone.length >= 10) {
        return 'UK landline format accepted';
    } else if (cleanedPhone.startsWith('02') && cleanedPhone.length >= 10) {
        return 'UK landline format accepted';
    } else if (cleanedPhone.startsWith('+44') && cleanedPhone.length >= 12) {
        return 'UK number with country code accepted';
    } else if (cleanedPhone.startsWith('+') && cleanedPhone.length >= 10) {
        return 'International format accepted';
    } else if (cleanedPhone.startsWith('0800') || cleanedPhone.startsWith('084') ||
        cleanedPhone.startsWith('087') || cleanedPhone.startsWith('090') ||
        cleanedPhone.startsWith('03')) {
        return 'UK special rate number format accepted';
    }

    return 'Please enter a valid UK phone number (e.g., 07xxx xxxxxx or +44 7xxx xxxxxx)';
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
                errors.push({ field: 'phone', message: 'Please enter a valid UK phone number (e.g., 07xxx xxxxxx, 01xxx xxxxxx, or +44 7xxx xxxxxx)' });
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
