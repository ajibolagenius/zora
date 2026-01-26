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
  const { checkAuth, isAuthenticated } = useAuthStore();

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
          
          // Wait a moment for auth state to update
          setTimeout(() => {
            if (isAuthenticated) {
              router.replace('/(tabs)');
            } else {
              router.replace('/(auth)/login');
            }
          }, 500);
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
  }, [router, checkAuth, isAuthenticated]);

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
