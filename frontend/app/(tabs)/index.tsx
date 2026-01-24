import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  MapPin,
  CaretDown,
  Bell,
  MagnifyingGlass,
  Sliders,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { HeroBanner, RegionCard, VendorCard, ProductCard } from '../../components/ui';
import { homeService } from '../../services/dataService';
import { HomeData, Product, Vendor, Region } from '../../types';
import { useCartStore } from '../../stores/cartStore';

const PRODUCT_GAP = 8;

export default function HomeScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const productCardWidth = (screenWidth - 32 - PRODUCT_GAP) / 2; // 16px padding on each side
  
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
      {/* Sticky Header Section */}
      <View style={styles.stickyHeader}>
        {/* Header Row */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.locationButton}>
            <MapPin size={20} color={Colors.primary} weight="fill" />
            <Text style={styles.locationText}>Brixton, London</Text>
            <CaretDown size={16} color={Colors.textMuted} weight="bold" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={Colors.textPrimary} weight="duotone" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchContainer}
          onPress={() => router.push('/(tabs)/explore')}
          activeOpacity={0.8}
        >
          <View style={styles.searchBar}>
            <MagnifyingGlass size={22} color={Colors.textMuted} weight="duotone" />
            <Text style={styles.searchPlaceholder}>
              Search for egusi, plantain, jollof...
            </Text>
            <View style={styles.filterButton}>
              <Sliders size={20} color={Colors.textPrimary} weight="duotone" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
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
            {filteredProducts?.map((product, index) => (
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
  stickyHeader: {
    backgroundColor: Colors.backgroundDark,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  locationText: {
    color: Colors.textPrimary,
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
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
    paddingBottom: Spacing.md,
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
  searchPlaceholder: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: FontSize.body,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bannerContainer: {
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
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
  },
});
