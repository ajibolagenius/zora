import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Sliders,
  MagnifyingGlass,
  MapPin,
  Clock,
  Star,
  ShoppingBag,
  ListBullets,
  MapTrifold,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { VendorCard, ProductCard } from '../../components/ui';
import { vendorService, productService } from '../../services/dataService';
import { Vendor, Product } from '../../types';

type FilterType = 'all' | 'open' | 'delivery' | 'pickup' | 'topRated';
type ViewMode = 'list' | 'map';

const FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open Now' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'pickup', label: 'Pickup' },
  { id: 'topRated', label: 'Top Rated' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const productCardWidth = (screenWidth - 32 - 8) / 2;
  
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showProducts, setShowProducts] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [vendorsData, productsData] = await Promise.all([
        vendorService.getAll(),
        productService.getAll(),
      ]);
      setVendors(vendorsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const filteredVendors = vendors.filter((vendor) => {
    // Search filter
    if (searchQuery && !vendor.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Type filter
    switch (activeFilter) {
      case 'open':
        return vendor.is_open;
      case 'topRated':
        return vendor.rating >= 4.5;
      case 'delivery':
      case 'pickup':
        return true; // All vendors support delivery/pickup in this demo
      default:
        return true;
    }
  });

  const filteredProducts = products.filter((product) => {
    if (searchQuery) {
      return (
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const handleVendorPress = (vendor: Vendor) => {
    router.push(`/vendor/${vendor.id}`);
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Vendors</Text>
        <TouchableOpacity style={styles.filterIconButton}>
          <Sliders size={24} color={Colors.textPrimary} weight="duotone" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MagnifyingGlass size={20} color={Colors.textMuted} weight="duotone" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search vendors, products..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {FILTER_OPTIONS.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              activeFilter === filter.id && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(filter.id as FilterType)}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === filter.id && styles.filterChipTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <MapTrifold size={48} color={Colors.primary} weight="duotone" />
          <Text style={styles.mapPlaceholderText}>Map View Coming Soon</Text>
          <Text style={styles.mapPlaceholderSubtext}>
            {filteredVendors.length} vendors in your area
          </Text>
        </View>
      </View>

      {/* Toggle View Mode */}
      <View style={styles.viewToggleContainer}>
        <TouchableOpacity
          style={[styles.viewToggleButton, !showProducts && styles.viewToggleButtonActive]}
          onPress={() => setShowProducts(false)}
        >
          <ShoppingBag size={18} color={!showProducts ? Colors.textPrimary : Colors.textMuted} weight="duotone" />
          <Text style={[styles.viewToggleText, !showProducts && styles.viewToggleTextActive]}>
            Vendors ({filteredVendors.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewToggleButton, showProducts && styles.viewToggleButtonActive]}
          onPress={() => setShowProducts(true)}
        >
          <ListBullets size={18} color={showProducts ? Colors.textPrimary : Colors.textMuted} weight="duotone" />
          <Text style={[styles.viewToggleText, showProducts && styles.viewToggleTextActive]}>
            Products ({filteredProducts.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results List */}
      <ScrollView
        style={styles.resultsContainer}
        contentContainerStyle={styles.resultsContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {!showProducts ? (
          // Vendors List
          <View style={styles.vendorsList}>
            {filteredVendors.map((vendor) => (
              <TouchableOpacity
                key={vendor.id}
                style={styles.vendorListItem}
                onPress={() => handleVendorPress(vendor)}
                activeOpacity={0.8}
              >
                <View style={styles.vendorImagePlaceholder}>
                  <ShoppingBag size={32} color={Colors.primary} weight="duotone" />
                </View>
                <View style={styles.vendorInfo}>
                  <View style={styles.vendorHeader}>
                    <Text style={styles.vendorName} numberOfLines={1}>{vendor.name}</Text>
                    {vendor.is_verified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.vendorCategory}>{vendor.category}</Text>
                  <View style={styles.vendorMeta}>
                    <View style={styles.metaItem}>
                      <Star size={14} color={Colors.rating} weight="fill" />
                      <Text style={styles.metaText}>{vendor.rating}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MapPin size={14} color={Colors.textMuted} weight="duotone" />
                      <Text style={styles.metaText}>{vendor.distance}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Clock size={14} color={Colors.textMuted} weight="duotone" />
                      <Text style={styles.metaText}>{vendor.delivery_time}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: vendor.is_open ? Colors.success : Colors.error }
                  ]}>
                    <Text style={styles.statusText}>
                      {vendor.is_open ? 'OPEN' : 'CLOSED'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          // Products Grid
          <View style={styles.productsGrid}>
            {filteredProducts.map((product, index) => (
              <View
                key={product.id}
                style={{
                  width: productCardWidth,
                  marginRight: index % 2 === 0 ? 8 : 0,
                  marginBottom: 8,
                }}
              >
                <ProductCard
                  product={product}
                  onPress={() => handleProductPress(product)}
                />
              </View>
            ))}
          </View>
        )}

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating List View Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
      >
        <ListBullets size={20} color={Colors.textPrimary} weight="bold" />
        <Text style={styles.floatingButtonText}>List View</Text>
      </TouchableOpacity>
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
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  filterIconButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.body,
  },
  filterContainer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardDark,
    marginRight: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
  },
  filterChipTextActive: {
    color: Colors.textPrimary,
  },
  mapContainer: {
    marginHorizontal: Spacing.base,
    height: 160,
    marginBottom: Spacing.md,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
    marginTop: Spacing.sm,
  },
  mapPlaceholderSubtext: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
    marginTop: Spacing.xs,
  },
  viewToggleContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.md,
  },
  viewToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  viewToggleButtonActive: {
    backgroundColor: Colors.primary,
  },
  viewToggleText: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
  },
  viewToggleTextActive: {
    color: Colors.textPrimary,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: Spacing.base,
  },
  vendorsList: {
    gap: Spacing.md,
  },
  vendorListItem: {
    flexDirection: 'row',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  vendorImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(204, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vendorInfo: {
    flex: 1,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 2,
  },
  vendorName: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    flex: 1,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: Colors.textPrimary,
    fontSize: 10,
    fontWeight: FontWeight.bold,
  },
  vendorCategory: {
    fontSize: FontSize.small,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  vendorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    color: Colors.textPrimary,
    fontSize: FontSize.tiny,
    fontWeight: FontWeight.bold,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  floatingButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
  },
});
