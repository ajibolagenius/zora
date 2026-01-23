import React, { useEffect, useState } from 'react';
import { Slot, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Colors } from '../constants/colors';
import { useAuthStore } from '../stores/authStore';

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.logo}>ZORA</Text>
      <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
      <StatusBar style="light" />
    </View>
  );
}

export default function RootLayout() {
  const { checkAuth } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        await checkAuth();
      } catch (e) {
        console.log('Init error:', e);
      } finally {
        setInitializing(false);
      }
    };

    // Timeout fallback
    const timeoutId = setTimeout(() => {
      setInitializing(false);
    }, 2000);

    initApp().finally(() => clearTimeout(timeoutId));

    return () => clearTimeout(timeoutId);
  }, []);

  if (initializing) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Slot />
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
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 6,
  },
});
