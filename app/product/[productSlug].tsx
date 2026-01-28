import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  FlatList,
  Animated,
  Share,
  Platform,
} from 'react-native';
import { LazyImage, LazyAvatar } from '../../components/ui';
import MetaTags from '../../components/ui/MetaTags';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Link } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  Leaf,
  Star,
  Recycle,
  CaretDown,
  CaretUp,
  Truck,
  ShieldCheck,
  SealCheck,
  CaretRight,
  Minus,
  Plus,
  PencilSimple,
  ShareNetwork,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, TouchTarget } from '../../constants/spacing';
import { FontSize, FontWeight, LetterSpacing, FontFamily } from '../../constants/typography';
import { ImageUrlBuilders } from '../../constants';
import { productService, vendorService, reviewService } from '../../services/supabaseService';
import { realtimeService } from '../../services/realtimeService';
import type { Product, Vendor, Review } from '../../types/supabase';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useAuthStore } from '../../stores/authStore';
import { useToast } from '../../components/ui/ToastProvider';
import FloatingTabBar from '../../components/ui/FloatingTabBar';
import { decodeProductSlug, isValidProductSlug } from '../../lib/slugUtils';
import { getVendorRoute, isValidRouteParam, safeGoBack } from '../../lib/navigationHelpers';
import NotFoundScreen from '../../components/errors/NotFoundScreen';
import { isSupabaseConfigured } from '../../lib/supabase';
import { generateProductMetaTags } from '../../lib/metaTags';

type SectionType = 'description' | 'nutrition' | 'heritage';

