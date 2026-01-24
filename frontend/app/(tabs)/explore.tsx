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
  Animated,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Sliders,
  Star,
  ShoppingBag,
  ForkKnife,
  ListBullets,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { vendorService, type Vendor } from '../../services/mockDataService';

type FilterType = 'open' | 'delivery' | 'pickup' | 'topRated';

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'open', label: 'Open Now' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'pickup', label: 'Pickup' },
  { id: 'topRated', label: 'Top Rated' },
];

// Transform vendor data for display
const transformVendorForDisplay = (vendor: Vendor) => ({
  id: vendor.id,
  name: vendor.shop_name,
  category: vendor.categories.join(' • '),
  image: vendor.cover_image_url,
  rating: vendor.rating,
  distance: `${(Math.random() * 2 + 0.5).toFixed(1)} km`,
  deliveryTime: `${vendor.delivery_time_min} min`,
  status: 'Open until 8pm',
  statusColor: '#22C55E',
});

export default function ExploreScreen() {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const [activeFilter, setActiveFilter] = useState<FilterType>('open');
  const [loading, setLoading] = useState(false);
  
  // Get vendors from mock database
  const allVendors = vendorService.getAll();
  const vendors = allVendors.map(transformVendorForDisplay);

  const handleVendorPress = (vendorId: string) => {
    router.push(`/vendor/${vendorId}`);
  };

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <View style={styles.mapContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=60' }}
          style={styles.mapImage}
          resizeMode="cover"
        />
        <View style={styles.mapOverlay} />
        
        {/* Map Markers */}
        <View style={[styles.mapMarker, { top: '30%', left: '25%' }]}>
          <View style={styles.markerIcon}>
            <ShoppingBag size={16} color="#FFFFFF" weight="fill" />
          </View>
          <View style={styles.markerPin} />
          <View style={styles.markerShadow} />
        </View>
        
        <View style={[styles.mapMarker, { top: '25%', right: '15%' }]}>
          <View style={styles.markerIcon}>
            <ForkKnife size={16} color="#FFFFFF" weight="fill" />
          </View>
          <View style={styles.markerPin} />
        </View>
        
        {/* Cluster Marker */}
        <View style={[styles.clusterMarker, { top: '35%', right: '30%' }]}>
          <Text style={styles.clusterText}>3</Text>
        </View>
        
        {/* User Location Dot */}
        <View style={styles.userDot} />
      </View>

      {/* Header */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Vendors</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Sliders size={24} color={Colors.textPrimary} weight="duotone" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                activeFilter === filter.id && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(filter.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === filter.id && styles.filterChipTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Sheet - Vendors List */}
      <View style={styles.bottomSheet}>
        {/* Handle */}
        <View style={styles.sheetHandle}>
          <View style={styles.handleBar} />
        </View>

        {/* Vendor Count */}
        <View style={styles.vendorCountContainer}>
          <Text style={styles.vendorCountText}>
            {vendors.length} VENDORS NEARBY
          </Text>
        </View>

        {/* Vendors List */}
        <ScrollView
          style={styles.vendorsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.vendorsListContent}
        >
          {vendors.map((vendor) => (
            <TouchableOpacity
              key={vendor.id}
              style={styles.vendorCard}
              onPress={() => handleVendorPress(vendor.id)}
              activeOpacity={0.8}
            >
              {/* Vendor Image */}
              <View style={styles.vendorImageContainer}>
                <Image
                  source={{ uri: vendor.image }}
                  style={styles.vendorImage}
                  resizeMode="cover"
                />
              </View>

              {/* Vendor Info */}
              <View style={styles.vendorInfo}>
                <View style={styles.vendorHeader}>
                  <Text style={styles.vendorName} numberOfLines={1}>
                    {vendor.name}
                  </Text>
                  <Text style={styles.vendorCategory} numberOfLines={1}>
                    {vendor.category}
                  </Text>
                </View>

                {/* Rating and Meta */}
                <View style={styles.vendorMeta}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFCC00" weight="fill" />
                    <Text style={styles.ratingText}>{vendor.rating}</Text>
                  </View>
                  <Text style={styles.metaDivider}>•</Text>
                  <Text style={styles.metaText}>{vendor.distance}</Text>
                  <Text style={styles.metaDivider}>•</Text>
                  <Text style={styles.metaText}>{vendor.deliveryTime}</Text>
                </View>

                {/* Status */}
                <Text style={[styles.statusText, { color: vendor.statusColor }]}>
                  {vendor.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Bottom padding for tab bar */}
          <View style={{ height: 120 }} />
        </ScrollView>
      </View>

      {/* Floating List View Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity style={styles.floatingButton} activeOpacity={0.9}>
          <Text style={styles.floatingButtonText}>List View</Text>
          <ListBullets size={18} color="#FFFFFF" weight="bold" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  // Map Styles
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
  },
  mapMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerIcon: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: BorderRadius.full,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  markerPin: {
    width: 4,
    height: 12,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginTop: -2,
  },
  markerShadow: {
    width: 8,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: BorderRadius.full,
    marginTop: 2,
  },
  clusterMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.backgroundDark,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  clusterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: FontWeight.bold,
  },
  userDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 16,
    height: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginLeft: -8,
    marginTop: -8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  // Filters Styles
  filtersContainer: {
    paddingBottom: Spacing.md,
  },
  filtersContent: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: '#2A1D15',
    marginRight: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    color: Colors.textPrimary,
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
  },
  filterChipTextActive: {
    color: Colors.textPrimary,
  },
  // Bottom Sheet Styles
  bottomSheet: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: Colors.cardDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
  sheetHandle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleBar: {
    width: 48,
    height: 6,
    backgroundColor: '#4B4B4B',
    borderRadius: 3,
  },
  vendorCountContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  vendorCountText: {
    fontSize: 12,
    fontWeight: FontWeight.semiBold,
    color: '#9CA3AF',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  vendorsList: {
    flex: 1,
  },
  vendorsListContent: {
    paddingHorizontal: 20,
  },
  // Vendor Card Styles
  vendorCard: {
    flexDirection: 'row',
    backgroundColor: '#2A1D15',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 16,
  },
  vendorImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#3E3E3E',
  },
  vendorImage: {
    width: '100%',
    height: '100%',
  },
  vendorInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  vendorHeader: {
    marginBottom: 4,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  vendorCategory: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  vendorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    color: '#FFCC00',
    fontSize: 12,
    fontWeight: FontWeight.semiBold,
  },
  metaDivider: {
    color: '#6B7280',
    marginHorizontal: 8,
    fontSize: 12,
  },
  metaText: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: FontWeight.medium,
  },
  statusText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  // Floating Button Styles
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: FontWeight.bold,
  },
});
