import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MapView, { Marker, Circle, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import {
  ArrowLeft,
  MapPin,
  Star,
  NavigationArrow,
  Storefront,
  Clock,
  CaretRight,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { vendorService, type Vendor } from '../services/mockDataService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// London default location (Brixton area)
const DEFAULT_LOCATION = {
  latitude: 51.4613,
  longitude: -0.1156,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function VendorMapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState<Region>(DEFAULT_LOCATION);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  
  // Get all vendors
  const vendors = vendorService.getAll();
  
  // Request location permission and get current location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          setLocationPermission(true);
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);
          setRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      } catch (error) {
        console.log('Location error:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  
  // Center map on user location
  const centerOnUser = useCallback(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 500);
    }
  }, [location]);
  
  // Handle marker press
  const handleMarkerPress = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: vendor.location.coordinates[1],
        longitude: vendor.location.coordinates[0],
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  };
  
  // Navigate to vendor page
  const handleVendorPress = () => {
    if (selectedVendor) {
      router.push(`/vendor/${selectedVendor.id}`);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Finding nearby vendors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={region}
        showsUserLocation={locationPermission}
        showsMyLocationButton={false}
        showsCompass={false}
        customMapStyle={mapStyle}
      >
        {/* Vendor Markers */}
        {vendors.map((vendor) => (
          <React.Fragment key={vendor.id}>
            {/* Coverage Circle */}
            <Circle
              center={{
                latitude: vendor.location.coordinates[1],
                longitude: vendor.location.coordinates[0],
              }}
              radius={vendor.coverage_radius_km * 1000}
              fillColor="rgba(193, 39, 45, 0.1)"
              strokeColor="rgba(193, 39, 45, 0.3)"
              strokeWidth={1}
            />
            {/* Vendor Marker */}
            <Marker
              coordinate={{
                latitude: vendor.location.coordinates[1],
                longitude: vendor.location.coordinates[0],
              }}
              onPress={() => handleMarkerPress(vendor)}
            >
              <View style={[
                styles.markerContainer,
                selectedVendor?.id === vendor.id && styles.markerSelected
              ]}>
                <View style={styles.markerIcon}>
                  <Storefront size={16} color="#FFFFFF" weight="fill" />
                </View>
              </View>
            </Marker>
          </React.Fragment>
        ))}
      </MapView>
      
      {/* Header Overlay */}
      <SafeAreaView style={styles.headerOverlay} edges={['top']}>
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
          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>
      
      {/* My Location Button */}
      {locationPermission && (
        <TouchableOpacity
          style={[styles.locationButton, { bottom: selectedVendor ? 220 : 40 }]}
          onPress={centerOnUser}
        >
          <NavigationArrow size={24} color={Colors.primary} weight="fill" />
        </TouchableOpacity>
      )}
      
      {/* Selected Vendor Card */}
      {selectedVendor && (
        <View style={[styles.vendorCardContainer, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={styles.vendorCard}
            onPress={handleVendorPress}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: selectedVendor.cover_image_url }}
              style={styles.vendorImage}
            />
            <View style={styles.vendorInfo}>
              <View style={styles.vendorHeader}>
                <Text style={styles.vendorName} numberOfLines={1}>
                  {selectedVendor.shop_name}
                </Text>
                {selectedVendor.is_verified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓ Verified</Text>
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
                <View style={styles.metaItem}>
                  <Clock size={14} color={Colors.textMuted} />
                  <Text style={styles.metaText}>
                    {selectedVendor.delivery_time_min}-{selectedVendor.delivery_time_max} min
                  </Text>
                </View>
                <View style={styles.metaDivider} />
                <View style={styles.metaItem}>
                  <MapPin size={14} color={Colors.textMuted} />
                  <Text style={styles.metaText}>
                    {selectedVendor.coverage_radius_km}km delivery
                  </Text>
                </View>
              </View>
              <View style={styles.vendorCta}>
                <Text style={styles.ctaText}>View Shop</Text>
                <CaretRight size={16} color={Colors.primary} weight="bold" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Vendor Count Badge */}
      <View style={styles.vendorCountBadge}>
        <Storefront size={16} color="#FFFFFF" weight="fill" />
        <Text style={styles.vendorCountText}>{vendors.length} vendors nearby</Text>
      </View>
    </View>
  );
}

// Dark map style for consistent look
const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d1d1d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1d1d1d' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1d1d1d' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e0e' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
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
  headerOverlay: {
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
  markerContainer: {
    alignItems: 'center',
  },
  markerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerSelected: {
    transform: [{ scale: 1.2 }],
  },
  locationButton: {
    position: 'absolute',
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(34, 23, 16, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  vendorCardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: 'transparent',
  },
  vendorCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(34, 23, 16, 0.95)',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  vendorImage: {
    width: 100,
    height: 120,
  },
  vendorInfo: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  vendorName: {
    flex: 1,
    color: Colors.textPrimary,
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.bodyLarge,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  verifiedText: {
    color: '#10B981',
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
  },
  vendorCategories: {
    color: Colors.textMuted,
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    marginTop: 2,
  },
  vendorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: Colors.textMuted,
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: Spacing.sm,
  },
  vendorCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  ctaText: {
    color: Colors.primary,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
  },
  vendorCountBadge: {
    position: 'absolute',
    top: 100,
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
  },
  vendorCountText: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
  },
});
