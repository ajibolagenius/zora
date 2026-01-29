"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Settings,
    User,
    Bell,
    Shield,
    CreditCard,
    Trash2,
    Save,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    AlertTriangle,
    Check,
    Smartphone,
} from "lucide-react";
import { Header } from "../../../components/Header";
import { Card, Button, Badge } from "@zora/ui-web";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("account");
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [accountData, setAccountData] = useState({
        fullName: "John Okafor",
        email: "john@africanspicehouse.co.uk",
        phone: "+44 7700 900000",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [notifications, setNotifications] = useState({
        orderAlerts: true,
        lowStock: true,
        reviews: true,
        marketing: false,
        emailDigest: "daily",
        pushNotifications: true,
    });

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
    };

    const tabs = [
        { id: "account", label: "Account", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
        { id: "billing", label: "Billing", icon: CreditCard },
    ];

    return (
        <>
            <Header
                title="Settings"
                description="Manage your account preferences"
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

                    {/* Account Tab */}
                    {activeTab === "account" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Card>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={accountData.fullName}
                                                onChange={(e) => setAccountData({ ...accountData, fullName: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={accountData.email}
                                                onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={accountData.phone}
                                                onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Button
                                        onClick={handleSave}
                                        loading={isSaving}
                                        leftIcon={<Save className="w-4 h-4" />}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === "notifications" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Card>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                                <div className="space-y-4">
                                    {[
                                        { key: "orderAlerts", label: "Order Alerts", desc: "Get notified when you receive new orders" },
                                        { key: "lowStock", label: "Low Stock Alerts", desc: "Get notified when products are running low" },
                                        { key: "reviews", label: "New Reviews", desc: "Get notified when customers leave reviews" },
                                        { key: "marketing", label: "Marketing Updates", desc: "Receive tips and updates from Zora" },
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.label}</p>
                                                <p className="text-sm text-gray-500">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notifications[item.key as keyof typeof notifications] as boolean}
                                                    onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Digest</h3>
                                <div className="space-y-3">
                                    {[
                                        { value: "realtime", label: "Real-time", desc: "Receive emails as events happen" },
                                        { value: "daily", label: "Daily Digest", desc: "One summary email per day" },
                                        { value: "weekly", label: "Weekly Digest", desc: "One summary email per week" },
                                    ].map((option) => (
                                        <label key={option.value} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="emailDigest"
                                                value={option.value}
                                                checked={notifications.emailDigest === option.value}
                                                onChange={(e) => setNotifications({ ...notifications, emailDigest: e.target.value })}
                                                className="w-4 h-4 text-primary focus:ring-primary"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900">{option.label}</p>
                                                <p className="text-sm text-gray-500">{option.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </Card>

                            <Card>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Smartphone className="w-5 h-5" />
                                    Push Notifications
                                </h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">Enable Push Notifications</p>
                                        <p className="text-sm text-gray-500">Receive notifications on your mobile device</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notifications.pushNotifications}
                                            onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Card>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Button leftIcon={<Lock className="w-4 h-4" />}>
                                        Update Password
                                    </Button>
                                </div>
                            </Card>

                            <Card>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">Enable 2FA</p>
                                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                                    </div>
                                    <Badge variant="warning">Not Enabled</Badge>
                                </div>
                                <div className="mt-4">
                                    <Button variant="outline" leftIcon={<Shield className="w-4 h-4" />}>
                                        Set Up 2FA
                                    </Button>
                                </div>
                            </Card>

                            <Card>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
                                <div className="space-y-4">
                                    {[
                                        { device: "MacBook Pro - Chrome", location: "London, UK", current: true },
                                        { device: "iPhone 14 Pro - Safari", location: "London, UK", current: false },
                                    ].map((session, index) => (
                                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                            <div>
                                                <p className="font-medium text-gray-900">{session.device}</p>
                                                <p className="text-sm text-gray-500">{session.location}</p>
                                            </div>
                                            {session.current ? (
                                                <Badge variant="success" size="sm">Current Session</Badge>
                                            ) : (
                                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                                    Revoke
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Billing Tab */}
                    {activeTab === "billing" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Card>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Rate</h3>
                                <div className="bg-gray-50 rounded-xl p-6 text-center">
                                    <p className="text-4xl font-bold text-primary mb-2">10%</p>
                                    <p className="text-gray-600">per successful order</p>
                                </div>
                            </Card>

                            <Card>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Bank Name</span>
                                        <span className="font-medium text-gray-900">Barclays Bank UK</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Account Number</span>
                                        <span className="font-medium text-gray-900">****4567</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Sort Code</span>
                                        <span className="font-medium text-gray-900">**-**-89</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <span className="text-gray-600">Payout Schedule</span>
                                        <span className="font-medium text-gray-900">Weekly (Every Monday)</span>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Button variant="outline" leftIcon={<CreditCard className="w-4 h-4" />}>
                                        Update Bank Details
                                    </Button>
                                </div>
                            </Card>

                            <Card className="border-red-200 bg-red-50">
                                <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" />
                                    Danger Zone
                                </h3>
                                <p className="text-red-700 mb-4">
                                    Once you delete your vendor account, there is no going back. Please be certain.
                                </p>
                                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100" leftIcon={<Trash2 className="w-4 h-4" />}>
                                    Delete Vendor Account
                                </Button>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}
