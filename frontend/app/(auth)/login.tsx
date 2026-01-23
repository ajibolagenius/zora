import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Button } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001';

export default function LoginScreen() {
  const router = useRouter();
  const { login, setLoading } = useAuthStore();
  const [loading, setLocalLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLocalLoading(true);
      
      // Create platform-specific redirect URL
      const redirectUrl = Platform.OS === 'web'
        ? `${BACKEND_URL}/`
        : Linking.createURL('/');
      
      const authUrl = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
      
      if (Platform.OS === 'web') {
        // For web, redirect directly
        window.location.href = authUrl;
      } else {
        // For mobile, use WebBrowser
        const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
        
        if (result.type === 'success' && result.url) {
          // Extract session_id from the returned URL
          const sessionId = extractSessionId(result.url);
          if (sessionId) {
            setLoading(true);
            await login(sessionId);
            router.replace('/(tabs)');
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLocalLoading(false);
    }
  };

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

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>ZORA</Text>
          <Text style={styles.tagline}>African Market</Text>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>
            Sign in to access your orders, saved items, and exclusive deals
          </Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textPrimary} />
          ) : (
            <>
              <MaterialCommunityIcons name="google" size={24} color={Colors.textPrimary} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Skip Button */}
        <Button
          title="Browse as Guest"
          variant="outline"
          fullWidth
          onPress={handleSkip}
        />

        {/* Terms */}
        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  logo: {
    fontSize: 56,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    letterSpacing: 8,
  },
  tagline: {
    fontSize: FontSize.body,
    color: Colors.secondary,
    marginTop: 4,
    letterSpacing: 2,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  welcomeTitle: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: FontSize.body,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardDark,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  googleButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderDark,
  },
  dividerText: {
    color: Colors.textMuted,
    marginHorizontal: Spacing.md,
    fontSize: FontSize.small,
  },
  terms: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primary,
  },
});
