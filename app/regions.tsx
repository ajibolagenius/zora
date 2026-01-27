import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { LazyImage } from '../components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Storefront, Package } from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, Heights } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { AnimationDuration, AnimationEasing } from '../constants';
import { regionService, type Region } from '../services/mockDataService';
import { onboardingService, type Region as OnboardingRegion } from '../services/onboardingService';
import { productService, vendorService } from '../services/supabaseService';
import { realtimeService } from '../services/realtimeService';
import { isSupabaseConfigured, getSupabaseFrom } from '../lib/supabase';

// Unsplash photo IDs for African regional cultural images
// These are curated to represent each region's cultural identity
const REGION_UNSPLASH_PHOTOS: Record<string, string[]> = {
  'West Africa': [
    '1596040033229-a9821ebd058d', // West African cuisine
    '1504674900247-0877df9cc836', // Vibrant market scene
    '1590001155093-a3c66ab0c3ff', // Traditional market
    '1489392191049-fc10c97e64b6', // Colorful food display
  ],
  'East Africa': [
    '1532336414038-cf19250c5757', // Spices and traditional ingredients
    '1608571423902-eed4a5ad8108', // Natural African products
    '1474979266404-7eaacbcd87c5', // Grains and staples
    '1542838132-92c53300491e',    // Traditional spices
  ],
  'North Africa': [
    '1523805009345-7448845a9e53', // Traditional market interior
    '1539635278303-d4002c07eae3', // Market stall with goods
    '1484318571209-661cf29a69c3', // Fresh produce display
    '1513475382585-d06e58bcb0e0', // Cultural market scene
  ],
  'South Africa': [
    '1507003211169-0a1dd7228f2d', // Modern African market
    '1531746020798-e6953c6e8e04', // Professional food display
    '1604329760661-e71dc83f8f26', // Traditional storefront
    '1523805009345-7448845a9e53', // Market interior
  ],
  'Central Africa': [
    '1590001155093-a3c66ab0c3ff', // Central African market
    '1489392191049-fc10c97e64b6', // Traditional food display
    '1539635278303-d4002c07eae3', // Market stall
    '1484318571209-661cf29a69c3', // Fresh produce
  ],
};

/**
 * Generate region cultural image URL using Unsplash
 * Randomly selects a photo each time for a fresh experience
 * Ensures no duplicate images across regions
 */
