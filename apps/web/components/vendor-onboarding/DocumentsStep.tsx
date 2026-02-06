import { FileText, Upload, CheckCircle, Warning } from '@phosphor-icons/react';
import { Button } from '@zora/ui-web';
import type { VendorOnboardingData } from '@/types/vendor-onboarding';

interface DocumentsStepProps {
    data: VendorOnboardingData;
    updateField: (field: string, value: any) => void;
    getFieldError: (field: string) => string | null;
    hasFieldError: (field: string) => boolean;
}

interface DocumentUploadProps {
    title: string;
    description: string;
    file: File | null;
    fieldName: keyof VendorOnboardingData['documents'];
    updateField: (field: string, value: any) => void;
    error: string | null;
}

function DocumentUpload({ title, description, file, fieldName, updateField, error }: DocumentUploadProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        updateField(`documents.${fieldName}`, selectedFile);
    };

    const handleRemove = () => {
        updateField(`documents.${fieldName}`, null);
    };

    return (
        <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-primary hover:bg-gray-50'
            }`}>
            <input
                type="file"
                id={`document-${fieldName}`}
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                aria-describedby={`${fieldName}-help ${fieldName}-error`}
            />

            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {file ? (
                    <CheckCircle size={24} weight="duotone" className="text-green-600" />
                ) : (
                    <FileText size={24} weight="duotone" className="text-primary" />
                )}
            </div>

            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">{description}</p>

            {file ? (
                <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-sm text-green-700 bg-green-100 px-3 py-2 rounded-lg">
                        <CheckCircle size={16} weight="duotone" />
                        <span>{file.name}</span>
                        <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                    </div>
                    <div className="flex gap-2 justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => document.getElementById(`document-${fieldName}`)?.click()}
                        >
                            Replace
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemove}
                            className="text-red-600 hover:text-red-700"
                        >
                            Remove
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        onClick={() => document.getElementById(`document-${fieldName}`)?.click()}
                        className="text-primary font-medium text-sm"
                    >
                        <Upload size={16} weight="duotone" className="mr-2" />
                        Click to upload
                    </Button>
                    <p id={`${fieldName}-help`} className="text-xs text-gray-500">
                        PDF, JPEG, or PNG (Max 5MB)
                    </p>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 mt-3" id={`${fieldName}-error`} role="alert">
                    <Warning size={16} weight="duotone" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}

export function DocumentsStep({ data, updateField, getFieldError, hasFieldError }: DocumentsStepProps) {
    return (
        <div className="space-y-6" role="group" aria-labelledby="step3-heading">
            <div>
                <h2 id="step3-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileText size={24} weight="duotone" className="text-primary" />
                    Required Documents
                </h2>
                <p className="text-gray-600 mb-6">
                    Please upload the following documents to verify your business. All documents must be clear,
                    valid, and less than 5MB in size.
                </p>
            </div>

            <div className="space-y-6">
                <DocumentUpload
                    title="Business Registration"
                    description="Company registration certificate or trading license"
                    file={data.documents.businessRegistration}
                    fieldName="businessRegistration"
                    updateField={updateField}
                    error={getFieldError('businessRegistration')}
                />

                <DocumentUpload
                    title="ID Document"
                    description="Passport or driving license of the business owner"
                    file={data.documents.idDocument}
                    fieldName="idDocument"
                    updateField={updateField}
                    error={getFieldError('idDocument')}
                />

                <DocumentUpload
                    title="Proof of Address"
                    description="Utility bill or bank statement (less than 3 months old)"
                    file={data.documents.proofOfAddress}
                    fieldName="proofOfAddress"
                    updateField={updateField}
                    error={getFieldError('proofOfAddress')}
                />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex gap-3">
                    <Warning size={20} weight="duotone" className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <h4 className="font-medium text-amber-800 mb-1">Security Notice</h4>
                        <p className="text-amber-700">
                            All documents are encrypted and stored securely. They are only used for verification purposes
                            and will never be shared with third parties.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
