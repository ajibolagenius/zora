import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { useAuthStore } from '../stores/authStore';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

export default function RootLayout() {
  const { checkAuth, isLoading, login, setLoading } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      // Check for session_id in URL (from OAuth redirect)
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          const sessionId = extractSessionId(url);
          if (sessionId) {
            await login(sessionId);
            setInitializing(false);
            return;
          }
        }
      } catch (e) {
        console.log('Error checking initial URL:', e);
      }

      // Check existing auth
      await checkAuth();
      setInitializing(false);
    };

    initApp();

    // Listen for deep links
    const subscription = Linking.addEventListener('url', async (event) => {
      const sessionId = extractSessionId(event.url);
      if (sessionId) {
        setLoading(true);
        await login(sessionId);
      }
    });

    return () => subscription.remove();
  }, []);

  // Extract session_id from URL hash or query
  const extractSessionId = (url: string): string | null => {
    if (!url) return null;
    
    // Check hash
    const hashMatch = url.match(/#session_id=([^&]+)/);
    if (hashMatch) return hashMatch[1];
    
    // Check query
    const queryMatch = url.match(/[?&]session_id=([^&]+)/);
    if (queryMatch) return queryMatch[1];
    
    return null;
  };

  if (initializing || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.backgroundDark },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="vendor/[id]" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="cart" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="checkout" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="order/[id]" options={{ headerShown: false, presentation: 'card' }} />
      </Stack>
    </>
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
