import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TouchableOpacityProps,
} from 'react-native';
import { IconProps } from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing, Heights } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ComponentType<IconProps>;
  rightIcon?: React.ComponentType<IconProps>;
}

/**
 * Button Component - Zora Design System
 * 
 * Variants:
 * - primary: Zora Red (#CC0000) background, white text
 * - secondary: Zora Yellow (#FFCC00) background, dark text
 * - outline: Transparent with red border, red text
 * - ghost: Transparent, red text
 * 
 * Sizes:
 * - sm: 36px height
 * - md: 48px height (default)
 * - lg: 56px height
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  style,
  ...props
}) => {
  const getBackgroundColor = (): string => {
    if (disabled) {
      switch (variant) {
        case 'primary':
          return 'rgba(204, 0, 0, 0.5)';
        case 'secondary':
          return 'rgba(255, 204, 0, 0.5)';
        default:
          return 'transparent';
      }
    }
    switch (variant) {
      case 'primary':
        return Colors.primary;
      case 'secondary':
        return Colors.secondary;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return Colors.primary;
    }
  };

  const getTextColor = (): string => {
    if (disabled && (variant === 'outline' || variant === 'ghost')) {
      return 'rgba(204, 0, 0, 0.5)';
    }
    switch (variant) {
      case 'primary':
        return Colors.textPrimary;
      case 'secondary':
        return Colors.backgroundDark;
      case 'outline':
      case 'ghost':
        return Colors.primary;
      default:
        return Colors.textPrimary;
    }
  };

  const getHeight = (): number => {
    switch (size) {
      case 'sm':
        return 36;
      case 'lg':
        return 56;
      default:
        return Heights.button; // 48px
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'sm':
        return FontSize.small;
      case 'lg':
        return FontSize.body;
      default:
        return FontSize.body;
    }
  };

  const getIconSize = (): number => {
    switch (size) {
      case 'sm':
        return 16;
      case 'lg':
        return 22;
      default:
        return 20;
    }
  };

  const getPadding = (): number => {
    switch (size) {
      case 'sm':
        return Spacing.base;
      case 'lg':
        return Spacing.xl;
      default:
        return Spacing.lg;
    }
  };

  const buttonStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    height: getHeight(),
    width: fullWidth ? '100%' : undefined,
    borderWidth: variant === 'outline' ? 2 : 0,
    borderColor: disabled ? 'rgba(204, 0, 0, 0.5)' : Colors.primary,
    paddingHorizontal: getPadding(),
    borderRadius: BorderRadius.lg, // 12px for consistency
  };

  const textColor = getTextColor();
  const iconSize = getIconSize();

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {LeftIcon && (
            <LeftIcon
              size={iconSize}
              color={textColor}
              weight="bold"
              style={styles.leftIcon}
            />
          )}
          <Text
            style={[
              styles.text,
              {
                color: textColor,
                fontSize: getFontSize(),
              },
            ]}
          >
            {title}
          </Text>
          {RightIcon && (
            <RightIcon
              size={iconSize}
              color={textColor}
              weight="bold"
              style={styles.rightIcon}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  text: {
    fontWeight: FontWeight.bold,
  },
  leftIcon: {
    marginRight: Spacing.xs,
  },
  rightIcon: {
    marginLeft: Spacing.xs,
  },
});

export default Button;
