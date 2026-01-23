import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontWeight } from '../constants/typography';
import { Button } from '../components/ui';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { orderService } from '../services/dataService';

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, subtotal, deliveryFee, serviceFee, total, clearCart } = useCartStore();
  const { isAuthenticated, sessionToken } = useAuthStore();

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !sessionToken) {
      router.push('/(auth)/login');
      return;
    }

    try {
      // Create order
      const orderData = {
        items: items.map((item) => ({
          product_id: item.product_id,
          vendor_id: item.vendor_id,
          name: item.product?.name || '',
          image_url: item.product?.image_url || '',
          price: item.product?.price || 0,
          quantity: item.quantity,
        })),
        delivery_option: 'delivery',
        payment_method: 'card',
      };

      const order = await orderService.create(orderData, sessionToken);
      
      // Clear cart
      await clearCart();
      
      // Navigate to success
      Alert.alert(
        'Order Placed!',
        `Your order ${order.order_number} has been placed successfully.`,
        [
          {
            text: 'View Order',
            onPress: () => router.replace(`/order/${order.id}`),
          },
          {
            text: 'Continue Shopping',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <TouchableOpacity style={styles.addressCard}>
            <MaterialCommunityIcons name="map-marker" size={24} color={Colors.primary} />
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>Home</Text>
              <Text style={styles.addressText}>123 Example Street, London, SW1A 1AA</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity style={styles.paymentCard}>
            <MaterialCommunityIcons name="credit-card" size={24} color={Colors.primary} />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentLabel}>Credit/Debit Card</Text>
              <Text style={styles.paymentText}>Pay securely with Stripe</Text>
            </View>
            <View style={styles.selectedIndicator}>
              <MaterialCommunityIcons name="check" size={16} color={Colors.textPrimary} />
            </View>
          </TouchableOpacity>
          <Text style={styles.paymentNote}>
            Note: Stripe payment is configured with placeholder keys. Replace with actual keys for live payments.
          </Text>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items ({items.length})</Text>
              <Text style={styles.summaryValue}>£{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>£{deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Fee</Text>
              <Text style={styles.summaryValue}>£{serviceFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>£{total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <Button
          title={`Pay £${total.toFixed(2)}`}
          fullWidth
          onPress={handlePlaceOrder}
        />
      </View>
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
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
  },
  addressInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  addressLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
  },
  addressText: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
    marginTop: 2,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  paymentInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  paymentLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
  },
  paymentText: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
    marginTop: 2,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentNote: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  summaryCard: {
    backgroundColor: Colors.cardDark,
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
  footer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
  },
});
