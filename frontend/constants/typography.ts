// Zora African Market Design Tokens - Typography
import { Platform } from 'react-native';

// Font Families
export const FontFamily = {
  display: Platform.select({
    ios: 'Montserrat-Bold',
    android: 'Montserrat-Bold',
    default: 'Montserrat, sans-serif',
  }),
  displayMedium: Platform.select({
    ios: 'Montserrat-SemiBold',
    android: 'Montserrat-SemiBold',
    default: 'Montserrat, sans-serif',
  }),
  body: Platform.select({
    ios: 'OpenSans-Regular',
    android: 'OpenSans-Regular',
    default: 'Open Sans, sans-serif',
  }),
  bodyMedium: Platform.select({
    ios: 'OpenSans-SemiBold',
    android: 'OpenSans-SemiBold',
    default: 'Open Sans, sans-serif',
  }),
};

// Font Sizes
export const FontSize = {
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,
  body: 16,
  bodyLarge: 18,
  small: 14,
  caption: 12,
  tiny: 10,
};

// Line Heights
export const LineHeight = {
  h1: 36,
  h2: 32,
  h3: 28,
  h4: 26,
  body: 24,
  small: 20,
  caption: 18,
};

// Font Weights
export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
};

// Pre-defined text styles
export const Typography = {
  h1: {
    fontSize: FontSize.h1,
    lineHeight: LineHeight.h1,
    fontWeight: FontWeight.bold,
  },
  h2: {
    fontSize: FontSize.h2,
    lineHeight: LineHeight.h2,
    fontWeight: FontWeight.bold,
  },
  h3: {
    fontSize: FontSize.h3,
    lineHeight: LineHeight.h3,
    fontWeight: FontWeight.bold,
  },
  h4: {
    fontSize: FontSize.h4,
    lineHeight: LineHeight.h4,
    fontWeight: FontWeight.semiBold,
  },
  body: {
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
    fontWeight: FontWeight.regular,
  },
  bodyMedium: {
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
    fontWeight: FontWeight.medium,
  },
  small: {
    fontSize: FontSize.small,
    lineHeight: LineHeight.small,
    fontWeight: FontWeight.regular,
  },
  caption: {
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    fontWeight: FontWeight.regular,
  },
};

export default Typography;
