import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, ComponentDimensions } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';

export type PriceDisplaySize = 'small' | 'medium' | 'large' | 'xlarge';
export type PriceDisplayLayout = 'horizontal' | 'vertical';

interface PriceDisplayProps {
    price: number;
    originalPrice?: number;
    currency?: string;
    size?: PriceDisplaySize;
    layout?: PriceDisplayLayout;
    showDiscount?: boolean;
    priceColor?: string;
    unitLabel?: string;
}

const sizeConfig = {
    small: {
        priceFontSize: ComponentDimensions.price.smallFontSize,
        originalFontSize: FontSize.caption,
        discountFontSize: FontSize.tiny,
        fontFamily: FontFamily.bodyBold,
    },
    medium: {
        priceFontSize: ComponentDimensions.price.mediumFontSize,
        originalFontSize: FontSize.small,
        discountFontSize: FontSize.caption,
        fontFamily: FontFamily.bodyBold,
    },
    large: {
        priceFontSize: ComponentDimensions.price.largeFontSize,
        originalFontSize: FontSize.body,
        discountFontSize: FontSize.small,
        fontFamily: FontFamily.display,
    },
    xlarge: {
        priceFontSize: 40,
        originalFontSize: FontSize.h4,
        discountFontSize: FontSize.body,
        fontFamily: FontFamily.display,
    },
};

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
    price,
    originalPrice,
    currency = '£',
    size = 'medium',
    layout = 'horizontal',
    showDiscount = true,
    priceColor = Colors.secondary,
    unitLabel,
}) => {
    const config = sizeConfig[size];
    const hasDiscount = originalPrice && originalPrice > price;
    const discountPercent = hasDiscount
        ? Math.round((1 - price / originalPrice) * 100)
        : 0;

    const formatPrice = (value: number) => {
        return `${currency}${value.toFixed(2)}`;
    };

    const containerStyle = [
        styles.container,
        layout === 'vertical' && styles.containerVertical,
    ];

    return (
        <View style={containerStyle}>
            {/* Main Price */}
            <View style={styles.mainPriceContainer}>
                <Text
                    style={[
                        styles.price,
                        { fontSize: config.priceFontSize, fontFamily: config.fontFamily, color: priceColor },
                    ]}
                >
                    {formatPrice(price)}
                </Text>
                {unitLabel && (
                    <Text style={styles.unitLabel}>{unitLabel}</Text>
                )}
            </View>

            {/* Original Price & Discount */}
            {hasDiscount && (
                <View style={[styles.discountContainer, layout === 'vertical' && styles.discountContainerVertical]}>
                    <Text
                        style={[
                            styles.originalPrice,
                            { fontSize: config.originalFontSize },
                        ]}
                    >
                        {formatPrice(originalPrice)}
                    </Text>
                    {showDiscount && discountPercent > 0 && (
                        <View style={styles.discountBadge}>
                            <Text style={[styles.discountText, { fontSize: config.discountFontSize }]}>
                                -{discountPercent}%
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    containerVertical: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: Spacing.xs,
    },
    mainPriceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: Spacing.xs,
    },
    price: {
        color: Colors.secondary,
    },
    unitLabel: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
    },
    discountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    discountContainerVertical: {
        marginTop: -Spacing.xs,
    },
    originalPrice: {
        fontFamily: FontFamily.body,
        color: Colors.textMuted,
        textDecorationLine: 'line-through',
    },
    discountBadge: {
        backgroundColor: Colors.success,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: Spacing.xs,
    },
    discountText: {
        fontFamily: FontFamily.bodySemiBold,
        color: Colors.textPrimary,
    },
});

export default PriceDisplay;
