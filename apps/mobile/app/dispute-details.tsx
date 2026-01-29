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
    Keyboard,
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
import { Spacing, BorderRadius, Heights, Shadows } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { ResolutionOptions, ValidationLimits, CommonImages, Placeholders, AnimationDuration, AnimationEasing } from '../constants';
import { orderService, disputeService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { safeGoBack } from '../lib/navigationHelpers';
import { useToast } from '../components/ui/ToastProvider';

// Mock selected items from previous screen
const SELECTED_ITEMS = [
    { id: '1', name: 'Jollof Rice Kit', quantity: 1, image: CommonImages.jollofRice },
    { id: '2', name: 'Suya Spice Blend', quantity: 1, image: CommonImages.suyaSpice },
];

export default function DisputeDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ orderId?: string; issueType?: string; selectedItems?: string }>();
    const { user } = useAuthStore();
    const showToast = useToast();
    const [description, setDescription] = useState('');
    const [selectedResolution, setSelectedResolution] = useState('refund');
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

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

    const handlePickImage = async () => {
        if (uploadedImages.length >= ValidationLimits.maxPhotos) {
            Alert.alert('Limit Reached', `You can only upload up to ${ValidationLimits.maxPhotos} photos.`);
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

    const handleSubmit = async () => {
        if (!description.trim() || !params.orderId || !params.issueType) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        if (!user?.user_id) {
            showToast('Please log in to submit a dispute', 'error');
            return;
        }

        setSubmitting(true);

        try {
            if (isSupabaseConfigured() && user?.user_id) {
                const dispute = await disputeService.create({
                    order_id: params.orderId,
                    user_id: user.user_id,
                    issue_type: params.issueType as any,
                    affected_items: params.selectedItems?.split(',') || [],
                    description: description.trim(),
                    preferred_resolution: selectedResolution as any,
                    evidence_images: uploadedImages,
                    status: 'pending',
                });

                if (dispute) {
                    showToast('Dispute submitted successfully', 'success');
                    router.push({
                        pathname: '/dispute-status',
                        params: {
                            orderId: params.orderId,
                            disputeId: dispute.id,
                        },
                    });
                } else {
                    showToast('Failed to submit dispute. Please try again.', 'error');
                    setSubmitting(false);
                }
            } else {
                // Fallback for non-Supabase mode
                router.push({
                    pathname: '/dispute-status',
                    params: {
                        orderId: params.orderId,
                        disputeId: `DISPUTE-${Date.now()}`,
                    },
                });
            }
        } catch (error) {
            console.error('Error submitting dispute:', error);
            showToast('An error occurred. Please try again.', 'error');
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => safeGoBack(router, '/(tabs)/orders')}
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
              placeholder={Placeholders.form.disputeDescription}
              placeholderTextColor={Colors.textMuted}
                            multiline
                            numberOfLines={6}
                            value={description}
                            onChangeText={(text) => setDescription(text.slice(0, ValidationLimits.maxDescriptionLength))}
                            textAlignVertical="top"
                            onBlur={() => Keyboard.dismiss()}
                        />
                        <Text style={styles.charCount}>{description.length}/{ValidationLimits.maxDescriptionLength}</Text>
                    </View>
                </View>

                {/* Photo Upload */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionLabel}>Upload Photos (Optional)</Text>
                        <Text style={styles.photoLimit}>Max {ValidationLimits.maxPhotos} photos</Text>
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
                        {ResolutionOptions.map((option) => {
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
                    style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    activeOpacity={0.9}
                    disabled={submitting || !description.trim()}
                >
                    <Text style={styles.submitButtonText}>
                        {submitting ? 'Submitting...' : 'Submit Dispute'}
                    </Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.15)', // 15% opacity
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
        ...Shadows.glowPrimary,
    },
    submitButtonText: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
});
