/**
 * Zora Design System - Component Sizes
 * Centralized sizing constants for consistent UI across the app
 */

import { Colors } from './colors';
import { BorderRadius, Spacing, Shadows, Heights, TouchTarget } from './spacing';
import { FontSize, FontWeight } from './typography';

// ============================================
// BUTTON STYLES
// ============================================
export const ButtonStyles = {
  // Primary Button (Full width, prominent actions)
  primary: {
    height: Heights.button,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
    gap: Spacing.sm,
  },
  primaryText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  
  // Secondary Button (Outlined style)
  secondary: {
    height: Heights.button,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
    gap: Spacing.sm,
  },
  secondaryText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  
  // Small Button (Compact actions)
  small: {
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
    gap: Spacing.xs,
  },
  smallText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  
  // Icon Button (Round, minimal)
  icon: {
    width: TouchTarget.min,
    height: TouchTarget.min,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardDark,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  iconTransparent: {
    width: TouchTarget.min,
    height: TouchTarget.min,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  // Floating Action Button
  fab: {
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
    gap: Spacing.sm,
    ...Shadows.lg,
  },
  fabText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  
  // Add to Cart Button (Circular)
  addToCart: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
};

// ============================================
// INPUT STYLES
// ============================================
export const InputStyles = {
  // Standard Input
  container: {
    height: Heights.input,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.cardDark,
    paddingHorizontal: Spacing.base,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: Spacing.sm,
  },
  text: {
    flex: 1,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  placeholder: {
    color: Colors.textMuted,
  },
  
  // Search Input
  search: {
    height: Heights.input,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardDark,
    paddingHorizontal: Spacing.base,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: Spacing.sm,
  },
};

// ============================================
// CARD STYLES
// ============================================
export const CardStyles = {
  // Standard Card
  base: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadows.md,
  },
  
  // Product Card
  product: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden' as const,
    ...Shadows.md,
  },
  productImage: {
    aspectRatio: 1,
    backgroundColor: Colors.backgroundDark,
  },
  productContent: {
    padding: Spacing.md,
  },
  
  // Vendor Card (List style)
  vendorList: {
    flexDirection: 'row' as const,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.base,
  },
  vendorImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundDark,
  },
  
  // Info Card (Small, centered content)
  info: {
    flex: 1,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    alignItems: 'center' as const,
  },
  
  // Collapsible Section Card
  section: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
  },
};

// ============================================
// BADGE STYLES
// ============================================
export const BadgeStyles = {
  // Standard Badge
  base: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  text: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textTransform: 'uppercase' as const,
  },
  
  // Chip Badge (Filter chips)
  chip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardDark,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  
  // Tag Badge (Inline tags like "Organic")
  tag: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  tagText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
  },
};

// ============================================
// HEADER STYLES
// ============================================
export const HeaderStyles = {
  // Transparent Header (overlayed on images/maps)
  transparent: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  
  // Solid Header (standard page header)
  solid: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.backgroundDark,
  },
  
  // Header Title
  title: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  
  // Header Button (Icon buttons)
  button: {
    width: TouchTarget.min,
    height: TouchTarget.min,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  buttonSolid: {
    width: TouchTarget.min,
    height: TouchTarget.min,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardDark,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  // Header Actions Container
  actions: {
    flexDirection: 'row' as const,
    gap: Spacing.sm,
  },
};

// ============================================
// TAB STYLES
// ============================================
export const TabStyles = {
  container: {
    flexDirection: 'row' as const,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  tab: {
    flex: 1,
    alignItems: 'center' as const,
    paddingVertical: Spacing.md,
    position: 'relative' as const,
  },
  tabText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  indicator: {
    position: 'absolute' as const,
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
};

// ============================================
// AVATAR STYLES
// ============================================
export const AvatarStyles = {
  // Small Avatar (in lists, vendor cards)
  small: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardDark,
  },
  
  // Medium Avatar (vendor detail)
  medium: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.cardDark,
  },
  
  // Large Avatar (profile, vendor header)
  large: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.cardDark,
    borderWidth: 3,
    borderColor: Colors.backgroundDark,
  },
  
  // Extra Large Avatar (vendor storefront)
  xlarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.cardDark,
    borderWidth: 4,
    borderColor: Colors.backgroundDark,
  },
};

// ============================================
// QUANTITY SELECTOR STYLES
// ============================================
export const QuantitySelectorStyles = {
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.lg,
    padding: 4,
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  text: {
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    minWidth: 32,
    textAlign: 'center' as const,
  },
};

// ============================================
// BOTTOM BAR STYLES
// ============================================
export const BottomBarStyles = {
  container: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.cardDark,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    ...Shadows.xl,
  },
  content: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    gap: Spacing.md,
  },
};

// ============================================
// BOTTOM SHEET STYLES
// ============================================
export const BottomSheetStyles = {
  container: {
    position: 'absolute' as const,
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: Colors.cardDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Shadows.xl,
  },
  handle: {
    alignItems: 'center' as const,
    paddingVertical: 12,
  },
  handleBar: {
    width: 48,
    height: 6,
    backgroundColor: Colors.textMuted,
    borderRadius: 3,
  },
};

// Export all
export default {
  Button: ButtonStyles,
  Input: InputStyles,
  Card: CardStyles,
  Badge: BadgeStyles,
  Header: HeaderStyles,
  Tab: TabStyles,
  Avatar: AvatarStyles,
  QuantitySelector: QuantitySelectorStyles,
  BottomBar: BottomBarStyles,
  BottomSheet: BottomSheetStyles,
};
