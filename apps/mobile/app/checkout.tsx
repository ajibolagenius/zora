import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Easing,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    ArrowRight,
    House,
    Briefcase,
    MapTrifold,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, Heights, Shadows } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { AnimationDuration, AnimationEasing } from '../constants';
import { useCartStore } from '../stores/cartStore';
import { onboardingService, type Address as OnboardingAddress } from '../services/onboardingService';
import { realtimeService } from '../services/realtimeService';
import { isSupabaseConfigured } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

type DeliveryTab = 'delivery' | 'pickup';

interface DateOption {
    day: string;
    date: number;
    month: string;
    isToday?: boolean;
}

interface TimeSlotOption {
    id: string;
    label: string;
}

interface AddressOption {
    id: string;
    label: string;
    address: string;
    isDefault?: boolean;
    icon: 'home' | 'work';
}

// Map onboarding address to checkout address format
const mapOnboardingAddressToAddressOption = (addr: OnboardingAddress): AddressOption => {
    const fullAddress = [
        addr.address_line1,
        addr.address_line2,
        addr.city,
        addr.postcode,
    ].filter(Boolean).join(', ');

    // Determine icon based on label
    const icon: 'home' | 'work' = addr.label.toLowerCase().includes('work') || addr.label.toLowerCase().includes('office') ? 'work' : 'home';

    return {
        id: addr.id,
        label: addr.label,
        address: fullAddress,
        isDefault: addr.is_default,
        icon,
    };
};

const TIME_SLOTS: TimeSlotOption[] = [
    { id: '1', label: '10:00 AM - 11:00 AM' },
    { id: '2', label: '11:00 AM - 12:00 PM' },
    { id: '3', label: '12:00 PM - 01:00 PM' },
    { id: '4', label: '01:00 PM - 02:00 PM' },
];

// Generate next 7 days
const generateDates = (): DateOption[] => {
    const dates: DateOption[] = [];
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push({
            day: i === 0 ? 'Today' : days[date.getDay()],
            date: date.getDate(),
            month: months[date.getMonth()],
            isToday: i === 0,
        });
    }
    return dates;
};

