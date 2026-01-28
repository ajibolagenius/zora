import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
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
  ChatCircle,
  MagnifyingGlass,
  Sliders,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Heights } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { AnimationDuration, AnimationEasing } from '../../constants';
import { FeaturedSlider, RegionCard, VendorCard, ProductCard } from '../../components/ui';
import MetaTags from '../../components/ui/MetaTags';
import { homeService, type HomeData } from '../../services/homeService';
import { messagingService } from '../../services/messagingService';
import type { Vendor, Product } from '../../types';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { isSupabaseConfigured } from '../../lib/supabase';
import { getProductRoute, getVendorRoute } from '../../lib/navigationHelpers';
import { CommonImages } from '../../constants';
import { generatePageMetaTags } from '../../lib/metaTags';

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
  const [userLocation, setUserLocation] = useState<{ city: string; postcode: string } | null>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [productOffset, setProductOffset] = useState(0);
  const [loadingColor] = useState(() => {
    // Generate random vibrant color similar to onboarding categories
    const vibrantColors = [
      Colors.primary,        // #CC0000 - Zora Red
      Colors.secondary,      // #FFCC00 - Zora Yellow
      Colors.success,        // #22C55E - Green
      Colors.info,           // #3B82F6 - Blue
      Colors.badgeEcoFriendly, // #14B8A6 - Teal
    ];
    return vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
  });
  const addToCart = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  
  // Get user's primary cultural region for personalized ranking
  const userRegion = user?.cultural_interests?.[0] || undefined;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Shuffle array randomly
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchHomeData = async () => {
    try {
      // Fetch home data and user location in parallel for faster loading
      const [data, location] = await Promise.all([
        homeService.getHomeData(userRegion),
        user?.user_id ? homeService.getUserLocation(user.user_id) : Promise.resolve(null),
      ]);
      
      // Randomize featured vendors
      const randomizedVendors = shuffleArray(data.featured_vendors);
      
      // Randomize popular products
      const randomizedProducts = shuffleArray(data.popular_products);
      
      setHomeData({
        ...data,
        featured_vendors: randomizedVendors,
        popular_products: randomizedProducts,
      });
      
      // Initialize products list with randomized batch (deduplicated)
      const uniqueProducts = Array.from(
        new Map(randomizedProducts.map(p => [p.id, p])).values()
      );
      setAllProducts(uniqueProducts);
      setProductOffset(uniqueProducts.length);
      setHasMoreProducts(uniqueProducts.length >= 20); // Assume more if we got full batch

      // Set user location
      setUserLocation(location);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMoreProducts = async () => {
    if (loadingMore || !hasMoreProducts) return;

    try {
      setLoadingMore(true);
      const moreProducts = await homeService.getMoreProducts(userRegion, productOffset, 20);
      
      if (moreProducts.length === 0) {
        setHasMoreProducts(false);
      } else {
        // Deduplicate products by ID to prevent duplicate keys
        // Calculate new products count BEFORE state updates to avoid side effects in updater
        // Use functional update to access current state synchronously
        let newProductsCount = 0;
        setAllProducts((prev) => {
          const existingIds = new Set(prev.map(p => p.id));
          const newProducts = moreProducts.filter(p => !existingIds.has(p.id));
          newProductsCount = newProducts.length; // Capture count for use outside updater
          return [...prev, ...newProducts];
        });
        
        // Update offset AFTER setAllProducts (outside updater function to avoid side effects)
        // Use the captured count from the updater calculation
        setProductOffset((prev) => prev + newProductsCount);
        setHasMoreProducts(moreProducts.length >= 20); // More available if we got full batch
      }
    } catch (error) {
      console.error('Error loading more products:', error);
      setHasMoreProducts(false);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchHomeData();

    // Subscribe to real-time updates
    let unsubscribe: (() => void) | null = null;

    homeService.subscribeToHomeUpdates(
      (updatedData) => {
        setHomeData((prev) => {
          if (!prev) return prev;
          
          // Randomize vendors and products when updated
          const updatedVendors = updatedData.featured_vendors 
            ? shuffleArray(updatedData.featured_vendors)
            : prev.featured_vendors;
          
          const updatedProducts = updatedData.popular_products
            ? shuffleArray(updatedData.popular_products)
            : prev.popular_products;
          
          return {
            ...prev,
            ...updatedData,
            featured_vendors: updatedVendors,
            popular_products: updatedProducts,
          };
        });
        
        // If popular_products were updated, merge them with allProducts (deduplicated and randomized)
        if (updatedData.popular_products) {
          const randomizedNewProducts = shuffleArray(updatedData.popular_products);
          setAllProducts((prev) => {
            const existingIds = new Set(prev.map(p => p.id));
            const newProducts = randomizedNewProducts.filter(p => !existingIds.has(p.id));
            // Shuffle the combined list to randomize order
            return shuffleArray([...prev, ...newProducts]);
          });
        }
      },
      userRegion
    ).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userRegion, user?.user_id]); // Refetch when user region or user changes

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
    setProductOffset(0);
    setHasMoreProducts(true);
    setAllProducts([]);
    fetchHomeData();
  };

  const handleProductPress = useCallback((product: Product) => {
    router.push(getProductRoute(product.id) as any);
  }, [router]);

  const handleVendorPress = useCallback((vendor: Vendor) => {
    router.push(getVendorRoute(vendor as any, vendor.id) as any);
  }, [router]);

  const handleAddToCart = useCallback((product: Product) => {
    // Map Product to cart Product format
    const imageUrls = product.images || (product.image_url ? [product.image_url] : []);
    
    const cartProduct = {
      ...product,
      currency: product.currency || 'GBP',
      image_url: product.image_url || imageUrls[0] || '',
      images: imageUrls,
      region: product.region || '',
      in_stock: product.in_stock ?? ((product.stock_quantity || 0) > 0),
      attributes: product.attributes || {},
    };
    addToCart(cartProduct as any, 1);
  }, [addToCart]);

  const handleRegionPress = (region: { name: string }) => {
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

  const handleMessagesPress = () => {
    router.push('/messages');
  };

  // Fetch unread messages count
  useEffect(() => {
    if (user?.user_id && isSupabaseConfigured()) {
      messagingService.getUnreadCount(user.user_id).then(setUnreadMessagesCount);
    }
  }, [user?.user_id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Memoize filtered products to prevent unnecessary re-renders
  const filteredProducts = useMemo(() => {
    return selectedRegion
      ? allProducts.filter((p) => (p.region || '').toLowerCase().includes(selectedRegion.toLowerCase()))
      : allProducts;
  }, [allProducts, selectedRegion]);

  // Memoize product card render to prevent unnecessary re-renders
  const renderProductCard = useCallback((product: Product, index: number) => {
    return (
      <View 
        key={`product-${product.id}`}
        style={{
          width: productCardWidth,
          marginRight: index % 2 === 0 ? PRODUCT_GAP : 0,
          marginBottom: PRODUCT_GAP,
        }}
      >
        <ProductCard
          product={{
            ...product,
            description: product.description || undefined,
          } as any}
          onPress={() => handleProductPress(product)}
          onAddToCart={() => handleAddToCart(product)}
        />
      </View>
    );
  }, [productCardWidth, handleProductPress, handleAddToCart]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MetaTags
        data={{
          title: 'Zora African Market - Authentic African Groceries & Products',
          description: 'Discover authentic African groceries, products, and vendors. Shop from the best African markets in the UK. Fast delivery, verified vendors, and premium quality.',
          image: '/assets/images/app-image.png',
          url: '/',
          type: 'website',
        }}
      />
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
            <Text style={styles.locationText}>
              {userLocation 
                ? `${userLocation.city}${userLocation.postcode ? `, ${userLocation.postcode}` : ''}`
                : 'Brixton, London'
              }
            </Text>
            <CaretDown size={16} color={Colors.textMuted} weight="bold" />
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity 
              style={styles.headerIconButton}
              onPress={handleMessagesPress}
              activeOpacity={0.8}
            >
              <ChatCircle size={24} color={Colors.textPrimary} weight="duotone" />
              {unreadMessagesCount > 0 && (
                <View style={styles.headerIconBadge}>
                  <Text style={styles.headerIconBadgeText}>
                    {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerIconButton}
              onPress={handleNotificationsPress}
              activeOpacity={0.8}
            >
              <Bell size={24} color={Colors.textPrimary} weight="duotone" />
              {unreadCount > 0 && (
                <View style={styles.headerIconBadge}>
                  <Text style={styles.headerIconBadgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
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
        onScroll={(event) => {
          const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
          const paddingToBottom = 100;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            loadMoreProducts();
          }
        }}
        scrollEventThrottle={400}
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
              {homeData?.regions.map((region) => {
                // Get fallback image from CommonImages based on slug
                const getRegionImage = (slug: string): string => {
                  if (region.image_url) return region.image_url;
                  const imageMap: Record<string, string> = {
                    'west-africa': CommonImages.westAfrica,
                    'east-africa': CommonImages.eastAfrica,
                    'southern-africa': CommonImages.southernAfrica,
                    'central-africa': CommonImages.centralAfrica,
                    'north-africa': CommonImages.northAfrica,
                  };
                  return imageMap[slug] || CommonImages.westAfrica;
                };

                return (
                  <RegionCard
                    key={region.id}
                    region={{
                      id: region.id,
                      name: region.name,
                      image_url: getRegionImage(region.slug || region.id),
                      description: region.description || undefined,
                    }}
                    selected={selectedRegion === region.name}
                    onPress={() => handleRegionPress({ name: region.name })}
                  />
                );
              })}
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
                  vendor={{
                    ...vendor,
                    description: vendor.description || undefined,
                  } as any}
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
              {filteredProducts.map((product, index) => renderProductCard(product, index))}
            </View>
            
            {/* Loading More Footer */}
            {loadingMore && hasMoreProducts && (
              <View style={styles.loadingFooterContainer}>
                <View style={[styles.loadingFooter, { backgroundColor: loadingColor + '20' }]}>
                  <ActivityIndicator size="small" color={loadingColor} />
                  <Text style={[styles.loadingFooterText, { color: loadingColor }]}>
                    Loading more products...
                  </Text>
                </View>
              </View>
            )}
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
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerIconButton: {
    position: 'relative',
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.backgroundDark,
  },
  headerIconBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    color: Colors.textPrimary,
    lineHeight: 12,
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
  loadingFooterContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    alignSelf: 'center',
  },
  loadingFooterText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
  },
});
