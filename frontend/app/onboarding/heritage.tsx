import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

const { width } = Dimensions.get('window');

const REGIONS = [
  {
    id: 'west-africa',
    name: 'West Africa',
    countries: 'Nigeria, Ghana, Senegal, Mali...',
    image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=600',
  },
  {
    id: 'east-africa',
    name: 'East Africa',
    countries: 'Kenya, Ethiopia, Tanzania, Uganda...',
    image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=600',
  },
  {
    id: 'southern-africa',
    name: 'Southern Africa',
    countries: 'South Africa, Zimbabwe, Botswana...',
    image: 'https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=600',
  },
  {
    id: 'central-africa',
    name: 'Central Africa',
    countries: 'Congo, Cameroon, Gabon...',
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600',
  },
  {
    id: 'north-africa',
    name: 'North Africa',
    countries: 'Morocco, Egypt, Tunisia, Algeria...',
    image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=600',
  },
];

export default function HeritageScreen() {
  const router = useRouter();
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const toggleRegion = (regionId: string) => {
    setSelectedRegions((prev) =>
      prev.includes(regionId)
        ? prev.filter((id) => id !== regionId)
        : [...prev, regionId]
    );
  };

  const handleContinue = () => {
    router.push('/onboarding/categories');
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
            <View style={[styles.progressFill, { width: '33%' }]} />
          </View>
          <Text style={styles.progressText}>Step 1 of 3</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Discover Your Heritage</Text>
        <Text style={styles.subtitle}>
          Select the regions you connect with to personalize your market experience.
        </Text>
      </View>

      {/* Regions List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {REGIONS.map((region) => {
          const isSelected = selectedRegions.includes(region.id);
          return (
            <TouchableOpacity
              key={region.id}
              style={[
                styles.regionCard,
                isSelected && styles.regionCardSelected,
              ]}
              onPress={() => toggleRegion(region.id)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: region.image }}
                style={styles.regionImage}
                resizeMode="cover"
              />
              <View style={styles.regionOverlay} />
              <View style={styles.regionContent}>
                <View>
                  <Text style={styles.regionName}>{region.name}</Text>
                  <Text style={styles.regionCountries}>{region.countries}</Text>
                </View>
                <View style={[
                  styles.selectionIndicator,
                  isSelected && styles.selectionIndicatorSelected,
                ]}>
                  {isSelected && (
                    <MaterialCommunityIcons name="check" size={18} color={Colors.textPrimary} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedRegions.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedRegions.length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    gap: Spacing.md,
  },
  regionCard: {
    height: 100,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  regionCardSelected: {
    borderColor: Colors.primary,
  },
  regionImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  regionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  regionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
  },
  regionName: {
    color: Colors.textPrimary,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
  },
  regionCountries: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
    marginTop: 2,
  },
  selectionIndicator: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionIndicatorSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
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
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
  },
});
