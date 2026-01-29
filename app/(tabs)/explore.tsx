import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Easing,
    useWindowDimensions,
    ActivityIndicator,
} from 'react-native';
import { LazyImage, RatingDisplay } from '../../components/ui';
import MetaTags from '../../components/ui/MetaTags';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    Sliders,
    Storefront,
    ForkKnife,
    ListBullets,
    MapPin,
    Clock,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Heights, Shadows, Gaps } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { AnimationDuration, AnimationEasing } from '../../constants';
import { vendorService as mockVendorService, type Vendor as MockVendor } from '../../services/mockDataService';
import { vendorService as supabaseVendorService, type Vendor } from '../../services/supabaseService';
import { realtimeService } from '../../services/realtimeService';
import { isSupabaseConfigured } from '../../lib/supabase';
import { getVendorRoute } from '../../lib/navigationHelpers';
import { generatePageMetaTags } from '../../lib/metaTags';

type FilterType = 'open' | 'delivery' | 'pickup' | 'topRated';

const FILTERS: { id: FilterType; label: string }[] = [
    { id: 'open', label: 'Open Now' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'pickup', label: 'Pickup' },
    { id: 'topRated', label: 'Top Rated' },
];

// Transform vendor data for display
const transformVendorForDisplay = (vendor: Vendor | MockVendor) => ({
    id: vendor.id,
    name: vendor.shop_name,
    category: Array.isArray(vendor.categories) ? vendor.categories.join(' • ') : '',
    image: vendor.cover_image_url,
    rating: vendor.rating,
    distance: `${(Math.random() * 2 + 0.5).toFixed(1)} km`,
    deliveryTime: `${vendor.delivery_time_min || 30} min`,
    status: 'Open until 8pm',
    statusColor: Colors.success,
    vendor: vendor, // Keep reference to original vendor for navigation
});

