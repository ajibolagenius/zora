import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, Check } from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Heights } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';

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
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.replace('/(auth)/login')}
          activeOpacity={0.8}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
      </View>

      <Animated.View 
        style={[
          styles.contentContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Discover Your{'\n'}Heritage</Text>
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
                      <Check size={16} color={Colors.textPrimary} weight="bold" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

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
          <Text style={styles.continueButtonText}>Start Shopping</Text>
          <ArrowRight size={20} color={Colors.textPrimary} weight="bold" />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    gap: Spacing.md,
  },
  regionCard: {
    height: 88,
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
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  regionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
  },
  regionName: {
    fontFamily: FontFamily.displayMedium,
    color: Colors.textPrimary,
    fontSize: FontSize.h4,
  },
  regionCountries: {
    fontFamily: FontFamily.body,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize.small,
    marginTop: 2,
  },
  selectionIndicator: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'transparent',
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
    height: Heights.button,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontFamily: FontFamily.bodyBold,
    color: Colors.textPrimary,
    fontSize: FontSize.body,
  },
});
