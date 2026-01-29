'use client';

/**
 * useAuth Hook for Admin Dashboard
 * Provides authentication state and methods using Supabase
 */

import { useEffect, useState, useCallback } from 'react';
import { createSupabaseClient, authService } from '@zora/api-client';
import type { User } from '@supabase/supabase-js';

interface AdminProfile {
    id: string;
    full_name?: string;
    email?: string;
    avatar_url?: string;
    role: string;
}

interface AuthState {
    user: User | null;
    profile: AdminProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
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
        profile: null,
        isLoading: true,
        isAuthenticated: false,
        isAdmin: false,
        error: null,
    });

    // Fetch admin profile for the user
    const fetchAdminProfile = useCallback(async (userId: string): Promise<AdminProfile | null> => {
        try {
            const supabase = createSupabaseClient();
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, email, avatar_url, role')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('[useAuth] Error fetching admin profile:', error);
                return null;
            }

            return data;
        } catch (err) {
            console.error('[useAuth] Error fetching admin profile:', err);
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
                    const profile = await fetchAdminProfile(session.user.id);
                    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

                    setState({
                        user: session.user,
                        profile,
                        isLoading: false,
                        isAuthenticated: true,
                        isAdmin,
                        error: null,
                    });
                } else {
                    setState({
                        user: null,
                        profile: null,
                        isLoading: false,
                        isAuthenticated: false,
                        isAdmin: false,
                        error: null,
                    });
                }
            } catch (err) {
                setState({
                    user: null,
                    profile: null,
                    isLoading: false,
                    isAuthenticated: false,
                    isAdmin: false,
                    error: err as Error,
                });
            }
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('[useAuth] Auth state changed:', event);

            if (session?.user) {
                const profile = await fetchAdminProfile(session.user.id);
                const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

                setState({
                    user: session.user,
                    profile,
                    isLoading: false,
                    isAuthenticated: true,
                    isAdmin,
                    error: null,
                });

                // Set cookie for middleware
                document.cookie = `admin_auth_token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
            } else {
                setState({
                    user: null,
                    profile: null,
                    isLoading: false,
                    isAuthenticated: false,
                    isAdmin: false,
                    error: null,
                });

                // Clear cookie
                document.cookie = 'admin_auth_token=; path=/; max-age=0';
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchAdminProfile]);

    // Sign in
    const signIn = useCallback(async (email: string, password: string) => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const { user, error } = await authService.signIn(email, password);

            if (error) {
                throw new Error(error);
            }

            if (!user) {
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

// Export admin ID helper
export function useAdminId(): string | null {
    const { user } = useAuth();
    return user?.id ?? null;
}
