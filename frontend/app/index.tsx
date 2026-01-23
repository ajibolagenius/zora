import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { useAuthStore } from '../stores/authStore';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Animate logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after delay
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        if (hasCompletedOnboarding) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      } else {
        router.replace('/(auth)/login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasCompletedOnboarding]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.logo}>ZORA</Text>
        <Text style={styles.tagline}>Connecting the Diaspora</Text>
      </Animated.View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>African Market</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 64,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    letterSpacing: 8,
  },
  tagline: {
    fontSize: FontSize.body,
    color: Colors.secondary,
    marginTop: 8,
    letterSpacing: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
  },
  footerText: {
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
});
