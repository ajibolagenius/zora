"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Buildings, User, FileText, CreditCard, MapPin, Tag, Upload } from "@phosphor-icons/react";
import { Button, Input, Card } from "@zora/ui-web";

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
    const [formData, setFormData] = useState({
        businessName: "",
        businessType: "",
        description: "",
        email: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        postcode: "",
        country: "United Kingdom",
    });

    const handleNext = () => {
        if (currentStep < 6) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const updateFormData = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-surface-light">
            {/* Header */}
            <header className="bg-white border-b border-border">
                <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-bold font-display text-primary">ZORA</span>
                    </Link>
                    <Link
                        href="/"
                        className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 sm:gap-2"
                    >
                        <ArrowLeft size={16} weight="duotone" />
                        <span className="hidden sm:inline">Back to Home</span>
                        <span className="sm:hidden">Back</span>
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6 sm:py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Title */}
                    <div className="text-center mb-8 sm:mb-12">
                        <h1 className="text-2xl sm:text-3xl font-bold font-display mb-2">
                            Become a Zora Vendor
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Complete the form below to start selling on Zora
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8 sm:mb-12">
                        {/* Mobile: Simple step indicator */}
                        <div className="sm:hidden flex items-center justify-center gap-2 mb-4">
                            {steps.map((step) => (
                                <div
                                    key={step.id}
                                    className={`w-2 h-2 rounded-full transition-colors ${currentStep >= step.id ? "bg-primary" : "bg-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="sm:hidden text-center">
                            <p className="text-sm text-muted-foreground">Step {currentStep} of {steps.length}</p>
                            <p className="font-medium">{steps[currentStep - 1].name}</p>
                        </div>

                        {/* Desktop: Full step progress */}
                        <div className="hidden sm:flex items-center justify-between">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center ${currentStep > step.id
                                                ? "bg-green-500 text-white"
                                                : currentStep === step.id
                                                    ? "bg-primary text-white"
                                                    : "bg-gray-200 text-gray-500"
                                                }`}
                                        >
                                            {currentStep > step.id ? (
                                                <Check size={20} weight="duotone" />
                                            ) : (
                                                <step.icon size={20} weight="duotone" />
                                            )}
                                        </div>
                                        <span
                                            className={`mt-2 text-xs font-medium text-center hidden lg:block ${currentStep >= step.id
                                                ? "text-foreground"
                                                : "text-muted-foreground"
                                                }`}
                                        >
                                            {step.name}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`flex-1 h-1 mx-2 lg:mx-4 ${currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
                        {currentStep === 1 && (
                            <div className="space-y-6" role="group" aria-labelledby="step1-heading">
                                <h2 id="step1-heading" className="text-xl font-semibold mb-4">Business Information</h2>
                                <Input
                                    label="Business Name *"
                                    type="text"
                                    value={formData.businessName}
                                    onChange={(e) => updateFormData("businessName", e.target.value)}
                                    placeholder="Enter your business name"
                                    inputSize="lg"
                                    required
                                    aria-required="true"
                                />
                                <div>
                                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Business Type *
                                    </label>
                                    <select
                                        id="businessType"
                                        value={formData.businessType}
                                        onChange={(e) => updateFormData("businessType", e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white text-gray-900"
                                        required
                                        aria-required="true"
                                    >
                                        <option value="">Select business type</option>
                                        <option value="grocery">Grocery Store</option>
                                        <option value="restaurant">Restaurant</option>
                                        <option value="wholesaler">Wholesaler</option>
                                        <option value="producer">Food Producer</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Business Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => updateFormData("description", e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white text-gray-900"
                                        rows={4}
                                        placeholder="Tell us about your business and the products you sell..."
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6" role="group" aria-labelledby="step2-heading">
                                <h2 id="step2-heading" className="text-xl font-semibold mb-4">Contact Details</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input
                                        label="Email *"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => updateFormData("email", e.target.value)}
                                        placeholder="business@example.com"
                                        inputSize="lg"
                                        required
                                        aria-required="true"
                                    />
                                    <Input
                                        label="Phone *"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => updateFormData("phone", e.target.value)}
                                        placeholder="+44 7XXX XXXXXX"
                                        inputSize="lg"
                                        required
                                        aria-required="true"
                                    />
                                </div>
                                <Input
                                    label="Address Line 1 *"
                                    type="text"
                                    value={formData.addressLine1}
                                    onChange={(e) => updateFormData("addressLine1", e.target.value)}
                                    placeholder="Street address"
                                    inputSize="lg"
                                    required
                                    aria-required="true"
                                />
                                <Input
                                    label="Address Line 2"
                                    type="text"
                                    value={formData.addressLine2}
                                    onChange={(e) => updateFormData("addressLine2", e.target.value)}
                                    placeholder="Apartment, suite, etc."
                                    inputSize="lg"
                                />
                                <div className="grid md:grid-cols-3 gap-6">
                                    <Input
                                        label="City *"
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => updateFormData("city", e.target.value)}
                                        placeholder="London"
                                        inputSize="lg"
                                        required
                                        aria-required="true"
                                    />
                                    <Input
                                        label="Postcode *"
                                        type="text"
                                        value={formData.postcode}
                                        onChange={(e) => updateFormData("postcode", e.target.value)}
                                        placeholder="SW1A 1AA"
                                        inputSize="lg"
                                        required
                                        aria-required="true"
                                    />
                                    <Input
                                        label="Country"
                                        type="text"
                                        value={formData.country}
                                        disabled
                                        inputSize="lg"
                                        className="bg-gray-50"
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
                                <p className="text-muted-foreground mb-6">
                                    Please upload the following documents to verify your business.
                                </p>
                                {[
                                    {
                                        name: "Business Registration",
                                        description: "Company registration certificate or trading license",
                                    },
                                    {
                                        name: "ID Document",
                                        description: "Passport or driving license of the business owner",
                                    },
                                    {
                                        name: "Proof of Address",
                                        description: "Utility bill or bank statement (less than 3 months old)",
                                    },
                                ].map((doc) => (
                                    <div
                                        key={doc.name}
                                        className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer"
                                    >
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText size={24} weight="duotone" className="text-primary" />
                                        </div>
                                        <h3 className="font-semibold">{doc.name}</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {doc.description}
                                        </p>
                                        <button className="text-primary font-medium text-sm">
                                            Click to upload
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
                                <p className="text-muted-foreground mb-6">
                                    Enter your bank details for receiving payments.
                                </p>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Account Holder Name *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="Name as it appears on your bank account"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Sort Code *
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="XX-XX-XX"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Account Number *
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="XXXXXXXX"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 5 && (
                            <div className="space-y-6">
                                <h2 className="text-lg sm:text-xl font-semibold mb-4">Delivery Coverage Area</h2>
                                <p className="text-sm sm:text-base text-muted-foreground mb-6">
                                    Select the areas where you can deliver products.
                                </p>
                                <div className="bg-gray-100 rounded-xl h-48 sm:h-64 flex items-center justify-center">
                                    <p className="text-muted-foreground text-sm sm:text-base text-center px-4">
                                        Interactive map will be displayed here
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                                    {["London", "Birmingham", "Manchester", "Leeds", "Liverpool", "Bristol", "Sheffield", "Newcastle"].map(
                                        (city) => (
                                            <label
                                                key={city}
                                                className="flex items-center gap-2 p-2.5 sm:p-3 border border-border rounded-lg sm:rounded-xl cursor-pointer hover:bg-gray-50 text-sm sm:text-base"
                                            >
                                                <input type="checkbox" className="rounded" />
                                                <span>{city}</span>
                                            </label>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {currentStep === 6 && (
                            <div className="space-y-6">
                                <h2 className="text-lg sm:text-xl font-semibold mb-4">Product Categories</h2>
                                <p className="text-sm sm:text-base text-muted-foreground mb-6">
                                    Select the categories of products you&apos;ll be selling.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    {[
                                        "Spices & Seasonings",
                                        "Grains & Cereals",
                                        "Vegetables",
                                        "Meat & Poultry",
                                        "Seafood",
                                        "Dairy & Eggs",
                                        "Beverages",
                                        "Snacks",
                                        "Canned Foods",
                                        "Oils & Condiments",
                                        "Baked Goods",
                                        "Textiles & Crafts",
                                    ].map((category) => (
                                        <label
                                            key={category}
                                            className="flex items-center gap-2 p-3 sm:p-4 border border-border rounded-lg sm:rounded-xl cursor-pointer hover:bg-gray-50 text-sm sm:text-base"
                                        >
                                            <input type="checkbox" className="rounded" />
                                            <span>{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-border">
                            <Button
                                variant="ghost"
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                leftIcon={<ArrowLeft size={16} weight="duotone" />}
                                aria-label="Go to previous step"
                            >
                                Previous
                            </Button>
                            {currentStep < 6 ? (
                                <Button
                                    onClick={handleNext}
                                    rightIcon={<ArrowRight size={16} weight="duotone" />}
                                    aria-label="Go to next step"
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    variant="success"
                                    rightIcon={<Check size={16} weight="duotone" />}
                                    aria-label="Submit vendor application"
                                >
                                    Submit Application
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
