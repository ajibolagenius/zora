import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  CaretDown,
  Camera,
  X,
} from 'phosphor-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, Heights } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';

interface ResolutionOption {
  id: string;
  title: string;
  description: string;
}

const RESOLUTION_OPTIONS: ResolutionOption[] = [
  {
    id: 'refund',
    title: 'Full Refund',
    description: 'Refund to original payment method',
  },
  {
    id: 'partial',
    title: 'Partial Refund',
    description: 'Keep item with a discount',
  },
  {
    id: 'replacement',
    title: 'Replacement',
    description: 'Send new items immediately',
  },
  {
    id: 'credit',
    title: 'Store Credit',
    description: 'Instant credit to your wallet',
  },
];

const MAX_CHARS = 1000;
const MAX_PHOTOS = 5;

// Mock selected items from previous screen
const SELECTED_ITEMS = [
  { id: '1', name: 'Jollof Rice Kit', quantity: 1, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200' },
  { id: '2', name: 'Suya Spice Blend', quantity: 1, image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=200' },
];

export default function DisputeDetailsScreen() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [selectedResolution, setSelectedResolution] = useState('refund');
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200',
    'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=200',
  ]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

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

  const handlePickImage = async () => {
    if (uploadedImages.length >= MAX_PHOTOS) {
      Alert.alert('Limit Reached', `You can only upload up to ${MAX_PHOTOS} photos.`);
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setUploadedImages([...uploadedImages, result.assets[0].uri]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log('Submitting dispute:', {
      description,
      selectedResolution,
      uploadedImages,
    });
    router.push('/dispute-status');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Describe the Issue</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Accordion */}
        <TouchableOpacity
          style={styles.accordionContainer}
          onPress={() => setIsAccordionOpen(!isAccordionOpen)}
          activeOpacity={0.8}
        >
          <View style={styles.accordionHeader}>
            <View style={styles.accordionHeaderContent}>
              <Text style={styles.accordionTitle}>Order #10293</Text>
              <Text style={styles.accordionSubtitle}>{SELECTED_ITEMS.length} Items Selected</Text>
            </View>
            <CaretDown
              size={24}
              color={Colors.textPrimary}
              weight="regular"
              style={isAccordionOpen ? { transform: [{ rotate: '180deg' }] } : {}}
            />
          </View>
          
          {isAccordionOpen && (
            <View style={styles.accordionContent}>
              <View style={styles.accordionDivider} />
              {SELECTED_ITEMS.map((item) => (
                <View key={item.id} style={styles.accordionItem}>
                  <Image source={{ uri: item.image }} style={styles.accordionItemImage} />
                  <View style={styles.accordionItemInfo}>
                    <Text style={styles.accordionItemName}>{item.name}</Text>
                    <Text style={styles.accordionItemQty}>Qty: {item.quantity}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>What went wrong?</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Please describe the issue in detail so we can help resolve it quickly..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={6}
              value={description}
              onChangeText={(text) => setDescription(text.slice(0, MAX_CHARS))}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{description.length}/{MAX_CHARS}</Text>
          </View>
        </View>

        {/* Photo Upload */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Upload Photos (Optional)</Text>
            <Text style={styles.photoLimit}>Max {MAX_PHOTOS} photos</Text>
          </View>
          <View style={styles.imageGrid}>
            {/* Add Photo Button */}
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={handlePickImage}
              activeOpacity={0.8}
            >
              <Camera size={28} color={Colors.primary} weight="duotone" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>

            {/* Uploaded Images */}
            {uploadedImages.map((uri, index) => (
              <View key={index} style={styles.uploadedImageContainer}>
                <Image source={{ uri }} style={styles.uploadedImage} />
                <View style={styles.imageOverlay} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <X size={14} color={Colors.textPrimary} weight="bold" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Preferred Resolution */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Preferred Resolution</Text>
          <View style={styles.optionsContainer}>
            {RESOLUTION_OPTIONS.map((option) => {
              const isSelected = selectedResolution === option.id;

              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  onPress={() => setSelectedResolution(option.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionTitle,
                        isSelected && styles.optionTitleSelected,
                      ]}
                    >
                      {option.title}
                    </Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bottom padding for button */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.9}
        >
          <Text style={styles.submitButtonText}>Submit Dispute</Text>
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundDark,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: Colors.black30,
  },
  headerTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
  },
  headerRight: {
    width: 44,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    gap: Spacing.lg,
  },

  // Accordion
  accordionContainer: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
  },
  accordionHeaderContent: {
    gap: Spacing.xs,
  },
  accordionTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  accordionSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  accordionContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
  accordionDivider: {
    height: 1,
    backgroundColor: Colors.white08,
    marginBottom: Spacing.md,
  },
  accordionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  accordionItemImage: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundDark,
  },
  accordionItemInfo: {
    gap: Spacing.xs,
  },
  accordionItemName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  accordionItemQty: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },

  // Sections
  section: {
    gap: Spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  photoLimit: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },

  // Text Area
  textAreaContainer: {
    position: 'relative',
  },
  textArea: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    minHeight: 140,
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  charCount: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.base,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },

  // Image Grid
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  addPhotoButton: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.borderOutline,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.white03,
  },
  addPhotoText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  uploadedImageContainer: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.black30 + '50', // ~15% opacity
  },
  removeImageButton: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Options
  optionsContainer: {
    gap: Spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary10,
  },
  optionContent: {
    flex: 1,
    paddingRight: Spacing.base,
  },
  optionTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  optionTitleSelected: {
    color: Colors.textPrimary,
  },
  optionDescription: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.white20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textPrimary,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.backgroundDark,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    height: Heights.button,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonText: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
});
