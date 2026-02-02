'use client';

/**
 * useAuth Hook for Vendor Portal
 * Provides authentication state and methods using Supabase
 */

import { useEffect, useState, useCallback } from 'react';
import { createSupabaseClient, authService } from '@zora/api-client';
import type { User } from '@supabase/supabase-js';

interface VendorProfile {
    id: string;
    user_id: string;
    shop_name: string;
    slug: string;
    logo_url?: string;
    is_verified: boolean;
}

interface AuthState {
    user: User | null;
    vendor: VendorProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: Error | null;
}

interface UseAuthReturn extends AuthState {
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
    const [state, setState] = useState<AuthState>({
        user: null,
        vendor: null,
        isLoading: true,
        isAuthenticated: false,
        error: null,
    });

    // Fetch vendor profile for the user
    const fetchVendorProfile = useCallback(async (userId: string): Promise<VendorProfile | null> => {
        try {
            const supabase = createSupabaseClient();
            const { data, error } = await supabase
                .from('vendors')
                .select('id, user_id, shop_name, slug, logo_url, is_verified')
                .eq('user_id', userId)
                .single();

            if (error) {
                console.error('[useAuth] Error fetching vendor profile:', error);
                return null;
            }

            return data;
        } catch (err) {
            console.error('[useAuth] Error fetching vendor profile:', err);
            return null;
        }
    }, []);

    // Initialize auth state
    useEffect(() => {
        const supabase = createSupabaseClient();

        // Get initial session
        const initAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    throw error;
                }

                if (session?.user) {
                    const vendor = await fetchVendorProfile(session.user.id);
                    setState({
                        user: session.user,
                        vendor,
                        isLoading: false,
                        isAuthenticated: true,
                        error: null,
                    });
                } else {
                    setState({
                        user: null,
                        vendor: null,
                        isLoading: false,
                        isAuthenticated: false,
                        error: null,
                    });
                }
            } catch (err) {
                setState({
                    user: null,
                    vendor: null,
                    isLoading: false,
                    isAuthenticated: false,
                    error: err as Error,
                });
            }
        };

        initAuth();

        // Listen for auth changes
        // IMPORTANT: Async calls inside onAuthStateChange can cause deadlocks in Supabase.js
        // We defer the profile fetch using setTimeout to run outside the handler
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('[useAuth] Auth state changed:', event);

            if (session?.user) {
                // Set cookie immediately (synchronous)
                document.cookie = `vendor_auth_token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

                // Defer async profile fetch to avoid deadlock
                setTimeout(async () => {
                    const vendor = await fetchVendorProfile(session.user.id);
                    setState({
                        user: session.user,
                        vendor,
                        isLoading: false,
                        isAuthenticated: true,
                        error: null,
                    });
                }, 0);
            } else {
                setState({
                    user: null,
                    vendor: null,
                    isLoading: false,
                    isAuthenticated: false,
                    error: null,
                });

                // Clear cookie
                document.cookie = 'vendor_auth_token=; path=/; max-age=0';
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchVendorProfile]);

    // Sign in
    const signIn = useCallback(async (email: string, password: string) => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const data = await authService.signIn(email, password);

            if (!data?.user) {
                throw new Error('Sign in failed');
            }

            // Auth state change listener will handle the rest
        } catch (err) {
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: err as Error,
            }));
            throw err;
        }
    }, []);

    // Sign out
    const signOut = useCallback(async () => {
        setState((prev) => ({ ...prev, isLoading: true }));

        try {
            await authService.signOut();
            // Auth state change listener will handle the rest
        } catch (err) {
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: err as Error,
            }));
            throw err;
        }
    }, []);

    // Refresh session
    const refreshSession = useCallback(async () => {
        const supabase = createSupabaseClient();
        const { error } = await supabase.auth.refreshSession();

        if (error) {
            console.error('[useAuth] Error refreshing session:', error);
        }
    }, []);

    return {
        ...state,
        signIn,
        signOut,
        refreshSession,
    };
}

// Export vendor ID helper
export function useVendorId(): string | null {
    const { vendor } = useAuth();
    return vendor?.id ?? null;
}
