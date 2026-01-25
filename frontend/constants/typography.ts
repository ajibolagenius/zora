// Zora African Market Design Tokens - Typography
import { Platform } from 'react-native';

/**
 * Font Families - Zora Design System
 * 
 * Primary: Montserrat - For headlines, titles, and emphasis
 * Secondary: Poppins - For body text, UI elements
 * 
 * Fonts are loaded via @expo-google-fonts in _layout.tsx
 */
export const FontFamily = {
  // Display & Headlines: Montserrat
  display: 'Montserrat-Bold',
  displayMedium: 'Montserrat-SemiBold',
  displayExtraBold: 'Montserrat-ExtraBold',
  
  // Body Text: Poppins
  body: 'Poppins-Regular',
  bodyMedium: 'Poppins-Medium',
  bodySemiBold: 'Poppins-SemiBold',
  bodyBold: 'Poppins-Bold',
  
  // UI Text: Poppins Medium
  ui: 'Poppins-Medium',
  
  // Montserrat variants
  montserratRegular: 'Montserrat-Regular',
  montserratMedium: 'Montserrat-Medium',
  montserratSemiBold: 'Montserrat-SemiBold',
  montserratBold: 'Montserrat-Bold',
  montserratExtraBold: 'Montserrat-ExtraBold',
  
  // Poppins variants
  poppinsRegular: 'Poppins-Regular',
  poppinsMedium: 'Poppins-Medium',
  poppinsSemiBold: 'Poppins-SemiBold',
  poppinsBold: 'Poppins-Bold',
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
    fontFamily: FontFamily.displayExtraBold,
    fontSize: FontSize.display,
    lineHeight: LineHeight.display,
    letterSpacing: LetterSpacing.tight,
  },
  h1: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h1,
    lineHeight: LineHeight.h1,
  },
  h2: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h2,
    lineHeight: LineHeight.h2,
  },
  h3: {
    fontFamily: FontFamily.displayMedium,
    fontSize: FontSize.h3,
    lineHeight: LineHeight.h3,
  },
  h4: {
    fontFamily: FontFamily.displayMedium,
    fontSize: FontSize.h4,
    lineHeight: LineHeight.h4,
  },
  
  // Body Text (Poppins)
  bodyLarge: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyLarge,
    lineHeight: LineHeight.bodyLarge,
  },
  body: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  bodyMedium: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  bodyBold: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  small: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    lineHeight: LineHeight.small,
  },
  smallMedium: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    lineHeight: LineHeight.small,
  },
  smallBold: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    lineHeight: LineHeight.small,
  },
  caption: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
  },
  captionMedium: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
  },
  
  // UI Labels
  overline: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.tiny,
    lineHeight: LineHeight.tiny,
    textTransform: 'uppercase' as const,
    letterSpacing: LetterSpacing.wider,
  },
  badge: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.tiny,
    lineHeight: LineHeight.tiny,
    textTransform: 'uppercase' as const,
    letterSpacing: LetterSpacing.wide,
  },
  button: {
    fontFamily: FontFamily.ui,
    fontSize: FontSize.small,
    textTransform: 'uppercase' as const,
    letterSpacing: LetterSpacing.wide,
  },
  buttonSmall: {
    fontFamily: FontFamily.ui,
    fontSize: FontSize.caption,
    textTransform: 'uppercase' as const,
    letterSpacing: LetterSpacing.wide,
  },
  
  // Price Typography
  priceMain: {
    fontFamily: FontFamily.display,
    fontSize: 30,
  },
  priceUnit: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyLarge,
  },
};

export default Typography;
