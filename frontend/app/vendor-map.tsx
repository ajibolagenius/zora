import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Star,
  Storefront,
  Clock,
  CaretRight,
  MapTrifold,
  List,
  NavigationArrow,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { vendorService, type Vendor } from '../services/mockDataService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Conditionally import MapView only on native platforms
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
  } catch (e) {
    console.log('react-native-maps not available');
  }
}

// Default location (London - Brixton area)
const DEFAULT_REGION = {
  latitude: 51.4545,
  longitude: -0.1155,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Dark map style for Google Maps
const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
  { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
  { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
];

export default function VendorMapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showListView, setShowListView] = useState(Platform.OS === 'web');
  
  // Get all vendors
  const vendors = vendorService.getAll();
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Navigate to vendor page
  const handleVendorPress = (vendor: Vendor) => {
    router.push(`/vendor/${vendor.id}`);
  };
  
  // Get vendor coordinates
  const getVendorCoordinates = (vendor: Vendor, index: number) => {
    if (vendor.location?.coordinates) {
      return {
        latitude: vendor.location.coordinates[1],
        longitude: vendor.location.coordinates[0],
      };
    }
    // Spread vendors around default location
    return {
      latitude: DEFAULT_REGION.latitude + (Math.random() - 0.5) * 0.04,
      longitude: DEFAULT_REGION.longitude + (Math.random() - 0.5) * 0.04,
    };
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Finding nearby vendors...</Text>
      </View>
    );
  }

  // Check if native maps are available
  const isNativeMapAvailable = Platform.OS !== 'web' && MapView !== null;

  return (
    <View style={styles.container}>
      {/* Map View - Native Only */}
      {isNativeMapAvailable && !showListView && (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={DEFAULT_REGION}
          showsUserLocation
          showsMyLocationButton={false}
          customMapStyle={mapStyle}
        >
          {vendors.map((vendor, index) => {
            const coords = getVendorCoordinates(vendor, index);
            return (
              <Marker
                key={vendor.id}
                coordinate={coords}
                onPress={() => setSelectedVendor(vendor)}
              >
                <View style={[
                  styles.markerContainer,
                  selectedVendor?.id === vendor.id && styles.markerContainerSelected
                ]}>
                  <Storefront size={18} color="#FFFFFF" weight="fill" />
                </View>
              </Marker>
            );
          })}
        </MapView>
      )}
      
      {/* Static Map Background - Web Only */}
      {Platform.OS === 'web' && !showListView && (
        <View style={styles.mapBackground}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=60' }}
            style={styles.mapImage}
            resizeMode="cover"
          />
          <View style={styles.mapOverlay} />
          <View style={styles.webNotice}>
            <MapTrifold size={40} color={Colors.primary} weight="duotone" />
            <Text style={styles.webNoticeTitle}>Interactive Map</Text>
            <Text style={styles.webNoticeText}>
              Download the Zora app to see vendors on a live map
            </Text>
            <TouchableOpacity 
              style={styles.switchToListButton}
              onPress={() => setShowListView(true)}
            >
              <List size={18} color="#FFFFFF" weight="bold" />
              <Text style={styles.switchToListText}>View as List</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* List View */}
      {showListView && (
        <ScrollView 
          style={styles.listView}
          contentContainerStyle={styles.listViewContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Nearby Vendors</Text>
          
          {vendors.map((vendor) => (
            <TouchableOpacity
              key={vendor.id}
              style={styles.vendorCard}
              onPress={() => handleVendorPress(vendor)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: vendor.cover_image_url }}
                style={styles.vendorImage}
              />
              <View style={styles.vendorInfo}>
                <View style={styles.vendorHeader}>
                  <Text style={styles.vendorName} numberOfLines={1}>
                    {vendor.shop_name}
                  </Text>
                  {vendor.is_verified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.vendorCategories} numberOfLines={1}>
                  {vendor.categories.join(' • ')}
                </Text>
                <View style={styles.vendorMeta}>
                  <View style={styles.metaItem}>
                    <Star size={14} color="#FFCC00" weight="fill" />
                    <Text style={styles.metaText}>{vendor.rating}</Text>
                  </View>
                  <View style={styles.metaDivider} />
                  <View style={styles.metaItem}>
                    <Clock size={14} color={Colors.textMuted} />
                    <Text style={styles.metaText}>
                      {vendor.delivery_time_min}-{vendor.delivery_time_max} min
                    </Text>
                  </View>
                  <View style={styles.metaDivider} />
                  <View style={styles.metaItem}>
                    <MapPin size={14} color={Colors.textMuted} />
                    <Text style={styles.metaText}>
                      {vendor.coverage_radius_km}km
                    </Text>
                  </View>
                </View>
              </View>
              <CaretRight size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
          
          <View style={{ height: insets.bottom + 20 }} />
        </ScrollView>
      )}
      
      {/* Header */}
      <SafeAreaView style={styles.headerContainer} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" weight="bold" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <MapPin size={20} color={Colors.primary} weight="fill" />
            <Text style={styles.headerText}>Vendor Map</Text>
          </View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowListView(!showListView)}
          >
            {showListView ? (
              <MapTrifold size={24} color="#FFFFFF" weight="duotone" />
            ) : (
              <List size={24} color="#FFFFFF" weight="bold" />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      {/* Vendor Count Badge */}
      <View style={styles.vendorCountBadge}>
        <Storefront size={16} color="#FFFFFF" weight="fill" />
        <Text style={styles.vendorCountText}>{vendors.length} vendors nearby</Text>
      </View>
      
      {/* Selected Vendor Card - Native Map Only */}
      {isNativeMapAvailable && !showListView && selectedVendor && (
        <View style={[styles.selectedVendorContainer, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={styles.selectedVendorCard}
            onPress={() => handleVendorPress(selectedVendor)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: selectedVendor.cover_image_url }}
              style={styles.selectedVendorImage}
            />
            <View style={styles.selectedVendorInfo}>
              <View style={styles.vendorHeader}>
                <Text style={styles.selectedVendorName} numberOfLines={1}>
                  {selectedVendor.shop_name}
                </Text>
                {selectedVendor.is_verified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={styles.vendorCategories} numberOfLines={1}>
                {selectedVendor.categories.join(' • ')}
              </Text>
              <View style={styles.vendorMeta}>
                <View style={styles.metaItem}>
                  <Star size={14} color="#FFCC00" weight="fill" />
                  <Text style={styles.metaText}>{selectedVendor.rating}</Text>
                </View>
                <View style={styles.metaDivider} />
                <Text style={styles.deliveryFee}>
                  £{selectedVendor.delivery_fee.toFixed(2)} delivery
                </Text>
              </View>
            </View>
            <View style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
              <CaretRight size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: Colors.backgroundDark,
  },
  loadingText: {
    marginTop: 16,
    color: Colors.textMuted,
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
  },
  map: {
    flex: 1,
  },
  mapBackground: {
    flex: 1,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  webNotice: {
    position: 'absolute',
    top: '40%',
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(34, 23, 16, 0.95)',
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  webNoticeTitle: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h3,
    marginTop: 12,
  },
  webNoticeText: {
    color: Colors.textMuted,
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  switchToListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    marginTop: 20,
  },
  switchToListText: {
    color: '#FFFFFF',
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
  },
  listView: {
    flex: 1,
    marginTop: 120,
  },
  listViewContent: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(34, 23, 16, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(34, 23, 16, 0.9)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  headerText: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
  },
  vendorCountBadge: {
    position: 'absolute',
    top: 110,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(34, 23, 16, 0.9)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 10,
  },
  vendorCountText: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
  },
  markerContainer: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  markerContainerSelected: {
    backgroundColor: '#10B981',
    transform: [{ scale: 1.2 }],
  },
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  vendorImage: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.md,
  },
  vendorInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  vendorName: {
    flex: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  verifiedBadge: {
    backgroundColor: '#10B981',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  vendorCategories: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    marginTop: 2,
  },
  vendorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: Spacing.sm,
  },
  deliveryFee: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    color: Colors.primary,
  },
  selectedVendorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.backgroundDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  selectedVendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedVendorImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
  },
  selectedVendorInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  selectedVendorName: {
    flex: 1,
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  viewButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: '#FFFFFF',
  },
});
