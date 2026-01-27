import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../lib/storage';
import { User } from '../types';
import { supabase, getSupabaseClient, isSupabaseConfigured, getCredentialsError } from '../lib/supabase';
import { Session, AuthError } from '@supabase/supabase-js';
import { ApiConfig } from '../constants';
import { Platform, AppState } from 'react-native';
import {
  logSecurityEvent,
  SecurityEventType,
  securityLogger,
} from '../lib/security/securityLogger';
import {
  createAuditLog,
  AuditAction,
} from '../lib/security/auditTrail';
import {
  createSecurityAlert,
} from '../lib/security/securityAlerts';
import {
  sessionTimeoutManager,
} from '../lib/security/sessionTimeout';
import { sanitizeEmail } from '../lib/security/sanitize';

// ============================================
// DEV MOCK USER - For testing without Supabase
// ============================================
// Email: test@zora.dev
// Password: Test123!
// ============================================
export const DEV_MOCK_USER: User = {
  id: 'dev-mock-user-001',
  email: 'test@zora.dev',
  name: 'Test User',
  picture: null,
  phone: '+234 800 000 0000',
  membership_tier: 'gold',
  zora_credits: 250.00,
  loyalty_points: 5000,
  referral_code: 'ZORATEST',
  cultural_interests: ['Yoruba', 'Igbo', 'Hausa'],
};

export const DEV_MOCK_CREDENTIALS = {
  email: 'test@zora.dev',
  password: 'Test123!',
};

// Helper to add timeout to promises
const withTimeout = <T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> => {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), ms);
  });
  return Promise.race([promise, timeout]);
};

const AUTH_TIMEOUT_MS = ApiConfig.authTimeout;

