import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { api } from '../services/api';

interface AuthState {
  user: User | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setSessionToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setOnboardingComplete: (complete: boolean) => void;
  login: (sessionId: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      sessionToken: null,
      isAuthenticated: false,
      isLoading: true,
      hasCompletedOnboarding: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSessionToken: (sessionToken) => set({ sessionToken }),
      setLoading: (isLoading) => set({ isLoading }),
      setOnboardingComplete: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),
      
      login: async (sessionId: string) => {
        try {
          set({ isLoading: true });
          const response = await api.post('/auth/session', { session_id: sessionId });
          const { user, session_token } = response.data;
          
          set({
            user,
            sessionToken: session_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: async () => {
        try {
          const { sessionToken } = get();
          if (sessionToken) {
            await api.post('/auth/logout', {}, {
              headers: { Authorization: `Bearer ${sessionToken}` }
            });
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            sessionToken: null,
            isAuthenticated: false,
          });
        }
      },
      
      checkAuth: async () => {
        const { sessionToken } = get();
        if (!sessionToken) {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }
        
        try {
          set({ isLoading: true });
          // Skip API call on web for now, just use stored session
          set({
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Auth check error:', error);
          set({
            user: null,
            sessionToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
      
      updateProfile: async (updates: Partial<User>) => {
        const { sessionToken } = get();
        if (!sessionToken) throw new Error('Not authenticated');
        
        try {
          const response = await api.put('/auth/profile', updates, {
            headers: { Authorization: `Bearer ${sessionToken}` }
          });
          set({ user: response.data });
        } catch (error) {
          console.error('Update profile error:', error);
          throw error;
        }
      },
    }),
    {
      name: 'zora-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        sessionToken: state.sessionToken,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
);

export default useAuthStore;
