import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { useAuthStore } from '../../stores/authStore';

const { width } = Dimensions.get('window');

const POPULAR_LOCATIONS = [
  {
    id: '1',
    name: "Mama Africa's",
    rating: 4.8,
    distance: '0.5 mi',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200',
  },
  {
    id: '2',
    name: 'Lagos Fresh Market',
    rating: 4.6,
    distance: '0.8 mi',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
  },
  {
    id: '3',
    name: 'Accra Spice House',
    rating: 4.9,
    distance: '1.2 mi',
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=200',
  },
];

export default function LocationScreen() {
  const router = useRouter();
  const { setOnboardingComplete } = useAuthStore();
  const [postcode, setPostcode] = useState('');
  const [locationActive, setLocationActive] = useState(false);

  const handleUseCurrentLocation = () => {
    setLocationActive(true);
    // In a real app, this would trigger location permissions and get the current location
  };

  const handleContinue = () => {
    setOnboardingComplete(true);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <Text style={styles.progressText}>Step 3 of 3</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Where Should We Deliver?</Text>
          <Text style={styles.subtitle}>
            We'll use your location to show you the best African markets and products nearby.
          </Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={22} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Enter postcode (e.g., SW9 8HQ)"
            placeholderTextColor={Colors.textMuted}
            value={postcode}
            onChangeText={setPostcode}
            autoCapitalize="characters"
          />
        </View>

        {/* Use Current Location Button */}
        <TouchableOpacity
          style={[
            styles.locationButton,
            locationActive && styles.locationButtonActive,
          ]}
          onPress={handleUseCurrentLocation}
        >
          <MaterialCommunityIcons
            name="crosshairs-gps"
            size={22}
            color={locationActive ? Colors.textPrimary : Colors.primary}
          />
          <Text style={[
            styles.locationButtonText,
            locationActive && styles.locationButtonTextActive,
          ]}>
            Use Current Location
          </Text>
        </TouchableOpacity>

        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            {/* Decorative dots pattern */}
            <View style={styles.mapPattern}>
              {Array.from({ length: 100 }).map((_, i) => (
                <View key={i} style={styles.mapDot} />
              ))}
            </View>
            
            {/* Location marker */}
            <View style={styles.locationMarker}>
              <View style={styles.markerPulse} />
              <View style={styles.markerCenter}>
                <MaterialCommunityIcons name="fire" size={24} color={Colors.primary} />
              </View>
            </View>
            
            {/* Status Badge */}
            {locationActive && (
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Delivery Active</Text>
              </View>
            )}
          </View>
        </View>

        {/* Popular Near You */}
        <View style={styles.popularSection}>
          <Text style={styles.sectionLabel}>POPULAR NEAR BRIXTON</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularList}
          >
            {POPULAR_LOCATIONS.map((location) => (
              <TouchableOpacity key={location.id} style={styles.locationCard}>
                <Image
                  source={{ uri: location.image }}
                  style={styles.locationImage}
                />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <View style={styles.locationMeta}>
                    <MaterialCommunityIcons name="star" size={14} color={Colors.rating} />
                    <Text style={styles.locationRating}>{location.rating}</Text>
                    <Text style={styles.locationDistance}>{location.distance}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Start Shopping</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: 120,
    height: 4,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  progressText: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    marginTop: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.base,
  },
  titleContainer: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.body,
    color: Colors.textMuted,
    lineHeight: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    height: 52,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.body,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    gap: Spacing.sm,
  },
  locationButtonActive: {
    backgroundColor: Colors.primary,
  },
  locationButtonText: {
    color: Colors.primary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
  },
  locationButtonTextActive: {
    color: Colors.textPrimary,
  },
  mapContainer: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.lg,
    height: 200,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: Colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: Spacing.sm,
    opacity: 0.3,
  },
  mapDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textMuted,
    margin: 8,
  },
  locationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(204, 0, 0, 0.15)',
  },
  markerCenter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(204, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  statusText: {
    color: Colors.textPrimary,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
  },
  popularSection: {
    marginTop: Spacing.xl,
  },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semiBold,
    letterSpacing: 1,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  popularList: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    width: 220,
    gap: Spacing.sm,
  },
  locationImage: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundDark,
  },
  locationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  locationName: {
    color: Colors.textPrimary,
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
  },
  locationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 4,
  },
  locationRating: {
    color: Colors.rating,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semiBold,
  },
  locationDistance: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    marginLeft: Spacing.xs,
  },
  footer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  continueButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
  },
});
