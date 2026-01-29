import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../constants/typography';
import { AnimationDuration, AppConfig } from '../constants';
import { useAuthStore } from '../stores/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { G, Path } from 'react-native-svg';

// Animated Zora Logo Component
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

interface AnimatedZoraLogoProps {
    width: number;
    height: number;
    hand1Opacity: Animated.Value;
    hand2Opacity: Animated.Value;
    bagOpacity: Animated.Value;
    africaOpacity: Animated.Value;
    textOpacity: Animated.Value;
    logoScale: Animated.Value;
}

const AnimatedZoraLogo: React.FC<AnimatedZoraLogoProps> = ({
    width,
    height,
    hand1Opacity,
    hand2Opacity,
    bagOpacity,
    africaOpacity,
    textOpacity,
    logoScale,
}) => {
    return (
        <Animated.View
            style={{
                transform: [{ scale: logoScale }],
            }}
        >
            <Svg width={width} height={height} viewBox="0 0 156 179">
                {/* Bag Group */}
                <AnimatedG opacity={bagOpacity}>
                    {/* Hands */}
                    <AnimatedPath
                        d="M55.643 29.404c-0.298-1.356-0.613-3.954-0.613-5.398v-2.559c0-10.801 8.769-19.569 19.569-19.569h7.112c10.801 0 19.569 8.769 19.569 19.569v2.559c0 2.421-0.571 5.206-1.376 7.347"
                        fill="none"
                        stroke="#000"
                        strokeWidth="2.08"
                        opacity={hand2Opacity}
                    />
                    <AnimatedPath
                        d="M63.832 31.655c-0.298-1.356-0.613-3.954-0.613-5.398v-2.559c0-10.801 8.769-19.569 19.569-19.569h7.112c10.801 0 19.569 8.769 19.569 19.569v2.559c0 2.421-0.192 3.493-0.997 5.634"
                        fill="none"
                        stroke="#000"
                        strokeWidth="2.08"
                        opacity={hand1Opacity}
                    />

                    {/* Bag Shape */}
                    <G>
                        <Path
                            d="M17.657 31.446l9.865-0.065 6.93-6.059 27.742 2.627-3.487 10.757-6.086 0.988 0.083 4.076-11.435 15.164v7.407l-2.445 5.046c0 0 15.955 21.579 25.604 15.127l7.746-2.576 4.453 2.558-0.342 8.748 3.387 2.559-43.111-11.716-11.381 0.63-12.184 0.845 4.66-56.116Z"
                            fill="#c00"
                        />
                        <Path
                            d="M60.48 33.238l1.782-5.354 68.425 3.342 14.497 94.941-108.021 4.569-13.019-5.139-14.225 0.663 3.086-39.989 0.108-0.12-0.117 1.413 12.184-0.845 11.381-0.63 43.111 11.716-3.387-2.559 0.342-8.748-4.453-2.558-7.746 2.576c-9.649 6.452-25.604-15.127-25.604-15.127l2.445-5.046v-7.407l11.435-15.164-0.037-1.805 2.386-2.666 3.653-0.593 1.773-5.468Z"
                            fill="#fc0"
                        />
                    </G>

                    {/* Africa Map */}
                    <AnimatedPath
                        d="M59.668 35.743l0.755 0.981c0 0 24.304-5.446 25.137 0.74l-0.174 3.459 7.025 4.507 5.142-3.467 10.973 3.827c0 0 7.273-4.703 7.663-0.141 0 0 1.05 19.872 15.025 24.318l8.276-1.775c0 0 5.206 4.912-0.213 15.694l-11.651 13.53 0.783 15.664-6.584 4.462-0.068 6.263-4.753 2.624-6.892 7.587-12.415 2.403-6.328-4.717-10.266-20.218 2.205-8.643-3.037-4.646-2.558-0.927 1.96 0.533-3.387-2.559 0.342-8.748-4.453-2.558-7.746 2.576c-9.649 6.452-25.604-15.127-25.604-15.127l2.445-5.046v-7.407l11.435-15.164-0.083-4.076 6.086-0.988 0.96-2.962Z"
                        fill="rgba(255, 255, 255, 0.85)"
                        stroke="#000"
                        strokeWidth="2.08"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={africaOpacity}
                    />
                </AnimatedG>

                {/* ZORA Text */}
                <AnimatedPath
                    d="M29.259 169.338h-11.7c-1.606 0.003-3.554 0.203-5.131 0.408 1.334-1.067 2.812-2.424 3.717-3.797l13.116-19.904c0.6-0.911 0.773-1.711 0.603-2.789l-0.554-3.495h-23.009c-2.651 0-3.395-0.535-3.395-0.535-0.289 2.32-0.939 5.461-0.939 6.426 0 1.055 0.877 2.172 0.877 2.172l9.789-0.02c1.084-0.002 2.753-0.313 4.044-0.595-1.176 0.888-2.823 2.332-4.049 4.204l-11.968 18.279c-0.598 0.912-0.769 1.712-0.598 2.789l0.775 4.897h24.964c2.651 0 3.395 0.537 3.395 0.537 0.289-2.321 0.939-5.463 0.939-6.429 0-1.054-0.877-2.172-0.877-2.172m25.124-30.092c-11.769 0-20.474 8.115-20.474 20.206 0 11.231 7.47 18.486 18.594 18.486 11.823 0 20.421-8.222 20.421-20.223 0-11.107-7.362-18.469-18.54-18.469m-2.15 7.792c5.589 0 9.781 5.051 9.781 13.005 0 6.072-2.472 10.157-7.523 10.049-5.911-0.107-9.673-5.589-9.673-13.005 0-5.589 2.15-10.049 7.416-10.049m49.47 14.17c4.114-0.998 8.594-4.329 8.594-10.892 0-8.099-6.49-11.07-17.726-11.07-4.849 0-9.889 0.613-12.34 1.075v36.435c0 0 1.118 0.914 2.172 0.914 1.287 0 5.88-0.269 8.576-0.269v-30.119c1.087-0.081 2.115-0.136 2.841-0.136 3.65 0 5.721 1.485 5.721 4.729 0 2.616-1.29 4.374-5.088 5.726-1.388 0.494-2.009 1.329-1.229 3.156l4.631 10.84c2.023 4.737 4.595 6.88 8.821 6.88 4.188 0 6.818-2.175 6.818-5.639-4.575-1.176-8.054-7.901-11.79-11.628Zm39.657-20.78c0 0-1.118-0.914-2.172-0.914-0.806 0-6.211 0.269-9.569 0.269 0 0 0.267 2.25-0.434 4.163l-12.037 32.81c0 0 1.118 0.914 2.172 0.914 1.188 0 4.897-0.269 7.912-0.269l3.122-9.007h10.161l2.86 8.362c0 0 1.117 0.914 2.172 0.914 1.362 0 5.917-0.269 9.554-0.269l-13.742-36.972Zm-6.498 7.083c0.194 0.821 0.866 3.582 2.011 7.483l1.882 6.413h-7.198l1.866-6.899c0.619-2.291 1.268-5.995 1.44-6.997Z"
                    fill={Colors.primary}
                    fillRule="nonzero"
                    opacity={textOpacity}
                />
            </Svg>
        </Animated.View>
    );
};

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
    const taglineOpacity = useRef(new Animated.Value(0)).current;
    const taglineTranslate = useRef(new Animated.Value(15)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const loaderOpacity = useRef(new Animated.Value(0)).current;
    const decorativeOpacity = useRef(new Animated.Value(0)).current;
    const screenOpacity = useRef(new Animated.Value(1)).current;

    // SVG path animations
    const hand1Opacity = useRef(new Animated.Value(0)).current;
    const hand2Opacity = useRef(new Animated.Value(0)).current;
    const bagOpacity = useRef(new Animated.Value(0)).current;
    const africaOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const logoPulseScale = useRef(new Animated.Value(1)).current;

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

    // SVG path sequential animation
    const startLogoPathAnimation = () => {
        Animated.sequence([
            // Hands appear first
            Animated.parallel([
                Animated.timing(hand1Opacity, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(hand2Opacity, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
            // Bag appears
            Animated.timing(bagOpacity, {
                toValue: 1,
                duration: 400,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            // Africa map fades in
            Animated.timing(africaOpacity, {
                toValue: 1,
                duration: 400,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            // ZORA text appears last
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 500,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    };

    // Subtle logo pulse animation
    const startLogoPulseAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(logoPulseScale, {
                    toValue: 1.02,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(logoPulseScale, {
                    toValue: 1,
                    duration: 2000,
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
            startLogoPathAnimation();
            startLogoPulseAnimation();
        });

        // Navigate after configured duration with fade-out
        const timer = setTimeout(() => {
            Animated.timing(screenOpacity, {
                toValue: 0,
                duration: AnimationDuration.default,
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
        }, AppConfig.splashScreenDuration);

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
                    {/* Animated SVG Logo */}
                    <View style={styles.logoWrapper}>
                        <AnimatedZoraLogo
                            width={width * 0.4}
                            height={(width * 0.4) * (179 / 156)}
                            hand1Opacity={hand1Opacity}
                            hand2Opacity={hand2Opacity}
                            bagOpacity={bagOpacity}
                            africaOpacity={africaOpacity}
                            textOpacity={textOpacity}
                            logoScale={logoPulseScale}
                        />
                    </View>
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

    // Logo wrapper
    logoWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
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
