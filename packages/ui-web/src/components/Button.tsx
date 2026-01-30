"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { CircleNotch } from "@phosphor-icons/react";
import { cn } from "../lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-white shadow-md hover:bg-primary-dark hover:shadow-lg focus-visible:ring-primary active:scale-[0.98]",
                secondary:
                    "bg-secondary text-gray-900 shadow-md hover:bg-secondary-dark hover:shadow-lg focus-visible:ring-secondary active:scale-[0.98]",
                destructive:
                    "bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg focus-visible:ring-red-500 active:scale-[0.98]",
                outline:
                    "border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-gray-400 active:scale-[0.98]",
                ghost:
                    "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-400",
                link:
                    "text-primary underline-offset-4 hover:underline focus-visible:ring-primary",
                success:
                    "bg-green-600 text-white shadow-md hover:bg-green-700 hover:shadow-lg focus-visible:ring-green-500 active:scale-[0.98]",
            },
            size: {
                default: "h-11 px-5 py-2.5",
                sm: "h-9 px-4 text-xs",
                lg: "h-12 px-8 text-base",
                xl: "h-14 px-10 text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends Omit<HTMLMotionProps<"button">, "children">,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
    loadingText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            isLoading = false,
            loadingText,
            leftIcon,
            rightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        if (asChild) {
            return (
                <Slot
                    className={cn(buttonVariants({ variant, size, className }))}
                    ref={ref as React.Ref<HTMLElement>}
                >
                    {children}
                </Slot>
            );
        }

        return (
            <motion.button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || isLoading}
                whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
                whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
                transition={{ duration: 0.15 }}
                {...props}
            >
                {isLoading ? (
                    <>
                        <CircleNotch size={16} weight="duotone" className="animate-spin" />
                        {loadingText || children}
                    </>
                ) : (
                    <>
                        {leftIcon}
                        {children}
                        {rightIcon}
                    </>
                )}
            </motion.button>
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
