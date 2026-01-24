import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  MapPin,
  Crosshair,
  MagnifyingGlass,
  NavigationArrow,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { useAuthStore } from '../../stores/authStore';

const SAVED_LOCATIONS = [
  {
    id: '1',
    name: 'Home',
    address: '42 Market Street, Brixton, London SW9 8LF',
    icon: '🏠',
  },
  {
    id: '2',
    name: 'Work',
    address: '15 Canary Wharf, London E14 5AB',
    icon: '🏢',
  },
];

export default function LocationScreen() {
  const router = useRouter();
  const { setHasCompletedOnboarding } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleComplete = () => {
    setHasCompletedOnboarding(true);
    router.replace('/(tabs)');
  };

  const handleUseCurrentLocation = () => {
    setSelectedLocation('current');
  };

  const handleSelectLocation = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
            <Text style={styles.progressText}>Step 3 of 3</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Set Your Delivery Location</Text>
          <Text style={styles.subtitle}>
            We'll show you the best vendors and products available in your area.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MagnifyingGlass size={22} color={Colors.textMuted} weight="duotone" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for your address..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Current Location Button */}
        <TouchableOpacity
          style={[
            styles.currentLocationButton,
            selectedLocation === 'current' && styles.locationSelected,
          ]}
          onPress={handleUseCurrentLocation}
          activeOpacity={0.8}
        >
          <View style={styles.locationIconContainer}>
            <Crosshair size={24} color={Colors.primary} weight="duotone" />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Use Current Location</Text>
            <Text style={styles.locationSubtitle}>Allow access to detect your location</Text>
          </View>
          {selectedLocation === 'current' && (
            <View style={styles.checkIndicator}>
              <Check size={18} color={Colors.textPrimary} weight="bold" />
            </View>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or select a saved location</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Saved Locations */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {SAVED_LOCATIONS.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={[
                styles.locationCard,
                selectedLocation === location.id && styles.locationSelected,
              ]}
              onPress={() => handleSelectLocation(location.id)}
              activeOpacity={0.8}
            >
              <View style={styles.locationIconContainer}>
                <Text style={styles.locationEmoji}>{location.icon}</Text>
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationTitle}>{location.name}</Text>
                <Text style={styles.locationSubtitle} numberOfLines={1}>
                  {location.address}
                </Text>
              </View>
              {selectedLocation === location.id ? (
                <View style={styles.checkIndicator}>
                  <Check size={18} color={Colors.textPrimary} weight="bold" />
                </View>
              ) : (
                <NavigationArrow size={20} color={Colors.textMuted} weight="duotone" />
              )}
            </TouchableOpacity>
          ))}

          {/* Map Placeholder */}
          <View style={styles.mapPlaceholder}>
            <MapPin size={48} color={Colors.primary} weight="duotone" />
            <Text style={styles.mapPlaceholderText}>
              Map integration coming soon
            </Text>
          </View>
        </ScrollView>

        {/* Complete Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.completeButton,
              !selectedLocation && styles.completeButtonDisabled,
            ]}
            onPress={handleComplete}
            disabled={!selectedLocation}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>Start Shopping</Text>
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
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.base,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 52,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.body,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    marginHorizontal: Spacing.base,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: Spacing.md,
  },
  locationSelected: {
    borderColor: Colors.primary,
  },
  locationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(204, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationEmoji: {
    fontSize: 24,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
    marginBottom: 2,
  },
  locationSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
  },
  checkIndicator: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginVertical: Spacing.lg,
    gap: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderDark,
  },
  dividerText: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    gap: Spacing.md,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: Spacing.md,
  },
  mapPlaceholder: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  mapPlaceholderText: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
    marginTop: Spacing.md,
  },
  footer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
  },
  completeButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonDisabled: {
    opacity: 0.5,
  },
  completeButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
  },
});
