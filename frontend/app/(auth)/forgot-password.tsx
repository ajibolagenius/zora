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
    Alert,
    Animated,
    Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Envelope,
    PaperPlaneTilt,
    ShieldCheck,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Heights } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { useAuthStore } from '../../stores/authStore';

type ScreenState = 'input' | 'sent';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { resetPassword, isLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [screenState, setScreenState] = useState<ScreenState>('input');
    const [localLoading, setLocalLoading] = useState(false);
    
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;
    const iconScale = useRef(new Animated.Value(0)).current;

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

    // Success animation
    const playSuccessAnimation = () => {
        iconScale.setValue(0);
        Animated.spring(iconScale, {
            toValue: 1,
            friction: 5,
            tension: 80,
            useNativeDriver: true,
        }).start();
    };

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Missing Email', 'Please enter your email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address');
            return;
        }

        try {
            setLocalLoading(true);
            
            // Call reset password function if available
            if (resetPassword) {
                await resetPassword(email);
            }
            
            // Show success state
            setScreenState('sent');
            playSuccessAnimation();
        } catch (error: any) {
            console.error('Reset password error:', error);
            Alert.alert(
                'Reset Failed',
                error.message || 'Unable to send reset email. Please try again.'
            );
        } finally {
            setLocalLoading(false);
        }
    };

    const handleBackToLogin = () => {
        router.back();
    };

    const handleTryAgain = () => {
        setScreenState('input');
        setEmail('');
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
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity 
                            style={styles.backButton} 
                            onPress={handleBackToLogin}
                            activeOpacity={0.8}
                        >
                            <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
                        </TouchableOpacity>
                    </View>

                    <Animated.View 
                        style={[
                            styles.content,
                            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                        ]}
                    >
                        {screenState === 'input' ? (
                            <>
                                {/* Icon */}
                                <View style={styles.iconContainer}>
                                    <View style={styles.iconWrapper}>
                                        <ShieldCheck size={48} color={Colors.primary} weight="duotone" />
                                    </View>
                                </View>

                                {/* Title */}
                                <Text style={styles.title}>Forgot Password?</Text>
                                <Text style={styles.subtitle}>
                                    No worries! Enter your email address below and we'll send you a link to reset your password.
                                </Text>

                                {/* Email Input */}
                                <View style={styles.inputContainer}>
                                    <View style={styles.inputWrapper}>
                                        <Envelope size={20} color={Colors.textMuted} weight="duotone" />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Email Address"
                                            placeholderTextColor={Colors.textMuted}
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoFocus
                                        />
                                    </View>
                                </View>

                                {/* Reset Button */}
                                <TouchableOpacity
                                    style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                                    onPress={handleResetPassword}
                                    disabled={loading}
                                    activeOpacity={0.8}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={Colors.textPrimary} />
                                    ) : (
                                        <Text style={styles.primaryButtonText}>Send Reset Link</Text>
                                    )}
                                </TouchableOpacity>

                                {/* Back to Login Link */}
                                <TouchableOpacity 
                                    style={styles.linkButton}
                                    onPress={handleBackToLogin}
                                    activeOpacity={0.8}
                                >
                                    <ArrowLeft size={16} color={Colors.textMuted} weight="bold" />
                                    <Text style={styles.linkButtonText}>Back to Sign In</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                {/* Success State */}
                                <Animated.View 
                                    style={[
                                        styles.iconContainer,
                                        { transform: [{ scale: iconScale }] }
                                    ]}
                                >
                                    <View style={styles.successIconWrapper}>
                                        <PaperPlaneTilt size={48} color={Colors.success} weight="duotone" />
                                    </View>
                                </Animated.View>

                                <Text style={styles.title}>Check Your Email</Text>
                                <Text style={styles.subtitle}>
                                    We've sent a password reset link to{'\n'}
                                    <Text style={styles.emailHighlight}>{email}</Text>
                                </Text>

                                <Text style={styles.instructionText}>
                                    Click the link in the email to reset your password. If you don't see the email, check your spam folder.
                                </Text>

                                {/* Open Email Button */}
                                <TouchableOpacity
                                    style={styles.primaryButton}
                                    onPress={handleBackToLogin}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.primaryButtonText}>Back to Sign In</Text>
                                </TouchableOpacity>

                                {/* Resend Link */}
                                <TouchableOpacity 
                                    style={styles.linkButton}
                                    onPress={handleTryAgain}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.linkButtonText}>Didn't receive email? </Text>
                                    <Text style={styles.linkButtonTextHighlight}>Resend</Text>
                                </TouchableOpacity>
                            </>
                        )}
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
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing['3xl'],
    },
    
    // Header - Transparent style per Design System
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.cardDark,
        borderWidth: 1,
        borderColor: Colors.borderDark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    // Content
    content: {
        flex: 1,
        paddingTop: Spacing['2xl'],
    },
    
    // Icon
    iconContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    iconWrapper: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: Colors.primary10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successIconWrapper: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: Colors.success10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    // Typography
    title: {
        fontFamily: FontFamily.display,
        fontSize: FontSize.h1,
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    subtitle: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.base,
    },
    emailHighlight: {
        fontFamily: FontFamily.bodySemiBold,
        color: Colors.textPrimary,
    },
    instructionText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.lg,
    },
    
    // Input Fields - Per Design System (48px height, 8px radius)
    inputContainer: {
        marginBottom: Spacing.lg,
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
    
    // Primary Button - Per Design System (48px height, 12px radius)
    primaryButton: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.lg,
        height: Heights.button, // 48px per Design System
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonDisabled: {
        opacity: 0.7,
    },
    primaryButtonText: {
        fontFamily: FontFamily.bodyBold,
        color: Colors.textPrimary,
        fontSize: FontSize.body,
    },
    
    // Link Button
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.xl,
        gap: Spacing.xs,
    },
    linkButtonText: {
        fontFamily: FontFamily.body,
        color: Colors.textMuted,
        fontSize: FontSize.small,
    },
    linkButtonTextHighlight: {
        fontFamily: FontFamily.bodySemiBold,
        color: Colors.primary,
        fontSize: FontSize.small,
    },
});
