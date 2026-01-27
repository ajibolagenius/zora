import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, Trash } from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, Heights } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { ProductCard } from '../components/ui';
import { useWishlistStore } from '../stores/wishlistStore';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { getProductRoute } from '../lib/navigationHelpers';
import { wishlistService } from '../services/wishlistService';
import { UiConfig } from '../constants';

const PRODUCT_GAP = UiConfig.productGap;

export default function WishlistScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const productCardWidth = (screenWidth - 32 - PRODUCT_GAP) / 2;
  const { user } = useAuthStore();
  const { items, isLoading, syncWithDatabase, removeFromWishlist, clearWishlist, setItems } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Load wishlist from database on mount
  useEffect(() => {
    if (user?.user_id) {
      loadWishlistFromDatabase();
    }
  }, [user?.user_id]);

  const loadWishlistFromDatabase = async () => {
    if (!user?.user_id) return;

    try {
      setSyncing(true);
      const dbWishlist = await wishlistService.getUserWishlist(user.user_id);
      
      // Update local store with database items
      const { items: localItems } = useWishlistStore.getState();
      const localIds = new Set(localItems.map((item) => item.id));
      const dbIds = new Set(dbWishlist.map((item) => item.id));

      // Merge: add DB items not in local, keep local items
      const mergedItems = [
        ...dbWishlist,
        ...localItems.filter((item) => !dbIds.has(item.id)),
      ];

      // Update store with merged items
      setItems(mergedItems);
    } catch (error) {
      console.error('Error loading wishlist from database:', error);
    } finally {
      setSyncing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWishlistFromDatabase();
    await syncWithDatabase();
    setRefreshing(false);
  };

  const handleProductPress = (product: any) => {
    router.push(getProductRoute(product.id));
  };

  const handleAddToCart = (product: any) => {
    const imageUrls = Array.isArray(product.image_urls)
      ? product.image_urls
      : product.image_urls
        ? [product.image_urls]
        : [];

    const cartProduct = {
      ...product,
      currency: 'GBP',
      image_url: imageUrls[0] || '',
      images: imageUrls,
      region: product.cultural_region || '',
      in_stock: (product.stock_quantity || 0) > 0,
      attributes: {},
      unit_price_label: product.unit_price_label || '',
    };
    addToCart(cartProduct as any, 1);
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    removeFromWishlist(productId);
    if (user?.user_id) {
      await wishlistService.removeFromWishlist(user.user_id, productId);
    }
  };

  const handleClearWishlist = async () => {
    clearWishlist();
    if (user?.user_id) {
      // Remove all items from database
      const { items: currentItems } = useWishlistStore.getState();
      for (const item of currentItems) {
        await wishlistService.removeFromWishlist(user.user_id, item.id);
      }
    }
  };

  if (isLoading || syncing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Wishlist</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        {items.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearWishlist}
            activeOpacity={0.8}
          >
            <Trash size={20} color={Colors.primary} weight="duotone" />
          </TouchableOpacity>
        )}
        {items.length === 0 && <View style={styles.backButton} />}
      </View>

      {/* Content */}
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Heart size={64} color={Colors.textMuted} weight="duotone" />
          <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Start adding products you love by tapping the heart icon
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)')}
            activeOpacity={0.8}
          >
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
            />
          }
        >
          <View style={styles.productsGrid}>
            {items.map((product, index) => (
              <View
                key={product.id}
                style={{
                  width: productCardWidth,
                  marginRight: index % 2 === 0 ? PRODUCT_GAP : 0,
                  marginBottom: PRODUCT_GAP,
                }}
              >
                <ProductCard
                  product={product}
                  onPress={() => handleProductPress(product)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              </View>
            ))}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.md,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.base,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  browseButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
});
