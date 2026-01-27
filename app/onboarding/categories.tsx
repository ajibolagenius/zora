import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  CookingPot,
  Leaf,
  Coffee,
  TShirt,
  Palette,
  Sparkle,
  Grain,
  Drop,
  Cookie,
  House,
  Heart,
  BookOpen,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Heights } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { AnimationDuration, AnimationEasing } from '../../constants';
import { onboardingService, Category } from '../../services/onboardingService';
import { useAuthStore } from '../../stores/authStore';

// Icon mapping for categories
const CATEGORY_ICONS: Record<string, any> = {
  'traditional-ingredients': CookingPot,
  'spices-seasonings': Leaf,
  'beverages': Coffee,
  'beauty-skincare': Sparkle,
  'fashion-textiles': TShirt,
  'art-crafts': Palette,
  'grains-cereals': Grain,
  'oils-condiments': Drop,
  'snacks-treats': Cookie,
  'home-living': House,
  'health-wellness': Heart,
  'books-media': BookOpen,
};

// Available colors from Design System
const DESIGN_SYSTEM_COLORS = [
  Colors.primary,        // #CC0000 - Zora Red
  Colors.secondary,      // #FFCC00 - Zora Yellow
  Colors.success,        // #22C55E - Green
  Colors.info,           // #3B82F6 - Blue
  Colors.badgeEcoFriendly, // #14B8A6 - Teal
];

// Shuffle array function for random color assignment
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function CategoriesScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { width } = useWindowDimensions();
  const cardWidth = Math.max(140, (width - Spacing.base * 2 - Spacing.md) / 2);
  
  // Get categories with random colors assigned (computed once on mount)
  const categoriesWithColors = useMemo(() => {
    const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
    return categories.map((category, index) => ({
      ...category,
      icon: CATEGORY_ICONS[category.slug] || CookingPot,
      color: shuffledColors[index % shuffledColors.length],
    }));
  }, [categories]);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Fetch categories from database
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const fetchedCategories = await onboardingService.getCategories();
        setCategories(fetchedCategories);
        
        // Load existing selections from user profile if available
        // Note: We'll need to check preferred_categories field once migration is run
        // For now, we'll start with empty selection
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();

    // Subscribe to real-time updates
    const unsubscribe = onboardingService.subscribeToCategories((updatedCategories) => {
      setCategories(updatedCategories);
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

  const toggleCategory = (categorySlug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categorySlug)
        ? prev.filter((slug) => slug !== categorySlug)
        : [...prev, categorySlug]
    );
  };

  const handleContinue = async () => {
    if (!user || selectedCategories.length === 0) return;

    try {
      setIsSaving(true);
      // Save to database
      await onboardingService.saveCategorySelection(user.user_id, selectedCategories);
      
      router.push('/onboarding/location');
    } catch (error) {
      console.error('Error saving category selection:', error);
      // Still allow navigation even if save fails
      router.push('/onboarding/location');
    } finally {
      setIsSaving(false);
    }
  };

  // Format category name for display (handle line breaks)
  const formatCategoryName = (name: string): string => {
    // If name contains newline, return as is, otherwise add line break before "&"
    if (name.includes('\n')) return name;
    return name.replace(' & ', ' &\n');
  };

  return (
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.progressText}>Step 2 of 3</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '66%' }]} />
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
          <Text style={styles.title}>What Are You{'\n'}Looking For?</Text>
          <Text style={styles.subtitle}>
            Select the categories that interest you most to personalize your feed.
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Categories Grid */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.grid}>
              {categoriesWithColors.map((category) => {
                const isSelected = selectedCategories.includes(category.slug);
                const IconComponent = category.icon;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryCard,
                      { width: cardWidth, height: cardWidth * 0.9 },
                      isSelected && styles.categoryCardSelected,
                    ]}
                    onPress={() => toggleCategory(category.slug)}
                    activeOpacity={0.8}
                  >
                    {/* Selection Indicator */}
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Check size={12} color={Colors.textPrimary} weight="bold" />
                      </View>
                    )}
                    
                    {/* Icon with random color from design system */}
                    <IconComponent
                      size={28}
                      color={category.color}
                      weight="duotone"
                    />
                    
                    {/* Name */}
                    <Text style={styles.categoryName}>{formatCategoryName(category.name)}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )}
      </Animated.View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (selectedCategories.length === 0 || isSaving || isLoading) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedCategories.length === 0 || isSaving || isLoading}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <>
              <ActivityIndicator size="small" color={Colors.textPrimary} />
              <Text style={styles.continueButtonText}>Saving...</Text>
            </>
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
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
    justifyContent: 'space-between',
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
  divider: {
    height: 1,
    backgroundColor: Colors.white08,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    position: 'relative',
    gap: Spacing.sm,
  },
  categoryCardSelected: {
    borderColor: Colors.primary,
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textPrimary,
    fontSize: FontSize.caption,
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    height: Heights.button,
    justifyContent: 'center',
    alignItems: 'center',
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
