import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight, FontFamily } from '../../constants/typography';
import { Button } from '../../components/ui';
import { orderService } from '../../services/dataService';
import { Order } from '../../types';
import { useAuthStore } from '../../stores/authStore';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
    case 'completed':
      return Colors.success;
    case 'cancelled':
    case 'refunded':
      return Colors.error;
    default:
      return Colors.secondary;
  }
};

const TRACKING_STEPS = [
  { status: 'confirmed', label: 'Order Confirmed', icon: 'check-circle' },
  { status: 'preparing', label: 'Preparing', icon: 'chef-hat' },
  { status: 'ready', label: 'Ready for Pickup', icon: 'package-variant' },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: 'truck-delivery' },
  { status: 'delivered', label: 'Delivered', icon: 'home-check' },
];

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { sessionToken } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && sessionToken) {
      fetchOrder();
    }
  }, [id, sessionToken]);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getById(id!, sessionToken!);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    return TRACKING_STEPS.findIndex((step) => step.status === order.status);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Order not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentStep = getCurrentStepIndex();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{order.order_number}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
              {order.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.estimatedText}>Estimated delivery: 30-45 min</Text>
        </View>

        {/* Tracking Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Order Progress</Text>
          {TRACKING_STEPS.map((step, index) => (
            <View key={step.status} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.timelineDot,
                    index <= currentStep && styles.timelineDotActive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={step.icon as any}
                    size={16}
                    color={index <= currentStep ? Colors.textPrimary : Colors.textMuted}
                  />
                </View>
                {index < TRACKING_STEPS.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      index < currentStep && styles.timelineLineActive,
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.timelineLabel,
                  index <= currentStep && styles.timelineLabelActive,
                ]}
              >
                {step.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Order Items */}
        <View style={styles.itemsCard}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Image source={{ uri: item.image_url }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>£{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>£{order.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>£{order.delivery_fee.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Fee</Text>
            <Text style={styles.summaryValue}>£{order.service_fee.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>£{order.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Help Button */}
        <Button
          title="Need Help?"
          variant="outline"
          fullWidth
          style={{ marginHorizontal: Spacing.base, marginTop: Spacing.md }}
        />

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.textMuted,
    fontSize: FontSize.body,
  },
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
  scrollView: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: Colors.cardDark,
    marginHorizontal: Spacing.base,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.bold,
  },
  estimatedText: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
    marginTop: Spacing.sm,
  },
  timelineCard: {
    backgroundColor: Colors.cardDark,
    marginHorizontal: Spacing.base,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotActive: {
    backgroundColor: Colors.primary,
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: Colors.backgroundDark,
    marginVertical: 4,
  },
  timelineLineActive: {
    backgroundColor: Colors.primary,
  },
  timelineLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.body,
    paddingTop: 6,
  },
  timelineLabelActive: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.semiBold,
  },
  itemsCard: {
    backgroundColor: Colors.cardDark,
    marginHorizontal: Spacing.base,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundDark,
  },
  itemInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  itemName: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  itemQuantity: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    marginTop: 2,
  },
  itemPrice: {
    color: Colors.secondary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
  },
  summaryCard: {
    backgroundColor: Colors.cardDark,
    marginHorizontal: Spacing.base,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.body,
  },
  summaryValue: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
  },
  totalLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
  },
  totalValue: {
    color: Colors.secondary,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
  },
});
