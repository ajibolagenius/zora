import { User, MapPin } from '@phosphor-icons/react';
import { Input } from '@zora/ui-web';
import type { VendorOnboardingData } from '@/types/vendor-onboarding';
import { getPhoneFormatHint } from '@/utils/validation';

interface ContactDetailsStepProps {
    data: VendorOnboardingData;
    updateField: (field: string, value: any) => void;
    getFieldError: (field: string) => string | null;
    hasFieldError: (field: string) => boolean;
}

export function ContactDetailsStep({ data, updateField, getFieldError, hasFieldError }: ContactDetailsStepProps) {
    return (
        <div className="space-y-6" role="group" aria-labelledby="step2-heading">
            <h2 id="step2-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User size={24} weight="duotone" className="text-primary" />
                Contact Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="business@example.com"
                        className={`w-full ${hasFieldError('email') ? 'border-red-500' : ''}`}
                        aria-required="true"
                        aria-describedby={hasFieldError('email') ? 'email-error' : undefined}
                    />
                    {hasFieldError('email') && (
                        <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                            {getFieldError('email')}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <Input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="e.g., 07xxx xxxxxx or +44 7xxx xxxxxx"
                        className={`w-full ${hasFieldError('phone') ? 'border-red-500' : ''}`}
                        aria-required="true"
                        aria-describedby={hasFieldError('phone') ? 'phone-error phone-help' : 'phone-help'}
                    />
                    {hasFieldError('phone') && (
                        <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                            {getFieldError('phone')}
                        </p>
                    )}
                    <p id="phone-help" className="mt-1 text-sm text-gray-500">
                        {getPhoneFormatHint(data.phone) || 'Enter a UK mobile, landline, or international number'}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <MapPin size={20} weight="duotone" className="text-primary" />
                    Business Address
                </h3>

                <div>
                    <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Address Line 1 <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <Input
                        id="addressLine1"
                        type="text"
                        value={data.addressLine1}
                        onChange={(e) => updateField('addressLine1', e.target.value)}
                        placeholder="Street address"
                        className={`w-full ${hasFieldError('addressLine1') ? 'border-red-500' : ''}`}
                        aria-required="true"
                        aria-describedby={hasFieldError('addressLine1') ? 'addressLine1-error' : undefined}
                    />
                    {hasFieldError('addressLine1') && (
                        <p id="addressLine1-error" className="mt-1 text-sm text-red-600" role="alert">
                            {getFieldError('addressLine1')}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Address Line 2
                    </label>
                    <Input
                        id="addressLine2"
                        type="text"
                        value={data.addressLine2}
                        onChange={(e) => updateField('addressLine2', e.target.value)}
                        placeholder="Apartment, suite, etc."
                        aria-describedby="addressLine2-help"
                    />
                    <p id="addressLine2-help" className="mt-1 text-sm text-gray-500">
                        Optional: Flat number, building name, etc.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">
                            City <span className="text-red-500" aria-label="required">*</span>
                        </label>
                        <Input
                            id="city"
                            type="text"
                            value={data.city}
                            onChange={(e) => updateField('city', e.target.value)}
                            placeholder="London"
                            className={`w-full ${hasFieldError('city') ? 'border-red-500' : ''}`}
                            aria-required="true"
                            aria-describedby={hasFieldError('city') ? 'city-error' : undefined}
                        />
                        {hasFieldError('city') && (
                            <p id="city-error" className="mt-1 text-sm text-red-600" role="alert">
                                {getFieldError('city')}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Postcode <span className="text-red-500" aria-label="required">*</span>
                        </label>
                        <Input
                            id="postcode"
                            type="text"
                            value={data.postcode}
                            onChange={(e) => updateField('postcode', e.target.value)}
                            placeholder="SW1A 1AA"
                            className={`w-full ${hasFieldError('postcode') ? 'border-red-500' : ''}`}
                            aria-required="true"
                            aria-describedby={hasFieldError('postcode') ? 'postcode-error' : undefined}
                        />
                        {hasFieldError('postcode') && (
                            <p id="postcode-error" className="mt-1 text-sm text-red-600" role="alert">
                                {getFieldError('postcode')}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Country
                        </label>
                        <Input
                            id="country"
                            type="text"
                            value={data.country}
                            disabled
                            className="w-full bg-gray-50"
                            aria-describedby="country-help"
                        />
                        <p id="country-help" className="mt-1 text-sm text-gray-500">
                            Currently limited to United Kingdom
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
