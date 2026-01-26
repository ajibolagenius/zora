import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ShoppingCart, 
  Trash, 
  Minus, 
  Plus,
  ArrowLeft,
  ArrowRight,
  Storefront,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Heights } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { Button } from '../../components/ui';
import { useCartStore } from '../../stores/cartStore';

export default function CartTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, vendors, subtotal, total, updateQuantity, removeItem, clearCart, calculateTotals } = useCartStore();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Calculate totals on mount and whenever items change
  useEffect(() => {
    if (items.length > 0) {
      calculateTotals();
    }
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [items.length]);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart ({itemCount})</Text>
        <View style={styles.headerRight} />
      </View>

      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Vendor Sections */}
        {vendors.map((vendor, vendorIndex) => (
          <View key={vendor.id} style={[styles.vendorSection, vendorIndex > 0 && { marginTop: Spacing.md }]}>
            {/* Vendor Header */}
            <View style={styles.vendorHeader}>
              <View style={styles.vendorIconContainer}>
                <Storefront size={20} color={Colors.secondary} weight="fill" />
              </View>
              <View style={styles.vendorInfo}>
                <Text style={styles.vendorName}>{vendor.name}</Text>
                <Text style={styles.vendorLocation}>Shipping from New York</Text>
              </View>
              <TouchableOpacity onPress={() => router.push(`/vendor/${vendor.id}`)}>
                <Text style={styles.visitStoreText}>Visit Store</Text>
              </TouchableOpacity>
            </View>

            {/* Items */}
            {vendor.items.map((item) => {
              // Handle both image_url and image_urls array
              const productImage = item.product?.image_url || 
                (item.product as any)?.image_urls?.[0] || 
                'https://via.placeholder.com/100';
              
              return (
                <TouchableOpacity
                  key={item.product_id}
                  style={styles.itemCard}
                  onPress={() => router.push(`/product/${item.product_id}`)}
                  activeOpacity={0.7}
                >
                  {/* Product Image */}
                  <Image source={{ uri: productImage }} style={styles.itemImage} />
                  
                  {/* Product Content */}
                  <View style={styles.itemContent}>
                    {/* Top Row: Name + Delete */}
                    <View style={styles.itemTopRow}>
                      <Text style={styles.itemName} numberOfLines={1}>{item.product?.name}</Text>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => removeItem(item.product_id)}
                      >
                        <Trash size={18} color={Colors.textMuted} weight="regular" />
                      </TouchableOpacity>
                    </View>
                    
                    {/* Variant */}
                    <Text style={styles.itemVariant}>{item.product?.weight || '1 Bottle (1L)'}</Text>
                    
                    {/* Bottom Row: Price + Quantity */}
                    <View style={styles.itemBottomRow}>
                      {/* Price */}
                      <Text style={styles.itemPrice}>
                        £{((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </Text>
                      
                      {/* Quantity Stepper */}
                      <View style={styles.quantityStepper}>
                        <TouchableOpacity
                          style={styles.stepperButtonMinus}
                          onPress={() => updateQuantity(item.product_id, item.quantity - 1)}
                        >
                          <Minus size={14} color={Colors.textPrimary} weight="bold" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.stepperButtonPlus}
                          onPress={() => updateQuantity(item.product_id, item.quantity + 1)}
                        >
                          <Plus size={14} color={Colors.backgroundDark} weight="bold" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {/* Bottom spacing for fixed checkout button + tab bar */}
        <View style={{ height: 160 }} />
      </Animated.ScrollView>

      {/* Fixed Footer */}
      <View style={[styles.footerContainer, { paddingBottom: Math.max(insets.bottom, 16) + 70 }]}>
        {/* Subtotal Row */}
        <View style={styles.subtotalRow}>
          <Text style={styles.subtotalLabel}>Subtotal ({itemCount} items)</Text>
          <Text style={styles.subtotalValue}>£{subtotal.toFixed(2)}</Text>
        </View>
        
        {/* Checkout Button */}
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => router.push('/checkout')}
          activeOpacity={0.9}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
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
  headerRight: {
    width: 44,
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
    fontFamily: FontFamily.displaySemiBold,
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
    paddingTop: Spacing.sm,
  },
  
  // Vendor Section
  vendorSection: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  vendorIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  vendorLocation: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.secondary,
    marginTop: 2,
  },
  visitStoreText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.secondary,
  },
  
  // Item Card
  itemCard: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundDark,
  },
  itemContent: {
    flex: 1,
    minWidth: 0,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  itemName: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  itemVariant: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  
  // Item Price
  itemPrice: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    color: Colors.secondary,
  },
  
  // Quantity Stepper
  quantityStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.full,
    height: 36,
  },
  stepperButtonMinus: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
    borderRadius: 18,
  },
  stepperButtonPlus: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 18,
  },
  quantityText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    width: 32,
    textAlign: 'center',
  },
  
  // Footer
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.backgroundDark,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  subtotalLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textMuted,
  },
  subtotalValue: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
  },
  checkoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    height: Heights.button,
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
  checkoutText: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.body,
    color: Colors.backgroundDark,
  },
});
