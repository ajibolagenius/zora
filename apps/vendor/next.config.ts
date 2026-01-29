import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: ["@zora/types", "@zora/design-tokens", "@zora/api-client", "@zora/ui-web"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "*.supabase.co",
            },
        ],
    },
};

export default nextConfig;