export default function CheckoutScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { total } = useCartStore();
    const { user } = useAuthStore();

    const [activeTab, setActiveTab] = useState<DeliveryTab>('delivery');
    const [addresses, setAddresses] = useState<AddressOption[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState(0);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('3');
    const [loading, setLoading] = useState(true);

    const dates = generateDates();

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            let addressData: AddressOption[] = [];

            if (isSupabaseConfigured() && user?.user_id) {
                const dbAddresses = await onboardingService.getUserAddresses(user.user_id);
                addressData = dbAddresses.map(mapOnboardingAddressToAddressOption);
            } else {
                // Fallback to mock addresses
                addressData = [
                    { id: '1', label: 'Home', address: '123 Nairobi St, Apt 4B, Westlands', isDefault: true, icon: 'home' },
                    { id: '2', label: 'Work', address: '45 Corporate Blvd, Suite 200', icon: 'work' },
                ];
            }

            setAddresses(addressData);

            // Set default selected address
            if (addressData.length > 0) {
                const defaultAddr = addressData.find(addr => addr.isDefault) || addressData[0];
                setSelectedAddress(defaultAddr.id);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
            // Fallback to mock addresses
            const mockAddresses: AddressOption[] = [
                { id: '1', label: 'Home', address: '123 Nairobi St, Apt 4B, Westlands', isDefault: true, icon: 'home' },
                { id: '2', label: 'Work', address: '45 Corporate Blvd, Suite 200', icon: 'work' },
            ];
            setAddresses(mockAddresses);
            setSelectedAddress(mockAddresses[0].id);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();

        // Subscribe to real-time address updates
        if (isSupabaseConfigured() && user?.user_id) {
            const unsubscribe = onboardingService.subscribeToAddresses(user.user_id, async (updatedAddresses) => {
                const mappedAddresses = updatedAddresses.map(mapOnboardingAddressToAddressOption);
                setAddresses(mappedAddresses);

                // Update selected address if current one was deleted
                if (selectedAddress && !mappedAddresses.find(addr => addr.id === selectedAddress)) {
                    const defaultAddr = mappedAddresses.find(addr => addr.isDefault) || mappedAddresses[0];
                    if (defaultAddr) {
                        setSelectedAddress(defaultAddr.id);
                    }
                }
            });

            return () => {
                if (typeof unsubscribe === 'function') {
                    unsubscribe();
                }
            };
        }
    }, [user?.user_id]);

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

    const handleContinue = () => {
        router.push('/payment');
    };

    const estimatedTotal = total || 124.50;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/(tabs)');
                        }
                    }}
                >
                    <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={styles.headerRight} />
            </View>

            <Animated.ScrollView
                style={[styles.scrollView, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Delivery/Pickup Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'delivery' && styles.tabActive]}
                        onPress={() => setActiveTab('delivery')}
                    >
                        <Text style={[styles.tabText, activeTab === 'delivery' && styles.tabTextActive]}>
                            Delivery
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'pickup' && styles.tabActive]}
                        onPress={() => setActiveTab('pickup')}
                    >
                        <Text style={[styles.tabText, activeTab === 'pickup' && styles.tabTextActive]}>
                            Store Pickup
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Delivering To Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivering to</Text>

                    {addresses.map((address) => {
                        const isSelected = selectedAddress === address.id;
                        return (
                            <TouchableOpacity
                                key={address.id}
                                style={[styles.addressCard, isSelected && styles.addressCardSelected]}
                                onPress={() => setSelectedAddress(address.id)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.addressLeft}>
                                    <View style={styles.addressIconContainer}>
                                        {address.icon === 'home' ? (
                                            <House size={18} color={Colors.textMuted} weight="fill" />
                                        ) : (
                                            <Briefcase size={18} color={Colors.textMuted} weight="fill" />
                                        )}
                                    </View>
                                    <View style={styles.addressInfo}>
                                        <View style={styles.addressLabelRow}>
                                            <Text style={styles.addressLabel}>{address.label}</Text>
                                            {address.isDefault && (
                                                <View style={styles.defaultBadge}>
                                                    <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.addressText}>{address.address}</Text>
                                    </View>
                                </View>
                                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                    {isSelected && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}

                    {/* Add New Address Button */}
                    <TouchableOpacity style={styles.addAddressButton} activeOpacity={0.8}>
                        <MapTrifold size={20} color={Colors.textMuted} weight="duotone" />
                        <Text style={styles.addAddressText}>Add New Address</Text>
                    </TouchableOpacity>
                </View>

                {/* Preferred Time Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferred Time</Text>

                    {/* Date Picker */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.datesContainer}
                    >
                        {dates.map((dateOption, index) => {
                            const isSelected = selectedDate === index;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                                    onPress={() => setSelectedDate(index)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.dateDay, isSelected && styles.dateDaySelected]}>
                                        {dateOption.day}
                                    </Text>
                                    <Text style={[styles.dateNumber, isSelected && styles.dateNumberSelected]}>
                                        {dateOption.date}
                                    </Text>
                                    <Text style={[styles.dateMonth, isSelected && styles.dateMonthSelected]}>
                                        {dateOption.month}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* Time Slots Grid */}
                    <View style={styles.timeSlotsGrid}>
                        {TIME_SLOTS.map((slot) => {
                            const isSelected = selectedTimeSlot === slot.id;
                            return (
                                <TouchableOpacity
                                    key={slot.id}
                                    style={[styles.timeSlotChip, isSelected && styles.timeSlotChipSelected]}
                                    onPress={() => setSelectedTimeSlot(slot.id)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.timeSlotText, isSelected && styles.timeSlotTextSelected]}>
                                        {slot.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Bottom spacing */}
                <View style={{ height: 140 }} />
            </Animated.ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <View style={styles.footerTotalRow}>
                    <Text style={styles.footerTotalLabel}>Estimated Total</Text>
                    <Text style={styles.footerTotalValue}>£{estimatedTotal.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                    activeOpacity={0.9}
                >
                    <Text style={styles.continueButtonText}>Continue to Payment</Text>
                    <ArrowRight size={20} color={Colors.backgroundDark} weight="bold" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundDark,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderDark,
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
    headerTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
    },
    headerRight: {
        width: 44,
    },

    // Scroll View
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.base,
    },

    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.lg,
        padding: Spacing.xs,
        marginBottom: Spacing.lg,
    },
    tab: {
        flex: 1,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: Colors.secondary,
    },
    tabText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.body,
        color: Colors.textMuted,
    },
    tabTextActive: {
        color: Colors.backgroundDark,
    },

    // Sections
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },

    // Address Card
    addressCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.lg,
        padding: Spacing.base,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.borderDark,
    },
    addressCardSelected: {
        borderColor: Colors.secondary,
    },
    addressLeft: {
        flexDirection: 'row',
        flex: 1,
        gap: Spacing.md,
    },
    addressIconContainer: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.backgroundDark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addressInfo: {
        flex: 1,
    },
    addressLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    addressLabel: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
    },
    defaultBadge: {
        backgroundColor: Colors.secondary20,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
    },
    defaultBadgeText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.tiny,
        color: Colors.secondary,
        letterSpacing: 0.5,
    },
    addressText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },

    // Radio Button
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: Colors.white20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: {
        borderColor: Colors.secondary,
        backgroundColor: Colors.secondary,
    },
    radioInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.backgroundDark,
    },

    // Add Address Button
    addAddressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.base,
        borderRadius: BorderRadius.lg,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: Colors.borderOutline,
    },
    addAddressText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
    },

    // Date Picker
    datesContainer: {
        gap: Spacing.md,
        marginBottom: Spacing.base,
    },
    dateCard: {
        width: 70,
        height: 90,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.cardDark,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    dateCardSelected: {
        backgroundColor: 'transparent',
        borderColor: Colors.secondary,
    },
    dateDay: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
    },
    dateDaySelected: {
        color: Colors.secondary,
    },
    dateNumber: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h2,
        color: Colors.textPrimary,
        marginVertical: 2,
    },
    dateNumberSelected: {
        color: Colors.secondary,
    },
    dateMonth: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
    },
    dateMonthSelected: {
        color: Colors.secondary,
    },

    // Time Slots Grid
    timeSlotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    timeSlotChip: {
        width: '48%',
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.cardDark,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    timeSlotChipSelected: {
        borderColor: Colors.secondary,
        backgroundColor: 'transparent',
    },
    timeSlotText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
    timeSlotTextSelected: {
        color: Colors.secondary,
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.base,
        backgroundColor: Colors.backgroundDark,
        borderTopWidth: 1,
        borderTopColor: Colors.borderDark,
    },
    footerTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    footerTotalLabel: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.body,
        color: Colors.textMuted,
    },
    footerTotalValue: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h3,
        color: Colors.textPrimary,
    },
    continueButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.secondary,
        borderRadius: BorderRadius.lg,
        height: Heights.button,
        ...Shadows.glowSecondary,
    },
    continueButtonText: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.body,
        color: Colors.backgroundDark,
    },
});
