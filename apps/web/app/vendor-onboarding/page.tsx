"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight, Check, Buildings, User, FileText, CreditCard, MapPin, Tag, Warning, FloppyDisk } from "@phosphor-icons/react";
import { Button } from "@zora/ui-web";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { FreeDeliveryBanner } from "@/components/marketing/FreeDeliveryBanner";
import { ProgressIndicator } from "@/components/vendor-onboarding/ProgressIndicator";
import { BusinessInfoStep } from "@/components/vendor-onboarding/BusinessInfoStep";
import { ContactDetailsStep } from "@/components/vendor-onboarding/ContactDetailsStep";
import { DocumentsStep } from "@/components/vendor-onboarding/DocumentsStep";
import { BankDetailsStep } from "@/components/vendor-onboarding/BankDetailsStep";
import { CoverageAreasStep } from "@/components/vendor-onboarding/CoverageAreasStep";
import { ProductCategoriesStep } from "@/components/vendor-onboarding/ProductCategoriesStep";
import { useVendorOnboardingForm } from "@/hooks/useVendorOnboardingForm";
import { VendorOnboardingService } from "@/services/vendor-onboarding";
import { validateAllSteps } from "@/utils/validation";

const TOTAL_STEPS = 6;

const steps = [
    { id: 1, name: "Business Info", icon: Buildings },
    { id: 2, name: "Contact Details", icon: User },
    { id: 3, name: "Documents", icon: FileText },
    { id: 4, name: "Bank Details", icon: CreditCard },
    { id: 5, name: "Coverage Area", icon: MapPin },
    { id: 6, name: "Categories", icon: Tag },
];

