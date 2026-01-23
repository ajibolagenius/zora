import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { SearchBar, HeroBanner, RegionCard, VendorCard, ProductCard } from '../../components/ui';
import { homeService } from '../../services/dataService';
import { HomeData, Product, Vendor, Region, Banner } from '../../types';
import { useCartStore } from '../../stores/cartStore';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const addToCart = useCartStore((state) => state.addItem);

  const fetchHomeData = async () => {
    try {
      const data = await homeService.getHomeData();
      setHomeData(data);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleVendorPress = (vendor: Vendor) => {
    router.push(`/vendor/${vendor.id}`);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  const handleRegionPress = (region: Region) => {
    setSelectedRegion(selectedRegion === region.id ? null : region.id);
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

  const filteredProducts = selectedRegion
    ? homeData?.popular_products.filter((p) => p.region === selectedRegion)
    : homeData?.popular_products;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.locationButton}>
            <MaterialCommunityIcons name="map-marker" size={20} color={Colors.primary} />
            <Text style={styles.locationText}>Brixton, London</Text>
            <MaterialCommunityIcons name="chevron-down" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={Colors.textPrimary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => {}}
          />
        </View>

        {/* Hero Banner */}
        {homeData?.banners && homeData.banners.length > 0 && (
          <View style={styles.bannerContainer}>
            <HeroBanner banner={homeData.banners[0]} />
          </View>
        )}

        {/* Shop by Region */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Region</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.regionsContainer}
          >
            {homeData?.regions.map((region) => (
              <RegionCard
                key={region.id}
                region={region}
                selected={selectedRegion === region.id}
                onPress={() => handleRegionPress(region)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Featured Vendors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Vendors</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vendorsContainer}
          >
            {homeData?.featured_vendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onPress={() => handleVendorPress(vendor)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Popular Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedRegion ? `Products from ${selectedRegion.replace('-', ' ')}` : 'Popular Products'}
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {filteredProducts?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => handleProductPress(product)}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </View>
        </View>

        {/* Bottom padding for tab bar */}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  locationText: {
    color: Colors.textPrimary,
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
    marginHorizontal: Spacing.xs,
  },
  notificationButton: {
    position: 'relative',
    padding: Spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  searchContainer: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.base,
  },
  bannerContainer: {
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
  },
  seeAllText: {
    color: Colors.primary,
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
  },
  regionsContainer: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  vendorsContainer: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
});
