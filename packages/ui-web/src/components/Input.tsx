"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const inputVariants = cva(
    "flex w-full rounded-xl border bg-white text-gray-900 transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
                error:
                    "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                success:
                    "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20",
            },
            inputSize: {
                default: "h-11 px-4 py-2 text-sm",
                sm: "h-9 px-3 py-1.5 text-xs",
                lg: "h-12 px-5 py-3 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            inputSize: "default",
        },
    }
);

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type,
            variant,
            inputSize,
            label,
            error,
            hint,
            leftIcon,
            rightIcon,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || React.useId();
        const hasError = !!error;

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        type={type}
                        id={inputId}
                        className={cn(
                            inputVariants({
                                variant: hasError ? "error" : variant,
                                inputSize,
                            }),
                            leftIcon && "pl-10",
                            rightIcon && "pr-10",
                            className
                        )}
                        ref={ref}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? `${inputId}-error` : undefined}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {(error || hint) && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "text-xs",
                            hasError ? "text-red-500" : "text-gray-500"
                        )}
                        id={hasError ? `${inputId}-error` : undefined}
                    >
                        {error || hint}
                    </motion.p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input, inputVariants };
