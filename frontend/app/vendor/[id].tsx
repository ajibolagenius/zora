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
  ImageBackground,
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
      // Get vendor data from mock database
      const vendorData = vendorService.getById(id);
      if (vendorData) {
        setVendor(vendorData);
        // Get products for this vendor
        const vendorProducts = productService.getByVendor(vendorData.id);
        setProducts(vendorProducts);
      } else {
        // Fallback to first vendor if not found
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
      {/* Fixed Top App Bar */}
      <View style={[styles.topAppBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.appBarButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" weight="bold" />
        </TouchableOpacity>
        <View style={styles.appBarActions}>
          <TouchableOpacity style={styles.appBarButton}>
            <MagnifyingGlass size={22} color="#FFFFFF" weight="bold" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.appBarButton}
            onPress={() => router.push('/(tabs)/cart')}
          >
            <ShoppingBag size={22} color="#FFFFFF" weight="bold" />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 56 }}
      >
        {/* Header Image (Shop Front) */}
        <View style={styles.headerImageContainer}>
          <Image
            source={{ uri: vendor.cover_image_url }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <View style={styles.headerOverlay} />
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
                  <SealCheck size={14} color="#FFFFFF" weight="fill" />
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
                <ChatCircle size={20} color="#FFFFFF" weight="regular" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
                <ShareNetwork size={20} color="#FFFFFF" weight="regular" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Vendor Info */}
          <View style={styles.vendorInfo}>
            <Text style={styles.vendorName}>{vendor.shop_name}</Text>
            
            {/* Location */}
            <View style={styles.infoRow}>
              <MapPin size={14} color="#9CA3AF" weight="fill" />
              <Text style={styles.locationText}>
                {vendor.address.split(',').slice(0, 2).join(',')} • Verified Vendor
              </Text>
            </View>

            {/* Rating */}
            <View style={styles.infoRow}>
              <Star size={16} color="#FFCC00" weight="fill" />
              <Text style={styles.ratingValue}>{vendor.rating}</Text>
              <Text style={styles.ratingCount}>({vendor.review_count.toLocaleString()} reviews)</Text>
            </View>

            {/* Description */}
            <Text style={styles.description} numberOfLines={2}>
              {vendor.description}
            </Text>
          </View>
        </View>

        {/* Sticky Tabs */}
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
            {/* Featured Products Header */}
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
                      <Heart size={16} color="#FFFFFF" weight="regular" />
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
                        <Plus size={16} color="#FFFFFF" weight="bold" />
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
                    color={star <= Math.floor(vendor.rating) ? '#FFCC00' : '#4B4B4B'}
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
                      <Star key={star} size={12} color="#FFCC00" weight="fill" />
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
    backgroundColor: '#1A1A1A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  // Top App Bar
  topAppBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
  },
  appBarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBarActions: {
    flexDirection: 'row',
    gap: 8,
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
  // Header Image
  headerImageContainer: {
    width: '100%',
    height: 200,
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
  // Profile Section
  profileSection: {
    paddingHorizontal: 16,
    marginTop: -56,
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
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: '#1A1A1A',
    backgroundColor: '#2D2D2D',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  followButton: {
    height: 36,
    paddingHorizontal: 20,
    borderRadius: 18,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2D2D2D',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vendorInfo: {
    marginTop: 16,
  },
  vendorName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ratingCount: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  description: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    marginTop: 12,
  },
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
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
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  // Product Grid
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
  // Product Card
  productCard: {
    backgroundColor: '#2D2D2D',
    borderRadius: 12,
    overflow: 'hidden',
  },
  productImageContainer: {
    aspectRatio: 1,
    width: '100%',
    position: 'relative',
    backgroundColor: '#3D3D3D',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  productBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 18,
  },
  productWeight: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Tab Content
  tabContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  // Review Summary
  reviewSummary: {
    alignItems: 'center',
    backgroundColor: '#2D2D2D',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  reviewScore: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 4,
    marginVertical: 8,
  },
  reviewCountText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  // Review Card
  reviewCard: {
    backgroundColor: '#2D2D2D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewerInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  reviewerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  reviewStarsSmall: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  reviewText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 22,
  },
  // About Section
  aboutSection: {
    marginBottom: 24,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 22,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyBadge: {
    backgroundColor: '#2D2D2D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specialtyText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
