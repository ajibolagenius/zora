import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Animated,
    Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    User,
    Envelope,
    Lock,
    Eye,
    EyeSlash,
    Check,
    GoogleLogo,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Heights } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { ErrorMessages, Placeholders } from '../../constants';
import { useAuthStore } from '../../stores/authStore';
import { useToast } from '../../components/ui';
import { getSupabaseClient, isSupabaseConfigured } from '../../lib/supabase';

type AuthMode = 'signin' | 'signup';

export default function LoginScreen() {
    const router = useRouter();
    const { signInWithGoogle, signInWithEmail, signUpWithEmail, isLoading } = useAuthStore();
    const { showToast } = useToast();
    const [mode, setMode] = useState<AuthMode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);
    
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    const loading = isLoading || localLoading;
    
    // Entrance animation
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleGoogleLogin = async () => {
        try {
            setLocalLoading(true);
            await signInWithGoogle();
            // Navigation will be handled by auth state change listener
        } catch (error: any) {
            console.error('Google login error:', error);
            showToast(
                error.message || 'Unable to sign in with Google',
                'error'
            );
        } finally {
            setLocalLoading(false);
        }
    };


    const handleEmailAuth = async () => {
        if (!email || !password) {
            showToast(ErrorMessages.auth.missingFields, 'error');
            return;
        }

        if (mode === 'signup' && !name) {
            showToast(ErrorMessages.auth.missingName, 'error');
            return;
        }

        try {
            setLocalLoading(true);

            if (mode === 'signin') {
                await signInWithEmail(email, password);
                // Login → home screen
                router.replace('/(tabs)');
            } else {
                await signUpWithEmail(email, password, name);
                // Register → onboarding
                router.replace('/onboarding/heritage');
            }
        } catch (error: any) {
            console.error('Auth error:', error);
            
            // Handle specific error cases with user-friendly messages
            let errorMessage = error.message || ErrorMessages.auth.generic;
            let errorType: 'error' | 'warning' | 'info' = 'error';
            let action: { label: string; onPress: () => void } | undefined;

            // Check for email not confirmed error
            if (error.message?.includes('Email not confirmed') || error.message?.includes('email_not_confirmed')) {
                errorMessage = 'Please verify your email address before signing in. Check your inbox for the confirmation link.';
                errorType = 'warning';
                action = {
                    label: 'Resend Email',
                    onPress: async () => {
                        try {
                            if (!isSupabaseConfigured()) {
                                showToast('Unable to resend verification email. Please try again later.', 'error');
                                return;
                            }
                            const client = await getSupabaseClient();
                            const { error: resendError } = await client.auth.resend({
                                type: 'signup',
                                email: email,
                                options: {
                                    emailRedirectTo: Platform.OS === 'web' 
                                        ? (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'http://localhost:3000/auth/callback')
                                        : 'zoramarket://auth/callback',
                                },
                            });
                            if (resendError) throw resendError;
                            showToast('Verification email sent! Please check your inbox.', 'success');
                        } catch (resendError: any) {
                            showToast(resendError.message || 'Failed to resend verification email', 'error');
                        }
                    },
                };
            } else if (error.message?.includes('Invalid login credentials') || error.message?.includes('invalid_credentials')) {
                errorMessage = 'Invalid email or password. Please check your credentials and try again.';
            } else if (error.message?.includes('Too many login attempts') || error.message?.includes('rate_limit')) {
                errorMessage = 'Too many login attempts. Please wait a few minutes before trying again.';
                errorType = 'warning';
            } else if (error.message?.includes('network') || error.message?.includes('Network')) {
                errorMessage = 'Network error. Please check your internet connection and try again.';
            }

            showToast(errorMessage, errorType, undefined, action);
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >

                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                        {/* Auth Mode Tabs */}
                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                style={[styles.tab, mode === 'signin' && styles.tabActive]}
                                onPress={() => setMode('signin')}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.tabText, mode === 'signin' && styles.tabTextActive]}>
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, mode === 'signup' && styles.tabActive]}
                                onPress={() => setMode('signup')}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                                    Sign Up
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Welcome Text */}
                        <View style={styles.welcomeContainer}>
                            <Text style={styles.welcomeTitle}>
                                {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                            </Text>
                            <Text style={styles.welcomeSubtitle}>
                                {mode === 'signin'
                                    ? 'Enter your details below to access your account and start shopping.'
                                    : 'Join Zora to discover authentic African products and connect with vendors.'}
                            </Text>
                        </View>

                        {/* Input Fields */}
                        <View style={styles.inputContainer}>
                            {mode === 'signup' && (
                                <View style={styles.inputWrapper}>
                                    <User size={20} color={Colors.textMuted} weight="duotone" />
                                    <TextInput
                                        style={styles.input}
                                        placeholder={Placeholders.auth.fullName}
                                        placeholderTextColor={Colors.textMuted}
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                    />
                                </View>
                            )}

                            <View style={styles.inputWrapper}>
                                <Envelope size={20} color={Colors.textMuted} weight="duotone" />
                                <TextInput
                                    style={styles.input}
                                    placeholder={Placeholders.auth.email}
                                    placeholderTextColor={Colors.textMuted}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputWrapper}>
                                <Lock size={20} color={Colors.textMuted} weight="duotone" />
                                <TextInput
                                    style={styles.input}
                                    placeholder={Placeholders.auth.password}
                                    placeholderTextColor={Colors.textMuted}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity 
                                    onPress={() => setShowPassword(!showPassword)}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    {showPassword ? (
                                        <Eye size={20} color={Colors.textMuted} weight="duotone" />
                                    ) : (
                                        <EyeSlash size={20} color={Colors.textMuted} weight="duotone" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Remember Me & Forgot Password */}
                        {mode === 'signin' && (
                            <View style={styles.optionsRow}>
                                <TouchableOpacity
                                    style={styles.checkboxContainer}
                                    onPress={() => setRememberMe(!rememberMe)}
                                    activeOpacity={0.8}
                                >
                                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                        {rememberMe && (
                                            <Check size={12} color={Colors.textPrimary} weight="bold" />
                                        )}
                                    </View>
                                    <Text style={styles.checkboxLabel}>Remember me</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    activeOpacity={0.8}
                                    onPress={() => router.push('/(auth)/forgot-password')}
                                >
                                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Sign In/Up Button */}
                        <TouchableOpacity
                            style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                            onPress={handleEmailAuth}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <ActivityIndicator color={Colors.textPrimary} />
                            ) : (
                                <Text style={styles.primaryButtonText}>
                                    {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>Or continue with</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Google Login Button */}
                        <TouchableOpacity
                            style={[styles.googleButton, loading && styles.googleButtonDisabled]}
                            onPress={handleGoogleLogin}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <GoogleLogo size={24} color="#DB4437" weight="bold" />
                            <Text style={styles.googleButtonText}>Continue with Google</Text>
                        </TouchableOpacity>

                        {/* Terms */}
                        <Text style={styles.terms}>
                            By signing in, you agree to our{' '}
                            <Text style={styles.termsLink}>Terms of Service</Text>
                            {' '}and{' '}
                            <Text style={styles.termsLink}>Privacy Policy</Text>.
                        </Text>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundDark,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing['2xl'],
    },
    
    // Tab Container - Pill style
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.full,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        borderRadius: BorderRadius.full,
    },
    tabActive: {
        backgroundColor: Colors.primary,
    },
    tabText: {
        fontFamily: FontFamily.bodySemiBold,
        color: Colors.textMuted,
        fontSize: FontSize.small,
    },
    tabTextActive: {
        color: Colors.textPrimary,
    },
    
    // Welcome Section
    welcomeContainer: {
        marginTop: Spacing['2xl'],
        marginBottom: Spacing.xl,
    },
    welcomeTitle: {
        fontFamily: FontFamily.display,
        fontSize: FontSize.h1,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    welcomeSubtitle: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
        lineHeight: 22,
    },
    
    // Input Fields - Per Design System (48px height, 8px radius)
    inputContainer: {
        gap: Spacing.base,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.md, // 8px per Design System
        borderWidth: 1,
        borderColor: Colors.borderDark,
        paddingHorizontal: Spacing.base,
        height: Heights.input, // 48px per Design System
        gap: Spacing.md,
    },
    input: {
        flex: 1,
        fontFamily: FontFamily.body,
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        height: '100%',
    },
    
    // Options Row
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.base,
        marginBottom: Spacing.lg,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: BorderRadius.sm,
        borderWidth: 1.5, // Per Design System
        borderColor: 'rgba(255, 255, 255, 0.3)', // 30% opacity
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    checkboxLabel: {
        fontFamily: FontFamily.body,
        color: Colors.textMuted,
        fontSize: FontSize.small,
    },
    forgotPassword: {
        fontFamily: FontFamily.bodySemiBold,
        color: Colors.primary,
        fontSize: FontSize.small,
    },
    
    // Primary Button - Per Design System (48px height, 12px radius)
    primaryButton: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.lg,
        height: Heights.button, // 48px per Design System
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Spacing.lg,
    },
    primaryButtonDisabled: {
        opacity: 0.7,
    },
    primaryButtonText: {
        fontFamily: FontFamily.bodyBold,
        color: Colors.textPrimary,
        fontSize: FontSize.body,
    },
    
    // Divider
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.xl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.white10,
    },
    dividerText: {
        fontFamily: FontFamily.body,
        color: Colors.textMuted,
        fontSize: FontSize.small,
        marginHorizontal: Spacing.md,
    },
    
    // Google Button - Major/Primary social login
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.textPrimary,
        borderRadius: BorderRadius.lg,
        height: Heights.button, // 48px per Design System
        gap: Spacing.sm,
        marginTop: Spacing.sm,
    },
    googleButtonDisabled: {
        opacity: 0.7,
    },
    googleButtonText: {
        fontFamily: FontFamily.bodyBold,
        color: Colors.backgroundDark,
        fontSize: FontSize.body,
    },
    
    // Terms
    terms: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
        textAlign: 'center',
        marginTop: Spacing['2xl'],
        lineHeight: 20,
        paddingHorizontal: Spacing.base,
    },
    termsLink: {
        color: Colors.primary,
        fontFamily: FontFamily.bodyMedium,
    },
});
