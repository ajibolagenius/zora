import { getSupabaseClient } from '../supabase';
import type { User, AuthUser, UserRole } from '@zora/types';

export const authService = {
    /**
     * Sign up with email and password
     */
    async signUp(email: string, password: string, metadata?: { name?: string }) {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });

        if (error) throw error;
        return data;
    },

    /**
     * Sign in with email and password
     */
    async signIn(email: string, password: string) {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    },

    /**
     * Sign in with OAuth provider
     */
    async signInWithOAuth(provider: 'google' | 'facebook' | 'apple', redirectTo?: string) {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo,
            },
        });

        if (error) throw error;
        return data;
    },

    /**
     * Sign out
     */
    async signOut() {
        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /**
     * Get current session
     */
    async getSession() {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;
    },

    /**
     * Get current user
     */
    async getUser() {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        return data.user;
    },

    /**
     * Get user profile from profiles table
     */
    async getProfile(): Promise<User | null> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update user profile
     */
    async updateProfile(updates: Partial<User>): Promise<User> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Send password reset email
     */
    async resetPassword(email: string, redirectTo?: string) {
        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo,
        });
        if (error) throw error;
    },

    /**
     * Update password
     */
    async updatePassword(newPassword: string) {
        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) throw error;
    },

    /**
     * Get user role
     */
    async getUserRole(): Promise<UserRole> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return 'customer';

        // Check if user is admin
        const { data: adminData } = await supabase
            .from('admins')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (adminData) return 'admin';

        // Check if user is vendor
        const { data: vendorData } = await supabase
            .from('vendors')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (vendorData) return 'vendor';

        return 'customer';
    },

    /**
     * Listen to auth state changes
     */
    onAuthStateChange(callback: (event: string, session: unknown) => void) {
        const supabase = getSupabaseClient();
        return supabase.auth.onAuthStateChange(callback);
    },
};

export default authService;
