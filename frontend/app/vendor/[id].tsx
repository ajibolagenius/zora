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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  MagnifyingGlass,
  ShoppingCart,
  ChatCircle,
  ShareNetwork,
  Star,
  Heart,
  Plus,
  MapPin,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { vendorService } from '../../services/dataService';
import { Vendor, Product } from '../../types';
import { useCartStore } from '../../stores/cartStore';

type TabType = 'products' | 'reviews' | 'about';

// Sample products for the vendor
const SAMPLE_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Jollof Seasoning',
    weight: '100g Pack',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
  },
  {
    id: 'prod-2',
    name: 'Suya Spice Mix',
    weight: '250g Jar',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1599909533706-07f97c6e4e43?w=400',
  },
  {
    id: 'prod-3',
    name: 'Berbere Blend',
    weight: '150g Pack',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400',
  },
  {
    id: 'prod-4',
    name: 'Egusi Seeds',
    weight: '500g Bulk',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400',
  },
];

export default function VendorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width: screenWidth } = useWindowDimensions();
  const productCardWidth = (screenWidth - 48) / 2; // 16px padding on each side + 16px gap
  const addToCart = useCartStore((state) => state.addItem);
  const cartItemCount = useCartStore((state) => state.getItemCount());

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const vendorData = await vendorService.getById(id);
      setVendor(vendorData);
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

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image,
      vendor_id: id || '',
      category: 'Spices',
      rating: 4.8,
      review_count: 100,
      in_stock: true,
    } as Product, 1);
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

  // Default vendor data if not found
  const vendorData = vendor || {
    name: "Mama Africa's Spices",
    rating: 4.8,
    review_count: 1200,
    is_verified: true,
    cover_image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    description: 'Authentic African spices and seasonings sourced directly from local farmers. Bringing the flavors of Africa to your kitchen.',
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Blurred Background */}
        <ImageBackground
          source={{ uri: vendorData.cover_image }}
          style={styles.headerBackground}
          blurRadius={Platform.OS === 'ios' ? 20 : 10}
        >
          <View style={styles.headerOverlay} />
          
          {/* Top App Bar */}
          <SafeAreaView style={styles.topAppBar} edges={['top']}>
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
              <TouchableOpacity style={styles.appBarButton}>
                <ShoppingCart size={22} color="#FFFFFF" weight="bold" />
                {cartItemCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Vendor Profile Card */}
          <View style={styles.profileCard}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: vendorData.avatar }}
                style={styles.avatar}
                resizeMode="cover"
              />
              {vendorData.is_verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedCheckmark}>✓</Text>
                </View>
              )}
            </View>

            {/* Vendor Info */}
            <View style={styles.vendorInfo}>
              <Text style={styles.vendorName}>{vendorData.name}</Text>
              
              {/* Location */}
              <View style={styles.locationRow}>
                <MapPin size={14} color="#9CA3AF" weight="fill" />
                <Text style={styles.locationText}>London, UK</Text>
              </View>

              {/* Rating */}
              <View style={styles.ratingRow}>
                <Star size={14} color="#FFCC00" weight="fill" />
                <Text style={styles.ratingValue}>4.8</Text>
                <Text style={styles.ratingCount}>(1.2k reviews)</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Description */}
          <Text style={styles.description}>
            {vendorData.description || 'Authentic African spices and seasonings sourced directly from local farmers. Bringing the flavors of Africa to your kitchen.'}
          </Text>

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
              <ChatCircle size={22} color="#FFFFFF" weight="regular" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
              <ShareNetwork size={22} color="#FFFFFF" weight="regular" />
            </TouchableOpacity>
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
                        source={{ uri: product.image }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                      
                      {/* Favorite Button */}
                      <TouchableOpacity style={styles.favoriteButton}>
                        <Heart size={18} color="#FFFFFF" weight="regular" />
                      </TouchableOpacity>
                    </View>

                    {/* Product Info */}
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>
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
                          <Plus size={18} color="#FFFFFF" weight="bold" />
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
                <Text style={styles.reviewScore}>{vendorData.rating}</Text>
                <View style={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      color={star <= Math.floor(vendorData.rating) ? '#FFCC00' : '#4B4B4B'}
                      weight="fill"
                    />
                  ))}
                </View>
                <Text style={styles.reviewCountText}>
                  Based on {vendorData.review_count >= 1000 
                    ? `${(vendorData.review_count / 1000).toFixed(1)}k` 
                    : vendorData.review_count} reviews
                </Text>
              </View>

              {/* Sample Review */}
              <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerAvatar}>
                    <Text style={styles.reviewerInitial}>J</Text>
                  </View>
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>John D.</Text>
                    <View style={styles.reviewStarsSmall}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={12} color="#FFCC00" weight="fill" />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewDate}>2 days ago</Text>
                </View>
                <Text style={styles.reviewText}>
                  Amazing quality spices! The jollof seasoning is absolutely perfect. 
                  Fast delivery and great packaging.
                </Text>
              </View>
            </View>
          )}

          {/* About Tab Content */}
          {activeTab === 'about' && (
            <View style={styles.tabContent}>
              <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>About Us</Text>
                <Text style={styles.aboutText}>
                  {vendorData.description || 'Authentic African spices and seasonings sourced directly from local farmers. Bringing the flavors of Africa to your kitchen.'}
                </Text>
              </View>

              <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>Business Hours</Text>
                <Text style={styles.aboutText}>Monday - Friday: 9:00 AM - 6:00 PM</Text>
                <Text style={styles.aboutText}>Saturday: 10:00 AM - 4:00 PM</Text>
                <Text style={styles.aboutText}>Sunday: Closed</Text>
              </View>

              <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>Contact</Text>
                <View style={styles.contactRow}>
                  <MapPin size={16} color={Colors.primary} weight="fill" />
                  <Text style={styles.aboutText}>123 Market Street, London, UK</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#221710',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  // Header Section
  headerBackground: {
    height: 280,
    position: 'relative',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(34, 23, 16, 0.7)',
  },
  topAppBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  appBarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBarActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#221710',
  },
  verifiedCheckmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFCC00',
  },
  ratingCount: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  // Main Content
  mainContent: {
    backgroundColor: '#221710',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  description: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 22,
    marginBottom: 20,
  },
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  followButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  followButtonActive: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  followButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#342418',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: Colors.primary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
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
    gap: 16,
  },
  // Product Card
  productCard: {
    backgroundColor: '#342418',
    borderRadius: 16,
    overflow: 'hidden',
  },
  productImageContainer: {
    aspectRatio: 1,
    width: '100%',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Tab Content
  tabContent: {
    paddingTop: 8,
  },
  // Review Summary
  reviewSummary: {
    alignItems: 'center',
    backgroundColor: '#342418',
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
    backgroundColor: '#342418',
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
    alignItems: 'center',
    gap: 8,
  },
});
