import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Heart,
    Globe,
    Envelope,
    MapPin,
    FileText,
    ShieldCheck,
    CaretRight,
    Storefront,
    ShoppingBag,
    Users,
} from 'phosphor-react-native';
import Svg, { G, Path } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { getSupabaseClient, isSupabaseConfigured } from '../../lib/supabase';
import { realtimeService } from '../../services/realtimeService';

const INITIAL_STATS = [
    { icon: ShoppingBag, value: '...', label: 'Products' },
    { icon: Storefront, value: '...', label: 'Vendors' },
    { icon: Users, value: '...', label: 'Customers' },
];

const CONTACT_ITEMS = [
    {
        icon: Globe,
        label: 'Website',
        value: 'www.zoraapp.co.uk',
        url: 'https://www.zoraapp.co.uk',
    },
    {
        icon: Envelope,
        label: 'Email',
        value: 'zoraafricanmarketapp@gmail.com',
        url: 'mailto:zoraafricanmarketapp@gmail.com',
    },
    {
        icon: MapPin,
        label: 'Location',
        value: 'United Kingdom',
        url: 'https://maps.google.com/?q=United+Kingdom',
    },
];

const LEGAL_ITEMS = [
    { icon: FileText, label: 'Terms of Service', route: '/legal/terms' },
    { icon: ShieldCheck, label: 'Privacy Policy', route: '/legal/privacy' },
    { icon: FileText, label: 'Licenses', route: '/legal/licenses' },
];

// Zora Logo SVG Component
interface ZoraLogoProps {
    width?: number;
    height?: number;
}

const ZoraLogo: React.FC<ZoraLogoProps> = ({ width = 120, height = 138 }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 156 179">
            {/* Bag Group */}
            <G>
                {/* Hands */}
                <Path
                    d="M55.643 29.404c-0.298-1.356-0.613-3.954-0.613-5.398v-2.559c0-10.801 8.769-19.569 19.569-19.569h7.112c10.801 0 19.569 8.769 19.569 19.569v2.559c0 2.421-0.571 5.206-1.376 7.347"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={2.08}
                />
                <Path
                    d="M63.832 31.655c-0.298-1.356-0.613-3.954-0.613-5.398v-2.559c0-10.801 8.769-19.569 19.569-19.569h7.112c10.801 0 19.569 8.769 19.569 19.569v2.559c0 2.421-0.192 3.493-0.997 5.634"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={2.08}
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
                <Path
                    d="M59.668 35.743l0.755 0.981c0 0 24.304-5.446 25.137 0.74l-0.174 3.459 7.025 4.507 5.142-3.467 10.973 3.827c0 0 7.273-4.703 7.663-0.141 0 0 1.05 19.872 15.025 24.318l8.276-1.775c0 0 5.206 4.912-0.213 15.694l-11.651 13.53 0.783 15.664-6.584 4.462-0.068 6.263-4.753 2.624-6.892 7.587-12.415 2.403-6.328-4.717-10.266-20.218 2.205-8.643-3.037-4.646-2.558-0.927 1.96 0.533-3.387-2.559 0.342-8.748-4.453-2.558-7.746 2.576c-9.649 6.452-25.604-15.127-25.604-15.127l2.445-5.046v-7.407l11.435-15.164-0.083-4.076 6.086-0.988 0.96-2.962Z"
                    fill="#fff"
                    stroke="#000"
                    strokeWidth={2.08}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </G>

            {/* ZORA Text */}
            <Path
                d="M29.259 169.338h-11.7c-1.606 0.003-3.554 0.203-5.131 0.408 1.334-1.067 2.812-2.424 3.717-3.797l13.116-19.904c0.6-0.911 0.773-1.711 0.603-2.789l-0.554-3.495h-23.009c-2.651 0-3.395-0.535-3.395-0.535-0.289 2.32-0.939 5.461-0.939 6.426 0 1.055 0.877 2.172 0.877 2.172l9.789-0.02c1.084-0.002 2.753-0.313 4.044-0.595-1.176 0.888-2.823 2.332-4.049 4.204l-11.968 18.279c-0.598 0.912-0.769 1.712-0.598 2.789l0.775 4.897h24.964c2.651 0 3.395 0.537 3.395 0.537 0.289-2.321 0.939-5.463 0.939-6.429 0-1.054-0.877-2.172-0.877-2.172m25.124-30.092c-11.769 0-20.474 8.115-20.474 20.206 0 11.231 7.47 18.486 18.594 18.486 11.823 0 20.421-8.222 20.421-20.223 0-11.107-7.362-18.469-18.54-18.469m-2.15 7.792c5.589 0 9.781 5.051 9.781 13.005 0 6.072-2.472 10.157-7.523 10.049-5.911-0.107-9.673-5.589-9.673-13.005 0-5.589 2.15-10.049 7.416-10.049m49.47 14.17c4.114-0.998 8.594-4.329 8.594-10.892 0-8.099-6.49-11.07-17.726-11.07-4.849 0-9.889 0.613-12.34 1.075v36.435c0 0 1.118 0.914 2.172 0.914 1.287 0 5.88-0.269 8.576-0.269v-30.119c1.087-0.081 2.115-0.136 2.841-0.136 3.65 0 5.721 1.485 5.721 4.729 0 2.616-1.29 4.374-5.088 5.726-1.388 0.494-2.009 1.329-1.229 3.156l4.631 10.84c2.023 4.737 4.595 6.88 8.821 6.88 4.188 0 6.818-2.175 6.818-5.639-4.575-1.176-8.054-7.901-11.79-11.628Zm39.657-20.78c0 0-1.118-0.914-2.172-0.914-0.806 0-6.211 0.269-9.569 0.269 0 0 0.267 2.25-0.434 4.163l-12.037 32.81c0 0 1.118 0.914 2.172 0.914 1.188 0 4.897-0.269 7.912-0.269l3.122-9.007h10.161l2.86 8.362c0 0 1.117 0.914 2.172 0.914 1.362 0 5.917-0.269 9.554-0.269l-13.742-36.972Zm-6.498 7.083c0.194 0.821 0.866 3.582 2.011 7.483l1.882 6.413h-7.198l1.866-6.899c0.619-2.291 1.268-5.995 1.44-6.997Z"
                fill={Colors.primary}
                fillRule="nonzero"
            />
        </Svg>
    );
};

