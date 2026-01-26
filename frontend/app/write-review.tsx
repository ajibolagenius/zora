import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Info } from 'phosphor-react-native';
import { useProduct, useCreateReview } from '../hooks/useQueries';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, Heights } from '../constants/spacing';
import { FontSize, FontFamily, LetterSpacing } from '../constants/typography';

export default function WriteReviewScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { productId, vendorId, productName } = useLocalSearchParams<{
        productId?: string;
        vendorId?: string;
        productName?: string;
    }>();

    // Form state
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [userName, setUserName] = useState('');

    // Get product details if available
    const { data: product } = useProduct(productId || '');

    // Review mutation
    const createReview = useCreateReview();

    // Character count
    const maxCommentLength = 500;
    const remainingChars = maxCommentLength - comment.length;

    // Validation
    const isValid = rating > 0 && title.trim().length >= 3 && comment.trim().length >= 10 && userName.trim().length >= 2;

    // Submit review
    const handleSubmit = async () => {
        if (!isValid) {
            Alert.alert('Incomplete Review', 'Please fill in all required fields.');
            return;
        }

        try {
            await createReview.mutateAsync({
                productId: productId || undefined,
                vendorId: vendorId || undefined,
                rating,
                title: title.trim(),
                comment: comment.trim(),
                userName: userName.trim(),
            });

            Alert.alert(
                'Review Submitted!',
                'Thank you for sharing your feedback.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to submit review. Please try again.');
        }
    };

    // Rating labels
    const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    {/* Header */}
                    <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                            activeOpacity={0.8}
                        >
                            <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>
                            Write a Review
                        </Text>
                        <View style={styles.headerRight} />
                    </View>

                    <ScrollView 
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Product Info (if available) */}
                        {(product || productName) && (
                            <View style={styles.productCard}>
                                {product?.image_urls?.[0] && (
                                    <Image
                                        source={{ uri: product.image_urls[0] }}
                                        style={styles.productImage}
                                        resizeMode="cover"
                                    />
                                )}
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName} numberOfLines={2}>
                                        {product?.name || productName || 'Product'}
                                    </Text>
                                    {product?.category && (
                                        <Text style={styles.productCategory}>{product.category}</Text>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Rating Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Your Rating <Text style={styles.required}>*</Text>
                            </Text>
                            <View style={styles.ratingContainer}>
                                <View style={styles.starsContainer}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <TouchableOpacity
                                            key={star}
                                            onPress={() => setRating(star)}
                                            activeOpacity={0.7}
                                            style={styles.starButton}
                                        >
                                            <Star
                                                size={44}
                                                color={star <= rating ? Colors.secondary : '#3D3D3D'}
                                                weight={star <= rating ? 'fill' : 'regular'}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                {rating > 0 && (
                                    <Text style={styles.ratingLabel}>
                                        {ratingLabels[rating]}
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* Your Name */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Your Name <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your name"
                                placeholderTextColor={Colors.textMuted}
                                value={userName}
                                onChangeText={setUserName}
                                maxLength={50}
                            />
                        </View>

                        {/* Review Title */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Review Title <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Summarize your experience"
                                placeholderTextColor={Colors.textMuted}
                                value={title}
                                onChangeText={setTitle}
                                maxLength={100}
                            />
                        </View>

                        {/* Review Comment */}
                        <View style={styles.section}>
                            <View style={styles.commentHeader}>
                                <Text style={styles.sectionTitle}>
                                    Your Review <Text style={styles.required}>*</Text>
                                </Text>
                                <Text style={[
                                    styles.charCount,
                                    remainingChars < 50 && styles.charCountWarning
                                ]}>
                                    {remainingChars} left
                                </Text>
                            </View>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Share details of your experience..."
                                placeholderTextColor={Colors.textMuted}
                                value={comment}
                                onChangeText={setComment}
                                multiline
                                numberOfLines={5}
                                maxLength={maxCommentLength}
                                textAlignVertical="top"
                            />
                        </View>

                        {/* Guidelines */}
                        <View style={styles.guidelinesCard}>
                            <View style={styles.guidelinesHeader}>
                                <Info size={20} color={Colors.info} weight="duotone" />
                                <Text style={styles.guidelinesTitle}>Review Guidelines</Text>
                            </View>
                            <View style={styles.guidelinesList}>
                                <Text style={styles.guidelineItem}>• Be honest and specific</Text>
                                <Text style={styles.guidelineItem}>• Focus on product quality and experience</Text>
                                <Text style={styles.guidelineItem}>• Avoid personal information</Text>
                                <Text style={styles.guidelineItem}>• Keep it respectful and constructive</Text>
                            </View>
                        </View>

                        <View style={{ height: 120 }} />
                    </ScrollView>

                    {/* Submit Button */}
                    <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.base }]}>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={!isValid || createReview.isPending}
                            style={[
                                styles.submitButton,
                                (!isValid || createReview.isPending) && styles.submitButtonDisabled
                            ]}
                            activeOpacity={0.8}
                        >
                            {createReview.isPending ? (
                                <ActivityIndicator size="small" color={Colors.textPrimary} />
                            ) : (
                                <Text style={[
                                    styles.submitButtonText,
                                    (!isValid || createReview.isPending) && styles.submitButtonTextDisabled
                                ]}>
                                    Submit Review
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundDark,
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.base,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderDark,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.cardDark,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.borderDark,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h3,
        color: Colors.textPrimary,
        marginRight: 44, // Balance the back button
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
        paddingTop: Spacing.lg,
    },

    // Product Card
    productCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.lg,
        padding: Spacing.base,
        marginBottom: Spacing.xl,
        borderWidth: 1,
        borderColor: Colors.borderDark,
    },
    productImage: {
        width: 64,
        height: 64,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.backgroundDark,
    },
    productInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    productName: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    productCategory: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },

    // Sections
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    required: {
        color: Colors.primary,
    },

    // Rating Section
    ratingContainer: {
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.borderDark,
        alignItems: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    starButton: {
        padding: Spacing.xs,
    },
    ratingLabel: {
        fontFamily: FontFamily.bodyMedium,
        fontSize: FontSize.body,
        color: Colors.secondary,
        marginTop: Spacing.xs,
    },

    // Inputs
    input: {
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        fontFamily: FontFamily.body,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
        borderWidth: 1,
        borderColor: Colors.borderDark,
    },
    textArea: {
        minHeight: 120,
        paddingTop: Spacing.md,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    charCount: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
    charCountWarning: {
        color: Colors.primary,
    },

    // Guidelines
    guidelinesCard: {
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.lg,
        padding: Spacing.base,
        marginTop: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.borderDark,
    },
    guidelinesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    guidelinesTitle: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
    },
    guidelinesList: {
        gap: Spacing.xs,
    },
    guidelineItem: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
        lineHeight: 20,
    },

    // Footer
    footer: {
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.base,
        borderTopWidth: 1,
        borderTopColor: Colors.borderDark,
        backgroundColor: Colors.backgroundDark,
    },
    submitButton: {
        height: Heights.button,
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: Colors.cardDark,
        opacity: 0.5,
    },
    submitButtonText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: LetterSpacing.wide,
    },
    submitButtonTextDisabled: {
        color: Colors.textMuted,
    },
});
