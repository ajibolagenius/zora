import { Buildings } from '@phosphor-icons/react';
import { Input } from '@zora/ui-web';
import type { VendorOnboardingData } from '@/types/vendor-onboarding';
import { BUSINESS_TYPES } from '@/types/vendor-onboarding';

interface BusinessInfoStepProps {
    data: VendorOnboardingData;
    updateField: (field: string, value: any) => void;
    getFieldError: (field: string) => string | null;
    hasFieldError: (field: string) => boolean;
}

export function BusinessInfoStep({ data, updateField, getFieldError, hasFieldError }: BusinessInfoStepProps) {
    return (
        <div className="space-y-6" role="group" aria-labelledby="step1-heading">
            <h2 id="step1-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Buildings size={24} weight="duotone" className="text-primary" />
                Business Information
            </h2>
            
            <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business Name <span className="text-red-500" aria-label="required">*</span>
                </label>
                <Input
                    id="businessName"
                    placeholder="Enter your business name"
                    value={data.businessName}
                    onChange={(e) => updateField('businessName', e.target.value)}
                    className={`w-full ${hasFieldError('businessName') ? 'border-red-500' : ''}`}
                    aria-required="true"
                    aria-describedby={hasFieldError('businessName') ? 'businessName-error' : undefined}
                />
                {hasFieldError('businessName') && (
                    <p id="businessName-error" className="mt-1 text-sm text-red-600" role="alert">
                        {getFieldError('businessName')}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business Type <span className="text-red-500" aria-label="required">*</span>
                </label>
                <select
                    id="businessType"
                    value={data.businessType}
                    onChange={(e) => updateField('businessType', e.target.value)}
                    className={`w-full h-12 px-4 rounded-xl border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white text-gray-900 ${
                        hasFieldError('businessType') ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                    aria-required="true"
                    aria-describedby={hasFieldError('businessType') ? 'businessType-error' : undefined}
                >
                    <option value="">Select business type</option>
                    {BUSINESS_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
                {hasFieldError('businessType') && (
                    <p id="businessType-error" className="mt-1 text-sm text-red-600" role="alert">
                        {getFieldError('businessType')}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business Description
                </label>
                <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white text-gray-900"
                    rows={4}
                    placeholder="Tell us about your business and the products you sell..."
                    aria-describedby="description-help"
                />
                <p id="description-help" className="mt-1 text-sm text-gray-500">
                    Optional: Help customers understand what makes your business special
                </p>
            </div>
        </div>
    );
}
