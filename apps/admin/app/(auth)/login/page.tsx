"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button, Input, Card } from "@zora/ui-web";

/**
 * Validates and sanitizes a redirect URL to prevent open redirect attacks.
 * Only allows relative paths starting with "/" and blocks external URLs.
 */
function getSafeRedirectUrl(url: string | null): string {
    const defaultRedirect = "/";

    if (!url) return defaultRedirect;

    // Must start with "/" (relative path)
    if (!url.startsWith("/")) return defaultRedirect;

    // Block protocol-relative URLs (e.g., "//evil.com")
    if (url.startsWith("//")) return defaultRedirect;

    // Block URLs with protocols (e.g., "/\evil.com" or encoded variants)
    try {
        const decoded = decodeURIComponent(url);
        if (decoded.includes("://") || decoded.startsWith("//")) {
            return defaultRedirect;
        }
    } catch {
        // If decoding fails, reject the URL
        return defaultRedirect;
    }

    return url;
}

export default function AdminLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = getSafeRedirectUrl(searchParams.get("redirect"));

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // In production, this would set cookies via API response
            document.cookie = `admin_auth_token=mock_token; path=/; max-age=${60 * 60 * 24 * 7}`;
            document.cookie = `admin_role=super_admin; path=/; max-age=${60 * 60 * 24 * 7}`;

            router.push(redirect);
        } catch {
            setError("Invalid credentials or insufficient permissions");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4"
                    >
                        <Shield className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Admin Portal
                    </h1>
                    <p className="text-slate-400">
                        Sign in to access the admin dashboard
                    </p>
                </div>

                <Card className="backdrop-blur-xl bg-white/95">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <Input
                            label="Email address"
                            type="email"
                            placeholder="admin@zoraapp.co.uk"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            leftIcon={<Mail className="w-4 h-4" />}
                            required
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                leftIcon={<Lock className="w-4 h-4" />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                }
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-gray-600">Remember this device</span>
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={isLoading}
                            loadingText="Verifying..."
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                            Sign in
                        </Button>
                    </form>
                </Card>

                <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <p className="text-slate-400 text-sm text-center">
                        This is a secure admin area. All access is logged and monitored.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
