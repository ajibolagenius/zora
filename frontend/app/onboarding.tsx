import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontWeight } from '../constants/typography';
import { Button } from '../components/ui';
import { useAuthStore } from '../stores/authStore';

const REGIONS = [
  { id: 'west-africa', name: 'West Africa', image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=200' },
  { id: 'east-africa', name: 'East Africa', image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=200' },
  { id: 'north-africa', name: 'North Africa', image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=200' },
  { id: 'south-africa', name: 'South Africa', image: 'https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=200' },
  { id: 'central-africa', name: 'Central Africa', image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=200' },
  { id: 'caribbean', name: 'Caribbean', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateProfile, setOnboardingComplete, user } = useAuthStore();
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const toggleRegion = (regionId: string) => {
    setSelectedRegions((prev) =>
      prev.includes(regionId)
        ? prev.filter((id) => id !== regionId)
        : [...prev, regionId]
    );
  };

  const handleContinue = async () => {
    if (step === 1) {
      setStep(2);
    } else {
      try {
        // Save cultural interests
        if (selectedRegions.length > 0) {
          await updateProfile({ cultural_interests: selectedRegions });
        }
        setOnboardingComplete(true);
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Error saving preferences:', error);
        setOnboardingComplete(true);
        router.replace('/(tabs)');
      }
    }
  };

  const handleSkip = () => {
    setOnboardingComplete(true);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressDots}>
          <View style={[styles.dot, step >= 1 && styles.dotActive]} />
          <View style={[styles.dot, step >= 2 && styles.dotActive]} />
        </View>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {step === 1 ? (
        // Step 1: Region Selection
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>What's your heritage?</Text>
          <Text style={styles.subtitle}>
            Select the regions you're most interested in. This helps us personalize your experience.
          </Text>

          <View style={styles.regionsGrid}>
            {REGIONS.map((region) => (
              <TouchableOpacity
                key={region.id}
                style={[
                  styles.regionCard,
                  selectedRegions.includes(region.id) && styles.regionCardSelected,
                ]}
                onPress={() => toggleRegion(region.id)}
              >
                <Image source={{ uri: region.image }} style={styles.regionImage} />
                <View style={styles.regionOverlay}>
                  <Text style={styles.regionName}>{region.name}</Text>
                </View>
                {selectedRegions.includes(region.id) && (
                  <View style={styles.checkmark}>
                    <MaterialCommunityIcons name="check" size={16} color={Colors.textPrimary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        // Step 2: Welcome
        <View style={styles.welcomeContent}>
          <View style={styles.welcomeImageContainer}>
            <MaterialCommunityIcons name="basket" size={80} color={Colors.primary} />
          </View>
          <Text style={styles.welcomeTitle}>Direct from Local Vendors</Text>
          <Text style={styles.welcomeSubtitle}>
            Discover authentic African groceries, spices, and products from trusted vendors in your area.
          </Text>
          <View style={styles.features}>
            <View style={styles.featureRow}>
              <MaterialCommunityIcons name="check-circle" size={24} color={Colors.success} />
              <Text style={styles.featureText}>Authentic products from verified vendors</Text>
            </View>
            <View style={styles.featureRow}>
              <MaterialCommunityIcons name="check-circle" size={24} color={Colors.success} />
              <Text style={styles.featureText}>Fast delivery across the UK</Text>
            </View>
            <View style={styles.featureRow}>
              <MaterialCommunityIcons name="check-circle" size={24} color={Colors.success} />
              <Text style={styles.featureText}>Support local African businesses</Text>
            </View>
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title={step === 1 ? 'Continue' : 'Get Started'}
          fullWidth
          onPress={handleContinue}
        />
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
  progressDots: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.cardDark,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  skipText: {
    color: Colors.textMuted,
    fontSize: FontSize.body,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.base,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.body,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  regionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  regionCard: {
    width: '47%',
    height: 120,
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
    backgroundColor: Colors.cardDark,
  },
  regionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  regionName: {
    color: Colors.textPrimary,
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContent: {
    flex: 1,
    paddingHorizontal: Spacing.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeImageContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  welcomeTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  welcomeSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.body,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  features: {
    width: '100%',
    gap: Spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureText: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
  },
  footer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
  },
});
