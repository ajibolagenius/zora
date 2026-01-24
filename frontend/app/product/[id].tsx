import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  ShareNetwork,
  Star,
  Leaf,
  Recycle,
  ShieldCheck,
  Truck,
  Clock,
  CaretDown,
  CaretUp,
  Plus,
  Minus,
  Basket,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { productService, vendorService, type Product, type Vendor } from '../../services/mockDataService';
import { useCartStore } from '../../stores/cartStore';

type CollapsibleSection = 'description' | 'nutrition' | 'heritage';

export default function ProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const addToCart = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedSections, setExpandedSections] = useState<CollapsibleSection[]>(['description']);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      // Use mock data service
      const productData = productService.getById(id);
      if (productData) {
        setProduct(productData);
        
        if (productData.vendor_id) {
          const vendorData = vendorService.getById(productData.vendor_id);
          setVendor(vendorData || null);
        }
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

  const toggleSection = (section: CollapsibleSection) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleAddToBasket = () => {
    if (product) {
      addToCart(product, quantity);
      router.back();
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  if (loading || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image_urls?.[0] || '' }}
            style={styles.productImage}
            resizeMode="cover"
          />
          
          {/* Navigation Header */}
          <SafeAreaView style={styles.headerOverlay} edges={['top']}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <ShareNetwork size={22} color={Colors.textPrimary} weight="duotone" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.headerButton, isFavorite && styles.headerButtonActive]}
                onPress={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  size={22}
                  color={isFavorite ? Colors.primary : Colors.textPrimary}
                  weight={isFavorite ? 'fill' : 'duotone'}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          {/* Region Tag */}
          {product.region && (
            <Text style={styles.regionTag}>{product.region.replace('-', ' ')}</Text>
          )}

          {/* Product Name */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Weight */}
          {product.weight && (
            <Text style={styles.productWeight}>{product.weight}</Text>
          )}

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>£{product.price.toFixed(2)}</Text>
            {hasDiscount && (
              <Text style={styles.originalPrice}>£{product.original_price?.toFixed(2)}</Text>
            )}
            {product.weight && (
              <Text style={styles.unitPrice}>
                (£{(product.price / (parseInt(product.weight) / 1000 || 1)).toFixed(2)}/kg)
              </Text>
            )}
          </View>

          {/* Badges */}
          <View style={styles.badgesRow}>
            {product.certifications?.includes('organic') && (
              <View style={[styles.badge, styles.badgeOrganic]}>
                <Leaf size={14} color={Colors.success} weight="fill" />
                <Text style={[styles.badgeText, { color: Colors.success }]}>Organic</Text>
              </View>
            )}
            {product.rating >= 4.5 && (
              <View style={[styles.badge, styles.badgeTopRated]}>
                <Star size={14} color={Colors.rating} weight="fill" />
                <Text style={[styles.badgeText, { color: Colors.rating }]}>Top Rated</Text>
              </View>
            )}
            {product.certifications?.includes('eco-friendly') && (
              <View style={[styles.badge, styles.badgeEco]}>
                <Recycle size={14} color="#14B8A6" weight="fill" />
                <Text style={[styles.badgeText, { color: '#14B8A6' }]}>Eco-Friendly</Text>
              </View>
            )}
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  color={star <= Math.floor(product.rating) ? Colors.rating : Colors.textMuted}
                  weight={star <= Math.floor(product.rating) ? 'fill' : 'regular'}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({product.review_count} reviews)</Text>
          </View>
        </View>

        {/* Vendor Card */}
        {vendor && (
          <TouchableOpacity
            style={styles.vendorCard}
            onPress={() => router.push(`/vendor/${vendor.id}`)}
            activeOpacity={0.8}
          >
            <View style={styles.vendorAvatarContainer}>
              <Image
                source={{ uri: vendor.avatar }}
                style={styles.vendorAvatar}
                resizeMode="cover"
              />
            </View>
            <View style={styles.vendorInfo}>
              <Text style={styles.vendorLabel}>Sold by</Text>
              <View style={styles.vendorNameRow}>
                <Text style={styles.vendorName}>{vendor.name}</Text>
                {vendor.is_verified && (
                  <ShieldCheck size={16} color={Colors.success} weight="fill" />
                )}
              </View>
            </View>
            <CaretDown size={20} color={Colors.textMuted} weight="bold" style={{ transform: [{ rotate: '-90deg' }] }} />
          </TouchableOpacity>
        )}

        {/* Collapsible Sections */}
        <View style={styles.sectionsContainer}>
          {/* Description Section */}
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('description')}
          >
            <Text style={styles.sectionTitle}>Product Description</Text>
            {expandedSections.includes('description') ? (
              <CaretUp size={20} color={Colors.textMuted} weight="bold" />
            ) : (
              <CaretDown size={20} color={Colors.textMuted} weight="bold" />
            )}
          </TouchableOpacity>
          {expandedSections.includes('description') && (
            <View style={styles.sectionContent}>
              <Text style={styles.sectionText}>
                {product.description || `Premium ${product.name} sourced directly from trusted African suppliers. Perfect for traditional recipes and authentic cuisine. Our products undergo strict quality checks to ensure you receive only the best.`}
              </Text>
            </View>
          )}

          {/* Nutrition Section */}
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('nutrition')}
          >
            <Text style={styles.sectionTitle}>Nutrition</Text>
            {expandedSections.includes('nutrition') ? (
              <CaretUp size={20} color={Colors.textMuted} weight="bold" />
            ) : (
              <CaretDown size={20} color={Colors.textMuted} weight="bold" />
            )}
          </TouchableOpacity>
          {expandedSections.includes('nutrition') && (
            <View style={styles.sectionContent}>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>120</Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>4g</Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>25g</Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>2g</Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
              </View>
            </View>
          )}

          {/* Heritage Story Section */}
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('heritage')}
          >
            <Text style={styles.sectionTitle}>Heritage Story</Text>
            {expandedSections.includes('heritage') ? (
              <CaretUp size={20} color={Colors.textMuted} weight="bold" />
            ) : (
              <CaretDown size={20} color={Colors.textMuted} weight="bold" />
            )}
          </TouchableOpacity>
          {expandedSections.includes('heritage') && (
            <View style={styles.sectionContent}>
              <Text style={styles.sectionText}>
                This product represents generations of African culinary tradition. Sourced from family-owned farms in {product.region?.replace('-', ' ') || 'West Africa'}, it carries the authentic flavors that have been cherished for centuries. By purchasing this product, you're supporting local African communities and preserving cultural heritage.
              </Text>
            </View>
          )}
        </View>

        {/* Delivery & Quality Cards */}
        <View style={styles.infoCardsRow}>
          <View style={styles.infoCard}>
            <Truck size={24} color={Colors.primary} weight="duotone" />
            <Text style={styles.infoCardTitle}>2-3 Day Delivery</Text>
            <Text style={styles.infoCardSubtitle}>Tracked shipping</Text>
          </View>
          <View style={styles.infoCard}>
            <ShieldCheck size={24} color={Colors.success} weight="duotone" />
            <Text style={styles.infoCardTitle}>Quality Guaranteed</Text>
            <Text style={styles.infoCardSubtitle}>100% authentic</Text>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <SafeAreaView edges={['bottom']} style={styles.bottomBarInner}>
          {/* Quantity Selector */}
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={decrementQuantity}
            >
              <Minus size={18} color={Colors.textPrimary} weight="bold" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={incrementQuantity}
            >
              <Plus size={18} color={Colors.textPrimary} weight="bold" />
            </TouchableOpacity>
          </View>

          {/* Add to Basket Button */}
          <TouchableOpacity
            style={styles.addToBasketButton}
            onPress={handleAddToBasket}
            activeOpacity={0.8}
          >
            <Basket size={22} color={Colors.textPrimary} weight="duotone" />
            <Text style={styles.addToBasketText}>ADD TO BASKET</Text>
            <Text style={styles.addToBasketPrice}>£{totalPrice}</Text>
          </TouchableOpacity>
        </SafeAreaView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.cardDark,
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
  headerButtonActive: {
    backgroundColor: 'rgba(204, 0, 0, 0.2)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  productInfo: {
    padding: Spacing.base,
  },
  regionTag: {
    color: Colors.primary,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  productName: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  productWeight: {
    fontSize: FontSize.body,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  price: {
    fontSize: FontSize.h1,
    fontWeight: FontWeight.bold,
    color: Colors.secondary,
  },
  originalPrice: {
    fontSize: FontSize.body,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  unitPrice: {
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  badgeOrganic: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  badgeTopRated: {
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
  },
  badgeEco: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
  },
  badgeText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  reviewCount: {
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    marginHorizontal: Spacing.base,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  vendorAvatarContainer: {
    marginRight: Spacing.md,
  },
  vendorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorLabel: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  vendorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  vendorName: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  sectionsContainer: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardDark,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  sectionContent: {
    backgroundColor: Colors.cardDark,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    marginTop: -Spacing.sm,
  },
  sectionText: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  nutritionLabel: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  infoCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.cardDark,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  infoCardTitle: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  infoCardSubtitle: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.cardDark,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  bottomBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    gap: Spacing.md,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.lg,
    padding: 4,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    minWidth: 32,
    textAlign: 'center',
  },
  addToBasketButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  addToBasketText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  addToBasketPrice: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    opacity: 0.8,
  },
});
