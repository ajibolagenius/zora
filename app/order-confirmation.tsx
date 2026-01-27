import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Check,
  ArrowLeft,
  ArrowRight,
  Gift,
  Export,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, Heights } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { AnimationDuration, AnimationEasing } from '../constants';
import { orderService } from '../services/supabaseService';
import { realtimeService } from '../services/realtimeService';
import { isSupabaseConfigured } from '../lib/supabase';
import { Order } from '../types';
import { useAuthStore } from '../stores/authStore';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const fetchOrder = async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      if (isSupabaseConfigured()) {
        const orderData = await orderService.getById(orderId);
        setOrder(orderData);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Subscribe to real-time order updates
    if (isSupabaseConfigured() && orderId) {
      const unsubscribe = realtimeService.subscribeToTable(
        'orders',
        'UPDATE',
        async (payload) => {
          if (payload.new?.id === orderId) {
            // Order was updated, refresh the order data
            await fetchOrder();
          }
        },
        `id=eq.${orderId}`
      );

      return () => {
        if (unsubscribe) {
          unsubscribe.then((unsub) => {
            if (typeof unsub === 'function') {
              unsub();
            }
          });
        }
      };
    }
  }, [orderId]);

  useEffect(() => {
    if (!loading) {
      // Animate success icon
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: AnimationDuration.default,
            easing: AnimationEasing.standard,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: AnimationDuration.normal,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);

  // Get estimated delivery date range
  const getEstimatedDeliveryDate = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 2);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 4);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${days[startDate.getDay()]}, ${months[startDate.getMonth()]} ${startDate.getDate()} - ${days[endDate.getDay()]}, ${months[endDate.getMonth()]} ${endDate.getDate()}`;
  };

  const formattedDateRange = getEstimatedDeliveryDate();
  const orderNumber = order?.order_number || order?.id?.substring(0, 8) || orderId || 'ZORA-8839';

  const handleTrackOrder = () => {
    const trackingId = order?.id || orderId || orderNumber;
    router.push(`/order-tracking/${trackingId}`);
  };

  const handleContinueShopping = () => {
    router.push('/(tabs)');
  };

  const handleHelp = () => {
    router.push('/help');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/(tabs)')}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Confirmation</Text>
        <TouchableOpacity onPress={handleHelp}>
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <Animated.View style={[
          styles.successIconContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}>
          <View style={styles.successIcon}>
            <Check size={40} color={Colors.textPrimary} weight="bold" />
          </View>
        </Animated.View>

        {/* Header Text */}
        <Animated.View style={[
          styles.headerText,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <Text style={styles.title}>Order Placed!</Text>
          <Text style={styles.subtitle}>
            Thank you for shopping with Zora.{'\n'}
            Your order <Text style={styles.orderNumberHighlight}>#{orderNumber}</Text> has been confirmed.
          </Text>
        </Animated.View>

        {/* Track Order Button */}
        <Animated.View style={[
          styles.trackButtonContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <TouchableOpacity
            style={styles.trackButton}
            onPress={handleTrackOrder}
            activeOpacity={0.9}
          >
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Delivery Card */}
        <Animated.View style={[
          styles.deliveryCard,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          {/* Orange accent border */}
          <View style={styles.deliveryCardAccent} />
          <View style={styles.deliveryCardContent}>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryLabel}>ESTIMATED DELIVERY</Text>
              <Text style={styles.deliveryDate}>{formattedDateRange}</Text>
              <View style={styles.deliveryStatusRow}>
                <Text style={styles.deliveryStatusLabel}>Order Received</Text>
                <Text style={styles.deliveryStatusValue}>Processing</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              <Text style={styles.deliveryNote}>We've sent a confirmation email to your inbox.</Text>
            </View>
            <View style={styles.mapPreview}>
              {/* Static map placeholder with roads pattern */}
              <View style={styles.mapBackground}>
                {/* Horizontal roads */}
                <View style={[styles.mapRoad, styles.mapRoadH1]} />
                <View style={[styles.mapRoad, styles.mapRoadH2]} />
                {/* Vertical roads */}
                <View style={[styles.mapRoad, styles.mapRoadV1]} />
                <View style={[styles.mapRoad, styles.mapRoadV2]} />
                {/* Location pin */}
                <View style={styles.mapPin} />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Referral Card */}
        <Animated.View style={[
          styles.referralCard,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <View style={styles.referralHeader}>
            <View style={styles.referralIconContainer}>
              <Gift size={22} color={Colors.secondary} weight="fill" />
            </View>
            <View style={styles.referralContent}>
              <Text style={styles.referralTitle}>Share the love!</Text>
              <Text style={styles.referralDescription}>
                Give friends <Text style={styles.referralHighlight}>10% off</Text> and earn <Text style={styles.referralHighlight}>$10 credit</Text> when they shop.
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.inviteButton} activeOpacity={0.8}>
            <Export size={16} color={Colors.secondary} weight="bold" />
            <Text style={styles.inviteButtonText}>Invite Friends</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Continue Shopping Link */}
        <TouchableOpacity
          style={styles.continueShoppingButton}
          onPress={handleContinueShopping}
          activeOpacity={0.8}
        >
          <Text style={styles.continueShoppingText}>Continue Shopping</Text>
        </TouchableOpacity>

        {/* Bottom padding */}
        <View style={{ height: insets.bottom + 32 }} />
      </ScrollView>
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
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
  },
  helpText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.secondary,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
  },
  
  // Success Icon
  successIconContainer: {
    marginBottom: Spacing.lg,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  
  // Header Text
  headerText: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  title: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  orderNumberHighlight: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.secondary,
  },
  
  // Track Order Button
  trackButtonContainer: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  trackButton: {
    width: '100%',
    height: Heights.button,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  trackButtonText: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.bodyLarge,
    color: Colors.backgroundDark,
  },
  
  // Delivery Card
  deliveryCard: {
    width: '100%',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    paddingLeft: Spacing.base + 4,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    overflow: 'hidden',
    position: 'relative',
  },
  deliveryCardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: BorderRadius.xl,
    borderBottomLeftRadius: BorderRadius.xl,
  },
  deliveryCardContent: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.tiny,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  deliveryDate: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.bodyLarge,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  deliveryStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  deliveryStatusLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  deliveryStatusValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.secondary,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.white10,
    borderRadius: 2,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    width: '25%',
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
  deliveryNote: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  mapPreview: {
    width: 90,
    height: 90,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    position: 'relative',
  },
  mapRoad: {
    position: 'absolute',
    backgroundColor: Colors.textMuted + '80', // Using textMuted with 50% opacity for map road
  },
  mapRoadH1: {
    left: 0,
    right: 0,
    top: 25,
    height: 3,
  },
  mapRoadH2: {
    left: 0,
    right: 0,
    top: 55,
    height: 2,
  },
  mapRoadV1: {
    top: 0,
    bottom: 0,
    left: 30,
    width: 3,
  },
  mapRoadV2: {
    top: 0,
    bottom: 0,
    right: 20,
    width: 2,
  },
  mapPin: {
    position: 'absolute',
    top: 35,
    left: 45,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.secondary,
    borderWidth: 2,
    borderColor: Colors.textPrimary,
  },
  
  // Referral Card
  referralCard: {
    width: '100%',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.secondary + '66', // 40% opacity
  },
  referralHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  referralIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  referralContent: {
    flex: 1,
  },
  referralTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  referralDescription: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  referralHighlight: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.secondary,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  inviteButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.secondary,
  },
  
  // Continue Shopping
  continueShoppingButton: {
    paddingVertical: Spacing.md,
  },
  continueShoppingText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textMuted,
  },
});
