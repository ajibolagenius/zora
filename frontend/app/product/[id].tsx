import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  ImageBackground,
  FlatList,
  Animated,
} from 'react-native';
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
import { productService, vendorService, reviewService, type Product, type Vendor, type Review } from '../../services/mockDataService';
import { useCartStore } from '../../stores/cartStore';
import FloatingTabBar from '../../components/ui/FloatingTabBar';

type SectionType = 'description' | 'nutrition' | 'heritage';

export default function ProductScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { height: screenHeight } = useWindowDimensions();
  const addToCart = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<SectionType>('description');
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const productData = productService.getById(id);
      if (productData) {
        setProduct(productData);
        if (productData.vendor_id) {
          const vendorData = vendorService.getById(productData.vendor_id);
          setVendor(vendorData || null);
        }
        // Fetch reviews for this product
        const productReviews = reviewService.getByProduct(id);
        setReviews(productReviews);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      router.back();
    }
  };

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
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Product not found</Text>
        </View>
      </View>
    );
  }

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <View style={styles.container}>
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
                    <ImageBackground
                      source={{ uri: item }}
                      style={styles.heroImage}
                      resizeMode="cover"
                    >
                      <LinearGradient
                        colors={[Colors.black40, 'transparent', 'rgba(0, 0, 0, 0.6)']} // 60% opacity
                        style={styles.heroGradient}
                      />
                    </ImageBackground>
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
              <ImageBackground
                source={{ uri: productImages[0] || '' }}
                style={styles.heroImage}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={[Colors.black40, 'transparent', 'rgba(0, 0, 0, 0.6)']} // 60% opacity
                  style={styles.heroGradient}
                />
              </ImageBackground>
            </View>
          )}
          
          {/* Header Buttons - Overlay on images */}
          <View style={[styles.heroHeader, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color={Colors.textPrimary} weight="bold" />
            </TouchableOpacity>
            <View style={styles.heroHeaderRight}>
              <TouchableOpacity
                style={styles.heroButton}
                onPress={() => setIsFavorite(!isFavorite)}
              >
                <Heart 
                  size={20} 
                  color="#FFFFFF" 
                  weight={isFavorite ? 'fill' : 'regular'} 
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.heroButton}
                onPress={() => {
                  // Share functionality
                  console.log('Share product');
                }}
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
              onPress={() => router.push(`/vendor/${vendor.id}`)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: vendor.logo_url }}
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

          {/* Tabs for Sections */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'description' && styles.tabActive]}
              onPress={() => setActiveTab('description')}
            >
              <Text style={[styles.tabText, activeTab === 'description' && styles.tabTextActive]}>
                Description
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'nutrition' && styles.tabActive]}
              onPress={() => setActiveTab('nutrition')}
            >
              <Text style={[styles.tabText, activeTab === 'nutrition' && styles.tabTextActive]}>
                Nutrition
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'heritage' && styles.tabActive]}
              onPress={() => setActiveTab('heritage')}
            >
              <Text style={[styles.tabText, activeTab === 'heritage' && styles.tabTextActive]}>
                Heritage Story
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === 'description' && (
              <View style={styles.sectionContent}>
                <Text style={styles.sectionText}>
                  {product.description || 'Premium quality product sourced from the finest ingredients. Perfect for traditional African dishes and modern fusion cuisine.'}
                </Text>
              </View>
            )}

            {activeTab === 'nutrition' && (
              <View style={styles.sectionContent}>
                <View style={styles.nutritionGrid}>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>Calories</Text>
                    <Text style={styles.nutritionValue}>{product.nutrition?.calories || '350 kcal / 100g'}</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>Protein</Text>
                    <Text style={styles.nutritionValue}>{product.nutrition?.protein || '8.5g'}</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>Carbs</Text>
                    <Text style={styles.nutritionValue}>{product.nutrition?.carbs || '78g'}</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>Fat</Text>
                    <Text style={styles.nutritionValue}>{product.nutrition?.fat || '0.5g'}</Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'heritage' && (
              <View style={styles.sectionContent}>
                <Text style={styles.sectionText}>
                  {product.heritage_story || 'Sourced directly from family-owned farms that have practiced sustainable cultivation for generations. Every product tells a story of tradition and respect for the land.'}
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
                  <Star size={16} color="#FFCC00" weight="fill" />
                  <Text style={styles.reviewsRatingText}>
                    {product.rating || 4.5} ({product.review_count || reviews.length} reviews)
                  </Text>
                </View>
              </View>
              <Link 
                href={`/write-review?productId=${id}&productName=${encodeURIComponent(product.name)}`}
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
                      <Image
                        source={{ uri: review.user_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User' }}
                        style={styles.reviewAvatar}
                      />
                      <View style={styles.reviewMeta}>
                        <Text style={styles.reviewerName}>{review.user_name}</Text>
                        <View style={styles.reviewStars}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              color={star <= review.rating ? '#FFCC00' : '#3D3D3D'}
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
                    onPress={() => router.push(`/product/${id}/reviews`)}
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
                  href={`/write-review?productId=${id}&productName=${encodeURIComponent(product.name)}`}
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -48,
    paddingHorizontal: Spacing.lg,
    paddingTop: 32,
    minHeight: 500,
    paddingBottom: Spacing.xl,
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
    backgroundColor: Colors.success10,
    borderColor: Colors.success20,
  },
  badgeTopRated: {
    backgroundColor: Colors.secondary10,
    borderColor: Colors.secondary20,
  },
  badgeEco: {
    backgroundColor: Colors.info10,
    borderColor: Colors.info20,
  },
  badgeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    textTransform: 'uppercase',
    letterSpacing: LetterSpacing.wide,
  },
  badgeTextOrganic: {
    color: '#86EFAC',
  },
  badgeTextTopRated: {
    color: '#FDE047',
  },
  badgeTextEco: {
    color: '#5EEAD4',
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
    backgroundColor: Colors.white05,
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
    backgroundColor: Colors.white03,
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
    backgroundColor: Colors.success10,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  verifiedText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: '#10B981',
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
