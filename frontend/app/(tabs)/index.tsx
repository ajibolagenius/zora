import React, { useEffect, useState, useRef } from 'react';
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
  Animated,
  Easing,
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
import { Spacing, BorderRadius, Heights } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { AnimationDuration, AnimationEasing } from '../../constants';
import { FeaturedSlider, RegionCard, VendorCard, ProductCard } from '../../components/ui';
import { 
  vendorService, 
  productService, 
  regionService, 
  bannerService,
  type Vendor,
  type Product,
  type Region,
  type Banner,
} from '../../services/mockDataService';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { getProductRoute, getVendorRoute } from '../../lib/navigationHelpers';

interface HomeData {
  banners: Banner[];
  regions: Region[];
  featured_vendors: Vendor[];
  popular_products: Product[];
}

import { UiConfig } from '../../constants';

const PRODUCT_GAP = UiConfig.productGap;

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
  const { user } = useAuthStore();
  
  // Get user's primary cultural region for personalized ranking
  const userRegion = user?.cultural_interests?.[0] || undefined;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const fetchHomeData = async () => {
    try {
      // Use mock data service instead of API
      const banners = bannerService.getActive();
      const regions = regionService.getAll();
      // Use ranking system with user's cultural region for personalized results
      const featured_vendors = vendorService.getFeatured(userRegion, 10);
      const popular_products = productService.getFeatured(userRegion, 20);
      
      setHomeData({
        banners,
        regions,
        featured_vendors,
        popular_products,
      });
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, [userRegion]); // Refetch when user region changes

  // Animate content when data loads
  useEffect(() => {
    if (!loading && homeData) {
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
  }, [loading, homeData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  const handleProductPress = (product: Product) => {
    router.push(getProductRoute(product.id));
  };

  const handleVendorPress = (vendor: Vendor) => {
    router.push(getVendorRoute(vendor as any, vendor.id));
  };

  const handleAddToCart = (product: Product) => {
    // Map mockDataService Product to types Product for cart compatibility
    const cartProduct = {
      ...product,
      currency: 'GBP',
      image_url: product.image_urls?.[0] || '',
      images: product.image_urls || [],
      region: product.cultural_region || '',
      in_stock: product.stock_quantity > 0,
      attributes: {},
    };
    addToCart(cartProduct as any, 1);
  };

  const handleRegionPress = (region: Region) => {
    setSelectedRegion(selectedRegion === region.name ? null : region.name);
  };

  const handleBannerPress = (banner: { cta_link?: string }) => {
    // Navigate based on banner CTA link
    if (banner.cta_link) {
      // Handle different link formats
      if (banner.cta_link.startsWith('/products')) {
        router.push(banner.cta_link as any);
      } else if (banner.cta_link.startsWith('/categories')) {
        router.push(banner.cta_link as any);
      } else if (banner.cta_link.startsWith('/collections')) {
        // Collections can be mapped to products with filters
        router.push('/products');
      } else {
        router.push(banner.cta_link as any);
      }
    }
  };

  const handleLocationPress = () => {
    // Navigate to address/location settings
    router.push('/settings/addresses');
  };

  const handleNotificationsPress = () => {
    router.push('/notifications');
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
    ? homeData?.popular_products.filter((p) => p.cultural_region?.toLowerCase().includes(selectedRegion.toLowerCase()))
    : homeData?.popular_products;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Sticky Header Section */}
      <View style={styles.stickyHeader}>
        {/* Header Row */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={handleLocationPress}
            activeOpacity={0.8}
          >
            <MapPin size={20} color={Colors.primary} weight="fill" />
            <Text style={styles.locationText}>Brixton, London</Text>
            <CaretDown size={16} color={Colors.textMuted} weight="bold" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotificationsPress}
            activeOpacity={0.8}
          >
            <Bell size={24} color={Colors.textPrimary} weight="duotone" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchContainer}
          onPress={() => router.push('/search')}
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
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Featured Collection Slider */}
          {homeData?.banners && homeData.banners.length > 0 && (
            <FeaturedSlider 
              banners={homeData.banners}
              onBannerPress={handleBannerPress}
              autoPlay={true}
              autoPlayInterval={5000}
            />
          )}

          {/* Shop by Region */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Shop by Region</Text>
              <TouchableOpacity onPress={() => router.push('/regions')} activeOpacity={0.7}>
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
                  selected={selectedRegion === region.name}
                  onPress={() => handleRegionPress(region)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Featured Vendors */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Vendors</Text>
              <TouchableOpacity onPress={() => router.push('/vendors')} activeOpacity={0.7}>
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
                  variant="carousel"
                  onPress={() => handleVendorPress(vendor)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Popular Products */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {selectedRegion ? `Products from ${selectedRegion}` : 'Popular Products'}
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  const regionSlug = selectedRegion?.toLowerCase().replace(/\s+/g, '-');
                  router.push(selectedRegion ? `/products?region=${regionSlug}` : '/products');
                }} 
                activeOpacity={0.7}
              >
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
        </Animated.View>
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
    gap: 6,
  },
  locationText: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textPrimary,
    fontSize: FontSize.small,
  },
  notificationButton: {
    position: 'relative',
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
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
    borderRadius: BorderRadius.full,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
    height: Heights.input,
    gap: Spacing.sm,
  },
  searchPlaceholder: {
    flex: 1,
    fontFamily: FontFamily.body,
    color: Colors.textMuted,
    fontSize: FontSize.small,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.sm,
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
    fontFamily: FontFamily.displaySemiBold,
    color: Colors.textPrimary,
    fontSize: FontSize.h4,
  },
  seeAllText: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.primary,
    fontSize: FontSize.small,
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
