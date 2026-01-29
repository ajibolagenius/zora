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
  ShoppingCart,
  Trash,
  ArrowLeft,
  ArrowRight,
  Storefront,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Heights, Shadows } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { PlaceholderImages, AnimationDuration, AnimationEasing } from '../../constants';
import { Button, LazyImage, QuantitySelector } from '../../components/ui';
import { useCartStore } from '../../stores/cartStore';
import { productService as supabaseProductService, vendorService as supabaseVendorService } from '../../services/supabaseService';
import { realtimeService } from '../../services/realtimeService';
import { isSupabaseConfigured } from '../../lib/supabase';
import { getProductRoute, getVendorRoute } from '../../lib/navigationHelpers';

export default function CartTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, vendors, subtotal, total, updateQuantity, removeItem, clearCart, calculateTotals } = useCartStore();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Sync product data from database and subscribe to real-time updates
  useEffect(() => {
    const syncProductData = async () => {
      if (!isSupabaseConfigured() || items.length === 0) {
        await calculateTotals();
        return;
      }

      try {
        // Fetch latest product data for all items in cart
        const updatedItems = await Promise.all(
          items.map(async (item) => {
            try {
              const product = await supabaseProductService.getById(item.product_id);
              if (product) {
                return {
                  ...item,
                  product: {
                    ...item.product,
                    price: product.price,
                    name: product.name,
                    image_url: Array.isArray(product.image_urls) 
                      ? product.image_urls[0] 
                      : (product.image_urls || item.product?.image_url),
                    in_stock: (product.stock_quantity || 0) > 0,
                  },
                };
              }
            } catch (error) {
              console.error(`Error fetching product ${item.product_id}:`, error);
            }
            return item;
          })
        );

        // Update cart store with synced data
        // Note: This is a workaround since we can't directly update items in the store
        // In production, you'd want to add a syncCartItems method to the store
        await calculateTotals();
      } catch (error) {
        console.error('Error syncing cart product data:', error);
        await calculateTotals();
      }
    };

    syncProductData();

    // Subscribe to real-time product updates
    const unsubscribers: (() => void)[] = [];

    if (isSupabaseConfigured() && items.length > 0) {
      // Subscribe to product updates for all items in cart
      const productIds = items.map(item => item.product_id);
      const uniqueProductIds = [...new Set(productIds)];

      uniqueProductIds.forEach((productId) => {
        realtimeService.subscribeToTable('products', '*', async (payload) => {
          if (payload.new?.id === productId || payload.old?.id === productId) {
            // Product was updated, sync cart data
            await syncProductData();
          }
        }).then((unsub) => {
          if (unsub) unsubscribers.push(unsub);
        });
      });
    }

    return () => {
      unsubscribers.forEach((unsub) => {
        if (typeof unsub === 'function') {
          unsub();
        }
      });
    };
  }, [items.length]);

  // Calculate totals on mount and whenever items change
  useEffect(() => {
    if (items.length > 0) {
      calculateTotals().catch(error => {
        console.error('Error calculating totals:', error);
      });
    }

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
                <Text style={styles.vendorLocation}>
                  {vendor.location
                    ? `Shipping from ${vendor.location}`
                    : 'Shipping from New York'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => {
                router.push(getVendorRoute(vendor as any, vendor.id) as any);
              }}>
                <Text style={styles.visitStoreText}>Visit Store</Text>
              </TouchableOpacity>
            </View>

            {/* Items */}
            {vendor.items.map((item) => {
              // Handle both image_url and image_urls array
              const productImage = item.product?.image_url ||
                (item.product as any)?.image_urls?.[0] ||
                PlaceholderImages.image100;

              return (
                <TouchableOpacity
                  key={item.product_id}
                  style={styles.itemCard}
                  onPress={() => {
                    router.push(getProductRoute(item.product_id) as any);
                  }}
                  activeOpacity={0.7}
                >
                  {/* Product Image */}
                  <LazyImage source={productImage} style={styles.itemImage} contentFit="cover" showLoader={false} />

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
                      <QuantitySelector
                        quantity={item.quantity}
                        onIncrease={() => updateQuantity(item.product_id, item.quantity + 1)}
                        onDecrease={() => updateQuantity(item.product_id, item.quantity - 1)}
                        onRemove={() => removeItem(item.product_id)}
                        min={1}
                        max={99}
                        size="small"
                        variant="compact"
                        showRemoveOnMin={true}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {/* Bottom spacing for fixed checkout button + tab bar */}
        <View style={{ height: Spacing['5xl'] * 2.5 }} />
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

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIconContainer: {
    width: Spacing['5xl'] + Spacing['2xl'] + Spacing.xs,
    height: Spacing['5xl'] + Spacing['2xl'] + Spacing.xs,
    borderRadius: BorderRadius.full,
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
    width: Spacing['5xl'] + Spacing['2xl'] + Spacing.xs,
    height: Spacing['5xl'] + Spacing['2xl'] + Spacing.xs,
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
    ...Shadows.lg,
  },
  checkoutText: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.body,
    color: Colors.backgroundDark,
  },
});
