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
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { Button } from '../../components/ui';
import { useCartStore } from '../../stores/cartStore';

// Zora Brand Colors
const ZORA_YELLOW = '#FFCC00';
const ZORA_RED = '#C1272D';
const ZORA_CARD = 'rgba(58, 42, 33, 0.3)';
const ZORA_CARD_SOLID = '#3A2A21';
const ZORA_INPUT = '#2D1E18';

export default function CartTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, vendors, subtotal, deliveryFee, serviceFee, total, updateQuantity, removeItem, clearCart } = useCartStore();
  const [promoCode, setPromoCode] = useState('');

  if (items.length === 0) {
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
          <Text style={styles.headerTitle}>Your Cart</Text>
          <View style={styles.headerRight} />
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
        <Text style={styles.headerTitle}>Your Cart</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Vendor Sections */}
        {vendors.map((vendor, vendorIndex) => (
          <View key={vendor.id} style={[styles.vendorSection, vendorIndex > 0 && { paddingTop: Spacing.sm }]}>
            {/* Vendor Header */}
            <View style={styles.vendorHeader}>
              <Image source={{ uri: vendor.logo_url }} style={styles.vendorLogo} />
              <View style={styles.vendorInfo}>
                <Text style={styles.vendorName}>{vendor.name}</Text>
                <View style={styles.deliveryRow}>
                  <Truck size={14} color="rgba(255, 255, 255, 0.5)" weight="fill" />
                  <Text style={styles.deliveryText}>Delivers in {vendor.delivery_time}</Text>
                </View>
              </View>
            </View>

            {/* Items */}
            {vendor.items.map((item) => {
              // Handle both image_url and image_urls array
              const productImage = item.product?.image_url || 
                (item.product as any)?.image_urls?.[0] || 
                'https://via.placeholder.com/60';
              
              return (
              <View key={item.product_id} style={styles.itemCard}>
                {/* Product Image */}
                <Image source={{ uri: productImage }} style={styles.itemImage} />
                
                {/* Product Content */}
                <View style={styles.itemContent}>
                  {/* Top Row: Name + Delete */}
                  <View style={styles.itemTopRow}>
                    <View style={styles.itemNameContainer}>
                      <Text style={styles.itemName} numberOfLines={2}>{item.product?.name}</Text>
                      <Text style={styles.itemVariant}>{item.product?.weight}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => removeItem(item.product_id)}
                    >
                      <Trash size={20} color="rgba(255, 255, 255, 0.3)" weight="regular" />
                    </TouchableOpacity>
                  </View>
                  
                  {/* Bottom Row: Quantity + Price */}
                  <View style={styles.itemBottomRow}>
                    {/* Quantity Stepper */}
                    <View style={styles.quantityStepper}>
                      <TouchableOpacity
                        style={styles.stepperButton}
                        onPress={() => updateQuantity(item.product_id, item.quantity - 1)}
                      >
                        <Minus size={16} color={Colors.textPrimary} weight="bold" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.stepperButton}
                        onPress={() => updateQuantity(item.product_id, item.quantity + 1)}
                      >
                        <Plus size={16} color={Colors.textPrimary} weight="bold" />
                      </TouchableOpacity>
                    </View>
                    
                    {/* Price */}
                    <Text style={styles.itemPrice}>
                      £{((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
              );
            })}
          </View>
        ))}

        {/* Promo Code Section */}
        <View style={styles.promoCard}>
          <View style={styles.promoInputWrapper}>
            <Tag size={18} color="rgba(255, 255, 255, 0.4)" weight="regular" style={styles.promoIcon} />
            <TextInput
              style={styles.promoInput}
              placeholder="Promo code"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              value={promoCode}
              onChangeText={setPromoCode}
            />
          </View>
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
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
            <View style={styles.serviceFeeRow}>
              <Text style={styles.summaryLabel}>Service Fee</Text>
              <Info size={14} color="rgba(255, 255, 255, 0.4)" weight="regular" />
            </View>
            <Text style={styles.summaryValue}>£{serviceFee.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>£{total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Bottom spacing for checkout button */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky Footer - Checkout Button */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
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
    fontFamily: FontFamily.display,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
  },
  headerRight: {
    width: 60,
  },
  clearAllText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: ZORA_RED,
  },
  
  // Empty State
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
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
  },
  
  // Vendor Section
  vendorSection: {
    marginBottom: Spacing.lg,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: Spacing.md,
  },
  vendorLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  deliveryText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  
  // Item Card
  itemCard: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    backgroundColor: ZORA_CARD,
    padding: 12,
    borderRadius: BorderRadius.lg,
    marginBottom: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.cardDark,
  },
  itemContent: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  itemNameContainer: {
    flex: 1,
  },
  itemName: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  itemVariant: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  
  // Quantity Stepper
  quantityStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ZORA_INPUT,
    borderRadius: BorderRadius.lg,
    height: 32,
  },
  stepperButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    width: 24,
    textAlign: 'center',
  },
  
  // Item Price
  itemPrice: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: ZORA_YELLOW,
  },
  
  // Promo Code Section
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: ZORA_CARD_SOLID,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.base,
  },
  promoInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ZORA_INPUT,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 12,
  },
  promoIcon: {
    marginRight: 8,
  },
  promoInput: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    paddingVertical: 10,
  },
  applyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: ZORA_RED,
    borderRadius: BorderRadius.lg,
  },
  applyButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
    color: ZORA_RED,
  },
  
  // Order Summary
  summaryCard: {
    backgroundColor: ZORA_CARD_SOLID,
    padding: 20,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.base,
    marginBottom: 32,
  },
  summaryTitle: {
    fontFamily: FontFamily.displayMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  summaryValue: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  serviceFeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    fontFamily: FontFamily.displayMedium,
    fontSize: FontSize.bodyLarge,
    color: Colors.textPrimary,
  },
  totalValue: {
    fontFamily: FontFamily.displayMedium,
    fontSize: FontSize.h3,
    color: ZORA_YELLOW,
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
  },
  checkoutButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: ZORA_RED,
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  checkoutText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  checkoutPrice: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: ZORA_YELLOW,
  },
});
