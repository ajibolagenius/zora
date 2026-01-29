import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variable names for different platforms
const ENV_KEYS = {
    // Web (Next.js)
    web: {
        url: 'NEXT_PUBLIC_SUPABASE_URL',
        anonKey: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    },
    // Mobile (Expo)
    mobile: {
        url: 'EXPO_PUBLIC_SUPABASE_URL',
        anonKey: 'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    },
};

type Platform = 'web' | 'mobile';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Get environment variable value with fallback to different platform prefixes
 */
function getEnvVar(key: string): string | undefined {
    // Try all possible environment variable names
    if (typeof process !== 'undefined' && process.env) {
        return (
            process.env[`NEXT_PUBLIC_${key}`] ||
            process.env[`EXPO_PUBLIC_${key}`] ||
            process.env[key]
        );
    }
    return undefined;
}

/**
 * Create or return existing Supabase client
 */
export function createSupabaseClient(
    options?: {
        supabaseUrl?: string;
        supabaseKey?: string;
        platform?: Platform;
    }
): SupabaseClient {
    if (supabaseInstance) {
        return supabaseInstance;
    }

    const supabaseUrl =
        options?.supabaseUrl ||
        getEnvVar('SUPABASE_URL') ||
        '';

    const supabaseKey =
        options?.supabaseKey ||
        getEnvVar('SUPABASE_ANON_KEY') ||
        '';

    if (!supabaseUrl || !supabaseKey) {
        console.warn(
            'Supabase URL or Key not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or EXPO_PUBLIC_ variants for mobile).'
        );
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    });

    return supabaseInstance;
}

/**
 * Get the Supabase client instance
 */
export function getSupabaseClient(): SupabaseClient {
    if (!supabaseInstance) {
        return createSupabaseClient();
    }
    return supabaseInstance;
}

/**
 * Reset the Supabase client (useful for testing)
 */
export function resetSupabaseClient(): void {
    supabaseInstance = null;
}

export { SupabaseClient };
