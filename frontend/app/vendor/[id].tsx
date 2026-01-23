import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Button, ProductCard } from '../../components/ui';
import { vendorService } from '../../services/dataService';
import { Vendor, Product } from '../../types';
import { useCartStore } from '../../stores/cartStore';

const { width } = Dimensions.get('window');

const TABS = ['Products', 'Reviews', 'About'];

export default function VendorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Products');
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (id) {
      fetchVendorData();
    }
  }, [id]);

  const fetchVendorData = async () => {
    try {
      const [vendorData, productsData] = await Promise.all([
        vendorService.getById(id!),
        vendorService.getProducts(id!),
      ]);
      setVendor(vendorData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
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

  if (!vendor) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Vendor not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: vendor.cover_image }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          {/* Overlay Navigation */}
          <SafeAreaView style={styles.overlayNav}>
            <TouchableOpacity style={styles.navButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.navRight}>
              <TouchableOpacity style={styles.navButton}>
                <MaterialCommunityIcons name="magnify" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButton} onPress={() => router.push('/(tabs)/cart')}>
                <MaterialCommunityIcons name="cart-outline" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Vendor Profile */}
        <View style={styles.profileSection}>
          <Image source={{ uri: vendor.logo_url }} style={styles.vendorLogo} />
          <View style={styles.vendorInfo}>
            <View style={styles.vendorNameRow}>
              <Text style={styles.vendorName}>{vendor.name}</Text>
              {vendor.is_verified && (
                <MaterialCommunityIcons name="check-decagram" size={20} color="#3B82F6" />
              )}
            </View>
            <Text style={styles.vendorMeta}>Verified Vendor</Text>
            <View style={styles.ratingRow}>
              <MaterialCommunityIcons name="star" size={16} color={Colors.rating} />
              <Text style={styles.ratingText}>{vendor.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({vendor.review_count.toLocaleString()})</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button title="Follow" fullWidth style={styles.followButton} />
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="message-outline" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="share-variant-outline" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'Products' && (
          <View style={styles.productsGrid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => handleProductPress(product)}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </View>
        )}

        {activeTab === 'Reviews' && (
          <View style={styles.reviewsContainer}>
            <Text style={styles.comingSoonText}>Reviews coming soon...</Text>
          </View>
        )}

        {activeTab === 'About' && (
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutText}>{vendor.description}</Text>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="tag" size={20} color={Colors.textMuted} />
              <Text style={styles.infoText}>{vendor.category}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="earth" size={20} color={Colors.textMuted} />
              <Text style={styles.infoText}>{vendor.regions.join(', ')}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="truck-delivery-outline" size={20} color={Colors.textMuted} />
              <Text style={styles.infoText}>Delivery: {vendor.delivery_time}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="currency-gbp" size={20} color={Colors.textMuted} />
              <Text style={styles.infoText}>Min. Order: £{vendor.min_order.toFixed(2)}</Text>
            </View>
          </View>
        )}

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
  errorText: {
    color: Colors.textMuted,
    fontSize: FontSize.body,
  },
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    position: 'relative',
  },
  coverImage: {
    width: width,
    height: 200,
    backgroundColor: Colors.cardDark,
  },
  overlayNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navRight: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.base,
    marginTop: -40,
  },
  vendorLogo: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    borderWidth: 3,
    borderColor: Colors.primary,
    backgroundColor: Colors.cardDark,
  },
  vendorInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    paddingTop: 44,
  },
  vendorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  vendorName: {
    color: Colors.textPrimary,
    fontSize: FontSize.h3,
    fontWeight: FontWeight.bold,
  },
  vendorMeta: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  ratingText: {
    color: Colors.rating,
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
    marginLeft: 4,
  },
  reviewCount: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  followButton: {
    flex: 1,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  tab: {
    paddingVertical: Spacing.md,
    marginRight: Spacing.xl,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  reviewsContainer: {
    padding: Spacing.base,
    alignItems: 'center',
  },
  comingSoonText: {
    color: Colors.textMuted,
    fontSize: FontSize.body,
    marginTop: Spacing.xl,
  },
  aboutContainer: {
    padding: Spacing.base,
  },
  aboutText: {
    color: Colors.textMuted,
    fontSize: FontSize.body,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoText: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
  },
});
