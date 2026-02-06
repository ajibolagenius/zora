import { Tag, Check } from '@phosphor-icons/react';
import { Button } from '@zora/ui-web';
import type { VendorOnboardingData } from '@/types/vendor-onboarding';
import { PRODUCT_CATEGORIES } from '@/types/vendor-onboarding';

interface ProductCategoriesStepProps {
    data: VendorOnboardingData;
    updateField: (field: string, value: any) => void;
    getFieldError: (field: string) => string | null;
    hasFieldError: (field: string) => boolean;
}

export function ProductCategoriesStep({ data, updateField, getFieldError, hasFieldError }: ProductCategoriesStepProps) {
    const handleCategoryToggle = (category: string) => {
        const currentCategories = data.productCategories;
        const newCategories = currentCategories.includes(category)
            ? currentCategories.filter(cat => cat !== category)
            : [...currentCategories, category];
        
        updateField('productCategories', newCategories);
    };

    const handleSelectAll = () => {
        updateField('productCategories', [...PRODUCT_CATEGORIES]);
    };

    const handleClearAll = () => {
        updateField('productCategories', []);
    };

    return (
        <div className="space-y-6" role="group" aria-labelledby="step6-heading">
            <div>
                <h2 id="step6-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Tag size={24} weight="duotone" className="text-primary" />
                    Product Categories
                </h2>
                <p className="text-gray-600 mb-6">
                    Select the categories of products you'll be selling. This helps customers find your products easily.
                </p>
            </div>

            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Choose Your Categories</h3>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearAll}
                        disabled={data.productCategories.length === 0}
                    >
                        Clear All
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSelectAll}
                        disabled={data.productCategories.length === PRODUCT_CATEGORIES.length}
                    >
                        Select All
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {PRODUCT_CATEGORIES.map((category) => {
                    const isSelected = data.productCategories.includes(category);
                    return (
                        <label
                            key={category}
                            className={`
                                relative flex items-center gap-3 p-3 sm:p-4 border rounded-lg sm:rounded-xl cursor-pointer 
                                transition-all duration-200 text-sm sm:text-base
                                ${isSelected 
                                    ? 'border-primary bg-primary/5 text-primary font-medium' 
                                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                }
                                ${hasFieldError('productCategories') ? 'ring-2 ring-red-500' : ''}
                            `}
                        >
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={isSelected}
                                onChange={() => handleCategoryToggle(category)}
                                aria-describedby={hasFieldError('productCategories') ? 'productCategories-error' : undefined}
                            />
                            <div className={`
                                w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0
                                ${isSelected 
                                    ? 'border-primary bg-primary' 
                                    : 'border-gray-300'
                                }
                            `}>
                                {isSelected && <Check size={12} weight="bold" className="text-white" />}
                            </div>
                            <span className="leading-tight">{category}</span>
                        </label>
                    );
                })}
            </div>

            {hasFieldError('productCategories') && (
                <div className="flex items-center gap-2 text-sm text-red-600 mt-3" id="productCategories-error" role="alert">
                    <Tag size={16} weight="duotone" />
                    <span>{getFieldError('productCategories')}</span>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm">
                    <h4 className="font-medium text-blue-800 mb-2">Category Guidelines</h4>
                    <ul className="text-blue-700 space-y-1 list-disc list-inside">
                        <li>Select all categories that apply to your business</li>
                        <li>You can add or remove categories later from your vendor dashboard</li>
                        <li>Be accurate - this affects how customers discover your products</li>
                        <li>Consider seasonal items you may sell throughout the year</li>
                    </ul>
                </div>
            </div>

            {data.productCategories.length > 0 && (
                <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-green-700 mb-2">
                            <Check size={20} weight="duotone" />
                            <span className="font-medium">
                                {data.productCategories.length} {data.productCategories.length === 1 ? 'category' : 'categories'} selected
                            </span>
                        </div>
                        <div className="text-sm text-green-600">
                            {data.productCategories.join(', ')}
                        </div>
                    </div>

                    {data.productCategories.length >= 8 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="text-sm">
                                <h4 className="font-medium text-amber-800 mb-1">Pro Tip</h4>
                                <p className="text-amber-700">
                                    You've selected a good variety of categories! This will help you reach more customers 
                                    with diverse interests.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
