import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getSupabaseClient, isSupabaseConfigured } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { Colors } from '../../constants/colors';

/**
 * OAuth Callback Handler
 * Handles OAuth redirects from Google and other providers
 * This route is called when the user returns from OAuth flow
 */
export default function AuthCallbackScreen() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!isSupabaseConfigured()) {
        router.replace('/(auth)/login');
        return;
      }

      try {
        const client = await getSupabaseClient();
        
        // Get the session from the URL hash (for web) or from storage (for native)
        // Supabase automatically handles this, but we need to check the session
        const { data: { session }, error } = await client.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.replace('/(auth)/login');
          return;
        }

        if (session) {
          // Session exists, refresh auth state
          await checkAuth();
          
          // Wait a moment for any async state updates to complete
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Check auth state and onboarding status after the delay
          const { isAuthenticated, hasCompletedOnboarding, emailVerified } = useAuthStore.getState();
          
          if (isAuthenticated && emailVerified) {
            // User is authenticated and verified, check onboarding
            if (hasCompletedOnboarding) {
              router.replace('/(tabs)');
            } else {
              // First time login after verification, redirect to onboarding
              router.replace('/onboarding/heritage');
            }
          } else {
            // Not authenticated or not verified, redirect to login
            router.replace('/(auth)/login');
          }
        } else {
          // No session, redirect to login
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/(auth)/login');
      }
    };

    handleAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
  },
});
