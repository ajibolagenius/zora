"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button, Input, Card } from "@zora/ui-web";

export default function AdminForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setIsSubmitted(true);
        } catch {
            setError("Failed to send reset email. Please try again.");
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
                        Reset Password
                    </h1>
                    <p className="text-slate-400">
                        {isSubmitted
                            ? "Check your email for reset instructions"
                            : "Enter your admin email to receive a reset link"}
                    </p>
                </div>

                <Card className="backdrop-blur-xl bg-white/95">
                    {isSubmitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Email Sent!
                            </h2>
                            <p className="text-gray-600 mb-6">
                                We&apos;ve sent a password reset link to{" "}
                                <span className="font-medium text-gray-900">{email}</span>.
                                Please check your inbox and spam folder.
                            </p>
                            <div className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        setIsSubmitted(false);
                                        setEmail("");
                                    }}
                                >
                                    Send to a different email
                                </Button>
                                <Link href="/login" className="block">
                                    <Button variant="ghost" className="w-full">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to sign in
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                leftIcon={<Mail className="w-4 h-4" />}
                                required
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                                loadingText="Sending..."
                            >
                                Send Reset Link
                            </Button>

                            <Link
                                href="/login"
                                className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to sign in
                            </Link>
                        </form>
                    )}
                </Card>

                <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <p className="text-slate-400 text-sm text-center">
                        For security reasons, password reset links expire after 1 hour.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