// Track OAuth timeout for native platforms to reset isLoading if user cancels
let oauthTimeoutId: NodeJS.Timeout | null = null;
const OAUTH_TIMEOUT_MS = 60 * 1000; // 60 seconds

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  emailVerified: boolean;
  sessionExpiringSoon: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setEmailVerified: (verified: boolean) => void;
  setSessionExpiringSoon: (expiring: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithMockUser: () => void; // Dev testing without Supabase
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  verifyEmail: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// Helper to convert Supabase user to our User type
const mapSupabaseUser = (supabaseUser: any, profile?: any): User => ({
  user_id: supabaseUser.id,
  email: supabaseUser.email || '',
  name: profile?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
  picture: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || null,
  phone: profile?.phone || null,
  membership_tier: profile?.membership_tier || 'bronze',
  zora_credits: profile?.zora_credits || 0,
  loyalty_points: profile?.loyalty_points || 0,
  referral_code: profile?.referral_code || null,
  cultural_interests: profile?.cultural_interests || [],
  created_at: supabaseUser.created_at || new Date().toISOString(),
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false, // Start as false to prevent blocking UI
      hasCompletedOnboarding: false,
      emailVerified: false,
      sessionExpiringSoon: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSession: (session) => {
        set({ session });
        // Start session timeout tracking when session is set
        if (session) {
          // Clear OAuth timeout if it exists (auth succeeded)
          if (oauthTimeoutId) {
            clearTimeout(oauthTimeoutId);
            oauthTimeoutId = null;
          }

          // Reset sessionExpiringSoon flag when starting a new session
          set({ sessionExpiringSoon: false });
          sessionTimeoutManager.startSession(
            (minutesLeft) => {
              set({ sessionExpiringSoon: true });
              const { user } = get();
              if (user) {
                createSecurityAlert.sessionExpiring(user.user_id, minutesLeft);
              }
            },
            () => {
              // Session expired
              const { user, logout } = get();
              if (user) {
                logSecurityEvent.sessionExpired(user.user_id, user.email);
                createSecurityAlert.suspiciousActivity(
                  user.user_id,
                  'Your session has expired. Please log in again.'
                );
              }
              logout();
            }
          );
        } else {
          sessionTimeoutManager.endSession();
          set({ sessionExpiringSoon: false });
        }
      },
      setLoading: (isLoading) => set({ isLoading }),
      setOnboardingComplete: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),
      setEmailVerified: (emailVerified) => set({ emailVerified }),
      setSessionExpiringSoon: (sessionExpiringSoon) => set({ sessionExpiringSoon }),

      signInWithGoogle: async () => {
        // Check credentials before attempting auth
        if (!isSupabaseConfigured()) {
          const error = new Error(getCredentialsError());
          console.error('Google sign in error:', error);
          logSecurityEvent.loginFailed('', 'Supabase not configured');
          throw error;
        }

        try {
          set({ isLoading: true });
          const client = await getSupabaseClient();

          // For React Native, we need to use the proper redirect URL
          // The redirect URL should match what's configured in Supabase Dashboard
          // Use the app scheme from app.json: zoramarket
          const redirectUrl = Platform.OS === 'web'
            ? (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'http://localhost:3000/auth/callback')
            : 'zoramarket://auth/callback';

          const { data, error } = await client.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: redirectUrl,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
              // Pass user metadata to be stored in profile
              skipBrowserRedirect: Platform.OS !== 'web', // For native, we'll handle redirect manually
            },
          });

          if (error) {
            logSecurityEvent.loginFailed('', `OAuth error: ${error.message}`);
            createAuditLog('', AuditAction.USER_LOGIN, {
              success: false,
              errorMessage: error.message,
            });
            set({ isLoading: false });
            throw error;
          }

          // For web, the redirect will happen automatically
          // For native, we need to open the URL manually
          if (Platform.OS !== 'web' && data.url) {
            const { Linking } = await import('react-native');
            await Linking.openURL(data.url);

            // Set a timeout to reset isLoading if user cancels OAuth or doesn't return
            // This prevents the loading state from persisting indefinitely
            // The timeout will be cleared if auth succeeds (in setSession or checkAuth)
            oauthTimeoutId = setTimeout(() => {
              const { isLoading, isAuthenticated } = get();
              // Only reset if still loading and not authenticated
              // (auth might have succeeded via deep link while app was in background)
              if (isLoading && !isAuthenticated) {
                set({ isLoading: false });
                console.log('OAuth timeout: Resetting loading state (user may have cancelled)');
              }
              oauthTimeoutId = null;
            }, OAUTH_TIMEOUT_MS);

            // Also listen for app state changes to check auth when app comes back to foreground
            let appStateSubscription: { remove: () => void } | null = null;
            const handleAppStateChange = async (nextAppState: string) => {
              if (nextAppState === 'active' && oauthTimeoutId) {
                // App came back to foreground, wait a moment for deep link to process
                setTimeout(async () => {
                  const { isLoading, isAuthenticated } = get();
                  if (isLoading && !isAuthenticated && oauthTimeoutId) {
                    // Check if we have a session now
                    try {
                      const client = await getSupabaseClient();
                      const { data: { session } } = await client.auth.getSession();
                      if (!session) {
                        // No session after returning to app, user likely cancelled
                        set({ isLoading: false });
                        if (oauthTimeoutId) {
                          clearTimeout(oauthTimeoutId);
                          oauthTimeoutId = null;
                        }
                        if (appStateSubscription) {
                          appStateSubscription.remove();
                          appStateSubscription = null;
                        }
                      }
                    } catch (error) {
                      // Error checking session, reset loading anyway
                      set({ isLoading: false });
                      if (oauthTimeoutId) {
                        clearTimeout(oauthTimeoutId);
                        oauthTimeoutId = null;
                      }
                      if (appStateSubscription) {
                        appStateSubscription.remove();
                        appStateSubscription = null;
                      }
                    }
                  }
                }, 1500); // Wait 1.5 seconds for deep link to process
              }
            };

            appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

            // Clean up listener after timeout
            setTimeout(() => {
              if (appStateSubscription) {
                appStateSubscription.remove();
                appStateSubscription = null;
              }
            }, OAUTH_TIMEOUT_MS);
          } else {
            // For web, the redirect happens automatically
            // The session will be handled by the auth state listener
            set({ isLoading: false });
          }

          // Log OAuth attempt (actual success will be logged by auth listener)
          logSecurityEvent.loginSuccess('', 'OAuth');
        } catch (error: any) {
          console.error('Google sign in error:', error);

          // Clear OAuth timeout if it exists
          if (oauthTimeoutId) {
            clearTimeout(oauthTimeoutId);
            oauthTimeoutId = null;
          }

          set({ isLoading: false });

          // Provide user-friendly error messages
          if (error.message?.includes('popup')) {
            throw new Error('Please enable popups for Google sign-in');
          } else if (error.message?.includes('network')) {
            throw new Error('Network error. Please check your connection and try again.');
          } else if (error.message?.includes('cancelled')) {
            throw new Error('Sign-in was cancelled');
          }

          throw error;
        }
      },

      signInWithEmail: async (email: string, password: string) => {
        // Sanitize email input
        const sanitizedEmail = sanitizeEmail(email);
        if (!sanitizedEmail) {
          const error = new Error('Invalid email address');
          logSecurityEvent.loginFailed(email, 'Invalid email format');
          throw error;
        }

        // Check for dev mock user credentials
        if (
          sanitizedEmail === DEV_MOCK_CREDENTIALS.email &&
          password === DEV_MOCK_CREDENTIALS.password
        ) {
          get().signInWithMockUser();
          return;
        }

        // Client-side rate limiting removed - Supabase handles rate limiting server-side
        // This prevents double rate limiting and allows Supabase's more sophisticated rate limiting to work

        // Check credentials before attempting auth
        if (!isSupabaseConfigured()) {
          const error = new Error(getCredentialsError());
          console.error('Email sign in error:', error);
          logSecurityEvent.loginFailed(sanitizedEmail, 'Supabase not configured');
          throw error;
        }

        try {
          set({ isLoading: true });
          const client = await getSupabaseClient();

          // Add timeout to prevent infinite loading
          const { data, error } = await withTimeout(
            client.auth.signInWithPassword({ email: sanitizedEmail, password }),
            AUTH_TIMEOUT_MS,
            'Sign in timed out. Please check your internet connection and try again.'
          );

          if (error) {
            logSecurityEvent.loginFailed(sanitizedEmail, error.message);
            throw error;
          }

          if (data.user) {
            // Fetch user profile with timeout
            const { data: profile } = await withTimeout(
              client.from('profiles').select('*').eq('id', data.user.id).single(),
              AUTH_TIMEOUT_MS,
              'Failed to load profile. Please try again.'
            );

            const user = mapSupabaseUser(data.user, profile);
            const emailVerified = data.user.email_confirmed_at !== null;

            if (!emailVerified) {
              await client.auth.signOut();
              throw new Error('Email not confirmed. Please check your inbox.');
            }

            const hasCompletedOnboarding = user.cultural_interests && user.cultural_interests.length > 0;

            set({
              user,
              session: data.session,
              isAuthenticated: true,
              emailVerified,
              isLoading: false,
              hasCompletedOnboarding,
            });

            // Log successful login
            logSecurityEvent.loginSuccess(user.user_id, user.email);
            createAuditLog(user.user_id, AuditAction.USER_LOGIN, { success: true });

            // Start session timeout
            if (data.session) {
              get().setSession(data.session);
            }
          } else {
            set({ isLoading: false });
          }
        } catch (error: any) {
          console.error('Email sign in error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // Mock user login for development testing
      // Usage: Call signInWithMockUser() or use credentials test@zora.dev / Test123!
      signInWithMockUser: () => {
        console.log('🧪 DEV: Signing in with mock user');
        set({
          user: DEV_MOCK_USER,
          session: null, // No real session for mock user
          isAuthenticated: true,
          isLoading: false,
          hasCompletedOnboarding: true, // Skip onboarding for testing
        });
      },

      signUpWithEmail: async (email: string, password: string, name: string) => {
        // Sanitize inputs
        const sanitizedEmail = sanitizeEmail(email);
        if (!sanitizedEmail) {
          throw new Error('Invalid email address');
        }

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
              email: sanitizedEmail,
              password,
              options: {
                data: {
                  full_name: name,
                },
                emailRedirectTo: 'zora://auth/verify-email',
              },
            }),
            AUTH_TIMEOUT_MS,
            'Sign up timed out. Please check your internet connection and try again.'
          );

          if (error) throw error;

          if (data.user) {
            // Profile is automatically created by the handle_new_user() trigger
            // But we should ensure it exists and has the correct data
            // Wait a moment for the trigger to complete, then fetch the profile
            await new Promise(resolve => setTimeout(resolve, 500));

            // Fetch or create profile with timeout
            let profile;
            try {
              const { data: existingProfile } = await withTimeout(
                client.from('profiles').select('*').eq('id', data.user.id).single(),
                AUTH_TIMEOUT_MS,
                'Failed to load profile. Please try again.'
              );
              profile = existingProfile;

              // If profile doesn't exist (trigger might have failed), create it
              if (!profile) {
                const { data: newProfile } = await withTimeout(
                  client.from('profiles').insert({
                    id: data.user.id,
                    email: data.user.email,
                    full_name: name,
                    membership_tier: 'bronze',
                    zora_credits: 5.0, // Welcome bonus
                    loyalty_points: 100,
                    referral_code: `ZORA${data.user.id.substring(0, 6).toUpperCase()}`,
                  }).select().single(),
                  AUTH_TIMEOUT_MS,
                  'Failed to create profile. Please try again.'
                );
                profile = newProfile;
              } else {
                // Update profile with signup data if needed
                if (!profile.full_name && name) {
                  try {
                    const { data: updatedProfile } = await client
                      .from('profiles')
                      .update({ full_name: name })
                      .eq('id', data.user.id)
                      .select()
                      .single();
                    profile = updatedProfile || { ...profile, full_name: name };
                  } catch (updateError) {
                    console.error('Failed to update profile full_name:', updateError);
                    // Continue with existing profile data
                    profile = { ...profile, full_name: name };
                  }
                }
              }
            } catch (profileError: any) {
              // If profile fetch fails, try to create it
              console.warn('Profile fetch failed, attempting to create:', profileError);
              try {
                const { data: newProfile } = await withTimeout(
                  client.from('profiles').insert({
                    id: data.user.id,
                    email: data.user.email,
                    full_name: name,
                    membership_tier: 'bronze',
                    zora_credits: 5.0,
                    loyalty_points: 100,
                    referral_code: `ZORA${data.user.id.substring(0, 6).toUpperCase()}`,
                  }).select().single(),
                  AUTH_TIMEOUT_MS,
                  'Failed to create profile. Please try again.'
                );
                profile = newProfile;
              } catch (createError) {
                console.error('Failed to create profile:', createError);
                // Continue anyway - profile might be created by trigger later
              }
            }

            const user = mapSupabaseUser(data.user, profile);
            const emailVerified = data.user.email_confirmed_at !== null;

            // Don't authenticate if email is not verified
            // User must verify email before they can log in
            if (!emailVerified) {
              // Sign out to clear any session
              await client.auth.signOut();
              set({
                user: null,
                session: null,
                isAuthenticated: false,
                emailVerified: false,
                isLoading: false,
              });
            } else {
              set({
                user,
                session: data.session,
                isAuthenticated: !!data.session,
                emailVerified,
                isLoading: false,
              });
            }

            // Log signup
            createAuditLog(user.user_id, AuditAction.USER_SIGNUP, { success: true });
            logSecurityEvent.emailVerificationSent(user.user_id, user.email);

            // Note: Supabase automatically sends verification email during signup,
            // so we don't need to call resendVerificationEmail here.
            // This prevents loading state issues when navigation happens immediately after signup.
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
        const { user } = get();
        try {
          set({ isLoading: true });
          const client = await getSupabaseClient();
          await client.auth.signOut();

          // Log logout
          if (user) {
            logSecurityEvent.logout(user.user_id, user.email);
            createAuditLog(user.user_id, AuditAction.USER_LOGOUT, { success: true });
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          sessionTimeoutManager.endSession();
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            emailVerified: false,
            sessionExpiringSoon: false,
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
            let profile;
            try {
              const { data: profileData } = await client
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              profile = profileData;

              // If profile doesn't exist (e.g., from OAuth), create it
              if (!profile) {
                const { data: newProfile } = await client
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    email: session.user.email,
                    full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                    avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
                    referral_code: `ZORA${session.user.id.substring(0, 6).toUpperCase()}`,
                    membership_tier: 'bronze',
                    zora_credits: 5.0,
                    loyalty_points: 100,
                  })
                  .select()
                  .single();
                profile = newProfile;
              } else {
                // Update profile with OAuth data if available and missing
                const updates: any = {};
                if (!profile.email && session.user.email) updates.email = session.user.email;
                if (!profile.full_name && session.user.user_metadata?.full_name) {
                  updates.full_name = session.user.user_metadata.full_name;
                }
                if (!profile.avatar_url && (session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture)) {
                  updates.avatar_url = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
                }

                if (Object.keys(updates).length > 0) {
                  const { data: updatedProfile } = await client
                    .from('profiles')
                    .update(updates)
                    .eq('id', session.user.id)
                    .select()
                    .single();
                  profile = updatedProfile || profile;
                }
              }
            } catch (profileError: any) {
              console.error('Profile fetch/creation error:', profileError);
              // Continue with basic user data if profile fetch fails
              profile = null;
            }

            const user = mapSupabaseUser(session.user, profile);
            const emailVerified = session.user.email_confirmed_at !== null;

            // Enforce email verification requirement (consistent with signInWithEmail)
            if (!emailVerified) {
              await client.auth.signOut();
              set({
                user: null,
                session: null,
                isAuthenticated: false,
                emailVerified: false,
                isLoading: false,
              });
              // Don't throw error here - just clear session and return
              // User will be redirected to login screen by ProtectedRoute
              return;
            }

            // Clear OAuth timeout if it exists (auth succeeded)
            if (oauthTimeoutId) {
              clearTimeout(oauthTimeoutId);
              oauthTimeoutId = null;
            }

            const hasCompletedOnboarding = user.cultural_interests && user.cultural_interests.length > 0;

            set({
              user,
              session,
              isAuthenticated: true,
              emailVerified,
              isLoading: false,
              hasCompletedOnboarding,
            });

            // Refresh session timeout
            get().setSession(session);
          } else {
            set({
              user: null,
              session: null,
              isAuthenticated: false,
              emailVerified: false,
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
        if (!user) throw new Error('Not authenticated');

        // If Supabase is not configured or using mock user, just update local state
        if (!isSupabaseConfigured() || !session) {
          set({
            user: {
              ...user,
              ...updates,
            },
          });
          return;
        }

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
            .eq('id', user.user_id)
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

      updatePassword: async (currentPassword: string, newPassword: string) => {
        const { session, user } = get();
        if (!user || !session) throw new Error('Not authenticated');

        // Check credentials before attempting password update
        if (!isSupabaseConfigured()) {
          const error = new Error(getCredentialsError());
          console.error('Password update error:', error);
          throw error;
        }

        try {
          set({ isLoading: true });
          const client = await getSupabaseClient();

          // First, verify the current password by attempting to sign in
          // Note: This creates a new session, but we'll restore the original session after
          const { error: verifyError } = await client.auth.signInWithPassword({
            email: user.email,
            password: currentPassword,
          });

          if (verifyError) {
            throw new Error('Current password is incorrect');
          }

          // Update password with timeout
          const { error: updateError } = await withTimeout(
            client.auth.updateUser({ password: newPassword }),
            AUTH_TIMEOUT_MS,
            'Password update timed out. Please check your internet connection and try again.'
          );

          if (updateError) throw updateError;

          // Password updated successfully
          logSecurityEvent.passwordChange(user.user_id, user.email);
          createAuditLog(user.user_id, AuditAction.PASSWORD_CHANGE, { success: true });
          createSecurityAlert.passwordChange(user.user_id);
        } catch (error: any) {
          console.error('Password update error:', error);
          createAuditLog(user.user_id, AuditAction.PASSWORD_CHANGE, {
            success: false,
            errorMessage: error.message,
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      verifyEmail: async () => {
        const { user } = get();
        if (!user) throw new Error('Not authenticated');

        if (!isSupabaseConfigured()) {
          throw new Error(getCredentialsError());
        }

        try {
          set({ isLoading: true });
          const client = await getSupabaseClient();

          // Check current email verification status
          const { data: { user: authUser } } = await client.auth.getUser();

          if (authUser?.email_confirmed_at) {
            set({ emailVerified: true });
            logSecurityEvent.emailVerified(user.user_id, user.email);
            createAuditLog(user.user_id, AuditAction.EMAIL_VERIFICATION, { success: true });
            return;
          }

          // If not verified, user needs to click link in email
          throw new Error('Please check your email and click the verification link');
        } catch (error: any) {
          console.error('Email verification error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      resendVerificationEmail: async () => {
        const { user } = get();
        if (!user) throw new Error('Not authenticated');

        if (!isSupabaseConfigured()) {
          throw new Error(getCredentialsError());
        }

        try {
          set({ isLoading: true });
          const client = await getSupabaseClient();

          const { error } = await client.auth.resend({
            type: 'signup',
            email: user.email,
            options: {
              emailRedirectTo: 'zora://auth/verify-email',
            },
          });

          if (error) throw error;

          logSecurityEvent.emailVerificationSent(user.user_id, user.email);
        } catch (error: any) {
          console.error('Resend verification email error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      refreshSession: async () => {
        const { session, user } = get();
        if (!session) return;

        try {
          const client = await getSupabaseClient();
          const { data, error } = await client.auth.refreshSession();

          if (error) throw error;

          if (data.session) {
            // Reset sessionExpiringSoon flag when session is refreshed
            set({ sessionExpiringSoon: false });
            get().setSession(data.session);

            // Log session refresh with actual user info
            if (user) {
              securityLogger.log({
                type: SecurityEventType.SESSION_REFRESHED,
                userId: user.user_id,
                email: user.email,
                severity: 'low',
              });
            }

            sessionTimeoutManager.refreshSession();
          }
        } catch (error) {
          console.error('Session refresh error:', error);
          // If refresh fails, logout user
          get().logout();
        }
      },
    }),
    {
      name: 'zora-auth-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        user: state.user,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        // We don't persist session here as Supabase helper handles its own persistence
        // We don't persist isLoading, error, etc.
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Error rehydrating auth store:', error);
          return;
        }
        // If a user was persisted, set isLoading to true so ProtectedRoute
        // waits for checkAuth() to complete before making routing decisions
        if (state?.user) {
          state.isLoading = true;
        }
      },
    }
  )
);

export default useAuthStore;
