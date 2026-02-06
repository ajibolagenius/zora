import { MapPin, Check } from '@phosphor-icons/react';
import { Button } from '@zora/ui-web';
import type { VendorOnboardingData } from '@/types/vendor-onboarding';
import { COVERAGE_CITIES } from '@/types/vendor-onboarding';

interface CoverageAreasStepProps {
    data: VendorOnboardingData;
    updateField: (field: string, value: any) => void;
    getFieldError: (field: string) => string | null;
    hasFieldError: (field: string) => boolean;
}

export function CoverageAreasStep({ data, updateField, getFieldError, hasFieldError }: CoverageAreasStepProps) {
    const handleCityToggle = (city: string) => {
        const currentAreas = data.coverageAreas;
        const newAreas = currentAreas.includes(city)
            ? currentAreas.filter(area => area !== city)
            : [...currentAreas, city];
        
        updateField('coverageAreas', newAreas);
    };

    const handleSelectAll = () => {
        updateField('coverageAreas', [...COVERAGE_CITIES]);
    };

    const handleClearAll = () => {
        updateField('coverageAreas', []);
    };

    return (
        <div className="space-y-6" role="group" aria-labelledby="step5-heading">
            <div>
                <h2 id="step5-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin size={24} weight="duotone" className="text-primary" />
                    Delivery Coverage Area
                </h2>
                <p className="text-gray-600 mb-6">
                    Select the areas where you can deliver products. You can choose multiple cities.
                </p>
            </div>

            <div className="bg-gray-100 rounded-xl h-48 sm:h-64 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                <div className="relative text-center px-4">
                    <MapPin size={48} weight="duotone" className="text-primary/30 mx-auto mb-4" />
                    <p className="text-gray-600 text-sm sm:text-base font-medium">
                        Interactive map will be displayed here
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-2">
                        Feature coming soon - select cities below for now
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Select Coverage Cities</h3>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearAll}
                        disabled={data.coverageAreas.length === 0}
                    >
                        Clear All
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSelectAll}
                        disabled={data.coverageAreas.length === COVERAGE_CITIES.length}
                    >
                        Select All
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {COVERAGE_CITIES.map((city) => {
                    const isSelected = data.coverageAreas.includes(city);
                    return (
                        <label
                            key={city}
                            className={`
                                relative flex items-center gap-2 p-2.5 sm:p-3 border rounded-lg sm:rounded-xl cursor-pointer 
                                transition-all duration-200 text-sm sm:text-base
                                ${isSelected 
                                    ? 'border-primary bg-primary/5 text-primary font-medium' 
                                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                }
                                ${hasFieldError('coverageAreas') ? 'ring-2 ring-red-500' : ''}
                            `}
                        >
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={isSelected}
                                onChange={() => handleCityToggle(city)}
                                aria-describedby={hasFieldError('coverageAreas') ? 'coverageAreas-error' : undefined}
                            />
                            <div className={`
                                w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-colors
                                ${isSelected 
                                    ? 'border-primary bg-primary' 
                                    : 'border-gray-300'
                                }
                            `}>
                                {isSelected && <Check size={12} weight="bold" className="text-white" />}
                            </div>
                            <span>{city}</span>
                        </label>
                    );
                })}
            </div>

            {hasFieldError('coverageAreas') && (
                <div className="flex items-center gap-2 text-sm text-red-600 mt-3" id="coverageAreas-error" role="alert">
                    <MapPin size={16} weight="duotone" />
                    <span>{getFieldError('coverageAreas')}</span>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm">
                    <h4 className="font-medium text-blue-800 mb-2">Delivery Information</h4>
                    <ul className="text-blue-700 space-y-1 list-disc list-inside">
                        <li>You can update your coverage areas anytime after approval</li>
                        <li>Delivery radius and fees will be configured in your vendor dashboard</li>
                        <li>Start with areas you're confident you can serve consistently</li>
                    </ul>
                </div>
            </div>

            {data.coverageAreas.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-700">
                        <Check size={20} weight="duotone" />
                        <span className="font-medium">
                            {data.coverageAreas.length} {data.coverageAreas.length === 1 ? 'city' : 'cities'} selected
                        </span>
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                        {data.coverageAreas.join(', ')}
                    </div>
                </div>
            )}
        </div>
    );
}
