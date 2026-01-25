import { create } from 'zustand';
import { User } from '../types';
import { supabase, getSupabaseClient } from '../lib/supabase';
import { Session, AuthError } from '@supabase/supabase-js';

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
  isLoading: true,
  hasCompletedOnboarding: false,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
  setOnboardingComplete: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),
  
  signInWithGoogle: async () => {
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
    try {
      set({ isLoading: true });
      const client = await getSupabaseClient();
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Fetch user profile
        const { data: profile } = await client
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        set({
          user: mapSupabaseUser(data.user, profile),
          session: data.session,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Email sign in error:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  signUpWithEmail: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true });
      const client = await getSupabaseClient();
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create profile in profiles table
        await client.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
          full_name: name,
          membership_tier: 'bronze',
          zora_credits: 5.0, // Welcome bonus
          loyalty_points: 100,
          referral_code: `ZORA${data.user.id.substring(0, 6).toUpperCase()}`,
        });
        
        set({
          user: mapSupabaseUser(data.user, { full_name: name }),
          session: data.session,
          isAuthenticated: !!data.session,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Email sign up error:', error);
      set({ isLoading: false });
      throw error;
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
