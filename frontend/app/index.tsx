import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../constants/typography';
import { useAuthStore } from '../stores/authStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Subtle African-inspired geometric pattern positions
const GEOMETRIC_PATTERNS = [
  { top: '8%', left: '10%', rotation: '45deg', size: 12 },
  { top: '12%', right: '15%', rotation: '0deg', size: 8 },
  { top: '25%', left: '5%', rotation: '30deg', size: 10 },
  { top: '35%', right: '8%', rotation: '60deg', size: 14 },
  { bottom: '30%', left: '12%', rotation: '15deg', size: 10 },
  { bottom: '20%', right: '10%', rotation: '45deg', size: 12 },
  { bottom: '12%', left: '20%', rotation: '0deg', size: 8 },
  { bottom: '8%', right: '25%', rotation: '30deg', size: 10 },
];

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();
  
  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const iconGlow = useRef(new Animated.Value(0.3)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslate = useRef(new Animated.Value(15)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;
  const decorativeOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  
  // Loader dot animations
  const dot1Translate = useRef(new Animated.Value(0)).current;
  const dot2Translate = useRef(new Animated.Value(0)).current;
  const dot3Translate = useRef(new Animated.Value(0)).current;

  // Animated loader dots
  const startLoaderAnimation = () => {
    const createBounce = (animatedValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: -8,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 300,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      createBounce(dot1Translate, 0),
      createBounce(dot2Translate, 150),
      createBounce(dot3Translate, 300),
    ]).start();
  };

  // Icon glow pulse animation
  const startGlowAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconGlow, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(iconGlow, {
          toValue: 0.3,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    // Orchestrated animation sequence
    Animated.sequence([
      // Decorative elements fade in first
      Animated.timing(decorativeOpacity, {
        toValue: 0.15,
        duration: 500,
        useNativeDriver: true,
      }),
      // Logo appears with spring
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),
      // Tagline slides in smoothly
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(taglineTranslate, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Subtitle fades in
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      // Loader appears
      Animated.timing(loaderOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      startLoaderAnimation();
      startGlowAnimation();
    });

    // Navigate after 5 seconds with fade-out
    const timer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        if (isAuthenticated) {
          if (hasCompletedOnboarding) {
            router.replace('/(tabs)');
          } else {
            router.replace('/onboarding/heritage');
          }
        } else {
          router.replace('/(auth)/login');
        }
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasCompletedOnboarding]);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      {/* Gradient background */}
      <LinearGradient
        colors={['#1a1209', Colors.backgroundDark, '#2a1a10']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Subtle geometric patterns (African-inspired) */}
      {GEOMETRIC_PATTERNS.map((pattern, index) => (
        <Animated.View
          key={index}
          style={[
            styles.geometricShape,
            {
              top: pattern.top,
              bottom: pattern.bottom,
              left: pattern.left,
              right: pattern.right,
              opacity: decorativeOpacity,
              transform: [{ rotate: pattern.rotation }],
            },
          ]}
        >
          <View style={[styles.diamond, { width: pattern.size, height: pattern.size }]} />
        </Animated.View>
      ))}

      {/* Decorative rings */}
      <Animated.View style={[styles.decorativeRing, styles.ringOuter, { opacity: decorativeOpacity }]} />
      <Animated.View style={[styles.decorativeRing, styles.ringInner, { opacity: decorativeOpacity }]} />

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
          {/* Icon with glow effect */}
          <View style={styles.iconContainer}>
            <Animated.View style={[styles.iconGlow, { opacity: iconGlow }]} />
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons name="basket" size={44} color={Colors.primary} />
            </View>
          </View>
          
          {/* Brand name */}
          <Text style={styles.logo}>ZORA</Text>
        </Animated.View>

        {/* Tagline with divider */}
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
            <View style={styles.dividerDiamond} />
            <View style={styles.dividerLine} />
          </View>
          <Text style={styles.tagline}>AFRICAN MARKET</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
          Connecting the Diaspora
        </Animated.Text>
      </View>

      {/* Footer with animated loader */}
      <Animated.View style={[styles.footer, { opacity: loaderOpacity }]}>
        <View style={styles.loader}>
          <Animated.View 
            style={[
              styles.loaderDot, 
              { transform: [{ translateY: dot1Translate }] }
            ]} 
          />
          <Animated.View 
            style={[
              styles.loaderDot, 
              { transform: [{ translateY: dot2Translate }] }
            ]} 
          />
          <Animated.View 
            style={[
              styles.loaderDot, 
              { transform: [{ translateY: dot3Translate }] }
            ]} 
          />
        </View>
        <Text style={styles.footerText}>Premium African Groceries</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Geometric patterns (African-inspired diamonds)
  geometricShape: {
    position: 'absolute',
  },
  diamond: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    transform: [{ rotate: '45deg' }],
  },
  
  // Decorative rings
  decorativeRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 999,
  },
  ringOuter: {
    width: width * 1.2,
    height: width * 1.2,
    opacity: 0.3,
  },
  ringInner: {
    width: width * 0.85,
    height: width * 0.85,
    opacity: 0.2,
  },
  
  // Main content
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
  },
  
  // Icon with glow
  iconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  iconGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    opacity: 0.15,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary15, // Close to 0.12
    borderWidth: 1,
    borderColor: Colors.primary + '40', // 25% opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Brand name
  logo: {
    fontFamily: FontFamily.displayExtraBold,
    fontSize: 64,
    color: Colors.primary,
    letterSpacing: 14,
    includeFontPadding: false,
  },
  
  // Tagline section
  taglineContainer: {
    alignItems: 'center',
    marginTop: 6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dividerLine: {
    width: 36,
    height: 1,
    backgroundColor: Colors.secondary,
    marginHorizontal: 10,
  },
  dividerDiamond: {
    width: 6,
    height: 6,
    backgroundColor: Colors.secondary,
    transform: [{ rotate: '45deg' }],
  },
  tagline: {
    fontFamily: FontFamily.montserratSemiBold,
    fontSize: FontSize.small,
    color: Colors.secondary,
    letterSpacing: LetterSpacing.widest + 3,
  },
  
  // Subtitle
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textMuted,
    marginTop: 20,
    letterSpacing: LetterSpacing.wide,
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 56,
    alignItems: 'center',
  },
  loader: {
    flexDirection: 'row',
    marginBottom: 14,
    height: 20,
    alignItems: 'flex-end',
  },
  loaderDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.primary,
    marginHorizontal: 5,
  },
  footerText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    letterSpacing: LetterSpacing.wide,
  },
});
