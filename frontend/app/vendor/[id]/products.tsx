import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Sliders,
  Star,
  Heart,
  Plus,
  X,
} from 'phosphor-react-native';
import { Colors } from '../../../constants/colors';
import { Spacing, BorderRadius, Heights } from '../../../constants/spacing';
import { FontSize, FontFamily } from '../../../constants/typography';
import { SortOptions, CategoryOptions, AnimationDuration, AnimationEasing } from '../../../constants';
import { vendorService, productService, type Vendor, type Product } from '../../../services/mockDataService';
import { useCartStore } from '../../../stores/cartStore';
import { getProductRoute } from '../../../lib/navigationHelpers';

const SORT_OPTIONS = SortOptions.vendorProducts;
const CATEGORY_OPTIONS = CategoryOptions;

export default function VendorProductsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width: screenWidth } = useWindowDimensions();
  const productCardWidth = (screenWidth - 48) / 2;
  const addToCart = useCartStore((state) => state.addItem);

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const filterSlideAnim = useRef(new Animated.Value(300)).current;

  const fetchData = useCallback(() => {
    if (!id) return;
    try {
      const vendorData = vendorService.getById(id);
      if (vendorData) {
        setVendor(vendorData);
        const vendorProducts = productService.getByVendor(vendorData.id);
        setProducts(vendorProducts);
        setFilteredProducts(vendorProducts);
      }
    } catch (error) {
      console.error('Error fetching vendor products:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  useEffect(() => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => 
        p.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Apply sorting
    switch (selectedSort) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Assuming newer products have higher IDs
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        // Popular - sort by review count
        filtered.sort((a, b) => b.review_count - a.review_count);
    }

    setFilteredProducts(filtered);
  }, [products, selectedSort, selectedCategory]);

  const toggleFilters = () => {
    if (showFilters) {
      Animated.timing(filterSlideAnim, {
        toValue: 300,
        duration: AnimationDuration.fast,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => setShowFilters(false));
    } else {
      setShowFilters(true);
      Animated.timing(filterSlideAnim, {
        toValue: 0,
        duration: AnimationDuration.normal,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_urls[0],
      vendor_id: product.vendor_id,
      category: product.category,
      rating: product.rating,
      review_count: product.review_count,
      in_stock: product.stock_quantity > 0,
    } as any, 1);
  };

  const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) + (selectedSort !== 'popular' ? 1 : 0);

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
        <Text style={styles.headerTitle} numberOfLines={1}>
          {vendor?.shop_name || 'Products'}
        </Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={toggleFilters}
        >
          <Sliders size={20} color={Colors.textPrimary} weight="bold" />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Product Count */}
      <View style={styles.productCountRow}>
        <Text style={styles.productCount}>{filteredProducts.length} products</Text>
      </View>

      {/* Product Grid */}
      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.productGrid}>
          {filteredProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[styles.productCard, { width: productCardWidth }]}
              onPress={() => {
                router.push(getProductRoute(product.id));
              }}
              activeOpacity={0.95}
            >
              <View style={styles.productImageContainer}>
                <Image
                  source={{ uri: product.image_urls[0] }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                
                {product.badge && (
                  <View style={styles.productBadge}>
                    <Text style={styles.productBadgeText}>{product.badge}</Text>
                  </View>
                )}
                
                <TouchableOpacity style={styles.favoriteButton}>
                  <Heart size={16} color={Colors.textPrimary} weight="regular" />
                </TouchableOpacity>
              </View>

              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.productWeight}>{product.weight}</Text>
                <View style={styles.ratingRow}>
                  <Star size={12} color={Colors.secondary} weight="fill" />
                  <Text style={styles.ratingText}>{product.rating}</Text>
                  <Text style={styles.reviewCount}>({product.review_count})</Text>
                </View>
                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>£{product.price.toFixed(2)}</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddToCart(product)}
                  >
                    <Plus size={14} color={Colors.textPrimary} weight="bold" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: insets.bottom + 32 }} />
      </Animated.ScrollView>

      {/* Filter Panel */}
      {showFilters && (
        <TouchableOpacity 
          style={styles.filterOverlay} 
          activeOpacity={1}
          onPress={toggleFilters}
        >
          <Animated.View 
            style={[
              styles.filterPanel,
              { transform: [{ translateX: filterSlideAnim }] }
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.filterHeader}>
                <Text style={styles.filterTitle}>Filters</Text>
                <TouchableOpacity onPress={toggleFilters}>
                  <X size={24} color={Colors.textPrimary} weight="bold" />
                </TouchableOpacity>
              </View>

              {/* Sort By */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sort By</Text>
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.filterOption}
                    onPress={() => setSelectedSort(option.id)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedSort === option.id && styles.filterOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                    <View style={[
                      styles.radioOuter,
                      selectedSort === option.id && styles.radioOuterSelected
                    ]}>
                      {selectedSort === option.id && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Category */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Category</Text>
                {CATEGORY_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.filterOption}
                    onPress={() => setSelectedCategory(option.id)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedCategory === option.id && styles.filterOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                    <View style={[
                      styles.radioOuter,
                      selectedCategory === option.id && styles.radioOuterSelected
                    ]}>
                      {selectedCategory === option.id && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Apply Button */}
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={toggleFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>

              {/* Clear Filters */}
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => {
                  setSelectedSort('popular');
                  setSelectedCategory('all');
                }}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}
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
    flex: 1,
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginHorizontal: Spacing.sm,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    color: Colors.textPrimary,
  },
  
  // Product Count
  productCountRow: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  productCount: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  
  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
  },
  
  // Product Grid
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  productCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  productImageContainer: {
    aspectRatio: 1,
    width: '100%',
    position: 'relative',
    backgroundColor: Colors.backgroundDark,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  productBadgeText: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textPrimary,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.black30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: Spacing.md,
  },
  productName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  productWeight: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.sm,
  },
  ratingText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
  },
  reviewCount: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.body,
    color: Colors.primary,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Filter Panel
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.black50,
    justifyContent: 'flex-end',
  },
  filterPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: Colors.backgroundDark,
    paddingTop: 60,
    paddingHorizontal: Spacing.base,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  filterTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
  },
  filterSection: {
    marginBottom: Spacing.lg,
  },
  filterSectionTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  filterOptionText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  filterOptionTextActive: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textPrimary,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.white20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    height: Heights.button,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  applyButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  clearButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  clearButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
});
