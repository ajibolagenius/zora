import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Get Supabase URL from environment variables
 * Checks all possible variable names across platforms
 */
function getSupabaseUrl(): string {
    // Next.js (web)
    if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return process.env.NEXT_PUBLIC_SUPABASE_URL;
    }
    // Expo (mobile)
    if (typeof process !== 'undefined' && process.env.EXPO_PUBLIC_SUPABASE_URL) {
        return process.env.EXPO_PUBLIC_SUPABASE_URL;
    }
    return '';
}

/**
 * Get Supabase Anon Key from environment variables
 * Checks all possible variable names across platforms
 */
function getSupabaseAnonKey(): string {
    // Next.js (web)
    if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    }
    // Expo (mobile)
    if (typeof process !== 'undefined' && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
        return process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    }
    return '';
}

/**
 * Create or return existing Supabase client
 */
export function createSupabaseClient(
    options?: {
        supabaseUrl?: string;
        supabaseKey?: string;
    }
): SupabaseClient {
    if (supabaseInstance) {
        return supabaseInstance;
    }

    const supabaseUrl = options?.supabaseUrl || getSupabaseUrl();
    const supabaseKey = options?.supabaseKey || getSupabaseAnonKey();

    if (!supabaseUrl || !supabaseKey) {
        console.warn(
            'Supabase URL or Key not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or EXPO_PUBLIC_ variants for mobile).'
        );
        // Throw error to prevent creating invalid client
        throw new Error(
            'Supabase configuration missing. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file.'
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
