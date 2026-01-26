import { useEffect, useCallback, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
} from '@expo-google-fonts/montserrat';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Colors } from '../constants/colors';
import { QueryProvider } from '../providers/QueryProvider';
import { useAuthStore } from '../stores/authStore';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import '../global.css';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontTimeout, setFontTimeout] = useState(false);
  
  const [fontsLoaded, fontError] = useFonts({
    // Montserrat - Headlines & Display
    'Montserrat-Regular': Montserrat_400Regular,
    'Montserrat-Medium': Montserrat_500Medium,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Bold': Montserrat_700Bold,
    'Montserrat-ExtraBold': Montserrat_800ExtraBold,
    // Poppins - Body Text & UI
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  // Fallback timeout for font loading (especially for web)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!fontsLoaded && !fontError) {
        console.warn('Font loading timeout - proceeding with system fonts');
        setFontTimeout(true);
      }
    }, 8000); // 8 second timeout

    return () => clearTimeout(timeout);
  }, [fontsLoaded, fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError || fontTimeout) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, fontTimeout]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  // Initialize Supabase client early (especially important for native platforms)
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // Initialize client early to ensure it's ready when services need it
    getSupabaseClient().catch((error) => {
      console.error('Failed to initialize Supabase client:', error);
    });
  }, []);

  // Auth state listener for session management
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    const setupAuthListener = async () => {
      try {
        const client = await getSupabaseClient();
        const { data } = client.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;

            const { checkAuth, setSession, setUser, logout } = useAuthStore.getState();

            switch (event) {
              case 'SIGNED_IN':
              case 'TOKEN_REFRESHED':
                // Refresh auth state when session changes
                await checkAuth();
                break;
              case 'SIGNED_OUT':
                // Clear auth state on logout
                setUser(null);
                setSession(null);
                break;
              case 'USER_UPDATED':
                // Refresh user data when profile is updated
                await checkAuth();
                break;
              default:
                // For other events, just refresh auth state
                await checkAuth();
            }
          }
        );
        // onAuthStateChange returns { data: { subscription } }
        // Only set subscription if component is still mounted
        if (mounted) {
          subscription = data.subscription;
        } else {
          // Component unmounted before listener was set up, unsubscribe immediately
          data.subscription.unsubscribe();
        }
      } catch (error) {
        console.error('Failed to setup auth state listener:', error);
      }
    };

    setupAuthListener();

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Show loading indicator while fonts are loading
  if (!fontsLoaded && !fontError && !fontTimeout) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <QueryProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.backgroundDark },
        }}
      />
    </QueryProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
  },
});
