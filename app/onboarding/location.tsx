import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LazyImage } from '../../components/ui/LazyImage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Crosshair,
  MagnifyingGlass,
  Star,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Heights } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { Placeholders, AnimationDuration, AnimationEasing } from '../../constants';
import { useAuthStore } from '../../stores/authStore';
import { onboardingService } from '../../services/onboardingService';
import { vendorService } from '../../services/supabaseService';

interface NearbyVendor {
  id: string;
  shop_name: string;
  rating: number;
  distance?: string;
  logo_url?: string | null;
  cover_image_url?: string | null;
}

export default function LocationScreen() {
  const router = useRouter();
  const { user, setOnboardingComplete } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearbyVendors, setNearbyVendors] = useState<NearbyVendor[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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
  }, []);

  const handleUseCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      
      // Check if location services are available
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings to use this feature.'
        );
        setIsLoadingLocation(false);
        return;
      }

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to find nearby vendors. Please enable it in your device settings.'
        );
        setIsLoadingLocation(false);
        return;
      }

      // Get current location with timeout
      const location = await Promise.race([
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Location request timed out')), 10000)
        ),
      ]) as Location.LocationObject;

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(coords);
      setIsLocationEnabled(true);

      // Fetch nearby vendors
      await fetchNearbyVendors(coords.latitude, coords.longitude);
    } catch (error: any) {
      console.error('Error getting location:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to get your location. Please try again.';
      
      if (error?.message?.includes('unavailable') || error?.message?.includes('timeout')) {
        errorMessage = 'Location services are currently unavailable. You can still continue by entering a postcode.';
      } else if (error?.code === 'E_LOCATION_SERVICES_DISABLED') {
        errorMessage = 'Location services are disabled. Please enable them in your device settings.';
      } else if (error?.code === 'E_LOCATION_UNAVAILABLE') {
        errorMessage = 'Location is currently unavailable. You can continue by entering a postcode.';
      }
      
      // Only show alert if not on web (web might not support location)
      if (Platform.OS !== 'web') {
        Alert.alert('Location Error', errorMessage);
      } else {
        // On web, silently fail and allow user to use postcode instead
        console.warn('Location not available on web. User can use postcode instead.');
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const fetchNearbyVendors = async (lat: number, lng: number) => {
    try {
      setIsLoadingVendors(true);
      const vendors = await onboardingService.getNearbyVendors(lat, lng, 10);
      
      // Format vendors for display
      const formattedVendors: NearbyVendor[] = vendors.map((vendor: any) => ({
        id: vendor.id,
        shop_name: vendor.shop_name,
        rating: vendor.rating || 0,
        logo_url: vendor.logo_url,
        cover_image_url: vendor.cover_image_url,
        // Calculate distance if needed
        distance: calculateDistance(lat, lng, vendor.latitude, vendor.longitude),
      }));

      setNearbyVendors(formattedVendors);
    } catch (error) {
      console.error('Error fetching nearby vendors:', error);
    } finally {
      setIsLoadingVendors(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    if (distance < 1) {
      return `${Math.round(distance * 10) / 10} mi`;
    }
    return `${Math.round(distance * 10) / 10} mi`;
  };

  const handleComplete = async () => {
    if (!user) return;

    // Validate that we have either location or search query
    if (!isLocationEnabled && !searchQuery.trim()) {
      Alert.alert(
        'Location Required', 
        'Please enable location or enter a postcode to continue. You can enter a postcode in the search field above.'
      );
      return;
    }

    try {
      setIsSaving(true);

      // If we have current location, save it as address
      if (currentLocation && isLocationEnabled) {
        // For now, we'll save a basic address with location
        // In a real app, you'd want to reverse geocode to get full address
        try {
          await onboardingService.saveDeliveryAddress(user.user_id, {
            label: 'Home',
            full_name: user.name || 'User',
            phone: user.phone || '',
            address_line1: searchQuery.trim() || 'Current Location',
            city: 'London', // Default city, should be reverse geocoded
            postcode: searchQuery.trim() || 'SW9 7AB', // Use search query or default
            country: 'United Kingdom',
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            is_default: true,
          });
        } catch (saveError) {
          console.error('Error saving address with location:', saveError);
          // Fallback to saving without coordinates
          if (searchQuery.trim()) {
            await onboardingService.saveDeliveryAddress(user.user_id, {
              label: 'Home',
              full_name: user.name || 'User',
              phone: user.phone || '',
              address_line1: 'Address',
              city: 'London',
              postcode: searchQuery.trim(),
              country: 'United Kingdom',
              is_default: true,
            });
          }
        }
      } else if (searchQuery.trim()) {
        // Save address with postcode (without coordinates)
        await onboardingService.saveDeliveryAddress(user.user_id, {
          label: 'Home',
          full_name: user.name || 'User',
          phone: user.phone || '',
          address_line1: 'Address',
          city: 'London',
          postcode: searchQuery.trim(),
          country: 'United Kingdom',
          is_default: true,
        });
      }

      setOnboardingComplete(true);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving delivery address:', error);
      Alert.alert(
        'Error', 
        'Failed to save delivery address. Please try again or contact support if the issue persists.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Step 3 of 3</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
          </View>
        </View>

        <Animated.View 
          style={[
            styles.contentContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Where Should We{'\n'}Deliver?</Text>
            <Text style={styles.subtitle}>
              To show you the freshest ingredients and nearest vendors, we need to know your location.
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <MagnifyingGlass size={20} color={Colors.textMuted} weight="regular" />
              <TextInput
                style={styles.searchInput}
                placeholder={Placeholders.form.postcode}
                placeholderTextColor={Colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onBlur={() => Keyboard.dismiss()}
              />
            </View>
          </View>

          {/* Current Location Button - Outline style per design */}
          <TouchableOpacity
            style={[
              styles.currentLocationButton,
              isLocationEnabled && styles.locationButtonActive,
              isLoadingLocation && styles.locationButtonDisabled,
            ]}
            onPress={handleUseCurrentLocation}
            disabled={isLoadingLocation}
            activeOpacity={0.8}
          >
            {isLoadingLocation ? (
              <>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.currentLocationText}>Getting Location...</Text>
              </>
            ) : (
              <>
                <Crosshair size={20} color={Colors.primary} weight="fill" />
                <Text style={styles.currentLocationText}>Use Current Location</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Map Section */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Map Placeholder with delivery badge */}
            <View style={styles.mapContainer}>
              <View style={styles.mapPlaceholder}>
                {/* Grid dots pattern */}
                <View style={styles.mapPattern}>
                  {Array.from({ length: 80 }).map((_, i) => (
                    <View key={i} style={styles.mapDot} />
                  ))}
                </View>
                {/* Center marker */}
                <View style={styles.mapMarker}>
                  <MapPin size={24} color={Colors.primary} weight="fill" />
                </View>
              </View>
              {/* Delivery Active Badge */}
              <View style={styles.deliveryBadge}>
                <View style={styles.deliveryDot} />
                <Text style={styles.deliveryText}>Delivery Active</Text>
              </View>
            </View>

            {/* Nearby Vendors Section */}
            {isLocationEnabled && (
              <View style={styles.vendorsSection}>
                <Text style={styles.vendorsSectionTitle}>
                  {isLoadingVendors ? 'FINDING NEARBY VENDORS...' : 'POPULAR NEAR YOU'}
                </Text>
                {isLoadingVendors ? (
                  <View style={styles.vendorsLoadingContainer}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                    <Text style={styles.vendorsLoadingText}>Loading vendors...</Text>
                  </View>
                ) : nearbyVendors.length > 0 ? (
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.vendorsScrollContent}
                  >
                    {nearbyVendors.map((vendor) => (
                      <View key={vendor.id} style={styles.vendorCard}>
                      <LazyImage
                        source={vendor.cover_image_url || vendor.logo_url || 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=200'}
                        style={styles.vendorImage}
                        contentFit="cover"
                        showLoader={false}
                      />
                        <View style={styles.vendorInfo}>
                          <Text style={styles.vendorName} numberOfLines={1}>{vendor.shop_name}</Text>
                          <View style={styles.vendorMeta}>
                            <Star size={12} color={Colors.secondary} weight="fill" />
                            <Text style={styles.vendorRating}>{vendor.rating.toFixed(1)}</Text>
                            {vendor.distance && (
                              <Text style={styles.vendorDistance}>• {vendor.distance}</Text>
                            )}
                          </View>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.noVendorsContainer}>
                    <Text style={styles.noVendorsText}>No vendors found nearby</Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </Animated.View>

        {/* Complete Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.completeButton,
              ((!isLocationEnabled && !searchQuery.trim()) || isSaving) && styles.completeButtonDisabled,
            ]}
            onPress={handleComplete}
            disabled={(!isLocationEnabled && !searchQuery.trim()) || isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <>
                <ActivityIndicator size="small" color={Colors.textPrimary} />
                <Text style={styles.completeButtonText}>Saving...</Text>
              </>
            ) : (
              <>
                <Text style={styles.completeButtonText}>Start Shopping</Text>
                <ArrowRight size={20} color={Colors.textPrimary} weight="bold" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  flex: {
    flex: 1,
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
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressBar: {
    width: 100,
    height: 3,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontFamily: FontFamily.body,
    color: Colors.textMuted,
    fontSize: FontSize.caption,
  },
  contentContainer: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  searchContainer: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
    height: Heights.input,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.body,
    color: Colors.textPrimary,
    fontSize: FontSize.small,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.base,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
    gap: Spacing.sm,
  },
  locationButtonActive: {
    backgroundColor: Colors.primary10,
  },
  locationButtonDisabled: {
    opacity: 0.6,
  },
  currentLocationText: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.primary,
    fontSize: FontSize.body,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
  mapContainer: {
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  mapPlaceholder: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  mapPattern: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: Spacing.md,
    gap: 16,
  },
  mapDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.white10,
  },
  mapMarker: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  deliveryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  deliveryText: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textPrimary,
    fontSize: FontSize.caption,
  },
  vendorsSection: {
    marginTop: Spacing.xl,
  },
  vendorsSectionTitle: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  vendorsScrollContent: {
    gap: Spacing.md,
  },
  vendorCard: {
    width: 140,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  vendorImage: {
    width: '100%',
    height: 80,
  },
  vendorInfo: {
    padding: Spacing.sm,
  },
  vendorName: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textPrimary,
    fontSize: FontSize.small,
    marginBottom: 2,
  },
  vendorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vendorRating: {
    fontFamily: FontFamily.body,
    color: Colors.textPrimary,
    fontSize: FontSize.caption,
  },
  vendorDistance: {
    fontFamily: FontFamily.body,
    color: Colors.textMuted,
    fontSize: FontSize.caption,
  },
  vendorsLoadingContainer: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  vendorsLoadingText: {
    fontFamily: FontFamily.body,
    color: Colors.textMuted,
    fontSize: FontSize.small,
  },
  noVendorsContainer: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  noVendorsText: {
    fontFamily: FontFamily.body,
    color: Colors.textMuted,
    fontSize: FontSize.small,
  },
  footer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
  },
  completeButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    height: Heights.button,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  completeButtonDisabled: {
    opacity: 0.5,
  },
  completeButtonText: {
    fontFamily: FontFamily.bodyBold,
    color: Colors.textPrimary,
    fontSize: FontSize.body,
  },
});
