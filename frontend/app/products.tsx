import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Funnel, X } from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, Heights } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { UiConfig, SortOptions, AnimationDuration, AnimationEasing } from '../constants';
import { 
  productService, 
  regionService, 
  categoryService,
  type Product, 
  type Region,
  type Category,
} from '../services/mockDataService';
import { ProductCard } from '../components/ui';
import { useCartStore } from '../stores/cartStore';
import { getProductRoute } from '../lib/navigationHelpers';

const SORT_OPTIONS = SortOptions.products;

const PRODUCT_GAP = UiConfig.productGap;

export default function ProductsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ region?: string; category?: string }>();
  const { width: screenWidth } = useWindowDimensions();
  const productCardWidth = (screenWidth - 32 - PRODUCT_GAP) / 2;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(params.region || null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(params.category || null);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [showFilters, setShowFilters] = useState(false);
  
  const addToCart = useCartStore((state) => state.addItem);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const productData = productService.getAll();
    const regionData = regionService.getAll();
    const categoryData = categoryService.getAll();
    setProducts(productData);
    setRegions(regionData);
    setCategories(categoryData);
    setLoading(false);
    
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
  }, []);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Filter by region - convert slug format (west-africa) to match cultural_region (West Africa)
    if (selectedRegion) {
      // Normalize slug to comparable format: "west-africa" -> "west africa"
      const normalizedFilter = selectedRegion.toLowerCase().replace(/-/g, ' ');
      result = result.filter(p => 
        p.cultural_region?.toLowerCase().includes(normalizedFilter)
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      result = result.filter(p => 
        p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    return result;
  }, [products, selectedRegion, selectedCategory, sortBy]);

  const activeFilterCount = 
    (selectedRegion ? 1 : 0) + 
    (selectedCategory ? 1 : 0) + 
    (sortBy !== 'rating' ? 1 : 0);

  const handleProductPress = (product: Product) => {
    router.push(getProductRoute(product.id));
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  const clearAllFilters = () => {
    setSelectedRegion(null);
    setSelectedCategory(null);
    setSortBy('rating');
  };

  // Get page title based on filters
  const getPageTitle = () => {
    if (selectedRegion && selectedCategory) {
      return `${selectedCategory} from ${selectedRegion}`;
    }
    if (selectedRegion) {
      const region = regions.find(r => r.slug === selectedRegion);
      return region?.name || 'Products';
    }
    if (selectedCategory) {
      return selectedCategory;
    }
    return 'All Products';
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{getPageTitle()}</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
          activeOpacity={0.8}
        >
          <Funnel size={22} color={Colors.textPrimary} weight={showFilters ? 'fill' : 'bold'} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          {/* Category Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                <TouchableOpacity
                  style={[styles.chip, !selectedCategory && styles.chipActive]}
                  onPress={() => setSelectedCategory(null)}
                >
                  <Text style={[styles.chipText, !selectedCategory && styles.chipTextActive]}>All</Text>
                </TouchableOpacity>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.chip, selectedCategory === cat.name && styles.chipActive]}
                    onPress={() => setSelectedCategory(cat.name)}
                  >
                    <Text style={[styles.chipText, selectedCategory === cat.name && styles.chipTextActive]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Region Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Region</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                <TouchableOpacity
                  style={[styles.chip, !selectedRegion && styles.chipActive]}
                  onPress={() => setSelectedRegion(null)}
                >
                  <Text style={[styles.chipText, !selectedRegion && styles.chipTextActive]}>All</Text>
                </TouchableOpacity>
                {regions.map((region) => (
                  <TouchableOpacity
                    key={region.id}
                    style={[styles.chip, selectedRegion === region.slug && styles.chipActive]}
                    onPress={() => setSelectedRegion(region.slug)}
                  >
                    <Text style={[styles.chipText, selectedRegion === region.slug && styles.chipTextActive]}>
                      {region.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Sort Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Sort By</Text>
            <View style={styles.filterChips}>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.chip, sortBy === option.id && styles.chipActive]}
                  onPress={() => setSortBy(option.id)}
                >
                  <Text style={[styles.chipText, sortBy === option.id && styles.chipTextActive]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{filteredProducts.length} products found</Text>
        {activeFilterCount > 0 && (
          <TouchableOpacity onPress={clearAllFilters}>
            <Text style={styles.clearFilters}>Clear Filters</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.productsGrid}>
            {filteredProducts.map((product, index) => (
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
        </Animated.View>

        <View style={{ height: 100 }} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.black40,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 22,
    backgroundColor: Colors.black40,
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
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    color: Colors.textPrimary,
  },
  filtersPanel: {
    backgroundColor: Colors.cardDark,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  filterSection: {
    marginBottom: Spacing.md,
  },
  filterLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  filterChips: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.borderOutline,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
  },
  chipTextActive: {
    color: Colors.textPrimary,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  resultsCount: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  clearFilters: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
