import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, ComponentDimensions, Gaps } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';

export type RatingDisplaySize = 'small' | 'medium' | 'large';
export type RatingDisplayVariant = 'default' | 'compact' | 'detailed';

interface RatingDisplayProps {
    rating: number;
    reviewCount?: number;
    maxRating?: number;
    size?: RatingDisplaySize;
    variant?: RatingDisplayVariant;
    showStars?: boolean;
    showReviewCount?: boolean;
    starColor?: string;
}

const sizeConfig = {
    small: {
        starSize: ComponentDimensions.rating.starSizeSmall,
        fontSize: FontSize.caption,
        gap: Gaps.xs,
    },
    medium: {
        starSize: ComponentDimensions.rating.starSize,
        fontSize: FontSize.small,
        gap: Gaps.sm,
    },
    large: {
        starSize: ComponentDimensions.rating.starSizeLarge,
        fontSize: FontSize.body,
        gap: Gaps.md,
    },
};

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
    rating,
    reviewCount,
    maxRating = 5,
    size = 'medium',
    variant = 'default',
    showStars = true,
    showReviewCount = true,
    starColor = Colors.rating,
}) => {
    const config = sizeConfig[size];
    const displayRating = Math.min(Math.max(rating, 0), maxRating);
    const fullStars = Math.floor(displayRating);
    const hasHalfStar = displayRating % 1 >= 0.5;

    // For compact variant, only show one star with rating number
    if (variant === 'compact') {
        return (
            <View style={[styles.container, { gap: config.gap }]}>
                <Star size={config.starSize} color={starColor} weight="fill" />
                <Text style={[styles.rating, { fontSize: config.fontSize }]}>
                    {displayRating.toFixed(1)}
                </Text>
                {showReviewCount && reviewCount !== undefined && reviewCount > 0 && (
                    <Text style={[styles.reviewCount, { fontSize: config.fontSize }]}>
                        ({reviewCount})
                    </Text>
                )}
            </View>
        );
    }

    // For detailed variant, show all stars
    if (variant === 'detailed' && showStars) {
        return (
            <View style={styles.detailedContainer}>
                <View style={[styles.starsRow, { gap: 2 }]}>
                    {[...Array(maxRating)].map((_, index) => {
                        const isFilled = index < fullStars;
                        const isHalf = index === fullStars && hasHalfStar;
                        return (
                            <Star
                                key={index}
                                size={config.starSize}
                                color={starColor}
                                weight={isFilled || isHalf ? 'fill' : 'regular'}
                                style={isHalf ? { opacity: 0.5 } : undefined}
                            />
                        );
                    })}
                </View>
                <View style={[styles.textContainer, { gap: config.gap }]}>
                    <Text style={[styles.rating, { fontSize: config.fontSize }]}>
                        {displayRating.toFixed(1)}
                    </Text>
                    {showReviewCount && reviewCount !== undefined && reviewCount > 0 && (
                        <Text style={[styles.reviewCount, { fontSize: config.fontSize }]}>
                            ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                        </Text>
                    )}
                </View>
            </View>
        );
    }

    // Default variant - single star with rating
    return (
        <View style={[styles.container, { gap: config.gap }]}>
            {showStars && (
                <Star size={config.starSize} color={starColor} weight="fill" />
            )}
            <Text style={[styles.rating, { fontSize: config.fontSize }]}>
                {displayRating.toFixed(1)}
            </Text>
            {showReviewCount && reviewCount !== undefined && reviewCount > 0 && (
                <Text style={[styles.reviewCount, { fontSize: config.fontSize }]}>
                    ({reviewCount})
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailedContainer: {
        gap: Spacing.xs,
    },
    starsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontFamily: FontFamily.bodySemiBold,
        color: Colors.rating,
    },
    reviewCount: {
        fontFamily: FontFamily.body,
        color: Colors.textMuted,
    },
});

export default RatingDisplay;
