"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon?: LucideIcon;
    iconColor?: string;
    iconBgColor?: string;
    loading?: boolean;
    className?: string;
}

export function StatsCard({
    title,
    value,
    change,
    changeLabel,
    icon: Icon,
    iconColor = "text-primary",
    iconBgColor = "bg-primary/10",
    loading = false,
    className,
}: StatsCardProps) {
    const trend = change ? (change > 0 ? "up" : change < 0 ? "down" : "neutral") : null;

    if (loading) {
        return (
            <div className={cn("rounded-2xl border border-gray-100 bg-white p-6", className)}>
                <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-gray-200 animate-pulse" />
                    <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
                </div>
                <div className="h-8 w-24 rounded bg-gray-200 animate-pulse mb-2" />
                <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-md transition-shadow",
                className
            )}
        >
            <div className="flex items-center justify-between mb-4">
                {Icon && (
                    <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", iconBgColor)}>
                        <Icon className={cn("h-6 w-6", iconColor)} />
                    </div>
                )}
                {trend && (
                    <div
                        className={cn(
                            "flex items-center gap-1 text-sm font-medium",
                            trend === "up" && "text-green-600",
                            trend === "down" && "text-red-600",
                            trend === "neutral" && "text-gray-500"
                        )}
                    >
                        {trend === "up" && <TrendingUp className="h-4 w-4" />}
                        {trend === "down" && <TrendingDown className="h-4 w-4" />}
                        {trend === "neutral" && <Minus className="h-4 w-4" />}
                        <span>{change && change > 0 ? "+" : ""}{change}%</span>
                    </div>
                )}
            </div>
            <motion.h3
                className="text-2xl font-bold text-gray-900 mb-1"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
                {value}
            </motion.h3>
            <p className="text-sm text-gray-500">{title}</p>
            {changeLabel && (
                <p className="text-xs text-gray-400 mt-1">{changeLabel}</p>
            )}
        </motion.div>
    );
}
