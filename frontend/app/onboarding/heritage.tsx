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
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, Check } from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Heights } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { AnimationDuration, AnimationEasing, CommonImages } from '../../constants';

const { width } = Dimensions.get('window');

const REGIONS = [
  {
    id: 'west-africa',
    name: 'West Africa',
    countries: 'Nigeria, Ghana, Senegal, Mali...',
    image: CommonImages.westAfrica,
  },
  {
    id: 'east-africa',
    name: 'East Africa',
    countries: 'Kenya, Ethiopia, Tanzania, Uganda...',
    image: CommonImages.eastAfrica,
  },
  {
    id: 'southern-africa',
    name: 'Southern Africa',
    countries: 'South Africa, Zimbabwe, Botswana...',
    image: CommonImages.southernAfrica,
  },
  {
    id: 'central-africa',
    name: 'Central Africa',
    countries: 'Congo, Cameroon, Gabon...',
    image: CommonImages.centralAfrica,
  },
  {
    id: 'north-africa',
    name: 'North Africa',
    countries: 'Morocco, Egypt, Tunisia, Algeria...',
    image: CommonImages.northAfrica,
  },
];

export default function HeritageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // Calculate available height for cards
  // Screen height - safe area top - header - title section - footer - padding
  const headerHeight = 44 + insets.top + (Spacing.sm * 2); // back button + padding
  const titleHeight = 120; // Approximate title section height (title + subtitle + margin)
  const footerHeight = Heights.button + (Spacing.lg * 2) + insets.bottom; // button + padding + safe area bottom
  const scrollPadding = Spacing.base * 2; // top and bottom padding in scroll content
  const availableHeight = screenHeight - headerHeight - titleHeight - footerHeight - scrollPadding;
  const gapHeight = Spacing.md * (REGIONS.length - 1); // Total gap between cards
  const cardHeight = Math.max((availableHeight - gapHeight) / REGIONS.length, 80); // Minimum 80px

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
                  { height: Math.max(cardHeight, 80) }, // Minimum 80px height
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
    backgroundColor: Colors.black40,
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
    flexGrow: 1,
  },
  regionCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 80,
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
    backgroundColor: Colors.black35,
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
    color: Colors.textMuted,
    fontSize: FontSize.small,
    marginTop: 2,
  },
  selectionIndicator: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)', // 40% opacity
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
