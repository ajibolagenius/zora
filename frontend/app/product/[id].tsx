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
import { Button } from '../../components/ui';
import { productService } from '../../services/dataService';
import { Product } from '../../types';
import { useCartStore } from '../../stores/cartStore';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productService.getById(id!);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      router.back();
    }
  };

  const handleVendorPress = () => {
    if (product?.vendor_id) {
      router.push(`/vendor/${product.vendor_id}`);
    }
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

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getBadgeStyle = (cert: string) => {
    switch (cert.toUpperCase()) {
      case 'ORGANIC':
        return { bg: '#22C55E20', color: Colors.success, icon: 'leaf' };
      case 'TOP RATED':
        return { bg: '#FFCC0020', color: Colors.secondary, icon: 'star' };
      case 'ECO-FRIENDLY':
        return { bg: '#14B8A620', color: '#14B8A6', icon: 'recycle' };
      default:
        return { bg: '#CC000020', color: Colors.primary, icon: 'tag' };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image_url }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Overlay Navigation */}
          <SafeAreaView style={styles.overlayNav}>
            <TouchableOpacity style={styles.navButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <MaterialCommunityIcons name="heart-outline" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Price */}
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>£{product.price.toFixed(2)}</Text>
            {product.weight && (
              <Text style={styles.unitPrice}>
                £{(product.price / parseFloat(product.weight)).toFixed(2)}/{product.unit || 'kg'}
              </Text>
            )}
          </View>

          {/* Certifications */}
          {product.certifications && product.certifications.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.certificationsContainer}
            >
              {product.certifications.map((cert, index) => {
                const style = getBadgeStyle(cert);
                return (
                  <View key={index} style={[styles.certBadge, { backgroundColor: style.bg }]}>
                    <MaterialCommunityIcons name={style.icon as any} size={14} color={style.color} />
                    <Text style={[styles.certText, { color: style.color }]}>{cert}</Text>
                  </View>
                );
              })}
            </ScrollView>
          )}

          {/* Vendor Card */}
          {product.vendor && (
            <TouchableOpacity style={styles.vendorCard} onPress={handleVendorPress}>
              <Image
                source={{ uri: product.vendor.logo_url }}
                style={styles.vendorLogo}
              />
              <View style={styles.vendorInfo}>
                <Text style={styles.soldBy}>SOLD BY</Text>
                <View style={styles.vendorNameRow}>
                  <Text style={styles.vendorName}>{product.vendor.name}</Text>
                  {product.vendor.is_verified && (
                    <MaterialCommunityIcons name="check-decagram" size={16} color="#3B82F6" />
                  )}
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textMuted} />
            </TouchableOpacity>
          )}

          {/* Tabs */}
          <View style={styles.tabs}>
            {['description', 'nutrition', 'heritage'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab === 'description' ? 'Product Description' :
                   tab === 'nutrition' ? 'Nutrition' : 'Heritage Story'}
                </Text>
                <MaterialCommunityIcons
                  name={activeTab === tab ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={activeTab === tab ? Colors.textPrimary : Colors.textMuted}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'description' && (
            <View style={styles.tabContent}>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>
          )}

          {/* Delivery Info */}
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryCard}>
              <MaterialCommunityIcons name="truck-delivery" size={24} color={Colors.primary} />
              <Text style={styles.deliveryTitle}>2-3 Day Delivery</Text>
              <Text style={styles.deliverySubtitle}>Tracked shipping</Text>
            </View>
            <View style={styles.deliveryCard}>
              <MaterialCommunityIcons name="shield-check" size={24} color={Colors.primary} />
              <Text style={styles.deliveryTitle}>Quality Guaranteed</Text>
              <Text style={styles.deliverySubtitle}>Premium grade</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 150 }} />
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <MaterialCommunityIcons name="minus" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(quantity + 1)}
          >
            <MaterialCommunityIcons name="plus" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <Button
          title="ADD TO BASKET"
          onPress={handleAddToCart}
          style={styles.addButton}
        />
      </View>
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
  imageContainer: {
    position: 'relative',
  },
  heroImage: {
    width: width,
    height: width * 0.8,
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
  content: {
    padding: Spacing.base,
  },
  productName: {
    color: Colors.textPrimary,
    fontSize: FontSize.h3,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  price: {
    color: Colors.secondary,
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
  },
  unitPrice: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
  },
  certificationsContainer: {
    marginBottom: Spacing.md,
  },
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    gap: Spacing.xs,
  },
  certText: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semiBold,
  },
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  vendorLogo: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundDark,
  },
  vendorInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  soldBy: {
    color: Colors.primary,
    fontSize: FontSize.tiny,
    fontWeight: FontWeight.bold,
  },
  vendorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  vendorName: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
  },
  tabs: {
    marginBottom: Spacing.md,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
  },
  tabTextActive: {
    color: Colors.textPrimary,
  },
  tabContent: {
    marginBottom: Spacing.md,
  },
  descriptionText: {
    color: Colors.textMuted,
    fontSize: FontSize.body,
    lineHeight: 24,
  },
  deliveryInfo: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  deliveryCard: {
    flex: 1,
    backgroundColor: Colors.cardDark,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  deliveryTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
    marginTop: Spacing.sm,
  },
  deliverySubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
    gap: Spacing.md,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.md,
  },
  quantityButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
    minWidth: 30,
    textAlign: 'center',
  },
  addButton: {
    flex: 1,
  },
});
