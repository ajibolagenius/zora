import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Button } from '../../components/ui';
import { useCartStore } from '../../stores/cartStore';

export default function CartTab() {
  const router = useRouter();
  const { items, vendors, subtotal, deliveryFee, serviceFee, total, updateQuantity, removeItem, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="cart-outline" size={80} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add items to get started</Text>
          <Button
            title="Start Shopping"
            onPress={() => router.push('/(tabs)')}
            style={{ marginTop: Spacing.lg }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Cart</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {vendors.map((vendor) => (
          <View key={vendor.id} style={styles.vendorSection}>
            <View style={styles.vendorHeader}>
              <Image source={{ uri: vendor.logo_url }} style={styles.vendorLogo} />
              <View>
                <Text style={styles.vendorName}>{vendor.name}</Text>
                <Text style={styles.deliveryTime}>
                  <MaterialCommunityIcons name="truck-delivery-outline" size={12} color={Colors.textMuted} />
                  {' '}Delivers in {vendor.delivery_time}
                </Text>
              </View>
            </View>

            {vendor.items.map((item) => (
              <View key={item.product_id} style={styles.itemRow}>
                <Image source={{ uri: item.product?.image_url }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.product?.name}</Text>
                  <Text style={styles.itemWeight}>{item.product?.weight}</Text>
                  <View style={styles.quantityRow}>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.product_id, item.quantity - 1)}
                      >
                        <MaterialCommunityIcons name="minus" size={18} color={Colors.textPrimary} />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.product_id, item.quantity + 1)}
                      >
                        <MaterialCommunityIcons name="plus" size={18} color={Colors.textPrimary} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.itemPrice}>
                      £{((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeItem(item.product_id)}
                >
                  <MaterialCommunityIcons name="delete-outline" size={20} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>£{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
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

        <View style={{ height: 150 }} />
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <Button
          title={`Proceed to Checkout • £${total.toFixed(2)}`}
          fullWidth
          onPress={() => router.push('/checkout')}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
  },
  clearText: {
    color: Colors.primary,
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.body,
    marginTop: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  vendorSection: {
    backgroundColor: Colors.cardDark,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  vendorLogo: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.md,
    backgroundColor: Colors.backgroundDark,
  },
  vendorName: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
  },
  deliveryTime: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    marginTop: 2,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundDark,
  },
  itemInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  itemName: {
    color: Colors.textPrimary,
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
  },
  itemWeight: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    marginTop: 2,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.md,
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
    minWidth: 30,
    textAlign: 'center',
  },
  itemPrice: {
    color: Colors.secondary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
  },
  deleteButton: {
    padding: Spacing.sm,
  },
  summarySection: {
    backgroundColor: Colors.cardDark,
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
  },
  summaryTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
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
  checkoutContainer: {
    position: 'absolute',
    bottom: 90,
    left: Spacing.base,
    right: Spacing.base,
  },
});
