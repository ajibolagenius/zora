"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 p-8 text-center">
                    <div className="rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/20">
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Something went wrong
                        </h3>
                        <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
                            {this.state.error?.message || "An unexpected error occurred."}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Try again
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
