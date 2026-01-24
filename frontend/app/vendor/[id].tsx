import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  MagnifyingGlass,
  ShoppingBag,
  ChatCircle,
  ShareNetwork,
  Star,
  Heart,
  Plus,
  MapPin,
  SealCheck,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, TouchTarget, Heights } from '../../constants/spacing';
import { FontSize, FontWeight, FontFamily, LetterSpacing } from '../../constants/typography';
import { vendorService, productService, type Vendor, type Product } from '../../services/mockDataService';
import { useCartStore } from '../../stores/cartStore';

type TabType = 'products' | 'reviews' | 'about';

export default function VendorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width: screenWidth } = useWindowDimensions();
  const productCardWidth = (screenWidth - 48) / 2;
  const addToCart = useCartStore((state) => state.addItem);
  const cartItemCount = useCartStore((state) => state.getItemCount());

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchData = useCallback(() => {
    if (!id) return;
    try {
      const vendorData = vendorService.getById(id);
      if (vendorData) {
        setVendor(vendorData);
        const vendorProducts = productService.getByVendor(vendorData.id);
        setProducts(vendorProducts);
      } else {
        const allVendors = vendorService.getAll();
        if (allVendors.length > 0) {
          setVendor(allVendors[0]);
          setProducts(productService.getByVendor(allVendors[0].id));
        }
      }
    } catch (error) {
      console.error('Error fetching vendor:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_urls[0],
      vendor_id: product.vendor_id,
      category: product.category,
      rating: product.rating,
      review_count: product.review_count,
      in_stock: product.stock_quantity > 0,
    } as any, 1);
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

  if (!vendor) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Vendor not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Image (Shop Front) */}
        <View style={styles.headerImageContainer}>
          <Image
            source={{ uri: vendor.cover_image_url }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <View style={styles.headerOverlay} />
          
          {/* Transparent Header - Same style as Explore/Product pages */}
          <SafeAreaView style={styles.header} edges={['top']}>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <MagnifyingGlass size={22} color={Colors.textPrimary} weight="bold" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push('/(tabs)/cart')}
              >
                <ShoppingBag size={22} color={Colors.textPrimary} weight="bold" />
                {cartItemCount > 0 && <View style={styles.cartBadge} />}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Profile Header Section */}
        <View style={styles.profileSection}>
          {/* Avatar Row with Action Buttons */}
          <View style={styles.avatarRow}>
            {/* Avatar with Verified Badge */}
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: vendor.logo_url }}
                style={styles.avatar}
                resizeMode="cover"
              />
              {vendor.is_verified && (
                <View style={styles.verifiedBadge}>
                  <SealCheck size={14} color={Colors.textPrimary} weight="fill" />
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.followButton, isFollowing && styles.followButtonActive]}
                onPress={() => setIsFollowing(!isFollowing)}
                activeOpacity={0.8}
              >
                <Text style={styles.followButtonText}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
                <ChatCircle size={20} color={Colors.textPrimary} weight="regular" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
                <ShareNetwork size={20} color={Colors.textPrimary} weight="regular" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Vendor Info */}
          <View style={styles.vendorInfo}>
            <Text style={styles.vendorName}>{vendor.shop_name}</Text>
            
            {/* Location */}
            <View style={styles.infoRow}>
              <MapPin size={14} color={Colors.textMuted} weight="fill" />
              <Text style={styles.locationText}>
                {vendor.address.split(',').slice(0, 2).join(',')} • Verified Vendor
              </Text>
            </View>

            {/* Rating */}
            <View style={styles.infoRow}>
              <Star size={16} color={Colors.secondary} weight="fill" />
              <Text style={styles.ratingValue}>{vendor.rating}</Text>
              <Text style={styles.ratingCount}>({vendor.review_count.toLocaleString()} reviews)</Text>
            </View>

            {/* Description */}
            <Text style={styles.description} numberOfLines={2}>
              {vendor.description}
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(['products', 'reviews', 'about'] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Products Tab Content */}
        {activeTab === 'products' && (
          <>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Products</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            {/* Product Grid */}
            <View style={styles.productGrid}>
              {products.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={[styles.productCard, { width: productCardWidth }]}
                  onPress={() => handleProductPress(product.id)}
                  activeOpacity={0.95}
                >
                  {/* Product Image */}
                  <View style={styles.productImageContainer}>
                    <Image
                      source={{ uri: product.image_urls[0] }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    
                    {/* Badge */}
                    {product.badge && (
                      <View style={styles.productBadge}>
                        <Text style={styles.productBadgeText}>{product.badge}</Text>
                      </View>
                    )}
                    
                    {/* Favorite Button */}
                    <TouchableOpacity style={styles.favoriteButton}>
                      <Heart size={16} color={Colors.textPrimary} weight="regular" />
                    </TouchableOpacity>
                  </View>

                  {/* Product Info */}
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <Text style={styles.productWeight}>{product.weight}</Text>
                    <View style={styles.productFooter}>
                      <Text style={styles.productPrice}>
                        £{product.price.toFixed(2)}
                      </Text>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddToCart(product)}
                      >
                        <Plus size={16} color={Colors.textPrimary} weight="bold" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Reviews Tab Content */}
        {activeTab === 'reviews' && (
          <View style={styles.tabContent}>
            <View style={styles.reviewSummary}>
              <Text style={styles.reviewScore}>{vendor.rating}</Text>
              <View style={styles.reviewStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    color={star <= Math.floor(vendor.rating) ? Colors.secondary : Colors.cardDark}
                    weight="fill"
                  />
                ))}
              </View>
              <Text style={styles.reviewCountText}>
                Based on {vendor.review_count.toLocaleString()} reviews
              </Text>
            </View>

            {/* Sample Review */}
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerAvatar}>
                  <Text style={styles.reviewerInitial}>A</Text>
                </View>
                <View style={styles.reviewerInfo}>
                  <Text style={styles.reviewerName}>Amara O.</Text>
                  <View style={styles.reviewStarsSmall}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={12} color={Colors.secondary} weight="fill" />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewDate}>1 week ago</Text>
              </View>
              <Text style={styles.reviewText}>
                Amazing quality spices! The jollof seasoning is absolutely perfect. 
                Fast delivery and great packaging. Will definitely order again!
              </Text>
            </View>
          </View>
        )}

        {/* About Tab Content */}
        {activeTab === 'about' && (
          <View style={styles.tabContent}>
            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>About Us</Text>
              <Text style={styles.aboutText}>{vendor.description}</Text>
            </View>

            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>Specialties</Text>
              <View style={styles.specialtiesList}>
                {vendor.cultural_specialties.map((specialty, index) => (
                  <View key={index} style={styles.specialtyBadge}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>Delivery Info</Text>
              <Text style={styles.aboutText}>
                Delivery Time: {vendor.delivery_time_min}-{vendor.delivery_time_max} mins
              </Text>
              <Text style={styles.aboutText}>
                Delivery Fee: {vendor.delivery_fee === 0 ? 'Free' : `£${vendor.delivery_fee.toFixed(2)}`}
              </Text>
              <Text style={styles.aboutText}>
                Minimum Order: £{vendor.minimum_order.toFixed(2)}
              </Text>
            </View>

            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>Location</Text>
              <View style={styles.contactRow}>
                <MapPin size={16} color={Colors.primary} weight="fill" />
                <Text style={styles.aboutText}>{vendor.address}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Bottom padding for tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>
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
  
  // Header Image
  headerImageContainer: {
    height: 220,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  
  // Transparent Header (matches Explore/Product pages)
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    width: TouchTarget.min,
    height: TouchTarget.min,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  
  // Profile Section
  profileSection: {
    paddingHorizontal: Spacing.base,
    marginTop: -50,
    position: 'relative',
    zIndex: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: Colors.backgroundDark,
    backgroundColor: Colors.cardDark,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.info,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.backgroundDark,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  followButton: {
    height: 36,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButtonActive: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  followButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vendorInfo: {
    marginTop: Spacing.base,
  },
  vendorName: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  locationText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  ratingValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
    color: Colors.textPrimary,
  },
  ratingCount: {
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  description: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: Spacing.md,
  },
  
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
    marginTop: Spacing.base,
    paddingHorizontal: Spacing.base,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    position: 'relative',
  },
  tabText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.base,
  },
  sectionTitle: {
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  
  // Product Grid
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.base,
    gap: Spacing.base,
  },
  productCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  productImageContainer: {
    aspectRatio: 1,
    width: '100%',
    position: 'relative',
    backgroundColor: Colors.backgroundDark,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.badgeHot,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  productBadgeText: {
    color: Colors.textPrimary,
    fontSize: 10,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: Spacing.md,
  },
  productName: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 18,
  },
  productWeight: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Tab Content
  tabContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
  },
  
  // Review Summary
  reviewSummary: {
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.base,
  },
  reviewScore: {
    fontSize: 48,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 4,
    marginVertical: Spacing.sm,
  },
  reviewCountText: {
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  
  // Review Card
  reviewCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewerInitial: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
  },
  reviewerInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  reviewerName: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  reviewStarsSmall: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
  reviewDate: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  reviewText: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  
  // About Section
  aboutSection: {
    marginBottom: Spacing.lg,
  },
  aboutTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  aboutText: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  specialtyBadge: {
    backgroundColor: Colors.cardDark,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  specialtyText: {
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
});