export default function ExploreScreen() {
    const router = useRouter();
    const { height: screenHeight } = useWindowDimensions();
    const [activeFilter, setActiveFilter] = useState<FilterType>('open');
    const [isListView, setIsListView] = useState(false);
    const [vendors, setVendors] = useState<ReturnType<typeof transformVendorForDisplay>[]>([]);
    const [loading, setLoading] = useState(true);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    const fetchVendors = async () => {
        try {
            setLoading(true);
            let vendorData: (Vendor | MockVendor)[];

            if (isSupabaseConfigured()) {
                vendorData = await supabaseVendorService.getAll();
            } else {
                vendorData = mockVendorService.getAll();
            }

            const transformedVendors = vendorData.map(transformVendorForDisplay);
            setVendors(transformedVendors);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();

        // Subscribe to real-time updates
        const unsubscribers: (() => void)[] = [];

        if (isSupabaseConfigured()) {
            realtimeService.subscribeToTable('vendors', '*', async () => {
                // Refresh vendors when database changes
                await fetchVendors();
            }).then((unsub) => {
                if (unsub) unsubscribers.push(unsub);
            });
        }

        return () => {
            unsubscribers.forEach((unsub) => {
                if (typeof unsub === 'function') {
                    unsub();
                }
            });
        };
    }, []);

    useEffect(() => {
        if (!loading) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: AnimationDuration.default,
                    easing: AnimationEasing.standard,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: AnimationDuration.default,
                    easing: AnimationEasing.standard,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [loading]);

    const handleVendorPress = (vendorId: string) => {
        // Find vendor from current list
        const vendor = vendors.find(v => v.id === vendorId);
        if (vendor && vendor.vendor) {
            router.push(getVendorRoute(vendor.vendor as any, vendorId));
        } else {
            // Fallback: try to get vendor from service
            if (isSupabaseConfigured()) {
                supabaseVendorService.getById(vendorId).then(v => {
                    if (v) router.push(getVendorRoute(v as any, vendorId));
                });
            } else {
                const v = mockVendorService.getById(vendorId);
                if (v) router.push(getVendorRoute(v as any, vendorId));
            }
        }
    };

    const handleFilterPress = () => {
        router.push('/vendors');
    };

    return (
        <View style={styles.container}>
            <MetaTags
                data={generatePageMetaTags(
                    'Explore Vendors - Zora African Market',
                    'Browse and discover authentic African vendors and products. Filter by category, delivery options, and ratings. Find your favorite African market vendors.',
                    '/assets/images/app-image.png',
                    '/explore'
                )}
            />
            {/* Map Background */}
            <View style={styles.mapContainer}>
                {/* Map Pattern Background */}
                <View style={styles.mapBackground}>
                    <View style={styles.mapPattern}>
                        {Array.from({ length: 120 }).map((_, i) => (
                            <View key={i} style={styles.mapDot} />
                        ))}
                    </View>
                </View>

                {/* Map Markers - Balloon Style */}
                <View style={[styles.mapMarker, { top: '28%', left: '20%' }]}>
                    <View style={styles.markerBalloon}>
                        <Storefront size={16} color="#FFFFFF" weight="fill" />
                    </View>
                    <View style={styles.markerTail} />
                </View>

                <View style={[styles.mapMarker, { top: '22%', right: '18%' }]}>
                    <View style={styles.markerBalloon}>
                        <ForkKnife size={16} color="#FFFFFF" weight="fill" />
                    </View>
                    <View style={styles.markerTail} />
                </View>

                {/* Cluster Marker */}
                <View style={[styles.clusterMarker, { top: '40%', right: '25%' }]}>
                    <Text style={styles.clusterText}>3</Text>
                </View>

                {/* User Location Pulse */}
                <View style={styles.userLocationContainer}>
                    <View style={styles.userPulse} />
                    <View style={styles.userDot} />
                </View>
            </View>

            {/* Header */}
            <SafeAreaView style={styles.header} edges={['top']}>
                <View style={{ width: 44 }} />
                <Text style={styles.headerTitle}>Find Vendors</Text>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={handleFilterPress}
                    activeOpacity={0.8}
                >
                    <Sliders size={22} color={Colors.textPrimary} weight="bold" />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Filter Chips - Outline style for inactive */}
            <View style={styles.filtersContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContent}
                >
                    {FILTERS.map((filter) => (
                        <TouchableOpacity
                            key={filter.id}
                            style={[
                                styles.filterChip,
                                activeFilter === filter.id && styles.filterChipActive,
                            ]}
                            onPress={() => setActiveFilter(filter.id)}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    activeFilter === filter.id && styles.filterChipTextActive,
                                ]}
                            >
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Bottom Sheet - Vendors List */}
            <Animated.View
                style={[
                    styles.bottomSheet,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}
            >
                {/* Handle */}
                <View style={styles.sheetHandle}>
                    <View style={styles.handleBar} />
                </View>

                {/* Vendor Count */}
                <View style={styles.vendorCountContainer}>
                    <Text style={styles.vendorCountText}>
                        {loading ? 'Loading...' : `${vendors.length} VENDORS NEARBY`}
                    </Text>
                </View>

                {/* Vendors List */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                    </View>
                ) : (
                    <ScrollView
                        style={styles.vendorsList}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.vendorsListContent}
                    >
                        {vendors.map((vendor) => (
                            <TouchableOpacity
                                key={vendor.id}
                                style={styles.vendorCard}
                                onPress={() => handleVendorPress(vendor.id)}
                                activeOpacity={0.8}
                            >
                                {/* Vendor Image */}
                                <View style={styles.vendorImageContainer}>
                                    <LazyImage
                                        source={vendor.image}
                                        style={styles.vendorImage}
                                        contentFit="cover"
                                        showLoader={false}
                                    />
                                </View>

                                {/* Vendor Info */}
                                <View style={styles.vendorInfo}>
                                    <Text style={styles.vendorName} numberOfLines={1}>
                                        {vendor.name}
                                    </Text>
                                    <Text style={styles.vendorCategory} numberOfLines={1}>
                                        {vendor.category}
                                    </Text>

                                    {/* Rating and Meta */}
                                    <View style={styles.vendorMeta}>
                                        <RatingDisplay
                                            rating={vendor.rating}
                                            size="small"
                                            variant="compact"
                                            showReviewCount={false}
                                        />
                                        <Text style={styles.metaDivider}>•</Text>
                                        <Text style={styles.metaText}>{vendor.distance}</Text>
                                        <Text style={styles.metaDivider}>•</Text>
                                        <Text style={styles.metaText}>{vendor.deliveryTime}</Text>
                                    </View>

                                    {/* Status */}
                                    <Text style={[styles.statusText, { color: vendor.statusColor }]}>
                                        {vendor.status}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        {/* Bottom padding for tab bar */}
                        <View style={{ height: 140 }} />
                    </ScrollView>
                )}
            </Animated.View>

            {/* Floating List View Button */}
            <View style={styles.floatingButtonContainer}>
                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() => router.push('/vendors')}
                    activeOpacity={0.9}
                >
                    <Text style={styles.floatingButtonText}>List View</Text>
                    <ListBullets size={18} color={Colors.textPrimary} weight="bold" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundDark,
    },
    // Map Styles
    mapContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    mapBackground: {
        flex: 1,
        backgroundColor: Colors.cardDark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapPattern: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: Spacing.md,
        gap: Spacing.lg,
    },
    mapDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.white08,
    },
    mapMarker: {
        position: 'absolute',
        alignItems: 'center',
    },
    markerBalloon: {
        backgroundColor: Colors.primary,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        ...Shadows.lg,
    },
    markerTail: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: Colors.primary,
        marginTop: -1,
    },
    clusterMarker: {
        position: 'absolute',
        width: 36,
        height: 36,
        backgroundColor: Colors.primary,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.backgroundDark,
        ...Shadows.md,
    },
    clusterText: {
        fontFamily: FontFamily.bodyBold,
        color: Colors.textPrimary,
        fontSize: FontSize.small,
    },
    userLocationContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -20,
        marginTop: -20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userPulse: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.info20,
    },
    userDot: {
        width: 16,
        height: 16,
        backgroundColor: Colors.info,
        borderRadius: 8,
        borderWidth: 3,
        borderColor: Colors.textPrimary,
        ...Shadows.md,
    },
    // Header Styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.sm,
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.black40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
    },
    // Filters Styles - Outline style for inactive
    filtersContainer: {
        paddingBottom: Spacing.sm,
    },
    filtersContent: {
        paddingHorizontal: Spacing.base,
    },
    filterChip: {
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.borderOutline,
        marginRight: Spacing.sm,
    },
    filterChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterChipText: {
        fontFamily: FontFamily.bodySemiBold,
        color: Colors.textPrimary,
        fontSize: FontSize.small,
    },
    filterChipTextActive: {
        color: Colors.textPrimary,
    },
    // Bottom Sheet Styles
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '55%',
        backgroundColor: Colors.cardDark,
        borderTopLeftRadius: BorderRadius['2xl'],
        borderTopRightRadius: BorderRadius['2xl'],
        ...Shadows.modal,
    },
    sheetHandle: {
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: Colors.white20,
        borderRadius: 2,
    },
    vendorCountContainer: {
        paddingHorizontal: Spacing.base,
        paddingBottom: Spacing.md,
    },
    vendorCountText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
        letterSpacing: 1,
    },
    vendorsList: {
        flex: 1,
    },
    vendorsListContent: {
        paddingHorizontal: Spacing.base,
    },
    // Vendor Card Styles
    vendorCard: {
        flexDirection: 'row',
        backgroundColor: Colors.backgroundDark,
        borderRadius: BorderRadius.lg,
        padding: Spacing.sm,
        marginBottom: Spacing.md,
        gap: Spacing.md,
    },
    vendorImageContainer: {
        width: 80,
        height: 80,
        borderRadius: BorderRadius.md,
        overflow: 'hidden',
        backgroundColor: Colors.cardDark,
    },
    vendorImage: {
        width: '100%',
        height: '100%',
    },
    vendorInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    vendorName: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    vendorCategory: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
        marginBottom: Spacing.xs,
    },
    vendorMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xs,
        gap: Gaps.sm,
    },
    metaDivider: {
        color: Colors.textMuted,
        fontSize: FontSize.caption,
    },
    metaText: {
        fontFamily: FontFamily.body,
        color: Colors.textPrimary,
        fontSize: FontSize.caption,
    },
    statusText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.tiny,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    // Floating Button Styles
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    floatingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.full,
        gap: Spacing.sm,
        ...Shadows.glowPrimary,
    },
    floatingButtonText: {
        fontFamily: FontFamily.bodySemiBold,
        color: Colors.textPrimary,
        fontSize: FontSize.small,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Spacing.xl,
    },
});
