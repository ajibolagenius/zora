import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    Animated,
    Easing,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft,
    Phone,
    ChatCircle,
    Storefront,
    House,
    Truck,
    Check,
    DotsThree,
    Crosshair,
    Headset,
    Warning,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { AnimationDuration, AnimationEasing, ImageUrlBuilders } from '../../constants';
import { orderService } from '../../services/supabaseService';
import { realtimeService } from '../../services/realtimeService';
import { messagingService } from '../../services/messagingService';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Order } from '../../types';
import { useAuthStore } from '../../stores/authStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TimelineStep {
    id: string;
    label: string;
    time?: string;
    description?: string;
    status: 'completed' | 'active' | 'pending';
}

const ORDER_STATUS_MAP: Record<string, { label: string; stepIndex: number }> = {
    'pending': { label: 'Order Confirmed', stepIndex: 0 },
    'confirmed': { label: 'Order Confirmed', stepIndex: 0 },
    'preparing': { label: 'Order Prepared', stepIndex: 1 },
    'ready': { label: 'Picked Up', stepIndex: 2 },
    'out_for_delivery': { label: 'Out for delivery', stepIndex: 3 },
    'delivered': { label: 'Delivered', stepIndex: 4 },
    'cancelled': { label: 'Cancelled', stepIndex: -1 },
};

const TIMELINE_STEPS: TimelineStep[] = [
    { id: '1', label: 'Order Confirmed', status: 'pending' },
    { id: '2', label: 'Order Prepared', status: 'pending' },
    { id: '3', label: 'Picked Up', status: 'pending' },
    { id: '4', label: 'Out for delivery', status: 'pending' },
    { id: '5', label: 'Delivered', status: 'pending' },
];

