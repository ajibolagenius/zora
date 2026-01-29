"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Building2, User, FileText, CreditCard, MapPin, Tag } from "lucide-react";

const steps = [
    { id: 1, name: "Business Info", icon: Building2 },
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
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold font-display text-primary">ZORA</span>
                    </Link>
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Title */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold font-display mb-2">
                            Become a Zora Vendor
                        </h1>
                        <p className="text-muted-foreground">
                            Complete the form below to start selling on Zora
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center ${currentStep > step.id
                                                    ? "bg-green-500 text-white"
                                                    : currentStep === step.id
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-200 text-gray-500"
                                                }`}
                                        >
                                            {currentStep > step.id ? (
                                                <Check className="w-6 h-6" />
                                            ) : (
                                                <step.icon className="w-6 h-6" />
                                            )}
                                        </div>
                                        <span
                                            className={`mt-2 text-xs font-medium ${currentStep >= step.id
                                                    ? "text-foreground"
                                                    : "text-muted-foreground"
                                                }`}
                                        >
                                            {step.name}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`flex-1 h-1 mx-4 ${currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold mb-4">Business Information</h2>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Business Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.businessName}
                                        onChange={(e) => updateFormData("businessName", e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="Enter your business name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Business Type *
                                    </label>
                                    <select
                                        value={formData.businessType}
                                        onChange={(e) => updateFormData("businessType", e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
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
                                    <label className="block text-sm font-medium mb-2">
                                        Business Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => updateFormData("description", e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        rows={4}
                                        placeholder="Tell us about your business and the products you sell..."
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email *</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => updateFormData("email", e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="business@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Phone *</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => updateFormData("phone", e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="+44 7XXX XXXXXX"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Address Line 1 *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.addressLine1}
                                        onChange={(e) => updateFormData("addressLine1", e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="Street address"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Address Line 2
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.addressLine2}
                                        onChange={(e) => updateFormData("addressLine2", e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="Apartment, suite, etc."
                                    />
                                </div>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">City *</label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => updateFormData("city", e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="London"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Postcode *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.postcode}
                                            onChange={(e) => updateFormData("postcode", e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="SW1A 1AA"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Country</label>
                                        <input
                                            type="text"
                                            value={formData.country}
                                            disabled
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50"
                                        />
                                    </div>
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
                                            <FileText className="w-6 h-6 text-primary" />
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
                                <h2 className="text-xl font-semibold mb-4">Delivery Coverage Area</h2>
                                <p className="text-muted-foreground mb-6">
                                    Select the areas where you can deliver products.
                                </p>
                                <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                                    <p className="text-muted-foreground">
                                        Interactive map will be displayed here
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {["London", "Birmingham", "Manchester", "Leeds", "Liverpool", "Bristol", "Sheffield", "Newcastle"].map(
                                        (city) => (
                                            <label
                                                key={city}
                                                className="flex items-center gap-2 p-3 border border-border rounded-xl cursor-pointer hover:bg-gray-50"
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
                                <h2 className="text-xl font-semibold mb-4">Product Categories</h2>
                                <p className="text-muted-foreground mb-6">
                                    Select the categories of products you&apos;ll be selling.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                                            className="flex items-center gap-2 p-4 border border-border rounded-xl cursor-pointer hover:bg-gray-50"
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
                            <button
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Previous
                            </button>
                            {currentStep < 6 ? (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors">
                                    Submit Application
                                    <Check className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
