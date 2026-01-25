import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
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
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#f90606';
const ZORA_CARD = '#342418';
const SURFACE_DARK = '#3a2727';
const BACKGROUND_DARK = '#230f0f';
const MUTED_TEXT = '#bb9b9b';

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
              placeholderTextColor={`${MUTED_TEXT}99`}
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
              <Camera size={28} color={ZORA_RED} weight="regular" />
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
    backgroundColor: BACKGROUND_DARK,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: `${BACKGROUND_DARK}F2`,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerRight: {
    width: 40,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: 8,
    gap: 24,
  },

  // Accordion
  accordionContainer: {
    backgroundColor: SURFACE_DARK,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  accordionHeaderContent: {
    gap: 2,
  },
  accordionTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  accordionSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: MUTED_TEXT,
  },
  accordionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  accordionDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  accordionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  accordionItemImage: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#444',
  },
  accordionItemInfo: {
    gap: 2,
  },
  accordionItemName: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  accordionItemQty: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },

  // Sections
  section: {
    gap: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  photoLimit: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },

  // Text Area
  textAreaContainer: {
    position: 'relative',
  },
  textArea: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    padding: 16,
    minHeight: 160,
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  charCount: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: `${MUTED_TEXT}99`,
  },

  // Image Grid
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  addPhotoButton: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addPhotoText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ZORA_RED,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Options
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2A1D1D',
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: ZORA_RED,
    backgroundColor: SURFACE_DARK,
  },
  optionContent: {
    flex: 1,
    paddingRight: 16,
  },
  optionTitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  optionTitleSelected: {
    color: Colors.textPrimary,
  },
  optionDescription: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: MUTED_TEXT,
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: ZORA_RED,
    backgroundColor: ZORA_RED,
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
    paddingBottom: 32,
    backgroundColor: `${BACKGROUND_DARK}F2`,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  submitButton: {
    backgroundColor: ZORA_RED,
    height: 52,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
});
