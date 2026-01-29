"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Settings,
    Globe,
    CreditCard,
    Truck,
    Bell,
    Shield,
    Palette,
    Save,
    ToggleLeft,
    Percent,
    Mail,
    Clock,
} from "lucide-react";
import { Header } from "../../../components/Header";
import { Card, Button, Badge } from "@zora/ui-web";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [isSaving, setIsSaving] = useState(false);

    const [settings, setSettings] = useState({
        // General
        platformName: "Zora African Market",
        supportEmail: "support@zoraapp.co.uk",
        timezone: "Europe/London",
        currency: "GBP",
        // Commission
        vendorCommission: 10,
        payoutSchedule: "weekly",
        minimumPayout: 50,
        // Delivery
        freeDeliveryThreshold: 35,
        standardDeliveryFee: 3.99,
        expressDeliveryFee: 6.99,
        sameDayDeliveryFee: 9.99,
        // Features
        maintenanceMode: false,
        newVendorSignups: true,
        guestCheckout: true,
        reviewModeration: true,
        // Notifications
        orderNotifications: true,
        vendorNotifications: true,
        lowStockAlerts: true,
        reviewAlerts: true,
    });

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
    };

    const tabs = [
        { id: "general", label: "General", icon: Globe },
        { id: "commission", label: "Commission", icon: Percent },
        { id: "delivery", label: "Delivery", icon: Truck },
        { id: "features", label: "Features", icon: ToggleLeft },
        { id: "notifications", label: "Notifications", icon: Bell },
    ];

    return (
        <>
            <Header
                title="Platform Settings"
                description="Configure platform-wide settings"
                actions={
                    <Button
                        onClick={handleSave}
                        isLoading={isSaving}
                        leftIcon={<Save className="w-4 h-4" />}
                    >
                        Save Changes
                    </Button>
                }
            />

            <div className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2 overflow-x-auto pb-4 mb-6"
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                                    ? "bg-primary text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </motion.div>

                    {/* General Settings */}
                    {activeTab === "general" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Card>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Platform Name
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.platformName}
                                            onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Support Email
                                        </label>
                                        <input
                                            type="email"
                                            value={settings.supportEmail}
                                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Timezone
                                            </label>
                                            <select
                                                value={settings.timezone}
                                                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            >
                                                <option value="Europe/London">Europe/London (GMT)</option>
                                                <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                                                <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Currency
                                            </label>
                                            <select
                                                value={settings.currency}
                                                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            >
                                                <option value="GBP">GBP (£)</option>
                                                <option value="EUR">EUR (€)</option>
                                                <option value="USD">USD ($)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Commission Settings */}
                    {activeTab === "commission" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Card>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Commission</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Commission Rate (%)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={settings.vendorCommission}
                                                onChange={(e) => setSettings({ ...settings, vendorCommission: Number(e.target.value) })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Percentage taken from each sale</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Payout Schedule
                                        </label>
                                        <select
                                            value={settings.payoutSchedule}
                                            onChange={(e) => setSettings({ ...settings, payoutSchedule: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="biweekly">Bi-weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Minimum Payout Amount (£)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={settings.minimumPayout}
                                            onChange={(e) => setSettings({ ...settings, minimumPayout: Number(e.target.value) })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Delivery Settings */}
                    {activeTab === "delivery" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Card>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Pricing</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Free Delivery Threshold (£)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={settings.freeDeliveryThreshold}
                                            onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Orders above this amount get free standard delivery</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Standard (£)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={settings.standardDeliveryFee}
                                                onChange={(e) => setSettings({ ...settings, standardDeliveryFee: Number(e.target.value) })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Express (£)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={settings.expressDeliveryFee}
                                                onChange={(e) => setSettings({ ...settings, expressDeliveryFee: Number(e.target.value) })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Same Day (£)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={settings.sameDayDeliveryFee}
                                                onChange={(e) => setSettings({ ...settings, sameDayDeliveryFee: Number(e.target.value) })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Feature Toggles */}
                    {activeTab === "features" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Card>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Features</h3>
                                <div className="space-y-4">
                                    {[
                                        { key: "maintenanceMode", label: "Maintenance Mode", desc: "Temporarily disable the platform for maintenance", warning: true },
                                        { key: "newVendorSignups", label: "New Vendor Signups", desc: "Allow new vendors to register on the platform" },
                                        { key: "guestCheckout", label: "Guest Checkout", desc: "Allow customers to checkout without an account" },
                                        { key: "reviewModeration", label: "Review Moderation", desc: "Require admin approval for new reviews" },
                                    ].map((feature) => (
                                        <div key={feature.key} className={`flex items-center justify-between py-4 border-b border-gray-100 last:border-0 ${feature.warning && settings[feature.key as keyof typeof settings] ? "bg-red-50 -mx-4 px-4 rounded-lg" : ""}`}>
                                            <div>
                                                <p className="font-medium text-gray-900">{feature.label}</p>
                                                <p className="text-sm text-gray-500">{feature.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settings[feature.key as keyof typeof settings] as boolean}
                                                    onChange={(e) => setSettings({ ...settings, [feature.key]: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {settings.maintenanceMode && (
                                <Card className="bg-red-50 border-red-200">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Shield className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-red-900">Maintenance Mode Active</h4>
                                            <p className="text-sm text-red-700 mt-1">
                                                The platform is currently in maintenance mode. Customers cannot access the site or place orders.
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </motion.div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === "notifications" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Card>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notifications</h3>
                                <div className="space-y-4">
                                    {[
                                        { key: "orderNotifications", label: "Order Notifications", desc: "Get notified for new orders" },
                                        { key: "vendorNotifications", label: "Vendor Notifications", desc: "Get notified for new vendor signups" },
                                        { key: "lowStockAlerts", label: "Low Stock Alerts", desc: "Get notified when products are low on stock" },
                                        { key: "reviewAlerts", label: "Review Alerts", desc: "Get notified for new reviews pending moderation" },
                                    ].map((notification) => (
                                        <div key={notification.key} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                                            <div>
                                                <p className="font-medium text-gray-900">{notification.label}</p>
                                                <p className="text-sm text-gray-500">{notification.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settings[notification.key as keyof typeof settings] as boolean}
                                                    onChange={(e) => setSettings({ ...settings, [notification.key]: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}