export default function AboutScreen() {
    const router = useRouter();
    const [stats, setStats] = useState(INITIAL_STATS);

    useEffect(() => {
        fetchStats();

        // Subscribe to real-time updates for stats
        if (isSupabaseConfigured()) {
            let unsubscribers: (() => void)[] = [];
            let isMounted = true;

            // Set up all subscriptions and wait for them to complete
            Promise.all([
                realtimeService.subscribeToTable('products', '*', async () => {
                    if (isMounted) {
                        await fetchStats();
                    }
                }),
                realtimeService.subscribeToTable('vendors', '*', async () => {
                    if (isMounted) {
                        await fetchStats();
                    }
                }),
                realtimeService.subscribeToTable('profiles', '*', async () => {
                    if (isMounted) {
                        await fetchStats();
                    }
                }),
            ]).then((unsubs) => {
                // Only add unsubscribe functions if component is still mounted
                if (isMounted) {
                    unsubscribers = unsubs.filter((unsub): unsub is (() => void) => typeof unsub === 'function');
                } else {
                    // Component unmounted before subscriptions completed, clean up immediately
                    unsubs.forEach((unsub) => {
                        if (typeof unsub === 'function') {
                            unsub();
                        }
                    });
                }
            }).catch((error) => {
                console.error('Error setting up real-time subscriptions:', error);
            });

            return () => {
                isMounted = false;
                // Clean up all subscriptions
                unsubscribers.forEach((unsub) => {
                    if (typeof unsub === 'function') {
                        unsub();
                    }
                });
            };
        }
    }, []);

    const fetchStats = async () => {
        try {
            const supabase = await getSupabaseClient();
            const [products, vendors, profiles] = await Promise.all([
                supabase.from('products').select('*', { count: 'exact', head: true }),
                supabase.from('vendors').select('*', { count: 'exact', head: true }),
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
            ]);

            setStats([
                { icon: ShoppingBag, value: formatCount(products.count || 0), label: 'Products' },
                { icon: Storefront, value: formatCount(vendors.count || 0), label: 'Vendors' },
                { icon: Users, value: formatCount(profiles.count || 0), label: 'Customers' },
            ]);
        } catch (error) {
            console.error('Error fetching stats:', error);
            // Fallback to initial stats or show error state if needed
        }
    };

    const formatCount = (count: number) => {
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K+';
        }
        return count.toString();
    };

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            // If no navigation history, navigate to profile tab
            router.replace('/(tabs)/profile');
        }
    };

    const handleOpenLink = (url: string) => {
        Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
    };

    const handleLegalPress = (route: string) => {
        // TODO: Implement legal pages navigation
        console.log('Navigate to:', route);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                    activeOpacity={0.8}
                >
                    <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About Zora</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Brand Section */}
                <View style={styles.brandSection}>
                    <View style={styles.logoContainer}>
                        <ZoraLogo width={120} height={138} />
                        <Text style={styles.logoSubtext}>AFRICAN MARKET</Text>
                    </View>
                    <Text style={styles.tagline}>
                        Connecting the African diaspora{'\n'}with the taste of home
                    </Text>
                    <Text style={styles.version}>Version 1.0.0</Text>
                </View>

                {/* Mission Card */}
                <View style={styles.missionCard}>
                    <View style={styles.missionHeader}>
                        <View style={styles.missionIconContainer}>
                            <Heart size={24} color={Colors.primary} weight="duotone" />
                        </View>
                        <Text style={styles.missionTitle}>Our Mission</Text>
                    </View>
                    <Text style={styles.missionText}>
                        Zora African Market was founded to bridge the gap between African vendors and the diaspora community in the UK. We believe everyone deserves access to authentic African groceries, spices, and products that remind them of home.
                    </Text>
                    <Text style={styles.missionText}>
                        By supporting local African vendors and providing a premium shopping experience, we're building a community that celebrates African culture and heritage.
                    </Text>
                </View>

                {/* Stats Section */}
                <View style={styles.statsRow}>
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <View key={index} style={styles.statCard}>
                                <View style={styles.statIconContainer}>
                                    <IconComponent size={24} color={Colors.secondary} weight="duotone" />
                                </View>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Contact Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Get in Touch</Text>
                    <View style={styles.contactCard}>
                        {CONTACT_ITEMS.map((item, index) => (
                            <React.Fragment key={item.label}>
                                <TouchableOpacity
                                    style={styles.contactItem}
                                    onPress={() => handleOpenLink(item.url)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.contactIconContainer}>
                                        <item.icon size={20} color={Colors.secondary} weight="duotone" />
                                    </View>
                                    <View style={styles.contactInfo}>
                                        <Text style={styles.contactLabel}>{item.label}</Text>
                                        <Text style={styles.contactValue}>{item.value}</Text>
                                    </View>
                                    <CaretRight size={20} color={Colors.textMuted} weight="regular" />
                                </TouchableOpacity>
                                {index < CONTACT_ITEMS.length - 1 && <View style={styles.contactDivider} />}
                            </React.Fragment>
                        ))}
                    </View>
                </View>

                {/* Legal Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Legal</Text>
                    <View style={styles.legalCard}>
                        {LEGAL_ITEMS.map((item, index) => (
                            <React.Fragment key={item.label}>
                                <TouchableOpacity
                                    style={styles.legalItem}
                                    onPress={() => handleLegalPress(item.route)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.legalLeft}>
                                        <View style={styles.legalIconContainer}>
                                            <item.icon size={18} color={Colors.textMuted} weight="duotone" />
                                        </View>
                                        <Text style={styles.legalLabel}>{item.label}</Text>
                                    </View>
                                    <CaretRight size={18} color={Colors.textMuted} weight="regular" />
                                </TouchableOpacity>
                                {index < LEGAL_ITEMS.length - 1 && <View style={styles.legalDivider} />}
                            </React.Fragment>
                        ))}
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => handleOpenLink('https://ajibolagenius.carrd.co/')} activeOpacity={0.8}>
                        <Text style={styles.footerText}>Made with 💚 in Nigeria</Text>
                    </TouchableOpacity>
                    <Text style={styles.copyright}>© {new Date().getFullYear()} Zora African Market Ltd.</Text>
                </View>

                {/* Bottom padding */}
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundDark,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderDark,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        backgroundColor: Colors.cardDark,
        borderWidth: 1,
        borderColor: Colors.borderDark,
    },
    headerTitle: {
        fontFamily: FontFamily.display,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
    },
    headerRight: {
        width: 44,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.base,
        gap: Spacing.xl,
    },
    // Brand Section
    brandSection: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: Spacing.base,
    },
    logoSubtext: {
        fontFamily: FontFamily.bodyMedium,
        fontSize: FontSize.caption,
        color: Colors.secondary,
        letterSpacing: 4,
        marginTop: Spacing.sm,
    },
    tagline: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: Spacing.sm,
    },
    version: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
    // Mission Card
    missionCard: {
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        gap: Spacing.base,
        borderWidth: 1,
        borderColor: Colors.borderDark,
        ...Shadows.md,
    },
    missionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    missionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${Colors.primary}26`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    missionTitle: {
        fontFamily: FontFamily.display,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
    },
    missionText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
        lineHeight: 22,
    },
    // Stats Row
    statsRow: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.lg,
        padding: Spacing.base,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.borderDark,
        ...Shadows.sm,
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: `${Colors.secondary}26`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    statValue: {
        fontFamily: FontFamily.display,
        fontSize: FontSize.h2,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    statLabel: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
    // Section
    section: {
        gap: Spacing.md,
    },
    sectionTitle: {
        fontFamily: FontFamily.display,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
        paddingHorizontal: Spacing.xs,
    },
    // Contact Card
    contactCard: {
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.borderDark,
        ...Shadows.md,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.base,
    },
    contactIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${Colors.secondary}26`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
    },
    contactValue: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
        marginTop: 2,
    },
    contactDivider: {
        height: 1,
        backgroundColor: Colors.borderDark,
        marginHorizontal: Spacing.base,
    },
    // Legal Card
    legalCard: {
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.borderDark,
        ...Shadows.md,
    },
    legalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.base,
    },
    legalLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    legalIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.backgroundDark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    legalLabel: {
        fontFamily: FontFamily.bodyMedium,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
    },
    legalDivider: {
        height: 1,
        backgroundColor: Colors.borderDark,
        marginHorizontal: Spacing.base,
    },
    // Footer
    footer: {
        alignItems: 'center',
        paddingVertical: Spacing.base,
    },
    footerText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    copyright: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
    },
});
