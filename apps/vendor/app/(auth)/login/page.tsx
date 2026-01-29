"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Store, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button, Input, Card } from "@zora/ui-web";

export default function VendorLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";

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
            document.cookie = `vendor_auth_token=mock_token; path=/; max-age=${60 * 60 * 24 * 7}`;

            router.push(redirect);
        } catch {
            setError("Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#221710] to-[#3a2a1f] flex items-center justify-center p-4">
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
                        <Store className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back
                    </h1>
                    <p className="text-[#CBA990]">
                        Sign in to your vendor dashboard
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
                            placeholder="vendor@example.com"
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
                                <span className="text-sm text-gray-600">Remember me</span>
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
                            loadingText="Signing in..."
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                            Sign in
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-600">
                            Want to become a vendor?{" "}
                            <Link
                                href="https://zoraapp.co.uk/vendor-onboarding"
                                className="text-primary font-medium hover:text-primary/80 transition-colors"
                            >
                                Apply now
                            </Link>
                        </p>
                    </div>
                </Card>

                <p className="text-center text-[#CBA990] text-sm mt-6">
                    Need help?{" "}
                    <Link href="/support" className="text-white hover:text-primary transition-colors">
                        Contact support
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
