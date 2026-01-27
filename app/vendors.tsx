import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Funnel, X, Star, Storefront } from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, Heights } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { vendorService, regionService, type Vendor, type Region } from '../services/mockDataService';
import { vendorService as supabaseVendorService } from '../services/supabaseService';
import { onboardingService, type Region as OnboardingRegion } from '../services/onboardingService';
import { realtimeService } from '../services/realtimeService';
import { isSupabaseConfigured } from '../lib/supabase';

// Map onboardingService Region to mockDataService Region format
const mapOnboardingRegionToRegion = (region: OnboardingRegion): Region => {
  const countries = region.description 
    ? region.description.split(',').map(c => c.trim()).filter(Boolean)
    : [];
  
  return {
    id: region.id,
    name: region.name,
    slug: region.slug,
    image_url: region.image_url || '',
    countries: countries,
    description: region.description || '',
    is_selected: false,
    vendor_count: 0,
    product_count: 0,
  };
};
import { VendorCard, Button } from '../components/ui';
import { SortOptions, AnimationDuration, AnimationEasing } from '../constants';
import { getVendorRoute } from '../lib/navigationHelpers';

const SORT_OPTIONS = SortOptions.vendors;

export default function VendorsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ region?: string }>();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(params.region || null);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [showFilters, setShowFilters] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch vendors from database or mock
      let vendorData: Vendor[];
      if (isSupabaseConfigured()) {
        vendorData = await supabaseVendorService.getAll();
      } else {
        vendorData = vendorService.getAll();
      }
      setVendors(vendorData);

      // Fetch regions from database or mock
      let regionData: Region[];
      if (isSupabaseConfigured()) {
        const onboardingRegions = await onboardingService.getRegions();
        regionData = onboardingRegions.map(mapOnboardingRegionToRegion);
      } else {
        regionData = regionService.getAll();
      }
      setRegions(regionData);

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
      console.error('Error fetching vendors data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to real-time updates
    const unsubscribers: (() => void)[] = [];

    if (isSupabaseConfigured()) {
      // Subscribe to vendors updates
      realtimeService.subscribeToTable('vendors', '*', async () => {
        const updatedVendors = await supabaseVendorService.getAll();
        setVendors(updatedVendors);
      }).then((unsub) => {
        if (unsub) unsubscribers.push(unsub);
      });

      // Subscribe to regions updates
      onboardingService.subscribeToRegions((updatedRegions) => {
        const mappedRegions = updatedRegions.map(mapOnboardingRegionToRegion);
        setRegions(mappedRegions);
      });
    }

    return () => {
      unsubscribers.forEach((unsub) => {
        if (typeof unsub === 'function') {
          unsub();
        }
      });
    };
  }, []);

  // Filtered and sorted vendors
  const filteredVendors = useMemo(() => {
    let result = [...vendors];

    // Filter by region
    if (selectedRegion) {
      result = result.filter(v =>
        v.cultural_specialties?.some(s =>
          s.toLowerCase().includes(selectedRegion.toLowerCase())
        )
      );
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.shop_name.localeCompare(b.shop_name));
        break;
      case 'delivery':
        result.sort((a, b) => a.delivery_time_min - b.delivery_time_min);
        break;
    }

    return result;
  }, [vendors, selectedRegion, sortBy]);

  const activeFilterCount = (selectedRegion ? 1 : 0) + (sortBy !== 'rating' ? 1 : 0);

  const handleVendorPress = (vendor: Vendor) => {
    router.push(getVendorRoute(vendor as any, vendor.id) as any);
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
        <Text style={styles.headerTitle}>All Vendors</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
          activeOpacity={0.8}
        >
          <Funnel size={22} color={Colors.textPrimary} weight={showFilters ? 'fill' : 'bold'} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          {/* Region Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Region</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                <TouchableOpacity
                  style={[styles.chip, !selectedRegion && styles.chipActive]}
                  onPress={() => setSelectedRegion(null)}
                >
                  <Text style={[styles.chipText, !selectedRegion && styles.chipTextActive]}>All</Text>
                </TouchableOpacity>
                {regions.map((region) => (
                  <TouchableOpacity
                    key={region.id}
                    style={[styles.chip, selectedRegion === region.slug && styles.chipActive]}
                    onPress={() => setSelectedRegion(region.slug)}
                  >
                    <Text style={[styles.chipText, selectedRegion === region.slug && styles.chipTextActive]}>
                      {region.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Sort Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Sort By</Text>
            <View style={styles.filterChips}>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.chip, sortBy === option.id && styles.chipActive]}
                  onPress={() => setSortBy(option.id)}
                >
                  <Text style={[styles.chipText, sortBy === option.id && styles.chipTextActive]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{filteredVendors.length} vendors found</Text>
        {activeFilterCount > 0 && (
          <TouchableOpacity onPress={() => { setSelectedRegion(null); setSortBy('rating'); }}>
            <Text style={styles.clearFilters}>Clear Filters</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {filteredVendors.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Storefront size={48} color={Colors.textMuted} weight="duotone" />
              </View>
              <Text style={styles.emptyTitle}>No vendors found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your filters to find what you're looking for</Text>
              {activeFilterCount > 0 && (
                <Button
                  title="Clear Filters"
                  onPress={() => { setSelectedRegion(null); setSortBy('rating'); }}
                  variant="secondary"
                  style={{ marginTop: Spacing.lg }}
                />
              )}
            </View>
          ) : (
            filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onPress={() => handleVendorPress(vendor)}
              />
            ))
          )}
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
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    color: Colors.textPrimary,
  },
  filtersPanel: {
    backgroundColor: Colors.cardDark,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  filterSection: {
    marginBottom: Spacing.md,
  },
  filterLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  filterChips: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.borderOutline,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
  },
  chipTextActive: {
    color: Colors.textPrimary,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  resultsCount: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  clearFilters: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
  },
  // Empty State - Consistent
  emptyContainer: {
    paddingVertical: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
});
