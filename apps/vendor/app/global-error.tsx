"use client";

import { useEffect } from "react";
import { Button } from "@zora/ui-web/components/Button";

export default function GlobalError({
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
        <html>
            <body className="flex min-h-screen flex-col items-center justify-center space-y-4 p-8 text-center bg-background text-foreground">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Portal Error</h2>
                    <p className="max-w-md text-muted-foreground">
                        {error.message || "An error occurred in the vendor portal."}
                    </p>
                </div>
                <Button onClick={() => reset()}>Try again</Button>
            </body>
        </html>
    );
}
