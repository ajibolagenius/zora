import { create } from 'zustand';
import { User } from '../types';
import { supabase, getSupabaseClient, isSupabaseConfigured, getCredentialsError } from '../lib/supabase';
import { Session, AuthError } from '@supabase/supabase-js';

// Helper to add timeout to promises
const withTimeout = <T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> => {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), ms);
  });
  return Promise.race([promise, timeout]);
};

const AUTH_TIMEOUT_MS = 15000; // 15 seconds

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setOnboardingComplete: (complete: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

// Helper to convert Supabase user to our User type
const mapSupabaseUser = (supabaseUser: any, profile?: any): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email || '',
  name: profile?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
  picture: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || null,
  phone: profile?.phone || null,
  membership_tier: profile?.membership_tier || 'bronze',
  zora_credits: profile?.zora_credits || 0,
  loyalty_points: profile?.loyalty_points || 0,
  referral_code: profile?.referral_code || null,
  cultural_interests: profile?.cultural_interests || [],
});

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false, // Start as false to prevent blocking UI
  hasCompletedOnboarding: false,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
  setOnboardingComplete: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),
  
  signInWithGoogle: async () => {
    // Check credentials before attempting auth
    if (!isSupabaseConfigured()) {
      const error = new Error(getCredentialsError());
      console.error('Google sign in error:', error);
      throw error;
    }

    try {
      set({ isLoading: true });
      const client = await getSupabaseClient();
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'zora://auth/callback',
        },
      });
      
      if (error) throw error;
      // The session will be handled by the auth state listener
    } catch (error) {
      console.error('Google sign in error:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  signInWithEmail: async (email: string, password: string) => {
    // Check credentials before attempting auth
    if (!isSupabaseConfigured()) {
      const error = new Error(getCredentialsError());
      console.error('Email sign in error:', error);
      throw error;
    }

    try {
      set({ isLoading: true });
      const client = await getSupabaseClient();
      
      // Add timeout to prevent infinite loading
      const { data, error } = await withTimeout(
        client.auth.signInWithPassword({ email, password }),
        AUTH_TIMEOUT_MS,
        'Sign in timed out. Please check your internet connection and try again.'
      );
      
      if (error) throw error;
      
      if (data.user) {
        // Fetch user profile with timeout
        const { data: profile } = await withTimeout(
          client.from('profiles').select('*').eq('id', data.user.id).single(),
          AUTH_TIMEOUT_MS,
          'Failed to load profile. Please try again.'
        );
        
        set({
          user: mapSupabaseUser(data.user, profile),
          session: data.session,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Email sign in error:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  signUpWithEmail: async (email: string, password: string, name: string) => {
    // Check credentials before attempting auth
    if (!isSupabaseConfigured()) {
      const error = new Error(getCredentialsError());
      console.error('Email sign up error:', error);
      throw error;
    }

    try {
      set({ isLoading: true });
      const client = await getSupabaseClient();
      
      // Add timeout to prevent infinite loading
      const { data, error } = await withTimeout(
        client.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        }),
        AUTH_TIMEOUT_MS,
        'Sign up timed out. Please check your internet connection and try again.'
      );
      
      if (error) throw error;
      
      if (data.user) {
        // Create profile in profiles table with timeout
        await withTimeout(
          client.from('profiles').insert({
            id: data.user.id,
            email: data.user.email,
            full_name: name,
            membership_tier: 'bronze',
            zora_credits: 5.0, // Welcome bonus
            loyalty_points: 100,
            referral_code: `ZORA${data.user.id.substring(0, 6).toUpperCase()}`,
          }),
          AUTH_TIMEOUT_MS,
          'Failed to create profile. Please try again.'
        );
        
        set({
          user: mapSupabaseUser(data.user, { full_name: name }),
          session: data.session,
          isAuthenticated: !!data.session,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Email sign up error:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  resetPassword: async (email: string) => {
    // Check credentials before attempting password reset
    if (!isSupabaseConfigured()) {
      const error = new Error(getCredentialsError());
      console.error('Password reset error:', error);
      throw error;
    }

    try {
      set({ isLoading: true });
      const client = await getSupabaseClient();
      
      const { error } = await withTimeout(
        client.auth.resetPasswordForEmail(email, {
          redirectTo: 'zora://auth/reset-password',
        }),
        AUTH_TIMEOUT_MS,
        'Password reset timed out. Please check your internet connection and try again.'
      );
      
      if (error) throw error;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: async () => {
    try {
      set({ isLoading: true });
      const client = await getSupabaseClient();
      await client.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
  
  checkAuth: async () => {
    // If Supabase is not configured, skip auth check silently
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Skipping auth check.');
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    try {
      set({ isLoading: true });
      const client = await getSupabaseClient();
      const { data: { session } } = await client.auth.getSession();
      
      if (session?.user) {
        // Fetch user profile
        const { data: profile } = await client
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        set({
          user: mapSupabaseUser(session.user, profile),
          session,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Check auth error:', error);
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
  
  updateProfile: async (updates: Partial<User>) => {
    const { session, user } = get();
    if (!session || !user) throw new Error('Not authenticated');
    
    try {
      const client = await getSupabaseClient();
      
      // Update profile in Supabase
      const { data, error } = await client
        .from('profiles')
        .update({
          full_name: updates.name,
          phone: updates.phone,
          avatar_url: updates.picture,
          cultural_interests: updates.cultural_interests,
        })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      set({
        user: {
          ...user,
          ...updates,
        },
      });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
}));

export default useAuthStore;
