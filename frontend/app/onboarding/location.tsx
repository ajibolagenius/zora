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
  Image,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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
import { useAuthStore } from '../../stores/authStore';

const NEARBY_VENDORS = [
  {
    id: '1',
    name: "Mama Africa's",
    rating: 4.8,
    distance: '1.2 mi',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=200',
  },
  {
    id: '2',
    name: 'Lagos Spices',
    rating: 4.6,
    distance: '1.8 mi',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200',
  },
];

export default function LocationScreen() {
  const router = useRouter();
  const { setOnboardingComplete } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleComplete = () => {
    setOnboardingComplete(true);
    router.replace('/(tabs)');
  };

  const handleUseCurrentLocation = () => {
    setIsLocationEnabled(true);
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
                placeholder="Enter postcode (e.g., SW9 8HQ)"
                placeholderTextColor={Colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Current Location Button - Outline style per design */}
          <TouchableOpacity
            style={[
              styles.currentLocationButton,
              isLocationEnabled && styles.locationButtonActive,
            ]}
            onPress={handleUseCurrentLocation}
            activeOpacity={0.8}
          >
            <Crosshair size={20} color={Colors.primary} weight="fill" />
            <Text style={styles.currentLocationText}>Use Current Location</Text>
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
                <Text style={styles.vendorsSectionTitle}>POPULAR NEAR BRIXTON</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.vendorsScrollContent}
                >
                  {NEARBY_VENDORS.map((vendor) => (
                    <View key={vendor.id} style={styles.vendorCard}>
                      <Image
                        source={{ uri: vendor.image }}
                        style={styles.vendorImage}
                        resizeMode="cover"
                      />
                      <View style={styles.vendorInfo}>
                        <Text style={styles.vendorName} numberOfLines={1}>{vendor.name}</Text>
                        <View style={styles.vendorMeta}>
                          <Star size={12} color={Colors.secondary} weight="fill" />
                          <Text style={styles.vendorRating}>{vendor.rating}</Text>
                          <Text style={styles.vendorDistance}>• {vendor.distance}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </ScrollView>
        </Animated.View>

        {/* Complete Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.completeButton,
              !isLocationEnabled && !searchQuery && styles.completeButtonDisabled,
            ]}
            onPress={handleComplete}
            disabled={!isLocationEnabled && !searchQuery}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>Start Shopping</Text>
            <ArrowRight size={20} color={Colors.textPrimary} weight="bold" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    backgroundColor: 'rgba(204, 0, 0, 0.1)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  mapMarker: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(204, 0, 0, 0.2)',
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
