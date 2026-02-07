import { useEffect, useCallback, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform, Linking } from 'react-native';
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
import { ToastProvider } from '../components/ui';
import { MobileRealtimeProvider } from '../providers/RealtimeProvider';
import { useAuthStore } from '../stores/authStore';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { ErrorBoundary } from '../components/ErrorBoundary';
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
        console.log('Font loading state:', { fontsLoaded, fontError: !!fontError, fontTimeout });

        if (fontsLoaded || fontError) {
            console.log('Fonts loaded or error occurred, hiding splash screen');
        }

        const timeout = setTimeout(() => {
            if (!fontsLoaded && !fontError) {
                console.warn('Font loading timeout - proceeding with system fonts');
                setFontTimeout(true);
            }
        }, 2000); // Reduced to 2 seconds for faster app startup

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

    // Handle deep links for OAuth callbacks (native only)
    useEffect(() => {
        if (Platform.OS === 'web') {
            // For web, Supabase handles URL hash automatically via detectSessionInUrl
            return;
        }

        if (!isSupabaseConfigured()) return;

        // For native, handle deep links
        const handleDeepLink = async (url: string) => {
            try {
                // Check if this is an OAuth callback
                if (url.includes('auth/callback') || url.includes('auth#') || url.includes('auth?')) {
                    const client = await getSupabaseClient();

                    // Supabase will automatically extract tokens from the URL
                    // Just check if we have a session now
                    const { data: { session }, error } = await client.auth.getSession();

                    if (session && !error) {
                        // Session exists, refresh auth state
                        const { checkAuth } = useAuthStore.getState();
                        await checkAuth();
                    }
                }
            } catch (error) {
                console.error('Deep link handling error:', error);
            }
        };

        // Get initial URL if app was opened via deep link
        Linking.getInitialURL().then((url) => {
            if (url) {
                handleDeepLink(url);
            }
        }).catch((error) => {
            console.error('Error getting initial URL:', error);
        });

        // Listen for deep links while app is running
        const subscription = Linking.addEventListener('url', (event) => {
            handleDeepLink(event.url);
        });

        return () => {
            subscription.remove();
        };
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
                    (event, session) => {
                        if (!mounted) return;

                        const { checkAuth, setSession, setUser, logout } = useAuthStore.getState();

                        // CRITICAL: Avoid making async Supabase API calls directly inside this handler.
                        // There's a known bug in supabase-js where async calls in onAuthStateChange
                        // cause deadlocks, making subsequent Supabase calls (like signInWithPassword) hang.
                        // Solution: Defer async operations using setTimeout to run outside the handler.

                        switch (event) {
                            case 'SIGNED_IN':
                                // Refresh auth state when user signs in
                                if (session) {
                                    // Defer checkAuth to avoid deadlock
                                    setTimeout(() => {
                                        if (mounted) {
                                            checkAuth().catch((error: any) => {
                                                if (error?.message?.includes('Invalid Refresh Token') ||
                                                    error?.message?.includes('Refresh Token Not Found') ||
                                                    error?.message?.includes('refresh_token_not_found')) {
                                                    console.warn('Invalid refresh token detected, clearing session');
                                                    logout();
                                                } else {
                                                    console.error('Error in deferred checkAuth (SIGNED_IN):', error);
                                                }
                                            });
                                        }
                                    }, 0);
                                }
                                break;
                            case 'TOKEN_REFRESHED':
                                // Handle token refresh - session should be valid
                                if (session) {
                                    setSession(session);
                                    // Defer checkAuth to avoid deadlock
                                    setTimeout(() => {
                                        if (mounted) {
                                            checkAuth().catch((error: any) => {
                                                console.error('Error in deferred checkAuth (TOKEN_REFRESHED):', error);
                                            });
                                        }
                                    }, 0);
                                } else {
                                    // Token refresh failed, clear session
                                    console.warn('Token refresh returned no session');
                                    logout();
                                }
                                break;
                            case 'SIGNED_OUT':
                                // Clear auth state on logout
                                setUser(null);
                                setSession(null);
                                break;
                            case 'USER_UPDATED':
                                // Refresh user data when profile is updated
                                if (session) {
                                    // Defer checkAuth to avoid deadlock
                                    setTimeout(() => {
                                        if (mounted) {
                                            checkAuth().catch((error: any) => {
                                                console.error('Error in deferred checkAuth (USER_UPDATED):', error);
                                            });
                                        }
                                    }, 0);
                                }
                                break;
                            default:
                                // For other events, just refresh auth state if we have a session
                                if (session) {
                                    // Defer checkAuth to avoid deadlock
                                    setTimeout(() => {
                                        if (mounted) {
                                            checkAuth().catch((error: any) => {
                                                console.error('Error in deferred checkAuth (default):', error);
                                            });
                                        }
                                    }, 0);
                                }
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
    // On web, we skip the loading state to properly handle hydration and prevent blocking
    // The fonts will load in the background (FOUT)
    if (Platform.OS !== 'web' && !fontsLoaded && !fontError && !fontTimeout) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar style="light" />
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <ErrorBoundary>
            <QueryProvider>
                <ToastProvider>
                    <MobileRealtimeProvider>
                        <StatusBar style="light" />
                        <Stack
                            screenOptions={{
                                headerShown: false,
                                contentStyle: { backgroundColor: Colors.backgroundDark },
                                animation: 'fade',
                                gestureEnabled: true,
                            }}
                        />
                    </MobileRealtimeProvider>
                </ToastProvider>
            </QueryProvider>
        </ErrorBoundary>
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
