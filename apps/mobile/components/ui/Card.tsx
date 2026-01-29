import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  ViewProps,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadows, Spacing } from '../../constants/spacing';

type ShadowLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl';
type RadiusLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  shadow?: ShadowLevel;
  radius?: RadiusLevel;
  padding?: number;
  bordered?: boolean;
  style?: ViewStyle;
}

/**
 * Card Component - Zora Design System
 * 
 * Base component for content surfaces.
 * Uses colors.cardDark (#342418) background in dark mode.
 * 
 * Shadow levels: none, sm, md, lg, xl
 * Border radius: none, sm, md, lg, xl, 2xl, full
 */
export const Card: React.FC<CardProps> = ({
  children,
  shadow = 'md',
  radius = 'lg',
  padding = Spacing.base,
  bordered = false,
  style,
  ...props
}) => {
  const getShadow = () => {
    switch (shadow) {
      case 'sm':
        return Shadows.sm;
      case 'md':
        return Shadows.md;
      case 'lg':
        return Shadows.lg;
      case 'xl':
        return Shadows.xl;
      default:
        return {};
    }
  };

  const getRadius = (): number => {
    switch (radius) {
      case 'none':
        return BorderRadius.none;
      case 'sm':
        return BorderRadius.sm;
      case 'md':
        return BorderRadius.md;
      case 'lg':
        return BorderRadius.lg;
      case 'xl':
        return BorderRadius.xl;
      case '2xl':
        return BorderRadius['2xl'];
      case 'full':
        return BorderRadius.full;
      default:
        return BorderRadius.lg;
    }
  };

  return (
    <View
      style={[
        styles.card,
        getShadow(),
        {
          borderRadius: getRadius(),
          padding,
          borderWidth: bordered ? 1 : 0,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardDark,
    borderColor: Colors.borderDark,
  },
});

export default Card;
