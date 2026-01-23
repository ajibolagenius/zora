import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { SearchBar, VendorCard, ProductCard } from '../../components/ui';
import { vendorService, productService } from '../../services/dataService';
import { Vendor, Product } from '../../types';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'apps' },
  { id: 'spices', name: 'Spices', icon: 'shaker-outline' },
  { id: 'grains', name: 'Grains', icon: 'grain' },
  { id: 'vegetables', name: 'Vegetables', icon: 'leaf' },
  { id: 'meats', name: 'Meats', icon: 'food-steak' },
  { id: 'textiles', name: 'Textiles', icon: 'tshirt-crew' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'vendors' | 'products'>('vendors');

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vendorsData, productsData] = await Promise.all([
        vendorService.getAll(selectedCategory !== 'all' ? { category: selectedCategory } : undefined),
        productService.getAll(selectedCategory !== 'all' ? { category: selectedCategory } : undefined),
      ]);
      setVendors(vendorsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching explore data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorPress = (vendor: Vendor) => {
    router.push(`/vendor/${vendor.id}`);
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search vendors or products..."
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipSelected,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <MaterialCommunityIcons
              name={category.icon as any}
              size={18}
              color={selectedCategory === category.id ? Colors.textPrimary : Colors.textMuted}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextSelected,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* View Mode Toggle */}
      <View style={styles.viewModeContainer}>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'vendors' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('vendors')}
        >
          <MaterialCommunityIcons
            name="store"
            size={18}
            color={viewMode === 'vendors' ? Colors.textPrimary : Colors.textMuted}
          />
          <Text style={[styles.viewModeText, viewMode === 'vendors' && styles.viewModeTextActive]}>
            Vendors
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'products' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('products')}
        >
          <MaterialCommunityIcons
            name="tag"
            size={18}
            color={viewMode === 'products' ? Colors.textPrimary : Colors.textMuted}
          />
          <Text style={[styles.viewModeText, viewMode === 'products' && styles.viewModeTextActive]}>
            Products
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {viewMode === 'vendors' ? (
            <View style={styles.vendorsList}>
              {vendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  onPress={() => handleVendorPress(vendor)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => handleProductPress(product)}
                />
              ))}
            </View>
          )}
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
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
  },
  searchContainer: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardDark,
    marginRight: Spacing.sm,
    gap: Spacing.xs,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
  },
  categoryTextSelected: {
    color: Colors.textPrimary,
  },
  viewModeContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  viewModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.cardDark,
    gap: Spacing.xs,
  },
  viewModeButtonActive: {
    backgroundColor: Colors.primary,
  },
  viewModeText: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
  },
  viewModeTextActive: {
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
    paddingHorizontal: Spacing.base,
  },
  vendorsList: {
    gap: Spacing.md,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
});
