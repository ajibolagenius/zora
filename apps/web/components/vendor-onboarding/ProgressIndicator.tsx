import { Check } from '@phosphor-icons/react';

interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
    steps: Array<{
        id: number;
        name: string;
        icon: React.ComponentType<any>;
    }>;
}

export function ProgressIndicator({ currentStep, totalSteps, steps }: ProgressIndicatorProps) {
    return (
        <section className="py-8 sm:py-12 px-4 bg-white border-b border-gray-100">
            <div className="container mx-auto max-w-4xl">
                {/* Progress bar for screen readers */}
                <div 
                    className="sr-only" 
                    role="progressbar" 
                    aria-valuenow={currentStep} 
                    aria-valuemin={1} 
                    aria-valuemax={totalSteps}
                    aria-label={`Step ${currentStep} of ${totalSteps}`}
                >
                    Step {currentStep} of {totalSteps}
                </div>

                {/* Visual progress indicator */}
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const isCompleted = currentStep > step.id;
                        const isCurrent = currentStep === step.id;
                        const Icon = step.icon;

                        return (
                            <div key={step.id} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div 
                                        className={`
                                            w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center 
                                            text-sm sm:text-base font-bold transition-all duration-300
                                            ${isCompleted 
                                                ? 'bg-primary text-white shadow-lg transform scale-105' 
                                                : isCurrent 
                                                    ? 'bg-primary text-white shadow-md animate-pulse' 
                                                    : 'bg-gray-100 text-gray-400'
                                            }
                                        `}
                                        aria-label={`${isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Future'} step: ${step.name}`}
                                    >
                                        {isCompleted ? (
                                            <Check size={16} weight="duotone" className="sm:w-5 sm:h-5" />
                                        ) : (
                                            step.id
                                        )}
                                    </div>
                                    <span 
                                        className={`
                                            text-xs sm:text-sm font-medium mt-2 text-center transition-colors duration-300
                                            ${isCompleted || isCurrent ? 'text-primary font-semibold' : 'text-gray-400'}
                                        `}
                                    >
                                        {step.name}
                                    </span>
                                </div>
                                
                                {/* Connector line */}
                                {index < steps.length - 1 && (
                                    <div 
                                        className={`
                                            hidden sm:block w-16 h-0.5 mx-2 transition-all duration-500
                                            ${isCompleted ? 'bg-primary' : 'bg-gray-200'}
                                        `}
                                        aria-hidden="true"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Step description for screen readers */}
                <div className="sr-only" role="status" aria-live="polite">
                    You are currently on step {currentStep}: {steps[currentStep - 1]?.name}
                </div>

                {/* Mobile step indicator */}
                <div className="sm:hidden mt-6 text-center">
                    <div className="text-sm text-gray-600">
                        Step {currentStep} of {totalSteps}
                    </div>
                    <div className="text-lg font-semibold text-primary mt-1">
                        {steps[currentStep - 1]?.name}
                    </div>
                </div>
            </div>
        </section>
    );
}
