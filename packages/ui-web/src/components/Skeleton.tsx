"use client";

import { cn } from "../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "text" | "circular" | "rectangular";
    animation?: "pulse" | "wave" | "none";
}

function Skeleton({
    className,
    variant = "rectangular",
    animation = "pulse",
    ...props
}: SkeletonProps) {
    return (
        <div
            className={cn(
                "bg-gray-200",
                variant === "text" && "h-4 w-full rounded",
                variant === "circular" && "rounded-full",
                variant === "rectangular" && "rounded-xl",
                animation === "pulse" && "animate-pulse",
                animation === "wave" &&
                "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
                className
            )}
            {...props}
        />
    );
}

// Pre-built skeleton components for common patterns
function SkeletonCard() {
    return (
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12" variant="circular" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}

function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            <div className="flex gap-4 border-b border-gray-100 pb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 py-2">
                    {[1, 2, 3, 4, 5].map((j) => (
                        <Skeleton key={j} className="h-4 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
}

function SkeletonStats({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="space-y-3 rounded-2xl border border-gray-100 bg-white p-6">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-32" />
                </div>
            ))}
        </div>
    );
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonStats };
