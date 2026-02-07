"use client";

import { useEffect } from "react";
import { Button } from "@zora/ui-web/components/Button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 p-8 text-center">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Something went wrong!</h2>
                <p className="max-w-md text-muted-foreground">
                    {error.message || "An unexpected error occurred."}
                </p>
            </div>
            <Button onClick={() => reset()}>Try again</Button>
        </div>
    );
}
