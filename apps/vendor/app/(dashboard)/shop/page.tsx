"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Storefront,
    Camera,
    Globe,
    Clock,
    Phone,
    Envelope,
    MapPin,
    FloppyDisk,
    InstagramLogo,
    FacebookLogo,
    ArrowSquareOut,
} from "@phosphor-icons/react";
import { Header } from "../../../components/Header";
import { Card, Button, Badge, Avatar, AvatarFallback } from "@zora/ui-web";

// Mock vendor data
const vendorData = {
    name: "African Spice House",
    slug: "african-spice-house",
    description: "Authentic African spices, seasonings, and ingredients sourced directly from West Africa. We bring the taste of home to your kitchen.",
    logo: null,
    coverImage: null,
    email: "info@africanspicehouse.co.uk",
    phone: "+44 7700 900000",
    address: "123 High Street, London, SE1 1AA",
    website: "https://africanspicehouse.co.uk",
    region: "West Africa",
    specialties: ["Spices", "Seasonings", "Grains", "Sauces"],
    openingHours: {
        monday: { open: "09:00", close: "18:00" },
        tuesday: { open: "09:00", close: "18:00" },
        wednesday: { open: "09:00", close: "18:00" },
        thursday: { open: "09:00", close: "18:00" },
        friday: { open: "09:00", close: "18:00" },
        saturday: { open: "10:00", close: "16:00" },
        sunday: { open: null, close: null },
    },
    socialLinks: {
        instagram: "@africanspicehouse",
        facebook: "africanspicehouse",
    },
    policies: {
        returns: "We accept returns within 14 days of purchase for unopened items.",
        shipping: "Free delivery on orders over £35. Standard delivery 3-5 business days.",
    },
};

export default function ShopProfilePage() {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState(vendorData);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
    };

    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    return (
        <>
            <Header
                title="Shop Profile"
                description="Manage your store information and branding"
                action={
                    <Button
                        onClick={handleSave}
                        isLoading={isSaving}
                        leftIcon={<FloppyDisk size={16} weight="duotone" />}
                    >
                        Save Changes
                    </Button>
                }
            />

            <div className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Cover & Logo Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card padding="none" className="overflow-hidden">
                            {/* Cover Image */}
                            <div className="relative h-48 bg-gradient-to-r from-primary to-primary-dark">
                                <button className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg">
                                        <Camera size={20} weight="duotone" className="text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">Change Cover</span>
                                    </div>
                                </button>
                            </div>

                            {/* Logo & Basic Info */}
                            <div className="px-6 pb-6">
                                <div className="flex flex-col sm:flex-row gap-4 -mt-12 relative z-10">
                                    <div className="relative">
                                        <Avatar size="xl" className="border-4 border-white shadow-lg w-24 h-24">
                                            <AvatarFallback className="text-2xl">AS</AvatarFallback>
                                        </Avatar>
                                        <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                                            <Camera size={16} weight="duotone" className="text-gray-600" />
                                        </button>
                                    </div>
                                    <div className="flex-1 pt-4 sm:pt-8">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <h2 className="text-xl font-semibold text-gray-900">{formData.name}</h2>
                                            <Badge variant="success" size="sm">Active</Badge>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">zoraapp.co.uk/store/{formData.slug}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Basic Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Storefront size={20} weight="duotone" className="text-primary" />
                                Basic Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Shop Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Shop URL Slug
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 text-sm">zoraapp.co.uk/store/</span>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Tell customers what makes your shop special</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cultural Region
                                    </label>
                                    <select
                                        value={formData.region}
                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    >
                                        <option value="West Africa">West Africa</option>
                                        <option value="East Africa">East Africa</option>
                                        <option value="North Africa">North Africa</option>
                                        <option value="South Africa">Southern Africa</option>
                                        <option value="Central Africa">Central Africa</option>
                                    </select>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Phone size={20} weight="duotone" className="text-primary" />
                                Contact Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Envelope size={20} weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone size={20} weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Address
                                    </label>
                                    <div className="relative">
                                        <MapPin size={20} weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Website
                                    </label>
                                    <div className="relative">
                                        <Globe size={20} weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="url"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Operating Hours */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock size={20} weight="duotone" className="text-primary" />
                                Operating Hours
                            </h3>
                            <div className="space-y-3">
                                {days.map((day) => {
                                    const dayKey = day as keyof typeof formData.openingHours;
                                    const dayHours = formData.openingHours[dayKey];
                                    const isClosed = !dayHours?.open;

                                    const handleTimeChange = (field: 'open' | 'close', value: string) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            openingHours: {
                                                ...prev.openingHours,
                                                [day]: {
                                                    ...prev.openingHours[dayKey],
                                                    [field]: value || null,
                                                },
                                            },
                                        }));
                                    };

                                    const toggleDay = () => {
                                        setFormData(prev => ({
                                            ...prev,
                                            openingHours: {
                                                ...prev.openingHours,
                                                [day]: isClosed
                                                    ? { open: "09:00", close: "17:00" }
                                                    : { open: null, close: null },
                                            },
                                        }));
                                    };

                                    return (
                                        <div key={day} className="flex items-center gap-4">
                                            <span className="w-24 text-sm font-medium text-gray-700 capitalize">{day}</span>
                                            <div className="flex items-center gap-2 flex-1">
                                                <input
                                                    type="time"
                                                    value={dayHours?.open || ""}
                                                    onChange={(e) => handleTimeChange('open', e.target.value)}
                                                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                                    disabled={isClosed}
                                                />
                                                <span className="text-gray-400">to</span>
                                                <input
                                                    type="time"
                                                    value={dayHours?.close || ""}
                                                    onChange={(e) => handleTimeChange('close', e.target.value)}
                                                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                                    disabled={isClosed}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={toggleDay}
                                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${isClosed
                                                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                        : "bg-red-100 text-red-700 hover:bg-red-200"
                                                        }`}
                                                >
                                                    {isClosed ? "Set Open" : "Set Closed"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Social Media */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <ArrowSquareOut size={20} weight="duotone" className="text-primary" />
                                Social Media
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Instagram
                                    </label>
                                    <div className="relative">
                                        <InstagramLogo size={20} weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.socialLinks.instagram}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                                            })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="@yourhandle"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Facebook
                                    </label>
                                    <div className="relative">
                                        <FacebookLogo size={20} weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.socialLinks.facebook}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                                            })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="facebook.com/yourpage"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Store Policies */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Policies</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Returns Policy
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.policies.returns}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            policies: { ...formData.policies, returns: e.target.value }
                                        })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Shipping Policy
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.policies.shipping}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            policies: { ...formData.policies, shipping: e.target.value }
                                        })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
