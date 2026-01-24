import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { useAuthStore } from '../stores/authStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();
  
  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslate = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;
  const decorativeOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Orchestrated animation sequence
    Animated.sequence([
      // Logo appears
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // Tagline slides in
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(taglineTranslate, {
          toValue: 0,
          friction: 10,
          useNativeDriver: true,
        }),
      ]),
      // Subtitle and decorative elements
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(decorativeOpacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Loader appears
      Animated.timing(loaderOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after animation completes
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        if (hasCompletedOnboarding) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding/heritage');
        }
      } else {
        router.replace('/(auth)/login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasCompletedOnboarding]);

  return (
    <View style={styles.container}>
      {/* Background decorative elements */}
      <Animated.View style={[styles.decorativeCircle, styles.circleTopRight, { opacity: decorativeOpacity }]} />
      <Animated.View style={[styles.decorativeCircle, styles.circleBottomLeft, { opacity: decorativeOpacity }]} />
      
      {/* Pattern overlay */}
      <Animated.View style={[styles.patternOverlay, { opacity: decorativeOpacity }]}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={i} style={styles.patternDot} />
        ))}
      </Animated.View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoWrapper}>
            <MaterialCommunityIcons name="basket" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.logo}>ZORA</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineTranslate }],
            },
          ]}
        >
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <MaterialCommunityIcons name="diamond-stone" size={16} color={Colors.secondary} />
            <View style={styles.dividerLine} />
          </View>
          <Text style={styles.tagline}>AFRICAN MARKET</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
          Connecting the Diaspora
        </Animated.Text>
      </View>

      {/* Footer */}
      <Animated.View style={[styles.footer, { opacity: loaderOpacity }]}>
        <View style={styles.loader}>
          <Animated.View style={[styles.loaderDot, styles.loaderDot1]} />
          <Animated.View style={[styles.loaderDot, styles.loaderDot2]} />
          <Animated.View style={[styles.loaderDot, styles.loaderDot3]} />
        </View>
        <Text style={styles.footerText}>Premium African Groceries</Text>
      </Animated.View>
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
  decorativeCircle: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  circleTopRight: {
    top: -width * 0.4,
    right: -width * 0.3,
  },
  circleBottomLeft: {
    bottom: -width * 0.4,
    left: -width * 0.3,
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 40,
  },
  patternDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    margin: 30,
    opacity: 0.2,
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(204, 0, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    fontSize: 72,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    letterSpacing: 12,
  },
  taglineContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dividerLine: {
    width: 40,
    height: 1,
    backgroundColor: Colors.secondary,
    marginHorizontal: 12,
  },
  tagline: {
    fontSize: FontSize.small,
    color: Colors.secondary,
    letterSpacing: 6,
    fontWeight: FontWeight.semiBold,
  },
  subtitle: {
    fontSize: FontSize.body,
    color: Colors.textMuted,
    marginTop: 24,
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  loader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  loaderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginHorizontal: 4,
  },
  loaderDot1: {
    opacity: 0.4,
  },
  loaderDot2: {
    opacity: 0.7,
  },
  loaderDot3: {
    opacity: 1,
  },
  footerText: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
});
