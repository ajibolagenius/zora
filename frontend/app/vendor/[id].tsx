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
    badge: 'HOT',
  },
  {
    id: 'prod-2',
    name: 'Suya Spice Mix',
    weight: '250g Jar',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1599909533706-07f97c6e4e43?w=400',
    badge: null,
  },
  {
    id: 'prod-3',
    name: 'Berbere Blend',
    weight: '150g Pack',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400',
    badge: null,
  },
  {
    id: 'prod-4',
    name: 'Egusi Seeds',
    weight: '500g Bulk',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400',
    badge: 'HOT',
  },
  {
    id: 'prod-5',
    name: 'Dried Peppers',
    weight: '100g Bag',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400',
    badge: null,
  },
  {
    id: 'prod-6',
    name: 'Turmeric Powder',
    weight: '200g Jar',
    price: 7.25,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400',
    badge: null,
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
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        {/* Header Image Section */}
        <View style={styles.headerImageSection}>
          <Image
            source={{ uri: vendorData.cover_image }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          {/* Gradient Overlay */}
          <View style={styles.gradientOverlay} />
          
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
                <MagnifyingGlass size={24} color="#FFFFFF" weight="bold" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.appBarButton}>
                <ShoppingCart size={24} color="#FFFFFF" weight="bold" />
                {cartItemCount > 0 && (
                  <View style={styles.cartBadge} />
                )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Profile Info Section - Will be sticky */}
        <View style={styles.profileSection}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: vendorData.avatar }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>

          {/* Vendor Details */}
          <View style={styles.vendorDetails}>
            <View style={styles.vendorNameRow}>
              <Text style={styles.vendorName}>{vendorData.name}</Text>
              {vendorData.is_verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedCheckmark}>✓</Text>
                </View>
              )}
            </View>
            
            <View style={styles.vendorMeta}>
              <Text style={styles.verifiedText}>Verified Vendor</Text>
              <View style={styles.metaDot} />
              <View style={styles.ratingRow}>
                <Star size={14} color="#FFCC00" weight="fill" />
                <Text style={styles.ratingValue}>{vendorData.rating}</Text>
                <Text style={styles.ratingCount}>
                  ({vendorData.review_count >= 1000 
                    ? `${(vendorData.review_count / 1000).toFixed(1)}k` 
                    : vendorData.review_count})
                </Text>
              </View>
            </View>
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
                <View style={[
                  styles.tabIndicator,
                  activeTab === tab && styles.tabIndicatorActive,
                ]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Product Grid */}
        {activeTab === 'products' && (
          <View style={styles.productGridContainer}>
            <View style={styles.productGrid}>
              {products.map((product, index) => (
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
                    
                    {/* HOT Badge */}
                    {product.badge && (
                      <View style={styles.hotBadge}>
                        <Text style={styles.hotBadgeText}>{product.badge}</Text>
                      </View>
                    )}
                    
                    {/* Favorite Button */}
                    <TouchableOpacity style={styles.favoriteButton}>
                      <Heart size={16} color="#FFFFFF" weight="regular" />
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
                        ${product.price.toFixed(2)}
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
          </View>
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
                    size={20}
                    color={star <= Math.floor(vendorData.rating) ? '#FFCC00' : '#4B4B4B'}
                    weight="fill"
                  />
                ))}
              </View>
              <Text style={styles.reviewCount}>
                {vendorData.review_count >= 1000 
                  ? `${(vendorData.review_count / 1000).toFixed(1)}k reviews` 
                  : `${vendorData.review_count} reviews`}
              </Text>
            </View>
          </View>
        )}

        {/* About Tab Content */}
        {activeTab === 'about' && (
          <View style={styles.tabContent}>
            <Text style={styles.aboutText}>
              Welcome to {vendorData.name}! We bring you the finest authentic African spices 
              sourced directly from local farmers across West Africa. Our mission is to share 
              the rich flavors of African cuisine with the world while supporting local communities.
            </Text>
          </View>
        )}

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
  // Header Image Section
  headerImageSection: {
    height: 200,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    // Simulating gradient with multiple layers
  },
  topAppBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  appBarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBarActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: '#221710',
  },
  // Profile Section
  profileSection: {
    backgroundColor: '#221710',
    paddingHorizontal: 16,
    marginTop: -56,
    paddingTop: 0,
  },
  avatarContainer: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: Colors.primary,
    overflow: 'hidden',
    backgroundColor: '#342418',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  vendorDetails: {
    marginTop: 12,
  },
  vendorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vendorName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedCheckmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  vendorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9CA3AF',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFCC00',
  },
  ratingCount: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  followButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#342418',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 12,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: Colors.primary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'transparent',
    borderRadius: 1,
  },
  tabIndicatorActive: {
    backgroundColor: Colors.primary,
  },
  // Product Grid
  productGridContainer: {
    padding: 16,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  // Product Card
  productCard: {
    backgroundColor: '#342418',
    borderRadius: 12,
    padding: 12,
    overflow: 'hidden',
  },
  productImageContainer: {
    aspectRatio: 1,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#221710',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  hotBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hotBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    marginTop: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  productWeight: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFCC00',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  // Tab Content
  tabContent: {
    padding: 16,
  },
  reviewSummary: {
    alignItems: 'center',
    backgroundColor: '#342418',
    borderRadius: 12,
    padding: 24,
  },
  reviewScore: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 4,
    marginVertical: 12,
  },
  reviewCount: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  aboutText: {
    fontSize: 16,
    color: '#D1D5DB',
    lineHeight: 26,
  },
});
