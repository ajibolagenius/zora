"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const badgeVariants = cva(
    "inline-flex items-center gap-1 rounded-full font-medium transition-colors",
    {
        variants: {
            variant: {
                default: "bg-gray-100 text-gray-700",
                primary: "bg-primary/10 text-primary",
                secondary: "bg-secondary/20 text-yellow-700",
                success: "bg-green-100 text-green-700",
                warning: "bg-yellow-100 text-yellow-700",
                error: "bg-red-100 text-red-700",
                info: "bg-blue-100 text-blue-700",
                outline: "border border-gray-200 text-gray-700 bg-white",
            },
            size: {
                sm: "px-2 py-0.5 text-xs",
                default: "px-2.5 py-1 text-xs",
                lg: "px-3 py-1.5 text-sm",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
    dot?: boolean;
    pulse?: boolean;
    icon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant, size, dot, pulse, icon, children, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(badgeVariants({ variant, size }), className)}
                {...props}
            >
                {dot && (
                    <span className="relative flex h-2 w-2">
                        {pulse && (
                            <span
                                className={cn(
                                    "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                                    variant === "success" && "bg-green-400",
                                    variant === "error" && "bg-red-400",
                                    variant === "warning" && "bg-yellow-400",
                                    variant === "info" && "bg-blue-400",
                                    variant === "primary" && "bg-primary",
                                    (!variant || variant === "default") && "bg-gray-400"
                                )}
                            />
                        )}
                        <span
                            className={cn(
                                "relative inline-flex h-2 w-2 rounded-full",
                                variant === "success" && "bg-green-500",
                                variant === "error" && "bg-red-500",
                                variant === "warning" && "bg-yellow-500",
                                variant === "info" && "bg-blue-500",
                                variant === "primary" && "bg-primary",
                                (!variant || variant === "default") && "bg-gray-500"
                            )}
                        />
                    </span>
                )}
                {icon}
                {children}
            </span>
        );
    }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
