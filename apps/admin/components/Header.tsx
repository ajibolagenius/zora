"use client";

import { Bell, MagnifyingGlass } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage, Input, Badge } from "@zora/ui-web";
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
            className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 lg:top-0 z-30"
        >
            <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 truncate">{title}</h1>
                {description && (
                    <p className="text-slate-500 text-sm truncate hidden sm:block">{description}</p>
                )}
            </div>
            <div className="flex items-center gap-2 sm:gap-4 ml-4">
                <div className="hidden lg:block w-64">
                    <Input
                        placeholder="Search..."
                        inputSize="sm"
                        leftIcon={<MagnifyingGlass size={16} weight="duotone" />}
                    />
                </div>
                <button
                    className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    aria-label="Notifications"
                >
                    <Bell size={20} weight="duotone" aria-hidden="true" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" aria-label="New notifications available" />
                </button>
                <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar size="default">
                        <AvatarImage src="/admin-avatar.jpg" alt="Admin" />
                        <AvatarFallback className="bg-slate-800 text-white">AD</AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block">
                        <p className="text-sm font-medium text-slate-900">Admin User</p>
                        <p className="text-xs text-slate-500">Super Admin</p>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