export default function VendorOnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const {
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
    } = useVendorOnboardingForm();

    // Focus management for accessibility
    useEffect(() => {
        const firstInput = document.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled])');
        if (firstInput && currentStep > 0) {
            (firstInput as HTMLElement).focus();
        }
    }, [currentStep]);

    // Handle step navigation
    const handleNext = useCallback(async () => {
        const isValid = validateCurrentStep(currentStep);

        if (isValid) {
            clearErrors();
            if (currentStep < TOTAL_STEPS) {
                setCurrentStep(currentStep + 1);
            }
        }
    }, [currentStep, validateCurrentStep, clearErrors]);

    const handlePrevious = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            clearErrors(); // Clear errors when going back
        }
    }, [currentStep, clearErrors]);

    const handleStepClick = useCallback((stepId: number) => {
        // Only allow navigation to completed steps or the next step
        if (stepId <= currentStep || stepId === currentStep + 1) {
            // Validate current step before moving forward
            if (stepId > currentStep) {
                const isValid = validateCurrentStep(currentStep);
                if (isValid) {
                    setCurrentStep(stepId);
                    clearErrors();
                }
            } else {
                setCurrentStep(stepId);
                clearErrors();
            }
        }
    }, [currentStep, validateCurrentStep, clearErrors]);

    // Handle form submission
    const handleSubmit = useCallback(async () => {
        // Validate all steps
        const allErrors = validateAllSteps(formState.data);
        if (allErrors.length > 0) {
            // Find the first step with errors and navigate to it
            const firstErrorStep = Math.min(...allErrors.map(error => {
                if (error.field.includes('businessName') || error.field.includes('businessType') || error.field.includes('description')) return 1;
                if (error.field.includes('email') || error.field.includes('phone') || error.field.includes('address')) return 2;
                if (error.field.includes('documents')) return 3;
                if (error.field.includes('bankDetails') || error.field.includes('account') || error.field.includes('sort')) return 4;
                if (error.field.includes('coverageAreas')) return 5;
                if (error.field.includes('productCategories')) return 6;
                return 1;
            }));

            setCurrentStep(firstErrorStep);
            return;
        }

        setSubmitting(true);
        setSubmitError(null);

        try {
            const result = await VendorOnboardingService.submitApplication(formState.data);

            if (result.success) {
                // Clear form and redirect to success page
                VendorOnboardingService.clearDraft();
                // In a real app, redirect to success page
                window.location.href = '/vendor-onboarding/success';
            } else {
                setSubmitError(result.message);
            }
        } catch (error) {
            setSubmitError('Failed to submit application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }, [formState.data, setSubmitting, setSubmitError]);

    // Render current step component
    const renderStepComponent = () => {
        const commonProps = {
            data: formState.data,
            updateField,
            getFieldError,
            hasFieldError,
        };

        switch (currentStep) {
            case 1:
                return <BusinessInfoStep {...commonProps} />;
            case 2:
                return <ContactDetailsStep {...commonProps} />;
            case 3:
                return <DocumentsStep {...commonProps} />;
            case 4:
                return <BankDetailsStep {...commonProps} />;
            case 5:
                return <CoverageAreasStep {...commonProps} />;
            case 6:
                return <ProductCategoriesStep {...commonProps} />;
            default:
                return <BusinessInfoStep {...commonProps} />;
        }
    };

    return (
        <main className="min-h-screen bg-background-light">
            {/* Free Delivery Banner - Fixed at top */}
            <FreeDeliveryBanner />

            {/* Navigation */}
            <Navigation />

            {/* Hero Section */}
            <section id="hero-section" className="relative min-h-[40vh] sm:min-h-[50vh] bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 min-h-[40vh] sm:min-h-[50vh] flex items-center justify-center">
                    <div className="text-center max-w-4xl">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
                            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                            Vendor Onboarding
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white leading-[1.1] mb-4 sm:mb-6">
                            Become a
                            <span className="relative inline-block mt-2">
                                Zora Vendor
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                    <path d="M2 8.5C50 2.5 150 2.5 198 8.5" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
                            Join our growing community of African food vendors and reach thousands of customers across the UK.
                        </p>
                    </div>
                </div>
            </section>

            {/* Progress Steps */}
            <ProgressIndicator
                currentStep={currentStep}
                totalSteps={TOTAL_STEPS}
                steps={steps}
            />

            {/* Form Section */}
            <section className="py-12 sm:py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    <div className="max-w-2xl mx-auto">
                        {/* Draft saved indicator */}
                        {formState.isSaved && (
                            <div className="mb-4 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                                <FloppyDisk size={16} weight="duotone" />
                                <span>Draft saved automatically</span>
                            </div>
                        )}

                        {/* Form error display */}
                        {formState.submitError && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex gap-3">
                                    <Warning size={20} weight="duotone" className="text-red-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-red-800 mb-1">Submission Error</h4>
                                        <p className="text-red-700 text-sm">{formState.submitError}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-6 sm:p-8">
                            <div className="mb-6 sm:mb-8">
                                <h2 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 mb-4">
                                    Start Your Vendor Journey
                                </h2>
                                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                                    Complete the form below to begin selling on Zora.
                                </p>
                                {formState.isSaved && (
                                    <p className="text-sm text-green-600 mt-2">
                                        Your progress is automatically saved
                                    </p>
                                )}
                            </div>

                            {/* Current Step Component */}
                            <div className="min-h-[400px]">
                                {renderStepComponent()}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                                <Button
                                    variant="ghost"
                                    onClick={handlePrevious}
                                    disabled={currentStep === 1 || formState.isSubmitting}
                                    leftIcon={<ArrowLeft size={16} weight="duotone" />}
                                    aria-label="Go to previous step"
                                >
                                    Previous
                                </Button>

                                <div className="flex gap-3">
                                    {/* Save draft button */}
                                    {currentStep < TOTAL_STEPS && (
                                        <Button
                                            variant="ghost"
                                            onClick={() => VendorOnboardingService.saveDraft(formState.data)}
                                            className="text-gray-600"
                                            leftIcon={<FloppyDisk size={16} weight="duotone" />}
                                        >
                                            Save Draft
                                        </Button>
                                    )}

                                    {currentStep < TOTAL_STEPS ? (
                                        <Button
                                            onClick={handleNext}
                                            disabled={formState.isSubmitting}
                                            rightIcon={<ArrowRight size={16} weight="duotone" />}
                                            aria-label="Go to next step"
                                        >
                                            Next
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="success"
                                            onClick={handleSubmit}
                                            disabled={formState.isSubmitting}
                                            rightIcon={formState.isSubmitting ? undefined : <Check size={16} weight="duotone" />}
                                            aria-label="Submit vendor application"
                                        >
                                            {formState.isSubmitting ? 'Submitting...' : 'Submit Application'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form completion info */}
                        {currentStep === TOTAL_STEPS && (
                            <div className="mt-6 text-center text-sm text-gray-600">
                                <p>
                                    By submitting this application, you confirm that all information provided is accurate
                                    and you have the right to operate this business.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main >
    );
}
