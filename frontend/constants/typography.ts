// Zora African Market Design Tokens - Typography
import { Platform } from 'react-native';

// Font Families - Based on Design System
export const FontFamily = {
  // Display & Headlines: Montserrat
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
  // Body Text: Open Sans
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
  // Alternative: Plus Jakarta Sans for Mobile UI
  ui: Platform.select({
    ios: 'System',
    android: 'System',
    default: 'Plus Jakarta Sans, sans-serif',
  }),
};

// Font Sizes - Based on Design System Type Scale
export const FontSize = {
  display: 56,    // Hero sections, splash screens
  h1: 28,         // Main section titles
  h2: 24,         // Subsection titles
  h3: 20,         // Card titles, small sections
  h4: 18,         // Labels, emphasis
  bodyLarge: 18,  // Lead paragraphs
  body: 16,       // Standard content
  small: 14,      // Secondary content
  caption: 12,    // Captions, footnotes, metadata
  tiny: 10,       // Overline labels (uppercase)
};

// Line Heights - Based on Design System
export const LineHeight = {
  display: 62,    // 1.1 ratio
  h1: 34,         // 1.2 ratio
  h2: 31,         // 1.3 ratio
  h3: 28,         // 1.4 ratio
  h4: 25,         // 1.4 ratio
  bodyLarge: 29,  // 1.6 ratio
  body: 26,       // 1.6 ratio
  small: 21,      // 1.5 ratio
  caption: 17,    // 1.4 ratio
  tiny: 13,       // 1.3 ratio
};

// Font Weights
export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

// Pre-defined text styles - Ready to use in components
export const Typography = {
  display: {
    fontSize: FontSize.display,
    lineHeight: LineHeight.display,
    fontWeight: FontWeight.extraBold,
  },
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
    fontWeight: FontWeight.semiBold,
  },
  h4: {
    fontSize: FontSize.h4,
    lineHeight: LineHeight.h4,
    fontWeight: FontWeight.semiBold,
  },
  bodyLarge: {
    fontSize: FontSize.bodyLarge,
    lineHeight: LineHeight.bodyLarge,
    fontWeight: FontWeight.regular,
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
  overline: {
    fontSize: FontSize.tiny,
    lineHeight: LineHeight.tiny,
    fontWeight: FontWeight.semiBold,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
};

export default Typography;