export default function ProductScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { productSlug } = useLocalSearchParams<{ productSlug: string }>();
  const { height: screenHeight } = useWindowDimensions();
  const addToCart = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  const showToast = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<SectionType>('description');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const fetchData = useCallback(async () => {
    if (!productSlug) return;
    
    // Validate slug format
    if (!isValidRouteParam(productSlug, 'slug')) {
      setLoading(false);
      return; // Will show NotFoundScreen
    }
    
    try {
      setLoading(true);
      // getBySlug handles both Base62-encoded UUIDs and legacy IDs
      const productData = await productService.getBySlug(productSlug);
      if (productData) {
        setProduct(productData);
        if (productData.vendor_id) {
          const vendorData = await vendorService.getById(productData.vendor_id);
          setVendor(vendorData || null);
        }
        // Fetch reviews for this product
        const productReviews = await reviewService.getByProduct(productData.id);
        setReviews(productReviews);
        
        // Update product review count and rating from actual reviews if available
        // Otherwise use the product's stored values
        if (productReviews.length > 0) {
          const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
          setProduct((prev) => prev ? { 
            ...prev, 
            review_count: productReviews.length,
            rating: Math.round(avgRating * 10) / 10 // Round to 1 decimal
          } : null);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }, [productSlug]);

  // Set up real-time subscriptions after product is loaded
  useEffect(() => {
    if (!product?.id || !isSupabaseConfigured()) return;

    const unsubscribers: (() => void)[] = [];
    let isMounted = true;

    // Subscribe to product updates
    realtimeService.subscribeToTable(
      'products',
      '*',
      async (payload) => {
        if (!isMounted || !product?.id) return;
        
        if (payload.new?.id === product.id || payload.old?.id === product.id) {
          try {
            const updatedProduct = await productService.getById(product.id);
            if (updatedProduct && isMounted) {
              setProduct(updatedProduct);
            }
          } catch (error) {
            console.error('Error fetching updated product:', error);
          }
        }
      },
      `id=eq.${product.id}`
    ).then((unsub) => {
      if (isMounted && unsub) unsubscribers.push(unsub);
    }).catch((error) => {
      console.error('Error setting up product subscription:', error);
    });

    // Subscribe to reviews updates for this product
    realtimeService.subscribeToTable(
      'reviews',
      '*',
      async (payload) => {
        if (!isMounted || !product?.id) return;
        
        if (payload.new?.product_id === product.id || payload.old?.product_id === product.id) {
          try {
            const updatedReviews = await reviewService.getByProduct(product.id);
            if (isMounted) {
              setReviews(updatedReviews);
              // Update product review count and rating from actual reviews
              if (updatedReviews.length > 0) {
                const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
                setProduct((prev) => prev ? { 
                  ...prev, 
                  review_count: updatedReviews.length,
                  rating: Math.round(avgRating * 10) / 10 // Round to 1 decimal
                } : null);
              } else {
                setProduct((prev) => prev ? { 
                  ...prev, 
                  review_count: 0,
                  rating: 0 
                } : null);
              }
            }
          } catch (error) {
            console.error('Error fetching updated reviews:', error);
          }
        }
      },
      `product_id=eq.${product.id}`
    ).then((unsub) => {
      if (isMounted && unsub) unsubscribers.push(unsub);
    }).catch((error) => {
      console.error('Error setting up reviews subscription:', error);
    });

    // Subscribe to vendor updates
    if (product.vendor_id) {
      realtimeService.subscribeToTable(
        'vendors',
        '*',
        async (payload) => {
          if (!isMounted || !product?.vendor_id) return;
          
          if (payload.new?.id === product.vendor_id || payload.old?.id === product.vendor_id) {
            try {
              const updatedVendor = await vendorService.getById(product.vendor_id);
              if (updatedVendor && isMounted) {
                setVendor(updatedVendor);
              }
            } catch (error) {
              console.error('Error fetching updated vendor:', error);
            }
          }
        },
        `id=eq.${product.vendor_id}`
      ).then((unsub) => {
        if (isMounted && unsub) unsubscribers.push(unsub);
      }).catch((error) => {
        console.error('Error setting up vendor subscription:', error);
      });
    }

    return () => {
      isMounted = false;
      unsubscribers.forEach((unsub) => {
        if (typeof unsub === 'function') {
          unsub();
        }
      });
    };
  }, [product?.id, product?.vendor_id]);

  const productImages = product?.image_urls || [];
  const { width: screenWidth } = useWindowDimensions();
  
  const handleImageScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentImageIndex(index);
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    if (product) {
      addToCart(product as any, quantity);
      safeGoBack(router, '/(tabs)/explore');
    }
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    
    if (!user?.user_id) {
      showToast('Please log in to add items to your wishlist', 'info');
      return;
    }

    toggleWishlist(product);
    const isFavorite = isInWishlist(product.id);
    if (isFavorite) {
      showToast('Added to wishlist', 'success');
    } else {
      showToast('Removed from wishlist', 'info');
    }
  };

  const handleShare = async () => {
    if (!product) return;

    const productUrl = Platform.select({
      web: typeof window !== 'undefined' 
        ? `${window.location.origin}/product/${productSlug}` 
        : `https://zora.app/product/${productSlug}`,
      default: `https://zora.app/product/${productSlug}`,
    });

    try {
      await Share.share({
        message: `Check out ${product.name} on Zora African Market! ${productUrl}`,
        title: `Share ${product.name}`,
        ...(Platform.OS !== 'web' && { url: productUrl }),
      });
    } catch (error: any) {
      // User cancelled or error occurred
      if (error.message !== 'User did not share') {
        console.error('Error sharing:', error);
      }
    }
  };

  // Check if nutrition data is available
  const hasNutritionData = product?.nutrition && 
    typeof product.nutrition === 'object' && 
    Object.keys(product.nutrition).length > 0;

  // Get available tabs based on data
  const availableTabs: SectionType[] = React.useMemo(() => {
    const tabs: SectionType[] = ['description'];
    if (hasNutritionData) {
      tabs.push('nutrition');
    }
    if (product?.heritage_story) {
      tabs.push('heritage');
    }
    return tabs;
  }, [product?.nutrition, product?.heritage_story, hasNutritionData]);

  // Ensure active tab is valid when product or tabs change
  useEffect(() => {
    if (product && !availableTabs.includes(activeTab)) {
      setActiveTab('description');
    }
  }, [product, availableTabs, activeTab]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <NotFoundScreen
        title="Product Not Found"
        message="This product doesn't exist or may have been removed. It might have been deleted or the link is incorrect."
        onBack={() => safeGoBack(router, '/(tabs)/explore')}
      />
    );
  }

  const totalPrice = (product.price * quantity).toFixed(2);

  // Get product image URL
  const productImageUrl = Array.isArray(product.image_urls) 
    ? product.image_urls[0] 
    : (product.image_urls || '');
  
  // Get vendor name
  const vendorName = vendor ? ((vendor as any).shop_name || (vendor as any).name || '') : '';
  
  // Generate product URL
  const productUrl = `/product/${productSlug}`;

  return (
    <View style={styles.container}>
      <MetaTags
        data={generateProductMetaTags(
          product.name,
          product.description || '',
          Number(product.price),
          productImageUrl,
          productUrl,
          vendorName,
          (product.stock_quantity || 0) > 0
        )}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Image Section - 45vh with Slider */}
        <View style={styles.imageSliderWrapper}>
          {productImages.length > 1 ? (
            <>
              <FlatList
                ref={flatListRef}
                data={productImages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleImageScroll}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                keyExtractor={(item, index) => `image-${index}`}
                getItemLayout={(_, index) => ({
                  length: screenWidth,
                  offset: screenWidth * index,
                  index,
                })}
                renderItem={({ item }) => (
                  <View style={[styles.heroSection, { height: screenHeight * 0.45, width: screenWidth }]}>
                    <View style={styles.heroImage}>
                      <LazyImage
                        source={item}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                        showLoader={false}
                      />
                      <LinearGradient
                        colors={[Colors.black40, 'transparent', 'rgba(0, 0, 0, 0.6)']} // 60% opacity
                        style={styles.heroGradient}
                      />
                    </View>
                  </View>
                )}
              />
              
              {/* Pagination Dots */}
              {productImages.length > 1 && (
                <View style={styles.paginationDots}>
                  {productImages.map((_, index) => {
                    const inputRange = [
                      (index - 1) * screenWidth,
                      index * screenWidth,
                      (index + 1) * screenWidth,
                    ];
                    
                    const dotWidth = scrollX.interpolate({
                      inputRange,
                      outputRange: [6, 20, 6],
                      extrapolate: 'clamp',
                    });
                    
                    const opacity = scrollX.interpolate({
                      inputRange,
                      outputRange: [0.4, 1, 0.4],
                      extrapolate: 'clamp',
                    });

                    return (
                      <Animated.View
                        key={index}
                        style={[
                          styles.paginationDot,
                          { width: dotWidth, opacity },
                        ]}
                      />
                    );
                  })}
                </View>
              )}
            </>
          ) : (
            <View style={[styles.heroSection, { height: screenHeight * 0.45 }]}>
              <View style={styles.heroImage}>
                <LazyImage
                  source={productImages[0] || ''}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                  showLoader={false}
                />
                <LinearGradient
                  colors={[Colors.black40, 'transparent', 'rgba(0, 0, 0, 0.6)']} // 60% opacity
                  style={styles.heroGradient}
                />
              </View>
            </View>
          )}
          
          {/* Header Buttons - Overlay on images */}
          <View style={[styles.heroHeader, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => safeGoBack(router, '/(tabs)/explore')}
            >
              <ArrowLeft size={20} color={Colors.textPrimary} weight="bold" />
            </TouchableOpacity>
            <View style={styles.heroHeaderRight}>
              <TouchableOpacity
                style={styles.heroButton}
                onPress={handleToggleFavorite}
              >
                <Heart 
                  size={20} 
                  color={product && isInWishlist(product.id) ? Colors.primary : "#FFFFFF"} 
                  weight={product && isInWishlist(product.id) ? 'fill' : 'regular'} 
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.heroButton}
                onPress={handleShare}
              >
                <ShareNetwork size={20} color="#FFFFFF" weight="duotone" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content Card - Overlapping hero */}
        <View style={styles.contentCard}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Product Title & Price */}
          <View style={styles.titleSection}>
            <Text style={styles.productTitle}>{product.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceMain}>£{product.price.toFixed(2)}</Text>
              <Text style={styles.priceUnit}>{product.unit_price_label || `£${(product.price / parseFloat(product.weight || '1')).toFixed(2)}/kg`}</Text>
            </View>
          </View>

          {/* Badges Row */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgesContainer}
          >
            {product.certifications?.includes('Organic') && (
              <View style={[styles.badge, styles.badgeOrganic]}>
                <Leaf size={16} color="#4ADE80" weight="fill" />
                <Text style={[styles.badgeText, styles.badgeTextOrganic]}>Organic</Text>
              </View>
            )}
            {product.rating >= 4.5 && (
              <View style={[styles.badge, styles.badgeTopRated]}>
                <Star size={16} color="#FACC15" weight="fill" />
                <Text style={[styles.badgeText, styles.badgeTextTopRated]}>Top Rated</Text>
              </View>
            )}
            {product.certifications?.includes('Eco-friendly') && (
              <View style={[styles.badge, styles.badgeEco]}>
                <Recycle size={16} color="#2DD4BF" weight="fill" />
                <Text style={[styles.badgeText, styles.badgeTextEco]}>Eco-friendly</Text>
              </View>
            )}
          </ScrollView>

          {/* Vendor Card */}
          {vendor && (
            <TouchableOpacity
              style={styles.vendorCard}
              onPress={() => {
                router.push(getVendorRoute(vendor as any, vendor.id));
              }}
              activeOpacity={0.8}
            >
              <LazyAvatar
                source={vendor.logo_url}
                size={48}
                style={styles.vendorAvatar}
              />
              <View style={styles.vendorInfo}>
                <View style={styles.vendorLabelRow}>
                  <Text style={styles.vendorLabel}>Sold by</Text>
                  {vendor.is_verified && (
                    <SealCheck size={14} color="#3B82F6" weight="fill" />
                  )}
                </View>
                <Text style={styles.vendorName}>{vendor.shop_name}</Text>
              </View>
              <View style={styles.vendorArrow}>
                <CaretRight size={20} color="#FFFFFF" weight="bold" />
              </View>
            </TouchableOpacity>
          )}

          {/* Tabs for Sections - Only show if more than one tab available */}
          {availableTabs.length > 1 && (
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'description' && styles.tabActive]}
                onPress={() => setActiveTab('description')}
              >
                <Text style={[styles.tabText, activeTab === 'description' && styles.tabTextActive]}>
                  Description
                </Text>
              </TouchableOpacity>
              {hasNutritionData && (
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'nutrition' && styles.tabActive]}
                  onPress={() => setActiveTab('nutrition')}
                >
                  <Text style={[styles.tabText, activeTab === 'nutrition' && styles.tabTextActive]}>
                    Nutrition
                  </Text>
                </TouchableOpacity>
              )}
              {product?.heritage_story && (
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'heritage' && styles.tabActive]}
                  onPress={() => setActiveTab('heritage')}
                >
                  <Text style={[styles.tabText, activeTab === 'heritage' && styles.tabTextActive]}>
                    Heritage Story
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Show description directly if only one section available */}
          {availableTabs.length === 1 && (
            <View style={styles.singleSectionContainer}>
              <Text style={styles.sectionTitle}>Description</Text>
            </View>
          )}

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {(activeTab === 'description' || availableTabs.length === 1) && (
              <View style={styles.sectionContent}>
                <Text style={styles.sectionText}>
                  {product.description || 'Premium quality product sourced from the finest ingredients. Perfect for traditional African dishes and modern fusion cuisine.'}
                </Text>
              </View>
            )}

            {activeTab === 'nutrition' && hasNutritionData && (
              <View style={styles.sectionContent}>
                <View style={styles.nutritionGrid}>
                  {product.nutrition && typeof product.nutrition === 'object' && (
                    <>
                      {product.nutrition.calories && (
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionLabel}>Calories</Text>
                          <Text style={styles.nutritionValue}>
                            {typeof product.nutrition.calories === 'string' 
                              ? product.nutrition.calories 
                              : `${product.nutrition.calories} kcal / 100g`}
                          </Text>
                        </View>
                      )}
                      {product.nutrition.protein && (
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionLabel}>Protein</Text>
                          <Text style={styles.nutritionValue}>
                            {typeof product.nutrition.protein === 'string' 
                              ? product.nutrition.protein 
                              : `${product.nutrition.protein}g`}
                          </Text>
                        </View>
                      )}
                      {product.nutrition.carbs && (
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionLabel}>Carbs</Text>
                          <Text style={styles.nutritionValue}>
                            {typeof product.nutrition.carbs === 'string' 
                              ? product.nutrition.carbs 
                              : `${product.nutrition.carbs}g`}
                          </Text>
                        </View>
                      )}
                      {product.nutrition.fat && (
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionLabel}>Fat</Text>
                          <Text style={styles.nutritionValue}>
                            {typeof product.nutrition.fat === 'string' 
                              ? product.nutrition.fat 
                              : `${product.nutrition.fat}g`}
                          </Text>
                        </View>
                      )}
                      {product.nutrition.fiber && (
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionLabel}>Fiber</Text>
                          <Text style={styles.nutritionValue}>
                            {typeof product.nutrition.fiber === 'string' 
                              ? product.nutrition.fiber 
                              : `${product.nutrition.fiber}g`}
                          </Text>
                        </View>
                      )}
                      {product.nutrition.sugar && (
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionLabel}>Sugar</Text>
                          <Text style={styles.nutritionValue}>
                            {typeof product.nutrition.sugar === 'string' 
                              ? product.nutrition.sugar 
                              : `${product.nutrition.sugar}g`}
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </View>
              </View>
            )}

            {activeTab === 'heritage' && product?.heritage_story && (
              <View style={styles.sectionContent}>
                <Text style={styles.sectionText}>
                  {product.heritage_story}
                </Text>
              </View>
            )}
          </View>

          {/* Info Cards */}
          <View style={styles.infoCardsRow}>
            <View style={styles.infoCard}>
              <Truck size={28} color={Colors.primary} weight="duotone" />
              <View style={styles.infoCardText}>
                <Text style={styles.infoCardTitle}>2-3 Day Delivery</Text>
                <Text style={styles.infoCardSubtitle}>Tracked shipping</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <ShieldCheck size={28} color={Colors.primary} weight="duotone" />
              <View style={styles.infoCardText}>
                <Text style={styles.infoCardTitle}>Quality Guaranteed</Text>
                <Text style={styles.infoCardSubtitle}>Premium grade</Text>
              </View>
            </View>
          </View>

          {/* Reviews Section */}
          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <View>
                <Text style={styles.reviewsTitle}>Customer Reviews</Text>
                <View style={styles.reviewsRating}>
                  <Star size={16} color={Colors.secondary} weight="fill" />
                  <Text style={styles.reviewsRatingText}>
                    {product.rating?.toFixed(1) || '0.0'} ({product.review_count || reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </Text>
                </View>
              </View>
              <Link 
                href={`/write-review?productId=${product.id}&productName=${encodeURIComponent(product.name)}`}
                asChild
              >
                <TouchableOpacity style={styles.writeReviewButton}>
                  <PencilSimple size={18} color="#C1272D" weight="bold" />
                  <Text style={styles.writeReviewText}>Write Review</Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <View style={styles.reviewsList}>
                {reviews.slice(0, 3).map((review) => (
                  <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <LazyAvatar
                        source={review.user_avatar || ImageUrlBuilders.dicebearAvatar('User')}
                        size={40}
                        style={styles.reviewAvatar}
                      />
                      <View style={styles.reviewMeta}>
                        <Text style={styles.reviewerName}>{review.user_name}</Text>
                        <View style={styles.reviewStars}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              color={star <= review.rating ? Colors.secondary : Colors.textMuted}
                              weight={star <= review.rating ? 'fill' : 'regular'}
                            />
                          ))}
                          <Text style={styles.reviewDate}>
                            {new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </Text>
                        </View>
                      </View>
                      {review.verified_purchase && (
                        <View style={styles.verifiedBadge}>
                          <SealCheck size={14} color="#10B981" weight="fill" />
                          <Text style={styles.verifiedText}>Verified</Text>
                        </View>
                      )}
                    </View>
                    {review.title && (
                      <Text style={styles.reviewTitle}>{review.title}</Text>
                    )}
                    <Text style={styles.reviewContent} numberOfLines={3}>
                      {review.content}
                    </Text>
                  </View>
                ))}
                {reviews.length > 3 && (
                  <TouchableOpacity 
                    style={styles.viewAllReviews}
                    onPress={() => router.push(`/product/${productSlug}/reviews`)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.viewAllReviewsText}>View All {reviews.length} Reviews</Text>
                    <CaretRight size={16} color={Colors.primary} weight="bold" />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.noReviews}>
                <Text style={styles.noReviewsText}>No reviews yet. Be the first to review!</Text>
                <Link 
                  href={`/write-review?productId=${product.id}&productName=${encodeURIComponent(product.name)}`}
                  asChild
                >
                  <TouchableOpacity style={styles.firstReviewButton}>
                    <Text style={styles.firstReviewText}>Write a Review</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            )}
          </View>

          {/* Bottom spacer */}
          <View style={{ height: 200 }} />
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 90 }]}>
        <View style={styles.bottomBarContent}>
          {/* Quantity Selector */}
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={decrementQuantity}
            >
              <Minus size={20} color={Colors.textMuted} weight="bold" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={incrementQuantity}
            >
              <Plus size={20} color={Colors.textMuted} weight="bold" />
            </TouchableOpacity>
          </View>

          {/* Add to Basket Button */}
          <TouchableOpacity
            style={styles.addToBasketButton}
            onPress={handleAddToCart}
            activeOpacity={0.9}
          >
            <Text style={styles.addToBasketText}>Add to Basket</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Tab Bar */}
      <FloatingTabBar />
    </View>
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
  errorText: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
  },
  scrollView: {
    flex: 1,
  },

  // Hero Section
  heroSection: {
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  imageSliderWrapper: {
    position: 'relative',
  },
  heroButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white10,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroHeaderRight: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  paginationDots: {
    position: 'absolute',
    bottom: Spacing.base,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  paginationDot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textPrimary,
  },

  // Content Card
  contentCard: {
    backgroundColor: Colors.cardDark,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    marginTop: -48,
    paddingHorizontal: Spacing.lg,
    paddingTop: 32,
    minHeight: 500,
    paddingBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderBottomWidth: 0,
  },
  dragHandle: {
    width: 48,
    height: 4,
    backgroundColor: Colors.white20,
    borderRadius: 2,
    alignSelf: 'center',
    position: 'absolute',
    top: 12,
  },

  // Title Section
  titleSection: {
    marginBottom: Spacing.lg,
  },
  productTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
    lineHeight: 32,
    marginBottom: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.md,
  },
  priceMain: {
    fontFamily: FontFamily.display,
    fontSize: 30,
    color: Colors.secondary,
  },
  priceUnit: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyLarge,
    color: Colors.textMuted,
    marginBottom: 4,
  },

  // Badges
  badgesContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  badgeOrganic: {
    backgroundColor: Colors.success15,
    borderColor: Colors.success,
  },
  badgeTopRated: {
    backgroundColor: Colors.secondary15,
    borderColor: Colors.secondary,
  },
  badgeEco: {
    backgroundColor: Colors.info10,
    borderColor: Colors.info,
  },
  badgeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    textTransform: 'uppercase',
    letterSpacing: LetterSpacing.wide,
  },
  badgeTextOrganic: {
    color: Colors.success,
  },
  badgeTextTopRated: {
    color: Colors.secondary,
  },
  badgeTextEco: {
    color: Colors.info,
  },

  // Vendor Card
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white05,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    marginBottom: Spacing.lg,
    gap: Spacing.base,
  },
  vendorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundDark,
    borderWidth: 1,
    borderColor: Colors.white10,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 2,
  },
  vendorLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.tiny,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: LetterSpacing.wider,
  },
  vendorName: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  vendorArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
    marginTop: Spacing.lg,
    marginBottom: Spacing.base,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    position: 'relative',
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textMuted,
  },
  tabTextActive: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.primary,
  },
  tabContent: {
    paddingTop: Spacing.base,
    paddingBottom: Spacing.base,
  },
  singleSectionContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  sectionContent: {
    paddingBottom: Spacing.base,
  },
  sectionText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // Nutrition Grid
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.base,
  },
  nutritionItem: {
    width: '45%',
  },
  nutritionLabel: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },

  // Info Cards
  infoCardsRow: {
    flexDirection: 'row',
    gap: Spacing.base,
    marginTop: Spacing.lg,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.white08,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  infoCardText: {
    gap: 2,
  },
  infoCardTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  infoCardSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.backgroundDark90,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.borderDark,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.white10,
    height: 48,
    paddingHorizontal: Spacing.xs,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },
  addToBasketButton: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToBasketText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: LetterSpacing.wide,
  },

  // Reviews Section
  reviewsSection: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  reviewsTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  reviewsRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  reviewsRatingText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  writeReviewText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.primary,
  },
  reviewsList: {
    gap: Spacing.md,
  },
  reviewCard: {
    backgroundColor: Colors.white08,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: Spacing.sm,
  },
  reviewMeta: {
    flex: 1,
  },
  reviewerName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  reviewStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  reviewDate: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.success15,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  verifiedText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.success,
  },
  reviewTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  reviewContent: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  viewAllReviews: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  viewAllReviewsText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.primary,
  },
  noReviews: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  noReviewsText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  firstReviewButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  firstReviewText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
});
