import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ShoppingCart, 
  Trash, 
  Minus, 
  Plus,
  Truck,
  ArrowLeft,
  Tag,
  Info,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, TouchTarget } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { Button } from '../../components/ui';
import { useCartStore } from '../../stores/cartStore';

export default function CartTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, vendors, subtotal, deliveryFee, serviceFee, total, updateQuantity, removeItem, clearCart } = useCartStore();
  const [promoCode, setPromoCode] = useState('');

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.title}>Your Cart</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <ShoppingCart size={48} color={Colors.textMuted} weight="duotone" />
          </View>
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

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Cart</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Vendor Sections */}
        {vendors.map((vendor) => (
          <View key={vendor.id} style={styles.vendorSection}>
            {/* Vendor Header */}
            <View style={styles.vendorHeader}>
              <Image source={{ uri: vendor.logo_url }} style={styles.vendorLogo} />
              <View style={styles.vendorInfoContainer}>
                <Text style={styles.vendorName}>{vendor.name}</Text>
                <View style={styles.deliveryInfo}>
                  <Truck size={14} color={Colors.textMuted} weight="fill" />
                  <Text style={styles.deliveryTime}>Delivers in {vendor.delivery_time}</Text>
                </View>
              </View>
            </View>

            {/* Items */}
            {vendor.items.map((item) => (
              <View key={item.product_id} style={styles.itemCard}>
                <Image source={{ uri: item.product?.image_url }} style={styles.itemImage} />
                <View style={styles.itemContent}>
                  <View style={styles.itemTopRow}>
                    <View style={styles.itemNameContainer}>
                      <Text style={styles.itemName} numberOfLines={2}>{item.product?.name}</Text>
                      <Text style={styles.itemWeight}>{item.product?.weight}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => removeItem(item.product_id)}
                    >
                      <Trash size={20} color={Colors.textMuted} weight="regular" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.itemBottomRow}>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.product_id, item.quantity - 1)}
                      >
                        <Minus size={16} color={Colors.textPrimary} weight="bold" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.product_id, item.quantity + 1)}
                      >
                        <Plus size={16} color={Colors.textPrimary} weight="bold" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.itemPrice}>
                      £{((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}

        {/* Promo Code Section */}
        <View style={styles.promoSection}>
          <View style={styles.promoInputContainer}>
            <Tag size={18} color={Colors.textMuted} weight="regular" />
            <TextInput
              style={styles.promoInput}
              placeholder="Promo code"
              placeholderTextColor={Colors.textMuted}
              value={promoCode}
              onChangeText={setPromoCode}
            />
          </View>
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({itemCount} items)</Text>
            <Text style={styles.summaryValue}>£{subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>£{deliveryFee.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <View style={styles.serviceFeeLabel}>
              <Text style={styles.summaryLabel}>Service Fee</Text>
              <Info size={14} color={Colors.textMuted} weight="regular" />
            </View>
            <Text style={styles.summaryValue}>£{serviceFee.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>£{total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Checkout Button - Fixed at bottom */}
      <View style={[styles.checkoutContainer, { paddingBottom: insets.bottom + 90 }]}>
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => router.push('/checkout')}
          activeOpacity={0.9}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          <Text style={styles.checkoutPrice}>£{total.toFixed(2)}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: TouchTarget.min,
    height: TouchTarget.min,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamily.display,
    color: Colors.textPrimary,
    fontSize: FontSize.h3,
  },
  headerSpacer: {
    width: TouchTarget.min,
  },
  clearButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  clearText: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.primary,
    fontSize: FontSize.small,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontFamily: FontFamily.displayMedium,
    color: Colors.textPrimary,
    fontSize: FontSize.h4,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontFamily: FontFamily.body,
    color: Colors.textMuted,
    fontSize: FontSize.body,
    marginTop: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  
  // Vendor Section
  vendorSection: {
    marginBottom: Spacing.lg,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: Spacing.md,
  },
  vendorLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.md,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  vendorInfoContainer: {
    flex: 1,
  },
  vendorName: {
    fontFamily: FontFamily.bodyBold,
    color: Colors.textPrimary,
    fontSize: FontSize.body,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 2,
  },
  deliveryTime: {
    fontFamily: FontFamily.bodyMedium,
    color: Colors.textMuted,
    fontSize: FontSize.caption,
  },

  // Item Card
  itemCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.base,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.cardDark,
  },
  itemContent: {
    flex: 1,
    gap: Spacing.sm,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  itemNameContainer: {
    flex: 1,
  },
  itemName: {
    fontFamily: FontFamily.bodyMedium,
    color: Colors.textPrimary,
    fontSize: FontSize.small,
    lineHeight: 18,
  },
  itemWeight: {
    fontFamily: FontFamily.body,
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    marginTop: 2,
  },
  deleteButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    height: 32,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontFamily: FontFamily.bodyMedium,
    color: Colors.textPrimary,
    fontSize: FontSize.small,
    minWidth: 24,
    textAlign: 'center',
  },
  itemPrice: {
    fontFamily: FontFamily.bodyBold,
    color: Colors.secondary,
    fontSize: FontSize.body,
  },

  // Promo Section
  promoSection: {
    flexDirection: 'row',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  promoInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  promoInput: {
    flex: 1,
    fontFamily: FontFamily.body,
    color: Colors.textPrimary,
    fontSize: FontSize.small,
    paddingVertical: Spacing.sm,
  },
  applyButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontFamily: FontFamily.bodyBold,
    color: Colors.primary,
    fontSize: FontSize.small,
  },

  // Summary Section
  summarySection: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  summaryTitle: {
    fontFamily: FontFamily.displayMedium,
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  summaryLabel: {
    fontFamily: FontFamily.body,
    color: Colors.textMuted,
    fontSize: FontSize.small,
  },
  summaryValue: {
    fontFamily: FontFamily.bodyMedium,
    color: Colors.textPrimary,
    fontSize: FontSize.small,
  },
  serviceFeeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: Spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
  },
  totalLabel: {
    fontFamily: FontFamily.displayMedium,
    color: Colors.textPrimary,
    fontSize: FontSize.bodyLarge,
  },
  totalValue: {
    fontFamily: FontFamily.displayMedium,
    color: Colors.secondary,
    fontSize: FontSize.h3,
  },

  // Checkout Button
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    backgroundColor: Colors.backgroundDark,
  },
  checkoutButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
  },
  checkoutText: {
    fontFamily: FontFamily.bodyBold,
    color: Colors.textPrimary,
    fontSize: FontSize.body,
  },
  checkoutPrice: {
    fontFamily: FontFamily.bodyBold,
    color: Colors.secondary,
    fontSize: FontSize.body,
  },
});
