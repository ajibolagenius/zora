import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
  useWindowDimensions,
  Keyboard,
  RefreshControl,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Funnel, X, Package, MagnifyingGlass } from 'phosphor-react-native';
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
import { productService as supabaseProductService, vendorService as supabaseVendorService } from '../services/supabaseService';
import { onboardingService, type Region as OnboardingRegion, type Category as OnboardingCategory } from '../services/onboardingService';
import { realtimeService } from '../services/realtimeService';
import { isSupabaseConfigured } from '../lib/supabase';

// Map onboardingService Region to mockDataService Region format
const mapOnboardingRegionToRegion = (region: OnboardingRegion): Region => {
  const countries = region.description
    ? region.description.split(',').map(c => c.trim()).filter(Boolean)
    : [];

  return {
    id: region.id,
    name: region.name,
    slug: region.slug,
    image_url: region.image_url || '',
    countries: countries,
    description: region.description || '',
    is_selected: false,
    vendor_count: 0,
    product_count: 0,
  };
};

// Map onboardingService Category to mockDataService Category format
const mapOnboardingCategoryToCategory = (category: OnboardingCategory): Category => {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon || '',
    image_url: category.image_url || '',
    product_count: 0, // Would need to be fetched separately if needed
    description: category.description || '',
  };
};
import { ProductCard, Button } from '../components/ui';
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
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(params.region || null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(params.category || null);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const addToCart = useCartStore((state) => state.addItem);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const fetchData = async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }

      // Fetch products from database or mock
      let productData: Product[];
      if (isSupabaseConfigured()) {
        productData = await supabaseProductService.getAll();
      } else {
        productData = productService.getAll();
      }
      setProducts(productData);

      // Fetch regions from database or mock
      let regionData: Region[];
      if (isSupabaseConfigured()) {
        const onboardingRegions = await onboardingService.getRegions();
        regionData = onboardingRegions.map(mapOnboardingRegionToRegion);
      } else {
        regionData = regionService.getAll();
      }
      setRegions(regionData);

      // Fetch categories from database or mock
      let categoryData: Category[];
      if (isSupabaseConfigured()) {
        const onboardingCategories = await onboardingService.getCategories();
        categoryData = onboardingCategories.map(mapOnboardingCategoryToCategory);
      } else {
        categoryData = categoryService.getAll();
      }
      setCategories(categoryData);

      if (!isRefresh) {
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
    } catch (error) {
      console.error('Error fetching products data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  useEffect(() => {
    fetchData();

    // Subscribe to real-time updates
    const unsubscribers: (() => void)[] = [];

    if (isSupabaseConfigured()) {
      // Subscribe to products updates
      realtimeService.subscribeToTable('products', '*', async () => {
        const updatedProducts = await supabaseProductService.getAll();
        setProducts(updatedProducts);
      }).then((unsub) => {
        if (unsub) unsubscribers.push(unsub);
      });

      // Subscribe to regions updates
      onboardingService.subscribeToRegions((updatedRegions) => {
        const mappedRegions = updatedRegions.map(mapOnboardingRegionToRegion);
        setRegions(mappedRegions);
      });

      // Subscribe to categories updates
      onboardingService.subscribeToCategories((updatedCategories) => {
        const mappedCategories = updatedCategories.map(mapOnboardingCategoryToCategory);
        setCategories(mappedCategories);
      });
    }

    return () => {
      unsubscribers.forEach((unsub) => {
        if (typeof unsub === 'function') {
          unsub();
        }
      });
    };
  }, []);

  // Shuffle array randomly
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }

    let result = [...products];

    // Filter by search query first
    if (searchQuery && searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(p => {
        const name = String(p.name || '').toLowerCase();
        const description = String(p.description || '').toLowerCase();
        const category = String(p.category || '').toLowerCase();
        const culturalRegion = String(p.cultural_region || '').toLowerCase();

        return name.includes(query) ||
          description.includes(query) ||
          category.includes(query) ||
          culturalRegion.includes(query);
      });
    }

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
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price_asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
        result.sort((a, b) => {
          const nameA = String(a.name || '').toLowerCase();
          const nameB = String(b.name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
        break;
    }

    // Randomize the final results for variety
    return shuffleArray(result);
  }, [products, selectedRegion, selectedCategory, sortBy, searchQuery]);

  const activeFilterCount =
    (selectedRegion ? 1 : 0) +
    (selectedCategory ? 1 : 0) +
    (sortBy !== 'rating' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const handleProductPress = (product: Product) => {
    router.push(getProductRoute(product.id) as any);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product as any, 1);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const clearAllFilters = () => {
    setSelectedRegion(null);
    setSelectedCategory(null);
    setSortBy('rating');
    setSearchQuery('');
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
          onPress={handleBack}
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MagnifyingGlass size={20} color={Colors.textMuted} weight="regular" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products by name, category..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
            clearButtonMode="never"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color={Colors.textMuted} weight="bold" />
            </TouchableOpacity>
          )}
        </View>
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
            </ScrollView>
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

      <View style={styles.listContainer}>
        {filteredProducts.length === 0 ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
              />
            }
            contentContainerStyle={styles.emptyScrollContent}
          >
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Package size={48} color={Colors.textMuted} weight="duotone" />
              </View>
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery.trim()
                  ? `No products match "${searchQuery}". Try a different search term or clear filters.`
                  : 'Try adjusting your filters to find what you\'re looking for'}
              </Text>
              {activeFilterCount > 0 && (
                <Button
                  title="Clear Filters"
                  onPress={clearAllFilters}
                  variant="secondary"
                  style={{ marginTop: Spacing.lg }}
                />
              )}
            </View>
          </ScrollView>
        ) : (
          <FlashList
            data={filteredProducts}
            numColumns={2}
            estimatedItemSize={280}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
              />
            }
            renderItem={({ item, index }) => (
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                  width: productCardWidth,
                  marginRight: index % 2 === 0 ? PRODUCT_GAP : 0,
                  marginBottom: PRODUCT_GAP,
                }}
              >
                <ProductCard
                  product={item}
                  onPress={() => handleProductPress(item)}
                  onAddToCart={() => handleAddToCart(item)}
                />
              </Animated.View>
            )}
            ListFooterComponent={<View style={{ height: 100 }} />}
          />
        )}
      </View>
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
    backgroundColor: 'transparent',
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
  searchContainer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.full,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.sm,
    height: Heights.input,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.body,
    color: Colors.textPrimary,
    fontSize: FontSize.small,
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
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  emptyScrollContent: {
    flexGrow: 1,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  // Empty State - Consistent
  emptyContainer: {
    paddingVertical: 80,
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
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
});
