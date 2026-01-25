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
  Info,
  Camera,
  X,
  CurrencyCircleDollar,
  ArrowsClockwise,
  Wallet,
  CheckCircle,
} from 'phosphor-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#CC0000';
const ZORA_CARD = '#342418';
const SURFACE_DARK = '#231515';
const BACKGROUND_DARK = '#181010';
const MUTED_TEXT = '#bc9a9a';

interface ResolutionOption {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

const RESOLUTION_OPTIONS: ResolutionOption[] = [
  {
    id: 'refund',
    icon: CurrencyCircleDollar,
    title: 'Refund to Original Payment',
    description: 'Receive £12.50 back to your card',
  },
  {
    id: 'replacement',
    icon: ArrowsClockwise,
    title: 'Send Replacement',
    description: 'Ship the same items again at no cost',
  },
  {
    id: 'credit',
    icon: Wallet,
    title: 'Zora Store Credit',
    description: 'Instant credit applied to your wallet',
  },
];

const MAX_CHARS = 500;

export default function DisputeDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [description, setDescription] = useState('');
  const [selectedResolution, setSelectedResolution] = useState('refund');
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200',
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200',
  ]);

  const handlePickImage = async () => {
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
    // Submit dispute logic
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
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Describe the Issue</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressSegment, styles.progressSegmentFilled]} />
            <View style={[styles.progressSegment, styles.progressSegmentFilled]} />
          </View>
          <Text style={styles.progressText}>Step 2 of 2</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Item Summary Card */}
        <View style={styles.itemCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200' }}
            style={styles.itemImage}
          />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>Jollof Rice Spice Mix - 200g</Text>
            <Text style={styles.itemQuantity}>Quantity: 2 items</Text>
          </View>
          <TouchableOpacity style={styles.infoButton}>
            <Info size={20} color={MUTED_TEXT} weight="regular" />
          </TouchableOpacity>
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>What went wrong?</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the problem in detail. For example: 'The package was opened when delivered, and some items were missing.' The more details you provide, the faster we can help."
              placeholderTextColor="rgba(188, 154, 154, 0.6)"
              multiline
              numberOfLines={6}
              value={description}
              onChangeText={(text) => setDescription(text.slice(0, MAX_CHARS))}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{description.length}/{MAX_CHARS}</Text>
          </View>
        </View>

        {/* Evidence Upload */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Upload Evidence</Text>
            <Text style={styles.optionalBadge}>Optional</Text>
          </View>
          <View style={styles.imageGrid}>
            {/* Add Photo Button */}
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={handlePickImage}
              activeOpacity={0.8}
            >
              <Camera size={24} color={MUTED_TEXT} weight="regular" />
              <Text style={styles.addPhotoText}>Add</Text>
            </TouchableOpacity>

            {/* Uploaded Images */}
            {uploadedImages.map((uri, index) => (
              <View key={index} style={styles.uploadedImageContainer}>
                <Image source={{ uri }} style={styles.uploadedImage} />
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

        {/* Desired Outcome */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Desired Outcome</Text>
          <View style={styles.optionsContainer}>
            {RESOLUTION_OPTIONS.map((option) => {
              const IconComponent = option.icon;
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
                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </View>
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
    backgroundColor: 'rgba(24, 16, 16, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerRight: {
    width: 44,
  },

  // Progress Bar
  progressContainer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
  },
  progressSegmentFilled: {
    backgroundColor: ZORA_RED,
  },
  progressText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: MUTED_TEXT,
    textAlign: 'center',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: 16,
    gap: 24,
  },

  // Item Card
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#44403C',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  itemQuantity: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: MUTED_TEXT,
  },
  infoButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Sections
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  optionalBadge: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    color: MUTED_TEXT,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },

  // Text Area
  textAreaContainer: {
    position: 'relative',
  },
  textArea: {
    backgroundColor: SURFACE_DARK,
    borderRadius: BorderRadius.xl,
    padding: 16,
    minHeight: 140,
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  charCount: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    color: MUTED_TEXT,
  },

  // Image Grid
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  addPhotoButton: {
    width: 100,
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addPhotoText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    color: MUTED_TEXT,
  },
  uploadedImageContainer: {
    width: 100,
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Options
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: SURFACE_DARK,
    borderRadius: BorderRadius.xl,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: ZORA_RED,
    backgroundColor: 'rgba(204, 0, 0, 0.05)',
  },
  radioContainer: {
    paddingTop: 2,
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
  optionContent: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  optionTitleSelected: {
    color: Colors.textPrimary,
  },
  optionDescription: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: MUTED_TEXT,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.base,
    paddingBottom: 32,
    backgroundColor: 'rgba(24, 16, 16, 0.95)',
  },
  submitButton: {
    backgroundColor: ZORA_RED,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
  },
});
