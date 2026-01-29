// Zora African Market Design Tokens - Typography
// Platform-agnostic typography definitions

export const fontFamily = {
    // Display & Headlines: Montserrat
    display: 'Montserrat',
    displayMedium: 'Montserrat',
    displaySemiBold: 'Montserrat',
    displayBold: 'Montserrat',

    // Body Text: Poppins
    body: 'Poppins',
    bodyMedium: 'Poppins',
    bodySemiBold: 'Poppins',
    bodyBold: 'Poppins',

    // UI Text
    ui: 'Poppins',
} as const;

export const fontSize = {
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
} as const;

export const lineHeight = {
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
} as const;

export const fontWeight = {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
} as const;

export const letterSpacing = {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 1.5,
} as const;

// Pre-defined text styles for web (CSS-compatible)
export const textStyles = {
    display: {
        fontFamily: fontFamily.display,
        fontSize: fontSize.display,
        lineHeight: lineHeight.display,
        fontWeight: fontWeight.extraBold,
        letterSpacing: letterSpacing.tight,
    },
    h1: {
        fontFamily: fontFamily.display,
        fontSize: fontSize.h1,
        lineHeight: lineHeight.h1,
        fontWeight: fontWeight.bold,
    },
    h2: {
        fontFamily: fontFamily.display,
        fontSize: fontSize.h2,
        lineHeight: lineHeight.h2,
        fontWeight: fontWeight.bold,
    },
    h3: {
        fontFamily: fontFamily.displayMedium,
        fontSize: fontSize.h3,
        lineHeight: lineHeight.h3,
        fontWeight: fontWeight.medium,
    },
    h4: {
        fontFamily: fontFamily.displayMedium,
        fontSize: fontSize.h4,
        lineHeight: lineHeight.h4,
        fontWeight: fontWeight.medium,
    },
    bodyLarge: {
        fontFamily: fontFamily.body,
        fontSize: fontSize.bodyLarge,
        lineHeight: lineHeight.bodyLarge,
        fontWeight: fontWeight.regular,
    },
    body: {
        fontFamily: fontFamily.body,
        fontSize: fontSize.body,
        lineHeight: lineHeight.body,
        fontWeight: fontWeight.regular,
    },
    bodyMedium: {
        fontFamily: fontFamily.bodyMedium,
        fontSize: fontSize.body,
        lineHeight: lineHeight.body,
        fontWeight: fontWeight.medium,
    },
    bodyBold: {
        fontFamily: fontFamily.bodyBold,
        fontSize: fontSize.body,
        lineHeight: lineHeight.body,
        fontWeight: fontWeight.bold,
    },
    small: {
        fontFamily: fontFamily.body,
        fontSize: fontSize.small,
        lineHeight: lineHeight.small,
        fontWeight: fontWeight.regular,
    },
    caption: {
        fontFamily: fontFamily.body,
        fontSize: fontSize.caption,
        lineHeight: lineHeight.caption,
        fontWeight: fontWeight.regular,
    },
    button: {
        fontFamily: fontFamily.ui,
        fontSize: fontSize.small,
        fontWeight: fontWeight.medium,
        letterSpacing: letterSpacing.wide,
        textTransform: 'uppercase' as const,
    },
} as const;

export type FontFamily = typeof fontFamily;
export type FontSize = typeof fontSize;
export type LineHeight = typeof lineHeight;
export type FontWeight = typeof fontWeight;
export type LetterSpacing = typeof letterSpacing;
export type TextStyles = typeof textStyles;

export default {
    fontFamily,
    fontSize,
    lineHeight,
    fontWeight,
    letterSpacing,
    textStyles,
};
