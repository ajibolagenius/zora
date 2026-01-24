import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'category';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
}

/**
 * Badge Component - Zora Design System
 * 
 * Variants:
 * - default: Primary red badge
 * - success: Green badge
 * - warning: Yellow badge
 * - error: Red badge
 * - info: Blue badge
 * - category: Red tinted background with red text
 */
export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'md',
  style,
}) => {
  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'success':
        return Colors.success;
      case 'warning':
        return Colors.warning;
      case 'error':
        return Colors.error;
      case 'info':
        return Colors.info;
      case 'category':
        return 'rgba(204, 0, 0, 0.1)';
      default:
        return Colors.primary;
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'warning':
        return Colors.backgroundDark;
      case 'category':
        return Colors.primary;
      default:
        return Colors.textPrimary;
    }
  };

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
          paddingHorizontal: isSmall ? Spacing.sm : Spacing.md,
          paddingVertical: isSmall ? 2 : Spacing.xs,
          borderRadius: BorderRadius.full,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            fontSize: isSmall ? FontSize.tiny : FontSize.caption,
            textTransform: variant === 'category' ? 'none' : 'uppercase',
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: FontFamily.bodySemiBold,
  },
});

export default Badge;
