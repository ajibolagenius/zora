import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import {
  ArrowLeft,
  MapPin,
  Star,
  Storefront,
  Clock,
  CaretRight,
  NavigationArrow,
  List,
  MapTrifold,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { vendorService, type Vendor } from '../services/mockDataService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Default location (London)
const DEFAULT_REGION: Region = {
  latitude: 51.4545,
  longitude: -0.1155,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function VendorMapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showListView, setShowListView] = useState(false);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  
  // Get all vendors
  const vendors = vendorService.getAll();
  
  // Get user's location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setUserLocation(newLocation);
          setRegion({
            ...newLocation,
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
  
  // Navigate to vendor page
  const handleVendorPress = (vendor: Vendor) => {
    router.push(`/vendor/${vendor.id}`);
  };
  
  // Center map on user location
  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 500);
    }
  };
  
  // Get vendor coordinates (mock - in real app would come from vendor data)
  const getVendorCoordinates = (vendor: Vendor, index: number) => {
    // Use vendor's actual coordinates if available
    if (vendor.location?.coordinates) {
      return {
        latitude: vendor.location.coordinates[1],
        longitude: vendor.location.coordinates[0],
      };
    }
    // Fallback: spread around default location
    const baseLocation = userLocation || DEFAULT_REGION;
    return {
      latitude: baseLocation.latitude + (Math.random() - 0.5) * 0.04,
      longitude: baseLocation.longitude + (Math.random() - 0.5) * 0.04,
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

  return (
    <View style={styles.container}>
      {/* Map View */}
      {!showListView && (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass={false}
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
                  <Storefront 
                    size={18} 
                    color="#FFFFFF" 
                    weight="fill" 
                  />
                </View>
              </Marker>
            );
          })}
        </MapView>
      )}
      
      {/* List View */}
      {showListView && (
        <ScrollView 
          style={styles.listView}
          contentContainerStyle={styles.listViewContent}
        >
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
                </View>
              </View>
              <CaretRight size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
          <View style={{ height: insets.bottom + 100 }} />
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
      
      {/* My Location Button */}
      {!showListView && userLocation && (
        <TouchableOpacity 
          style={[styles.myLocationButton, { bottom: selectedVendor ? 220 : 120 }]}
          onPress={centerOnUser}
        >
          <NavigationArrow size={22} color={Colors.primary} weight="fill" />
        </TouchableOpacity>
      )}
      
      {/* Selected Vendor Card */}
      {!showListView && selectedVendor && (
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
                <View style={styles.metaItem}>
                  <Clock size={14} color={Colors.textMuted} />
                  <Text style={styles.metaText}>
                    {selectedVendor.delivery_time_min}-{selectedVendor.delivery_time_max} min
                  </Text>
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
  listView: {
    flex: 1,
    marginTop: 120,
  },
  listViewContent: {
    padding: Spacing.lg,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  markerContainerSelected: {
    backgroundColor: '#10B981',
    transform: [{ scale: 1.2 }],
  },
  myLocationButton: {
    position: 'absolute',
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(34, 23, 16, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
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
