// Zora African Market Design Tokens - Typography
import { Platform } from 'react-native';

/**
 * Font Families - Zora Design System
 * 
 * Primary: Montserrat - For headlines, titles, and emphasis
 * Secondary: Inter - For body text, UI elements
 * 
 * Note: These fonts need to be loaded via expo-font or included in assets
 * Currently using system fonts as fallback
 */
export const FontFamily = {
  // Display & Headlines: Montserrat (Bold/SemiBold)
  display: Platform.select({
    ios: 'Montserrat-Bold',
    android: 'Montserrat-Bold',
    default: 'Montserrat, system-ui, sans-serif',
  }),
  displayMedium: Platform.select({
    ios: 'Montserrat-SemiBold',
    android: 'Montserrat-SemiBold',
    default: 'Montserrat, system-ui, sans-serif',
  }),
  
  // Body Text: Inter
  body: Platform.select({
    ios: 'Inter-Regular',
    android: 'Inter-Regular',
    default: 'Inter, system-ui, sans-serif',
  }),
  bodyMedium: Platform.select({
    ios: 'Inter-Medium',
    android: 'Inter-Medium',
    default: 'Inter, system-ui, sans-serif',
  }),
  bodySemiBold: Platform.select({
    ios: 'Inter-SemiBold',
    android: 'Inter-SemiBold',
    default: 'Inter, system-ui, sans-serif',
  }),
  bodyBold: Platform.select({
    ios: 'Inter-Bold',
    android: 'Inter-Bold',
    default: 'Inter, system-ui, sans-serif',
  }),
  
  // UI Text: Inter
  ui: Platform.select({
    ios: 'Inter-Medium',
    android: 'Inter-Medium',
    default: 'Inter, system-ui, sans-serif',
  }),
  
  // System fonts fallback (when custom fonts not loaded)
  system: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'system-ui, sans-serif',
  }),
  systemMedium: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'system-ui, sans-serif',
  }),
  systemBold: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'system-ui, sans-serif',
  }),
};

// Font Sizes - Based on Design System Type Scale
export const FontSize = {
  display: 56,    // Hero sections, splash screens
  h1: 28,         // Main section titles
  h2: 24,         // Subsection titles, Product names
  h3: 20,         // Card titles, small sections
  h4: 18,         // Labels, emphasis
  bodyLarge: 18,  // Lead paragraphs
  body: 16,       // Standard content
  small: 14,      // Secondary content
  caption: 12,    // Captions, footnotes, metadata
  tiny: 10,       // Overline labels (uppercase), badges
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

// Letter Spacing
export const LetterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 1.5,
};

// Pre-defined text styles - Ready to use in components
export const Typography = {
  // Headlines (Montserrat)
  display: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.display,
    lineHeight: LineHeight.display,
    fontWeight: FontWeight.extraBold,
    letterSpacing: LetterSpacing.tight,
  },
  h1: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h1,
    lineHeight: LineHeight.h1,
    fontWeight: FontWeight.bold,
  },
  h2: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h2,
    lineHeight: LineHeight.h2,
    fontWeight: FontWeight.bold,
  },
  h3: {
    fontFamily: FontFamily.displayMedium,
    fontSize: FontSize.h3,
    lineHeight: LineHeight.h3,
    fontWeight: FontWeight.semiBold,
  },
  h4: {
    fontFamily: FontFamily.displayMedium,
    fontSize: FontSize.h4,
    lineHeight: LineHeight.h4,
    fontWeight: FontWeight.semiBold,
  },
  
  // Body Text (Inter)
  bodyLarge: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyLarge,
    lineHeight: LineHeight.bodyLarge,
    fontWeight: FontWeight.regular,
  },
  body: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
    fontWeight: FontWeight.regular,
  },
  bodyMedium: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
    fontWeight: FontWeight.medium,
  },
  bodyBold: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
    fontWeight: FontWeight.bold,
  },
  small: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    lineHeight: LineHeight.small,
    fontWeight: FontWeight.regular,
  },
  smallMedium: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    lineHeight: LineHeight.small,
    fontWeight: FontWeight.medium,
  },
  smallBold: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    lineHeight: LineHeight.small,
    fontWeight: FontWeight.semiBold,
  },
  caption: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    fontWeight: FontWeight.regular,
  },
  captionMedium: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    fontWeight: FontWeight.medium,
  },
  
  // UI Labels
  overline: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.tiny,
    lineHeight: LineHeight.tiny,
    fontWeight: FontWeight.semiBold,
    textTransform: 'uppercase' as const,
    letterSpacing: LetterSpacing.wider,
  },
  badge: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.tiny,
    lineHeight: LineHeight.tiny,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase' as const,
    letterSpacing: LetterSpacing.wide,
  },
  button: {
    fontFamily: FontFamily.ui,
    fontSize: FontSize.small,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase' as const,
    letterSpacing: LetterSpacing.wide,
  },
  buttonSmall: {
    fontFamily: FontFamily.ui,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase' as const,
    letterSpacing: LetterSpacing.wide,
  },
  
  // Price Typography
  priceMain: {
    fontFamily: FontFamily.display,
    fontSize: 30,
    fontWeight: FontWeight.bold,
  },
  priceUnit: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyLarge,
    fontWeight: FontWeight.regular,
  },
};

export default Typography;