function generateRegionImage(
  regionName: string, 
  usedPhotoIds: Set<string> = new Set(),
  width: number = 800
): string {
  const photos = REGION_UNSPLASH_PHOTOS[regionName] || REGION_UNSPLASH_PHOTOS['West Africa'];
  
  // Filter out already used photos
  const availablePhotos = photos.filter(photoId => !usedPhotoIds.has(photoId));
  
  // If all photos for this region are used, fall back to all photos (shouldn't happen with 4+ photos per region)
  const photosToChooseFrom = availablePhotos.length > 0 ? availablePhotos : photos;
  
  // Randomly select a photo index
  const index = Math.floor(Math.random() * photosToChooseFrom.length);
  const photoId = photosToChooseFrom[index];
  
  // Mark this photo as used
  usedPhotoIds.add(photoId);
  
  // Unsplash Source API - free, no key required
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&auto=format&fit=crop`;
}

// Convert slug to region name format (e.g., "west-africa" -> "West Africa")
const slugToRegionName = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Get product count for a region
const getProductCount = async (regionName: string): Promise<number> => {
  // Fetch all products and filter in memory to match the same logic used in products screen
  const allProducts = await productService.getAll();
  const normalizedRegionName = regionName.toLowerCase();
  
  return allProducts.filter(p => 
    p.cultural_region?.toLowerCase().includes(normalizedRegionName)
  ).length;
};

// Region to country mapping (matching the SQL query logic)
const REGION_COUNTRY_MAP: Record<string, string[]> = {
  'West Africa': ['Nigeria', 'Ghana', 'Senegal', 'Mali'],
  'East Africa': ['Kenya', 'Ethiopia', 'Tanzania', 'Uganda'],
  'North Africa': ['Morocco', 'Egypt', 'Tunisia', 'Algeria'],
  'South Africa': ['South Africa', 'Zimbabwe', 'Botswana', 'Namibia'],
  'Central Africa': ['Congo', 'Cameroon', 'Gabon', 'Chad'],
};

// Get vendor count for a region using country mapping
const getVendorCount = async (regionName: string): Promise<number> => {
  // Fetch all vendors and filter by countries in the region
  const allVendors = await vendorService.getAll();
  const regionCountries = REGION_COUNTRY_MAP[regionName] || [];
  
  if (regionCountries.length === 0) return 0;
  
  return allVendors.filter(v => {
    const specialties = Array.isArray(v.cultural_specialties) 
      ? v.cultural_specialties 
      : [];
    // Check if any specialty matches any country in the region
    return specialties.some((specialty: string) => 
      regionCountries.some(country => 
        specialty.toLowerCase().includes(country.toLowerCase()) ||
        country.toLowerCase().includes(specialty.toLowerCase())
      )
    );
  }).length;
};

// Map onboardingService Region to mockDataService Region format with counts
// Accepts usedPhotoIds to ensure no duplicate images across regions
const mapOnboardingRegionToRegion = async (
  region: OnboardingRegion,
  usedPhotoIds?: Set<string>
): Promise<Region> => {
  // Parse countries from description if available, or use the mapping
  const regionCountries = REGION_COUNTRY_MAP[region.name] || [];
  const countries = region.description 
    ? region.description.split(',').map(c => c.trim()).filter(Boolean)
    : regionCountries;
  
  // Get counts for this region
  const regionName = region.name;
  const [productCount, vendorCount] = await Promise.all([
    getProductCount(regionName),
    getVendorCount(regionName),
  ]);
  
  // Generate region image if not provided, ensuring uniqueness
  const imageUrl = region.image_url || generateRegionImage(regionName, usedPhotoIds);
  
  return {
    id: region.id,
    name: region.name,
    slug: region.slug,
    image_url: imageUrl,
    countries: countries,
    description: region.description || '',
    is_selected: false,
    vendor_count: vendorCount,
    product_count: productCount,
  };
};

export default function RegionsScreen() {
  const router = useRouter();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch regions from database or mock
      let data: Region[];
      if (isSupabaseConfigured()) {
        const onboardingRegions = await onboardingService.getRegions();
        // Create a shared set to track used photo IDs across all regions
        const usedPhotoIds = new Set<string>();
        // Map regions with counts (async mapping), ensuring unique images
        data = await Promise.all(
          onboardingRegions.map(region => mapOnboardingRegionToRegion(region, usedPhotoIds))
        );
      } else {
        data = regionService.getAll();
      }
      setRegions(data);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: AnimationDuration.default,
          easing: AnimationEasing.standard,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: AnimationDuration.default,
          easing: AnimationEasing.standard,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Error fetching regions data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to real-time updates for regions
    if (isSupabaseConfigured()) {
      onboardingService.subscribeToRegions(async (updatedRegions) => {
        // Create a shared set to track used photo IDs across all regions
        const usedPhotoIds = new Set<string>();
        // Map regions with counts (async mapping), ensuring unique images
        const mappedRegions = await Promise.all(
          updatedRegions.map((region) => mapOnboardingRegionToRegion(region, usedPhotoIds))
        );
        setRegions(mappedRegions);
      });

      // Also subscribe to products and vendors updates to refresh counts
      const unsubscribers: (() => void)[] = [];

      realtimeService.subscribeToTable('products', '*', async () => {
        // Refresh region counts when products change
        const onboardingRegions = await onboardingService.getRegions();
        // Create a shared set to track used photo IDs across all regions
        const usedPhotoIds = new Set<string>();
        const mappedRegions = await Promise.all(
          onboardingRegions.map(region => mapOnboardingRegionToRegion(region, usedPhotoIds))
        );
        setRegions(mappedRegions);
      }).then((unsub) => {
        if (unsub) unsubscribers.push(unsub);
      });

      realtimeService.subscribeToTable('vendors', '*', async () => {
        // Refresh region counts when vendors change
        const onboardingRegions = await onboardingService.getRegions();
        // Create a shared set to track used photo IDs across all regions
        const usedPhotoIds = new Set<string>();
        const mappedRegions = await Promise.all(
          onboardingRegions.map(region => mapOnboardingRegionToRegion(region, usedPhotoIds))
        );
        setRegions(mappedRegions);
      }).then((unsub) => {
        if (unsub) unsubscribers.push(unsub);
      });

      return () => {
        unsubscribers.forEach((unsub) => {
          if (typeof unsub === 'function') {
            unsub();
          }
        });
      };
    }
  }, []);

  const handleRegionPress = (region: Region) => {
    setSelectedRegion(region.id);
    // Navigate to products filtered by region
    router.push(`/products?region=${region.slug}`);
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop by Region</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Intro Text */}
          <Text style={styles.introText}>
            Discover authentic products from across the African continent. Each region offers unique flavors, ingredients, and cultural treasures.
          </Text>

          {/* Regions Grid */}
          <View style={styles.regionsGrid}>
            {regions.map((region) => (
              <TouchableOpacity
                key={region.id}
                style={styles.regionCard}
                onPress={() => handleRegionPress(region)}
                activeOpacity={0.8}
              >
                <LazyImage
                  source={region.image_url}
                  style={styles.regionImage}
                  contentFit="cover"
                  showLoader={false}
                />
                <View style={styles.regionOverlay} />
                <View style={styles.regionContent}>
                  <Text style={styles.regionName}>{region.name}</Text>
                  <Text style={styles.regionCountries} numberOfLines={1}>
                    {region.countries.slice(0, 3).join(', ')}
                    {region.countries.length > 3 ? '...' : ''}
                  </Text>
                  <View style={styles.regionStats}>
                    <View style={styles.statItem}>
                      <Storefront size={14} color={Colors.primary} weight="fill" />
                      <Text style={styles.statText}>{region.vendor_count} Vendors</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Package size={14} color={Colors.primary} weight="fill" />
                      <Text style={styles.statText}>{region.product_count} Products</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
  },
  introText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  regionsGrid: {
    gap: Spacing.md,
  },
  regionCard: {
    height: 140,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  regionImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  regionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.black50, // Close to 0.45
  },
  regionContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.base,
  },
  regionName: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  regionCountries: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  regionStats: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
  },
});
