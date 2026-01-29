"use client";

import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, Input } from "@zora/ui-web";
import { motion } from "framer-motion";

interface HeaderProps {
    title: string;
    description?: string;
}

export function Header({ title, description }: HeaderProps) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 lg:top-0 z-30"
        >
            <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900 truncate">{title}</h1>
                {description && (
                    <p className="text-gray-500 text-sm truncate hidden sm:block">{description}</p>
                )}
            </div>
            <div className="flex items-center gap-2 sm:gap-4 ml-4">
                <div className="hidden lg:block w-64">
                    <Input
                        placeholder="Search..."
                        inputSize="sm"
                        leftIcon={<Search className="h-4 w-4" />}
                    />
                </div>
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                </button>
                <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar size="default">
                        <AvatarImage src="/vendor-avatar.jpg" alt="Vendor" />
                        <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block">
                        <p className="text-sm font-medium text-gray-900">African Spice House</p>
                        <p className="text-xs text-gray-500">Premium Vendor</p>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
