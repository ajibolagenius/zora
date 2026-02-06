import { CreditCard, Lock } from '@phosphor-icons/react';
import { Input } from '@zora/ui-web';
import type { VendorOnboardingData } from '@/types/vendor-onboarding';

interface BankDetailsStepProps {
    data: VendorOnboardingData;
    updateField: (field: string, value: any) => void;
    getFieldError: (field: string) => string | null;
    hasFieldError: (field: string) => boolean;
}

export function BankDetailsStep({ data, updateField, getFieldError, hasFieldError }: BankDetailsStepProps) {
    const formatSortCode = (value: string) => {
        const cleaned = value.replace(/\D/g, '').slice(0, 6);
        const formatted = cleaned.replace(/(\d{2})(\d{2})(\d{0,2})/, '$1-$2-$3');
        return formatted;
    };

    const handleSortCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatSortCode(e.target.value);
        updateField('bankDetails.sortCode', formatted);
    };

    const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cleaned = e.target.value.replace(/\D/g, '').slice(0, 8);
        updateField('bankDetails.accountNumber', cleaned);
    };

    return (
        <div className="space-y-6" role="group" aria-labelledby="step4-heading">
            <div>
                <h2 id="step4-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CreditCard size={24} weight="duotone" className="text-primary" />
                    Bank Details
                </h2>
                <p className="text-gray-600 mb-6">
                    Enter your bank details for receiving payments. All information is encrypted and secure.
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                    <Lock size={20} weight="duotone" className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <h4 className="font-medium text-blue-800 mb-1">Secure Banking Information</h4>
                        <p className="text-blue-700">
                            Your banking details are encrypted using industry-standard security protocols 
                            and are only used for processing payments to your account.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Account Holder Name <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <Input
                        id="accountHolderName"
                        type="text"
                        value={data.bankDetails.accountHolderName}
                        onChange={(e) => updateField('bankDetails.accountHolderName', e.target.value)}
                        placeholder="Name as it appears on your bank account"
                        className={`w-full ${hasFieldError('accountHolderName') ? 'border-red-500' : ''}`}
                        aria-required="true"
                        aria-describedby={hasFieldError('accountHolderName') ? 'accountHolderName-error accountHolderName-help' : 'accountHolderName-help'}
                    />
                    {hasFieldError('accountHolderName') && (
                        <p id="accountHolderName-error" className="mt-1 text-sm text-red-600" role="alert">
                            {getFieldError('accountHolderName')}
                        </p>
                    )}
                    <p id="accountHolderName-help" className="mt-1 text-sm text-gray-500">
                        Must match exactly with your bank account records
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="sortCode" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Sort Code <span className="text-red-500" aria-label="required">*</span>
                        </label>
                        <Input
                            id="sortCode"
                            type="text"
                            value={data.bankDetails.sortCode}
                            onChange={handleSortCodeChange}
                            placeholder="XX-XX-XX"
                            maxLength={8}
                            className={`w-full ${hasFieldError('sortCode') ? 'border-red-500' : ''}`}
                            aria-required="true"
                            aria-describedby={hasFieldError('sortCode') ? 'sortCode-error sortCode-help' : 'sortCode-help'}
                        />
                        {hasFieldError('sortCode') && (
                            <p id="sortCode-error" className="mt-1 text-sm text-red-600" role="alert">
                                {getFieldError('sortCode')}
                            </p>
                        )}
                        <p id="sortCode-help" className="mt-1 text-sm text-gray-500">
                            6-digit UK bank sort code
                        </p>
                    </div>

                    <div>
                        <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Account Number <span className="text-red-500" aria-label="required">*</span>
                        </label>
                        <Input
                            id="accountNumber"
                            type="text"
                            value={data.bankDetails.accountNumber}
                            onChange={handleAccountNumberChange}
                            placeholder="XXXXXXXX"
                            maxLength={8}
                            className={`w-full ${hasFieldError('accountNumber') ? 'border-red-500' : ''}`}
                            aria-required="true"
                            aria-describedby={hasFieldError('accountNumber') ? 'accountNumber-error accountNumber-help' : 'accountNumber-help'}
                        />
                        {hasFieldError('accountNumber') && (
                            <p id="accountNumber-error" className="mt-1 text-sm text-red-600" role="alert">
                                {getFieldError('accountNumber')}
                            </p>
                        )}
                        <p id="accountNumber-help" className="mt-1 text-sm text-gray-500">
                            8-digit UK bank account number
                        </p>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="text-sm">
                        <h4 className="font-medium text-amber-800 mb-2">Important Information</h4>
                        <ul className="text-amber-700 space-y-1 list-disc list-inside">
                            <li>Bank details must belong to a UK bank account</li>
                            <li>Account must be able to receive electronic transfers</li>
                            <li>Business accounts are preferred, but personal accounts are accepted</li>
                            <li>Incorrect details may delay payments to your account</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
