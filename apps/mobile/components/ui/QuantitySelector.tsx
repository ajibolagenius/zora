import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Minus, Plus, Trash } from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, IconSize, ComponentDimensions, Shadows } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';

export type QuantitySelectorSize = 'small' | 'medium' | 'large';
export type QuantitySelectorVariant = 'default' | 'compact' | 'pill';

interface QuantitySelectorProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    onRemove?: () => void;
    min?: number;
    max?: number;
    size?: QuantitySelectorSize;
    variant?: QuantitySelectorVariant;
    showRemoveOnMin?: boolean;
    disabled?: boolean;
}

const sizeConfig = {
    small: {
        buttonSize: ComponentDimensions.quantitySelector.buttonSizeSmall,
        iconSize: IconSize.tiny,
        fontSize: FontSize.small,
        minWidth: 90,
    },
    medium: {
        buttonSize: ComponentDimensions.quantitySelector.buttonSize,
        iconSize: IconSize.small,
        fontSize: FontSize.body,
        minWidth: ComponentDimensions.quantitySelector.minWidth,
    },
    large: {
        buttonSize: 40,
        iconSize: IconSize.medium,
        fontSize: FontSize.h4,
        minWidth: 120,
    },
};

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    quantity,
    onIncrease,
    onDecrease,
    onRemove,
    min = 1,
    max = 99,
    size = 'medium',
    variant = 'default',
    showRemoveOnMin = false,
    disabled = false,
}) => {
    const config = sizeConfig[size];
    const isAtMin = quantity <= min;
    const isAtMax = quantity >= max;
    const showRemove = showRemoveOnMin && isAtMin && onRemove;

    const handleDecrease = () => {
        if (showRemove && onRemove) {
            onRemove();
        } else if (!isAtMin) {
            onDecrease();
        }
    };

    const containerStyle = [
        styles.container,
        variant === 'pill' && styles.containerPill,
        variant === 'compact' && styles.containerCompact,
        { minWidth: config.minWidth },
    ];

    const buttonStyle = [
        styles.button,
        { width: config.buttonSize, height: config.buttonSize },
        variant === 'pill' && styles.buttonPill,
        disabled && styles.buttonDisabled,
    ];

    return (
        <View style={containerStyle}>
            <TouchableOpacity
                style={[
                    buttonStyle,
                    (isAtMin && !showRemove) && styles.buttonDisabled,
                    showRemove && styles.buttonRemove,
                ]}
                onPress={handleDecrease}
                disabled={disabled || (isAtMin && !showRemove)}
                activeOpacity={0.7}
            >
                {showRemove ? (
                    <Trash size={config.iconSize} color={Colors.error} weight="bold" />
                ) : (
                    <Minus
                        size={config.iconSize}
                        color={isAtMin ? Colors.textMuted : Colors.textPrimary}
                        weight="bold"
                    />
                )}
            </TouchableOpacity>

            <View style={styles.quantityContainer}>
                <Text style={[styles.quantity, { fontSize: config.fontSize }]}>
                    {quantity}
                </Text>
            </View>

            <TouchableOpacity
                style={[buttonStyle, isAtMax && styles.buttonDisabled]}
                onPress={onIncrease}
                disabled={disabled || isAtMax}
                activeOpacity={0.7}
            >
                <Plus
                    size={config.iconSize}
                    color={isAtMax ? Colors.textMuted : Colors.textPrimary}
                    weight="bold"
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.borderDark,
        padding: Spacing.xs,
    },
    containerPill: {
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.backgroundDark,
    },
    containerCompact: {
        padding: 2,
        borderRadius: BorderRadius.md,
    },
    button: {
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.white10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPill: {
        borderRadius: BorderRadius.full,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonRemove: {
        backgroundColor: Colors.primary10,
    },
    quantityContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 32,
    },
    quantity: {
        fontFamily: FontFamily.bodyBold,
        color: Colors.textPrimary,
        textAlign: 'center',
    },
});

export default QuantitySelector;