export default function OrderTrackingScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { session, user } = useAuthStore();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const fetchOrder = async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const orderData = await orderService.getById(id);
            setOrder(orderData);
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();

        // Check for unread support messages
        const checkUnreadMessages = async () => {
            if (!isSupabaseConfigured() || !user?.user_id || !id) {
                return;
            }

            try {
                const conversation = await messagingService.getOrCreateSupportConversation(user.user_id, id);
                if (conversation && conversation.unread_count_user > 0) {
                    setHasUnreadMessages(true);
                }
            } catch (error) {
                console.error('Error checking unread messages:', error);
            }
        };

        checkUnreadMessages();

        // Subscribe to real-time order updates
        if (isSupabaseConfigured() && id) {
            let isMounted = true;
            const unsubscribers: (() => void)[] = [];

            // Subscribe to order updates
            realtimeService.subscribeToTable(
                'orders',
                '*',
                async (payload) => {
                    if (!isMounted) return;

                    if (payload.new?.id === id || payload.old?.id === id) {
                        // Order was updated, refresh the order data
                        try {
                            await fetchOrder();
                        } catch (error) {
                            console.error('Error refreshing order:', error);
                        }
                    }
                },
                `id=eq.${id}`
            ).then((unsub) => {
                if (isMounted && unsub) unsubscribers.push(unsub);
            }).catch((error) => {
                console.error('Error setting up order subscription:', error);
            });

            // Subscribe to conversation updates for unread count
            if (user?.user_id) {
                messagingService.getOrCreateSupportConversation(user.user_id, id).then((conversation) => {
                    if (!conversation || !isMounted) return;

                    realtimeService.subscribeToTable(
                        'conversations',
                        'UPDATE',
                        async (payload) => {
                            if (!isMounted) return;

                            if (payload.new?.id === conversation.id) {
                                setHasUnreadMessages((payload.new.unread_count_user || 0) > 0);
                            }
                        },
                        `id=eq.${conversation.id}`
                    ).then((unsub) => {
                        if (isMounted && unsub) unsubscribers.push(unsub);
                    }).catch((error) => {
                        console.error('Error setting up conversation subscription:', error);
                    });
                });
            }

            return () => {
                isMounted = false;
                unsubscribers.forEach((unsub) => {
                    if (typeof unsub === 'function') {
                        unsub();
                    }
                });
            };
        }
    }, [id, user?.user_id]);

    useEffect(() => {
        if (!loading) {
            // Entrance animation
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

            // Driver pin pulse animation (only if order is in transit)
            if (order && order.status === 'out_for_delivery') {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(pulseAnim, {
                            toValue: 1.2,
                            duration: 1000,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(pulseAnim, {
                            toValue: 1,
                            duration: 1000,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                    ])
                ).start();
            }
        }
    }, [loading, order]);

    // Calculate timeline steps based on order status
    const timelineSteps = useMemo(() => {
        if (!order) return TIMELINE_STEPS;

        const statusInfo = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP['pending'];
        const currentStepIndex = statusInfo.stepIndex;

        return TIMELINE_STEPS.map((step, index) => {
            if (index < currentStepIndex) {
                return { ...step, status: 'completed' as const };
            } else if (index === currentStepIndex) {
                return { ...step, status: 'active' as const };
            } else {
                return { ...step, status: 'pending' as const };
            }
        });
    }, [order]);

    const orderNumber = order?.order_number || order?.id?.substring(0, 8) || id || '8821';

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            {/* Map Background */}
            <View style={styles.mapContainer}>
                {/* Dot Pattern Background */}
                <View style={styles.mapPattern}>
                    {Array.from({ length: 200 }).map((_, i) => (
                        <View key={i} style={styles.mapDot} />
                    ))}
                </View>

                {/* Route Line */}
                <View style={styles.routeLineContainer}>
                    <View style={styles.routeLine} />
                </View>

                {/* Vendor Pin */}
                <View style={styles.vendorPinContainer}>
                    <View style={styles.markerBalloon}>
                        <Storefront size={18} color="#FFFFFF" weight="fill" />
                    </View>
                    <View style={styles.markerTail} />
                </View>

                {/* Driver Pin - Animated */}
                <Animated.View style={[styles.driverPinContainer, { transform: [{ scale: pulseAnim }] }]}>
                    <View style={styles.driverPulse} />
                    <View style={styles.driverPin}>
                        <Truck size={16} color={Colors.primary} weight="fill" />
                    </View>
                </Animated.View>

                {/* Destination Pin */}
                <View style={styles.destinationPinContainer}>
                    <View style={styles.destinationBalloon}>
                        <House size={18} color="#FFFFFF" weight="fill" />
                    </View>
                    <View style={styles.destinationTail} />
                </View>
            </View>

            {/* Top AppBar (Floating) */}
            <SafeAreaView style={styles.topBar} edges={['top']}>
                <TouchableOpacity
                    style={styles.topBarButton}
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/(tabs)');
                        }
                    }}
                    onLongPress={async () => {
                        // HIDDEN DEBUG ACTION: Simulate Dispatch
                        if (order?.id) {
                            await orderService.adminSimulateDispatch(
                                order.id,
                                'DPD',
                                '15504203025211',
                                'https://www.dpd.co.uk/tracking'
                            );
                            // Refresh order
                            fetchOrder();
                            alert('DEBUG: Order dispatched with DPD!');
                        }
                    }}
                >
                    <ArrowLeft size={22} color="#FFFFFF" weight="bold" />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>TRACK ORDER</Text>
                    <Text style={styles.orderNumberText}>#{orderNumber}</Text>
                </View>

                <TouchableOpacity style={styles.topBarButton}>
                    <DotsThree size={22} color="#FFFFFF" weight="bold" />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Location Button (Floating) */}
            <View style={styles.locationButtonContainer}>
                <TouchableOpacity style={styles.locationButton}>
                    <Crosshair size={22} color="#FFFFFF" weight="bold" />
                </TouchableOpacity>
            </View>

            {/* Bottom Sheet */}
            <Animated.View style={[styles.bottomSheet, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                {/* Drag Handle */}
                <View style={styles.dragHandle} />

                <ScrollView
                    style={styles.sheetContent}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.sheetContentInner}
                >
                    {/* Arrival Time & Progress */}
                    <View style={styles.arrivalSection}>
                        <View style={styles.arrivalHeader}>
                            <Text style={styles.arrivalTitle}>Arriving in ~15 mins</Text>
                            <View style={styles.onTimeBadge}>
                                <Text style={styles.onTimeText}>On Time</Text>
                            </View>
                        </View>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: '75%' }]} />
                        </View>
                    </View>

                    {/* Delivery Info Card */}
                    <View style={styles.driverCard}>
                        {order?.delivery_provider ? (
                            // Third-Party Courier UI
                            <>
                                <View style={styles.driverPhoto}>
                                    <View style={[styles.driverImage, { backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }]}>
                                        <Truck size={32} color={Colors.primary} weight="duotone" />
                                    </View>
                                </View>

                                <View style={styles.driverInfo}>
                                    <Text style={styles.driverName}>Shipped with {order.delivery_provider}</Text>
                                    <Text style={styles.vehicleInfo}>
                                        Ref: <Text style={{ fontFamily: FontFamily.body }}>{order.tracking_reference || 'N/A'}</Text>
                                    </Text>
                                </View>

                                <View style={styles.driverActions}>
                                    <TouchableOpacity
                                        style={[styles.callButton, { width: 'auto', paddingHorizontal: Spacing.md }]}
                                        onPress={() => {
                                            if (order.tracking_url) {
                                                // Open external link
                                                import('react-native').then(({ Linking }) => {
                                                    Linking.openURL(order.tracking_url!);
                                                });
                                            } else {
                                                // Fallback or copy to clipboard
                                                import('react-native').then(({ Alert, Clipboard }) => {
                                                    if (order.tracking_reference) {
                                                        Clipboard.setString(order.tracking_reference);
                                                        Alert.alert('Copied', 'Tracking reference copied to clipboard');
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        <Text style={{ color: '#FFF', fontFamily: FontFamily.bodySemiBold, fontSize: FontSize.small }}>
                                            Track
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            // Fallback / Internal Driver UI (Legacy)
                            <>
                                <View style={styles.driverPhoto}>
                                    <Image
                                        source={{ uri: ImageUrlBuilders.dicebearAvatar('David') }}
                                        style={styles.driverImage}
                                    />
                                    <View style={styles.ratingBadge}>
                                        <Text style={styles.ratingText}>★ 4.9</Text>
                                    </View>
                                </View>

                                <View style={styles.driverInfo}>
                                    <Text style={styles.driverName}>David</Text>
                                    <Text style={styles.vehicleInfo}>White Toyota Camry</Text>
                                    <View style={styles.licensePlate}>
                                        <Text style={styles.licensePlateText}>AB 123 CD</Text>
                                    </View>
                                </View>

                                <View style={styles.driverActions}>
                                    <TouchableOpacity style={styles.callButton}>
                                        <Phone size={20} color="#FFFFFF" weight="fill" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.chatButton}>
                                        <ChatCircle size={20} color={Colors.primary} weight="fill" />
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>

                    {/* Timeline */}
                    <View style={styles.timelineContainer}>
                        {timelineSteps.map((step, index) => {
                            const isLast = index === timelineSteps.length - 1;

                            return (
                                <View key={step.id} style={styles.timelineStep}>
                                    {/* Left: Icons and Line */}
                                    <View style={styles.timelineLeft}>
                                        {/* Step Icon */}
                                        {step.status === 'completed' ? (
                                            <View style={styles.stepIconCompleted}>
                                                <Check size={14} color="#FFFFFF" weight="bold" />
                                            </View>
                                        ) : step.status === 'active' ? (
                                            <View style={styles.stepIconActive}>
                                                <View style={styles.stepIconActiveDot} />
                                            </View>
                                        ) : (
                                            <View style={styles.stepIconPending} />
                                        )}

                                        {/* Line */}
                                        {!isLast && (
                                            <View style={[
                                                styles.timelineLine,
                                                step.status === 'completed' && styles.timelineLineCompleted,
                                                step.status === 'active' && styles.timelineLineActive,
                                            ]} />
                                        )}
                                    </View>

                                    {/* Right: Content */}
                                    <View style={[
                                        styles.timelineRight,
                                        step.status === 'pending' && styles.timelineRightPending,
                                    ]}>
                                        <Text style={[
                                            styles.stepLabel,
                                            step.status === 'completed' && styles.stepLabelCompleted,
                                            step.status === 'active' && styles.stepLabelActive,
                                        ]}>
                                            {step.label}
                                        </Text>
                                        {step.status === 'completed' && order?.updated_at && (
                                            <Text style={styles.stepTime}>
                                                {new Date(order.updated_at).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </Text>
                                        )}
                                        {step.status === 'active' && order?.status === 'out_for_delivery' && (
                                            <Text style={styles.stepDescription}>Driver is heading your way</Text>
                                        )}
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                            style={styles.needHelpButton}
                            onPress={() => {
                                // Use order ID to ensure unique chat session per order
                                const orderId = order?.id || id;
                                router.push(`/order-support/${orderId}`);
                            }}
                            activeOpacity={0.8}
                        >
                            <View style={styles.needHelpButtonContent}>
                                <Headset size={18} color={Colors.primary} weight="duotone" />
                                <Text style={styles.needHelpText}>Need Help?</Text>
                                {hasUnreadMessages && <View style={styles.unreadBadge} />}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.reportIssueButton}
                            onPress={() => {
                                // Use order ID for consistency
                                const orderId = order?.id || id;
                                router.push(`/report-issue?orderId=${orderId}`);
                            }}
                            activeOpacity={0.8}
                        >
                            <Warning size={18} color="#EF4444" weight="fill" />
                            <Text style={styles.reportIssueText}>Report Issue</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundDark,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Map
    mapContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.cardDark,
    },
    mapPattern: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.md,
        gap: 20,
    },
    mapDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.white08,
    },
    routeLineContainer: {
        position: 'absolute',
        top: 100,
        left: '35%',
        width: 60,
        height: 350,
    },
    routeLine: {
        position: 'absolute',
        left: 20,
        top: 0,
        width: 4,
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 2,
        ...Shadows.glowPrimary,
    },

    // Pins - Balloon Style
    vendorPinContainer: {
        position: 'absolute',
        top: 80,
        left: '30%',
        alignItems: 'center',
    },
    markerBalloon: {
        backgroundColor: Colors.primary,
        padding: Spacing.sm,
        borderRadius: BorderRadius.lg,
        ...Shadows.md,
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
    driverPinContainer: {
        position: 'absolute',
        top: 260,
        left: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    driverPulse: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.primary20,
    },
    driverPin: {
        padding: Spacing.sm,
        borderRadius: BorderRadius.full,
        backgroundColor: '#FFFFFF',
        ...Shadows.sm,
    },
    destinationPinContainer: {
        position: 'absolute',
        top: 400,
        left: '38%',
        alignItems: 'center',
    },
    destinationBalloon: {
        backgroundColor: Colors.success || '#22C55E',
        padding: Spacing.sm,
        borderRadius: BorderRadius.lg,
        ...Shadows.md,
    },
    destinationTail: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: Colors.success || '#22C55E',
        marginTop: -1,
    },

    // Top Bar
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        paddingHorizontal: Spacing.base,
        paddingBottom: Spacing.base,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topBarButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.black40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        backgroundColor: Colors.black40,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
    },
    titleText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.caption,
        color: Colors.textPrimary,
        letterSpacing: 1,
    },
    orderNumberText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.tiny,
        color: Colors.textMuted,
        letterSpacing: 1,
    },

    // Location Button
    locationButtonContainer: {
        position: 'absolute',
        bottom: '52%',
        right: Spacing.base,
        zIndex: 20,
    },
    locationButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.black40,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Bottom Sheet
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: '60%',
        backgroundColor: Colors.cardDark,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        zIndex: 40,
        ...Shadows.modal,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: Colors.white20,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: Spacing.md,
        marginBottom: Spacing.xs,
    },
    sheetContent: {
        flex: 1,
    },
    sheetContentInner: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.xl,
        gap: Spacing.base,
    },

    // Arrival Section
    arrivalSection: {
        gap: Spacing.md,
    },
    arrivalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    arrivalTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h3,
        color: Colors.textPrimary,
    },
    onTimeBadge: {
        backgroundColor: Colors.success15,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
        borderWidth: 1,
        borderColor: Colors.success + '4D', // 30% opacity
    },
    onTimeText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.caption,
        color: '#22C55E',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: Colors.white10,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },

    // Driver Card
    driverCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        backgroundColor: Colors.backgroundDark,
        padding: Spacing.base,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.borderDark,
    },
    driverPhoto: {
        position: 'relative',
    },
    driverImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    ratingBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: Colors.secondary,
        paddingHorizontal: Spacing.xs,
        paddingVertical: 2,
        borderRadius: BorderRadius.full,
    },
    ratingText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.tiny,
        color: '#000',
    },
    driverInfo: {
        flex: 1,
    },
    driverName: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
    },
    vehicleInfo: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
        marginTop: 2,
    },
    licensePlate: {
        backgroundColor: Colors.white10,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
        alignSelf: 'flex-start',
        marginTop: Spacing.xs,
    },
    licensePlateText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.tiny,
        color: Colors.textPrimary,
        letterSpacing: 1,
    },
    driverActions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    callButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Timeline
    timelineContainer: {
        paddingLeft: Spacing.sm,
    },
    timelineStep: {
        flexDirection: 'row',
        gap: Spacing.base,
    },
    timelineLeft: {
        alignItems: 'center',
        width: 24,
    },
    stepIconCompleted: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    stepIconActive: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        marginTop: 2,
    },
    stepIconActiveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
    stepIconPending: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.white20,
        zIndex: 10,
        marginTop: 6,
    },
    timelineLine: {
        width: 2,
        height: 28,
        backgroundColor: Colors.white10,
        marginVertical: Spacing.xs,
    },
    timelineLineCompleted: {
        backgroundColor: Colors.primary30,
    },
    timelineLineActive: {
        backgroundColor: Colors.primary,
    },
    timelineRight: {
        flex: 1,
        paddingBottom: Spacing.md,
    },
    timelineRightPending: {
        opacity: 0.4,
    },
    stepLabel: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
    stepLabelCompleted: {
        color: Colors.textMuted,
    },
    stepLabelActive: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
    },
    stepTime: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
        marginTop: 2,
    },
    stepDescription: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
        marginTop: 2,
    },

    // Action Buttons
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.sm,
    },
    needHelpButton: {
        flex: 1,
        paddingVertical: Spacing.md,
        backgroundColor: 'transparent',
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    needHelpButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        position: 'relative',
    },
    needHelpText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.primary,
    },
    unreadBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        borderWidth: 1.5,
        borderColor: Colors.cardDark,
    },
    reportIssueButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.md,
        backgroundColor: 'transparent',
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: '#EF4444',
    },
    reportIssueText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: '#EF4444',
    },
});
