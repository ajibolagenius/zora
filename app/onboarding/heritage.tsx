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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, Check } from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Heights } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { AnimationDuration, AnimationEasing, CommonImages } from '../../constants';
import { onboardingService, Region } from '../../services/onboardingService';
import { useAuthStore } from '../../stores/authStore';

const { width } = Dimensions.get('window');

export default function HeritageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const { user, updateProfile } = useAuthStore();
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
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
  const gapHeight = Spacing.md * (regions.length || 5 - 1); // Total gap between cards
  const cardHeight = Math.max((availableHeight - gapHeight) / (regions.length || 5), 80); // Minimum 80px

  // Fetch regions from database
  useEffect(() => {
    const loadRegions = async () => {
      try {
        setIsLoading(true);
        const fetchedRegions = await onboardingService.getRegions();
        setRegions(fetchedRegions);
        
        // Load existing selections from user profile if available
        if (user?.cultural_interests && user.cultural_interests.length > 0) {
          setSelectedRegions(user.cultural_interests);
        }
      } catch (error) {
        console.error('Error loading regions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRegions();

    // Subscribe to real-time updates
    const unsubscribe = onboardingService.subscribeToRegions((updatedRegions) => {
      setRegions(updatedRegions);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (!isLoading) {
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
    }
  }, [isLoading]);

  const toggleRegion = (regionSlug: string) => {
    setSelectedRegions((prev) =>
      prev.includes(regionSlug)
        ? prev.filter((slug) => slug !== regionSlug)
        : [...prev, regionSlug]
    );
  };

  const handleContinue = async () => {
    if (!user || selectedRegions.length === 0) return;

    try {
      setIsSaving(true);
      // Save to database
      await onboardingService.saveHeritageSelection(user.user_id, selectedRegions);
      
      // Update local state
      await updateProfile({ cultural_interests: selectedRegions });
      
      router.push('/onboarding/categories');
    } catch (error) {
      console.error('Error saving heritage selection:', error);
      // Still allow navigation even if save fails
      router.push('/onboarding/categories');
    } finally {
      setIsSaving(false);
    }
  };

  // Get image URL for region (use image_url from DB or fallback to CommonImages)
  const getRegionImage = (region: Region): string => {
    if (region.image_url) return region.image_url;
    
    // Fallback to CommonImages based on slug
    const imageMap: Record<string, string> = {
      'west-africa': CommonImages.westAfrica,
      'east-africa': CommonImages.eastAfrica,
      'southern-africa': CommonImages.southernAfrica,
      'central-africa': CommonImages.centralAfrica,
      'north-africa': CommonImages.northAfrica,
    };
    
    return imageMap[region.slug] || CommonImages.westAfrica;
  };

  // Get description for region
  const getRegionDescription = (region: Region): string => {
    if (region.description) return region.description;
    
    // Fallback descriptions
    const descMap: Record<string, string> = {
      'west-africa': 'Nigeria, Ghana, Senegal, Mali...',
      'east-africa': 'Kenya, Ethiopia, Tanzania, Uganda...',
      'southern-africa': 'South Africa, Zimbabwe, Botswana...',
      'central-africa': 'Congo, Cameroon, Gabon...',
      'north-africa': 'Morocco, Egypt, Tunisia, Algeria...',
    };
    
    return descMap[region.slug] || region.name;
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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading regions...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {regions.map((region) => {
              const isSelected = selectedRegions.includes(region.slug);
              return (
                <TouchableOpacity
                  key={region.id}
                  style={[
                    styles.regionCard,
                    { height: Math.max(cardHeight, 80) }, // Minimum 80px height
                    isSelected && styles.regionCardSelected,
                  ]}
                  onPress={() => toggleRegion(region.slug)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: getRegionImage(region) }}
                    style={styles.regionImage}
                    resizeMode="cover"
                  />
                  <View style={styles.regionOverlay} />
                  <View style={styles.regionContent}>
                    <View>
                      <Text style={styles.regionName}>{region.name}</Text>
                      <Text style={styles.regionCountries}>{getRegionDescription(region)}</Text>
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
        )}
      </Animated.View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (selectedRegions.length === 0 || isSaving || isLoading) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedRegions.length === 0 || isSaving || isLoading}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <>
              <ActivityIndicator size="small" color={Colors.textPrimary} />
              <Text style={styles.continueButtonText}>Saving...</Text>
            </>
          ) : (
            <>
              <Text style={styles.continueButtonText}>Start Shopping</Text>
              <ArrowRight size={20} color={Colors.textPrimary} weight="bold" />
            </>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    fontFamily: FontFamily.body,
    color: Colors.textMuted,
    fontSize: FontSize.small,
    marginTop: Spacing.md,
  },
});
