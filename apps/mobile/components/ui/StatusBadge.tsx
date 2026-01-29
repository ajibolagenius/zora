import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    Fire,
    Star,
    Sparkle,
    Leaf,
    ShieldCheck,
    Clock,
    Package,
    CheckCircle,
    XCircle,
    Truck,
    Warning,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, IconSize, ComponentDimensions } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';

export type BadgeType =
    | 'hot'
    | 'popular'
    | 'new'
    | 'topRated'
    | 'bestseller'
    | 'organic'
    | 'ecoFriendly'
    | 'verified'
    | 'discount'
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'custom';

export type BadgeSize = 'small' | 'medium' | 'large';
export type BadgeVariant = 'filled' | 'outlined' | 'soft';

interface StatusBadgeProps {
    type?: BadgeType;
    label?: string;
    size?: BadgeSize;
    variant?: BadgeVariant;
    color?: string;
    backgroundColor?: string;
    showIcon?: boolean;
    icon?: React.ReactNode;
}

// Badge configuration for each type
const badgeConfig: Record<BadgeType, { color: string; bgColor: string; icon: typeof Fire; label: string }> = {
    hot: { color: Colors.textPrimary, bgColor: Colors.badgeHot, icon: Fire, label: 'HOT' },
    popular: { color: Colors.textPrimary, bgColor: Colors.badgePopular, icon: Fire, label: 'POPULAR' },
    new: { color: Colors.textPrimary, bgColor: Colors.badgeNew, icon: Sparkle, label: 'NEW' },
    topRated: { color: Colors.textPrimary, bgColor: Colors.badgeTopRated, icon: Star, label: 'TOP RATED' },
    bestseller: { color: Colors.textPrimary, bgColor: Colors.badgeTopRated, icon: Star, label: 'BESTSELLER' },
    organic: { color: Colors.textPrimary, bgColor: Colors.badgeOrganic, icon: Leaf, label: 'ORGANIC' },
    ecoFriendly: { color: Colors.textPrimary, bgColor: Colors.badgeEcoFriendly, icon: Leaf, label: 'ECO-FRIENDLY' },
    verified: { color: Colors.textPrimary, bgColor: Colors.success, icon: ShieldCheck, label: 'VERIFIED' },
    discount: { color: Colors.textPrimary, bgColor: Colors.success, icon: Sparkle, label: 'SALE' },
    pending: { color: Colors.warning, bgColor: Colors.secondary20, icon: Clock, label: 'PENDING' },
    processing: { color: Colors.info, bgColor: Colors.info20, icon: Package, label: 'PROCESSING' },
    shipped: { color: Colors.info, bgColor: Colors.info20, icon: Truck, label: 'SHIPPED' },
    delivered: { color: Colors.success, bgColor: Colors.success20, icon: CheckCircle, label: 'DELIVERED' },
    cancelled: { color: Colors.error, bgColor: Colors.primary20, icon: XCircle, label: 'CANCELLED' },
    custom: { color: Colors.textPrimary, bgColor: Colors.primary, icon: Sparkle, label: '' },
};

const sizeConfig = {
    small: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        fontSize: FontSize.tiny,
        iconSize: IconSize.xs,
        borderRadius: BorderRadius.sm,
    },
    medium: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        fontSize: FontSize.caption,
        iconSize: IconSize.tiny,
        borderRadius: BorderRadius.md,
    },
    large: {
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        fontSize: FontSize.small,
        iconSize: IconSize.small,
        borderRadius: BorderRadius.lg,
    },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    type = 'custom',
    label,
    size = 'small',
    variant = 'filled',
    color,
    backgroundColor,
    showIcon = false,
    icon,
}) => {
    const typeConfig = badgeConfig[type];
    const sizes = sizeConfig[size];

    const badgeColor = color || typeConfig.color;
    const badgeBgColor = backgroundColor || typeConfig.bgColor;
    const displayLabel = label || typeConfig.label;
    const IconComponent = typeConfig.icon;

    const getBackgroundColor = () => {
        switch (variant) {
            case 'outlined':
                return 'transparent';
            case 'soft':
                // For soft variant, use a lighter version of the bg color
                return badgeBgColor.includes('rgba') ? badgeBgColor : `${badgeBgColor}33`;
            default:
                return badgeBgColor;
        }
    };

    const getBorderStyle = () => {
        if (variant === 'outlined') {
            return {
                borderWidth: 1,
                borderColor: badgeColor,
            };
        }
        return {};
    };

    return (
        <View
            style={[
                styles.badge,
                {
                    backgroundColor: getBackgroundColor(),
                    paddingHorizontal: sizes.paddingHorizontal,
                    paddingVertical: sizes.paddingVertical,
                    borderRadius: sizes.borderRadius,
                },
                getBorderStyle(),
            ]}
        >
            {showIcon && (
                icon || <IconComponent size={sizes.iconSize} color={badgeColor} weight="fill" />
            )}
            {displayLabel && (
                <Text
                    style={[
                        styles.text,
                        {
                            color: variant === 'filled' ? badgeColor : badgeBgColor,
                            fontSize: sizes.fontSize,
                        },
                        variant !== 'filled' && { color: badgeColor },
                    ]}
                >
                    {displayLabel}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: Spacing.xs,
    },
    text: {
        fontFamily: FontFamily.bodySemiBold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});

export default StatusBadge;
