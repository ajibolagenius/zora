import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  ShareNetwork,
  ChatCircle,
  Star,
  Clock,
  Truck,
  ShieldCheck,
  Plus,
  MapPin,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { ProductCard } from '../../components/ui';
import { vendorService } from '../../services/dataService';
import { Vendor, Product } from '../../types';
import { useCartStore } from '../../stores/cartStore';

type TabType = 'products' | 'reviews' | 'about';

export default function VendorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width: screenWidth } = useWindowDimensions();
  const productCardWidth = (screenWidth - 32 - 8) / 2;
  const addToCart = useCartStore((state) => state.addItem);

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const [vendorData, productsData] = await Promise.all([
        vendorService.getById(id),
        vendorService.getProducts(id),
      ]);
      setVendor(vendorData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching vendor:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  if (loading || !vendor) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: vendor.cover_image }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.coverOverlay} />
          
          {/* Navigation Header */}
          <SafeAreaView style={styles.headerOverlay} edges={['top']}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <ShareNetwork size={22} color={Colors.textPrimary} weight="duotone" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Heart size={22} color={Colors.textPrimary} weight="duotone" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Vendor Info Card */}
        <View style={styles.vendorInfoCard}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: vendor.avatar }}
              style={styles.avatar}
              resizeMode="cover"
            />
            {vendor.is_verified && (
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={16} color={Colors.textPrimary} weight="fill" />
              </View>
            )}
          </View>

          {/* Vendor Details */}
          <View style={styles.vendorDetails}>
            <View style={styles.vendorNameRow}>
              <Text style={styles.vendorName}>{vendor.name}</Text>
              {vendor.is_verified && (
                <View style={styles.verifiedLabel}>
                  <Text style={styles.verifiedLabelText}>Verified Vendor</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.vendorCategory}>{vendor.category}</Text>
            
            {/* Rating & Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Star size={16} color={Colors.rating} weight="fill" />
                <Text style={styles.statText}>{vendor.rating}</Text>
                <Text style={styles.statLabel}>({vendor.review_count} reviews)</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Clock size={16} color={Colors.textMuted} weight="duotone" />
                <Text style={styles.statText}>{vendor.delivery_time}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Truck size={16} color={Colors.textMuted} weight="duotone" />
                <Text style={styles.statText}>
                  {vendor.delivery_fee === 0 ? 'Free' : `£${vendor.delivery_fee}`}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.followButton, isFollowing && styles.followButtonActive]}
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <Text style={styles.followButtonText}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatButton}>
              <ChatCircle size={22} color={Colors.textPrimary} weight="duotone" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(['products', 'reviews', 'about'] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'products' && (
            <View style={styles.productsGrid}>
              {products.map((product, index) => (
                <View
                  key={product.id}
                  style={{
                    width: productCardWidth,
                    marginRight: index % 2 === 0 ? 8 : 0,
                    marginBottom: 8,
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
          )}

          {activeTab === 'reviews' && (
            <View style={styles.reviewsContainer}>
              <View style={styles.reviewSummary}>
                <Text style={styles.reviewScore}>{vendor.rating}</Text>
                <View style={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      color={star <= Math.floor(vendor.rating) ? Colors.rating : Colors.textMuted}
                      weight={star <= Math.floor(vendor.rating) ? 'fill' : 'regular'}
                    />
                  ))}
                </View>
                <Text style={styles.reviewCount}>{vendor.review_count} reviews</Text>
              </View>
              
              {/* Sample Reviews */}
              {[1, 2, 3].map((i) => (
                <View key={i} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerAvatar}>
                      <Text style={styles.reviewerInitial}>J</Text>
                    </View>
                    <View style={styles.reviewerInfo}>
                      <Text style={styles.reviewerName}>John D.</Text>
                      <View style={styles.reviewRating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={12} color={Colors.rating} weight="fill" />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewDate}>2 days ago</Text>
                  </View>
                  <Text style={styles.reviewText}>
                    Amazing products! Authentic African ingredients that remind me of home. Fast delivery too!
                  </Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'about' && (
            <View style={styles.aboutContainer}>
              <Text style={styles.aboutDescription}>{vendor.description}</Text>
              
              <View style={styles.aboutSection}>
                <Text style={styles.aboutSectionTitle}>Location</Text>
                <View style={styles.locationRow}>
                  <MapPin size={18} color={Colors.primary} weight="duotone" />
                  <Text style={styles.locationText}>{vendor.distance} away • London, UK</Text>
                </View>
              </View>

              <View style={styles.aboutSection}>
                <Text style={styles.aboutSectionTitle}>Regions</Text>
                <View style={styles.regionsRow}>
                  {vendor.regions.map((region) => (
                    <View key={region} style={styles.regionBadge}>
                      <Text style={styles.regionText}>{region.replace('-', ' ')}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.aboutSection}>
                <Text style={styles.aboutSectionTitle}>Delivery Info</Text>
                <View style={styles.deliveryInfo}>
                  <View style={styles.deliveryItem}>
                    <Clock size={18} color={Colors.textMuted} weight="duotone" />
                    <Text style={styles.deliveryText}>{vendor.delivery_time}</Text>
                  </View>
                  <View style={styles.deliveryItem}>
                    <Truck size={18} color={Colors.textMuted} weight="duotone" />
                    <Text style={styles.deliveryText}>
                      {vendor.delivery_fee === 0 ? 'Free Delivery' : `£${vendor.delivery_fee} delivery fee`}
                    </Text>
                  </View>
                  <View style={styles.deliveryItem}>
                    <ShieldCheck size={18} color={Colors.success} weight="duotone" />
                    <Text style={styles.deliveryText}>Min order: £{vendor.min_order}</Text>
                  </View>
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
  coverContainer: {
    height: 200,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  vendorInfoCard: {
    backgroundColor: Colors.cardDark,
    marginHorizontal: Spacing.base,
    marginTop: -50,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -60,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: Colors.cardDark,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.cardDark,
  },
  vendorDetails: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  vendorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  vendorName: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  verifiedLabel: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  verifiedLabelText: {
    color: Colors.success,
    fontSize: FontSize.tiny,
    fontWeight: FontWeight.semiBold,
  },
  vendorCategory: {
    fontSize: FontSize.body,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semiBold,
  },
  statLabel: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.borderDark,
    marginHorizontal: Spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  followButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  followButtonActive: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  followButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
  },
  chatButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.base,
    marginTop: Spacing.lg,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
  },
  tabTextActive: {
    color: Colors.textPrimary,
  },
  tabContent: {
    padding: Spacing.base,
    paddingTop: Spacing.lg,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reviewsContainer: {},
  reviewSummary: {
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
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
  reviewCount: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
  },
  reviewItem: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
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
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
  },
  reviewerInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  reviewerName: {
    color: Colors.textPrimary,
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  reviewDate: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
  },
  reviewText: {
    color: Colors.textSecondary,
    fontSize: FontSize.small,
    lineHeight: 22,
  },
  aboutContainer: {},
  aboutDescription: {
    color: Colors.textSecondary,
    fontSize: FontSize.body,
    lineHeight: 26,
    marginBottom: Spacing.xl,
  },
  aboutSection: {
    marginBottom: Spacing.xl,
  },
  aboutSectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  locationText: {
    color: Colors.textSecondary,
    fontSize: FontSize.body,
  },
  regionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  regionBadge: {
    backgroundColor: 'rgba(204, 0, 0, 0.1)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  regionText: {
    color: Colors.primary,
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
    textTransform: 'capitalize',
  },
  deliveryInfo: {
    gap: Spacing.md,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  deliveryText: {
    color: Colors.textSecondary,
    fontSize: FontSize.body,
  },
});
